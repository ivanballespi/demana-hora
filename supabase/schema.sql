-- Apte · esquema de base de dades
-- Supabase → SQL Editor → New query → enganxa-ho tot → Run.
-- RLS activat sense polítiques: només el servidor (service role) hi accedeix.

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  credits int not null default 1 check (credits >= 0),   -- 1 correcció gratis
  pass_until timestamptz,                                -- accés il·limitat fins a
  created_at timestamptz not null default now()
);

create table public.corrections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  level text not null check (level in ('C1','C2')),
  variant text not null check (variant in ('catala','valencia','balear')),
  task text not null,
  essay text not null,
  result jsonb,
  score numeric(4,1),
  status text not null default 'pending' check (status in ('pending','done','failed')),
  paid_with text not null check (paid_with in ('credit','pass')),
  created_at timestamptz not null default now()
);
create index on public.corrections (user_id, created_at desc);

create table public.payments (
  stripe_session_id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  product text not null,
  amount_cents int not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.corrections enable row level security;
alter table public.payments enable row level security;

-- Gasta una correcció de manera atòmica. Retorna 'pass', 'credit' o null.
create or replace function public.spend_correction(p_user uuid, p_monthly_cap int)
returns text language plpgsql security definer set search_path = public as $$
declare
  p public.profiles;
  used int;
begin
  insert into public.profiles (user_id) values (p_user) on conflict do nothing;
  select * into p from public.profiles where user_id = p_user for update;

  if p.pass_until > now() then
    select count(*) into used from public.corrections
      where user_id = p_user and paid_with = 'pass' and created_at > now() - interval '30 days';
    if used < p_monthly_cap then
      return 'pass';
    end if;
  end if;

  if p.credits > 0 then
    update public.profiles set credits = credits - 1 where user_id = p_user;
    return 'credit';
  end if;
  return null;
end;
$$;

-- Aplica una compra (idempotent per sessió de Stripe).
create or replace function public.grant_purchase(p_session text, p_user uuid, p_product text, p_amount int)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  insert into public.payments (stripe_session_id, user_id, product, amount_cents)
    values (p_session, p_user, p_product, p_amount);
  insert into public.profiles (user_id, credits) values (p_user, 0) on conflict do nothing;
  if p_product = 'pack5' then
    update public.profiles set credits = credits + 5 where user_id = p_user;
  elsif p_product = 'pass30' then
    update public.profiles
      set pass_until = greatest(coalesce(pass_until, now()), now()) + interval '30 days'
      where user_id = p_user;
  end if;
  return true;
exception when unique_violation then
  return false;
end;
$$;

revoke all on function public.spend_correction from public, anon, authenticated;
revoke all on function public.grant_purchase from public, anon, authenticated;
grant execute on function public.spend_correction to service_role;
grant execute on function public.grant_purchase to service_role;

create or replace function public.refund_credit(p_user uuid)
returns void language sql security definer set search_path = public as $$
  update public.profiles set credits = credits + 1 where user_id = p_user;
$$;
revoke all on function public.refund_credit from public, anon, authenticated;
grant execute on function public.refund_credit to service_role;
