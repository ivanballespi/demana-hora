-- Senyal · esquema de base de dades
-- Executa-ho sencer a Supabase → SQL Editor → New query → Run.
-- Totes les taules tenen RLS activat i cap política: només el servidor
-- (amb la service role key) hi pot llegir i escriure.

create extension if not exists btree_gist;

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) between 3 and 40),
  email text not null,
  phone text,
  address text,
  description text,
  timezone text not null default 'Europe/Madrid',
  cancel_hours int not null default 24 check (cancel_hours between 0 and 168),
  min_notice_hours int not null default 2 check (min_notice_hours between 0 and 168),
  max_days_ahead int not null default 45 check (max_days_ahead between 1 and 365),
  stripe_account_id text unique,
  stripe_charges_enabled boolean not null default false,
  stripe_customer_id text unique,
  subscription_id text unique,
  subscription_status text,
  trial_ends_at timestamptz not null default (now() + interval '14 days'),
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  duration_min int not null check (duration_min between 5 and 600),
  price_cents int not null check (price_cents >= 0),
  deposit_cents int not null check (deposit_cents >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index on public.services (business_id);

-- Franges d'obertura: una fila per franja (p. ex. dilluns 9-14 i dilluns 16-20)
-- weekday: 0 = diumenge ... 6 = dissabte
create table public.opening_hours (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  weekday int not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  check (end_time > start_time)
);
create index on public.opening_hours (business_id);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  service_id uuid references public.services(id) on delete set null,
  service_name text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  -- pending: esperant pagament · confirmed · cancelled · attended · no_show · expired
  status text not null default 'pending'
    check (status in ('pending','confirmed','cancelled','attended','no_show','expired')),
  price_cents int not null,
  deposit_cents int not null,
  refunded boolean not null default false,
  stripe_session_id text unique,
  stripe_payment_intent text,
  cancel_token uuid not null default gen_random_uuid(),
  hold_expires_at timestamptz,
  reminder_sent boolean not null default false,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at),
  -- Impossible tenir dues reserves vives que es solapin al mateix negoci
  constraint no_overlap exclude using gist (
    business_id with =,
    tstzrange(starts_at, ends_at) with &&
  ) where (status in ('pending','confirmed'))
);
create index on public.bookings (business_id, starts_at);

alter table public.businesses enable row level security;
alter table public.services enable row level security;
alter table public.opening_hours enable row level security;
alter table public.bookings enable row level security;

-- Crea una reserva de manera atòmica: allibera abans les reserves pendents
-- caducades (gent que no va acabar de pagar) i deixa que la restricció
-- no_overlap rebutgi qualsevol solapament.
create or replace function public.create_booking(
  p_business_id uuid,
  p_service_id uuid,
  p_starts_at timestamptz,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_hold_minutes int
) returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  s public.services;
  b public.bookings;
begin
  select * into s from public.services
    where id = p_service_id and business_id = p_business_id and active;
  if not found then
    raise exception 'service_not_found';
  end if;

  update public.bookings set status = 'expired'
    where business_id = p_business_id
      and status = 'pending'
      and hold_expires_at < now();

  insert into public.bookings (
    business_id, service_id, service_name, starts_at, ends_at,
    customer_name, customer_email, customer_phone,
    status, price_cents, deposit_cents, hold_expires_at
  ) values (
    p_business_id, s.id, s.name, p_starts_at,
    p_starts_at + make_interval(mins => s.duration_min),
    p_customer_name, p_customer_email, p_customer_phone,
    case when s.deposit_cents > 0 then 'pending' else 'confirmed' end,
    s.price_cents, s.deposit_cents,
    case when s.deposit_cents > 0 then now() + make_interval(mins => p_hold_minutes) end
  ) returning * into b;

  return b;
end;
$$;

revoke all on function public.create_booking from public, anon, authenticated;
grant execute on function public.create_booking to service_role;
