"use client";

import { useEffect, useState } from "react";
import { euros } from "@/lib/format";

type Svc = { id: string; name: string; duration_min: number; price_cents: number; deposit_cents: number };

const dayLabel = (d: string) => {
  const date = new Date(`${d}T12:00:00Z`);
  return {
    weekday: new Intl.DateTimeFormat("ca-ES", { weekday: "short", timeZone: "UTC" }).format(date),
    day: date.getUTCDate(),
    month: new Intl.DateTimeFormat("ca-ES", { month: "short", timeZone: "UTC" }).format(date),
  };
};

export function BookingWidget({ slug, services, days, cancelHours }: { slug: string; services: Svc[]; days: string[]; cancelHours: number }) {
  const [service, setService] = useState<Svc | null>(services.length === 1 ? services[0] : null);
  const [day, setDay] = useState<string | null>(null);
  const [result, setResult] = useState<{ key: string; slots: string[] } | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [reload, setReload] = useState(0);

  const key = service && day ? `${service.id}|${day}|${reload}` : null;
  const slots = result && result.key === key ? result.slots : null;

  useEffect(() => {
    if (!service || !day || !key) return;
    let cancelled = false;
    fetch(`/api/slots?negoci=${slug}&servei=${service.id}&dia=${day}`)
      .then((r) => r.json())
      .then((d) => !cancelled && setResult({ key, slots: d.slots ?? [] }))
      .catch(() => !cancelled && setResult({ key, slots: [] }));
    return () => {
      cancelled = true;
    };
  }, [slug, service, day, key]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!service || !day || !time) return;
    setSending(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, serviceId: service.id, day, time, ...Object.fromEntries(form) }),
    });
    const data = await res.json().catch(() => ({}));
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    setSending(false);
    setError(data.error ?? "Alguna cosa ha fallat. Torna-ho a provar.");
    if (res.status === 409) {
      setTime(null);
      setReload((r) => r + 1);
    }
  }

  return (
    <div className="space-y-6">
      <Step n={1} title="Què necessites?">
        <div className="space-y-2">
          {services.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => { setService(s); setTime(null); }}
              className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                service?.id === s.id ? "border-brand bg-brand-soft ring-2 ring-brand/20" : "border-stone-200 bg-white hover:border-stone-400"
              }`}
            >
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm text-stone-500">{s.duration_min} min</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{euros(s.price_cents)}</div>
                {s.deposit_cents > 0 && <div className="text-xs text-stone-500">{euros(s.deposit_cents)} en reservar</div>}
              </div>
            </button>
          ))}
        </div>
      </Step>

      {service && (
        <Step n={2} title="Quin dia?">
          {days.length === 0 ? (
            <p className="text-sm text-stone-500">No hi ha dies disponibles.</p>
          ) : (
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
              {days.map((d) => {
                const l = dayLabel(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => { setDay(d); setTime(null); }}
                    className={`flex w-16 shrink-0 flex-col items-center rounded-xl border py-2 text-sm transition ${
                      day === d ? "border-brand bg-brand text-white" : "border-stone-200 bg-white hover:border-stone-400"
                    }`}
                  >
                    <span className="text-xs capitalize opacity-80">{l.weekday}</span>
                    <span className="text-lg font-bold">{l.day}</span>
                    <span className="text-xs opacity-80">{l.month}</span>
                  </button>
                );
              })}
            </div>
          )}
          {day && (
            <div className="mt-4">
              {error && !time && <p className="mb-3 text-sm text-red-600">{error}</p>}
              {slots === null ? (
                <p className="text-sm text-stone-500">Buscant hores lliures...</p>
              ) : slots.length === 0 ? (
                <p className="text-sm text-stone-500">Aquest dia ja està ple. Prova un altre dia 🙏</p>
              ) : (
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                  {slots.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => { setTime(t); setError(null); }}
                      className={`rounded-lg border py-2 text-sm font-semibold tabular-nums transition ${
                        time === t ? "border-brand bg-brand text-white" : "border-stone-200 bg-white hover:border-stone-400"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </Step>
      )}

      {service && day && time && (
        <Step n={3} title="Les teves dades">
          <form onSubmit={submit} className="space-y-3">
            <input className="input" name="name" placeholder="Nom i cognom" required autoComplete="name" />
            <input className="input" name="email" type="email" placeholder="Correu electrònic" required autoComplete="email" />
            <input className="input" name="phone" type="tel" placeholder="Telèfon" required autoComplete="tel" />
            {service.deposit_cents > 0 && (
              <p className="rounded-xl bg-stone-100 p-3 text-xs text-stone-600">
                Per confirmar la reserva pagues <b>{euros(service.deposit_cents)}</b> de paga i senyal, que es descompten del preu final.
                Si cancel·les com a mínim {cancelHours} h abans, te&apos;ls retornem. Si no vens sense avisar, es perden.
              </p>
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="btn-primary w-full py-3 text-base" disabled={sending}>
              {sending
                ? "Un moment..."
                : service.deposit_cents > 0
                  ? `Pagar ${euros(service.deposit_cents)} i reservar`
                  : "Confirmar reserva"}
            </button>
          </form>
        </Step>
      )}
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 font-semibold">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-xs text-white">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
