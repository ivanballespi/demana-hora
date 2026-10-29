import { removeService, saveHours, saveService, updateBusiness } from "@/app/panell/actions";
import { ConfirmButton } from "@/components/ConfirmButton";
import { StateForm } from "@/components/StateForm";
import { requireBusiness } from "@/lib/business";
import { WEEK_ORDER, WEEKDAYS } from "@/lib/format";
import { admin } from "@/lib/supabase/admin";
import type { OpeningHour, Service } from "@/lib/types";

export const metadata = { title: "Serveis i horari" };

const toEuros = (cents: number) => (cents / 100).toString().replace(".", ",");

export default async function Page() {
  const { business } = await requireBusiness();
  const db = admin();
  const [{ data: services }, { data: hours }] = await Promise.all([
    db.from("services").select("*").eq("business_id", business.id).eq("active", true).order("created_at"),
    db.from("opening_hours").select("*").eq("business_id", business.id).order("start_time"),
  ]);
  const hoursByDay = (d: number) => ((hours ?? []) as OpeningHour[]).filter((h) => h.weekday === d);

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-bold">Serveis</h1>
        <p className="mt-1 text-sm text-stone-600">
          Consell: una paga i senyal del 20–30% del preu (mínim 5–10 €) frena les plantades sense espantar ningú.
        </p>
        <div className="mt-4 space-y-3">
          {((services ?? []) as Service[]).map((s) => (
            <div key={s.id} className="card">
              <ServiceFields action={saveService} service={s} />
              <form action={removeService} className="mt-3">
                <input type="hidden" name="id" value={s.id} />
                <ConfirmButton className="text-xs text-stone-400 hover:text-red-600" message={`Eliminar «${s.name}»?`}>
                  Eliminar servei
                </ConfirmButton>
              </form>
            </div>
          ))}
          <details className="card">
            <summary className="cursor-pointer font-semibold text-brand">+ Afegir servei</summary>
            <div className="mt-4"><ServiceFields action={saveService} /></div>
          </details>
        </div>
      </section>

      <section id="horari">
        <h2 className="text-2xl font-bold">Horari</h2>
        <p className="mt-1 text-sm text-stone-600">Fins a dues franges per dia (p. ex. matí i tarda). Els clients només veuran hores lliures dins d&apos;aquestes franges.</p>
        <div className="card mt-4">
          <StateForm action={saveHours} submit="Desar horari">
            <div className="space-y-3">
              {WEEK_ORDER.map((d) => {
                const [a, b] = hoursByDay(d);
                return (
                  <div key={d} className="flex flex-wrap items-center gap-2 text-sm">
                    <label className="flex w-28 items-center gap-2 font-medium">
                      <input type="checkbox" name={`open_${d}`} defaultChecked={!!a} className="h-4 w-4 accent-brand" />
                      {WEEKDAYS[d]}
                    </label>
                    <Range prefix="a" d={d} h={a} />
                    <span className="text-stone-400">i</span>
                    <Range prefix="b" d={d} h={b} />
                  </div>
                );
              })}
            </div>
          </StateForm>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold">El teu negoci</h2>
        <div className="card mt-4">
          <StateForm action={updateBusiness} submit="Desar">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nom" name="name" defaultValue={business.name} required />
              <Field label="Enllaç (/r/...)" name="slug" defaultValue={business.slug} required />
              <Field label="Correu on reps els avisos" name="email" type="email" defaultValue={business.email} required />
              <Field label="Telèfon" name="phone" defaultValue={business.phone ?? ""} />
              <div className="sm:col-span-2">
                <Field label="Adreça" name="address" defaultValue={business.address ?? ""} placeholder="C/ Major 12, Vic" />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="description">Descripció curta</label>
                <textarea className="input" id="description" name="description" rows={2} defaultValue={business.description ?? ""} maxLength={500} />
              </div>
              <Field label="Cancel·lació gratuïta fins a (hores abans)" name="cancel_hours" type="number" defaultValue={String(business.cancel_hours)} />
              <Field label="Antelació mínima per reservar (hores)" name="min_notice_hours" type="number" defaultValue={String(business.min_notice_hours)} />
              <Field label="Es pot reservar fins a (dies vista)" name="max_days_ahead" type="number" defaultValue={String(business.max_days_ahead)} />
            </div>
          </StateForm>
        </div>
      </section>
    </div>
  );
}

function ServiceFields({ action, service }: { action: typeof saveService; service?: Service }) {
  return (
    <StateForm action={action} submit={service ? "Desar" : "Afegir"}>
      {service && <input type="hidden" name="id" value={service.id} />}
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="sm:col-span-4">
          <Field label="Nom del servei" name="name" defaultValue={service?.name ?? ""} placeholder="Tall + rentat" required />
        </div>
        <Field label="Durada (min)" name="duration_min" type="number" defaultValue={String(service?.duration_min ?? 60)} required />
        <Field label="Preu (€)" name="price" defaultValue={service ? toEuros(service.price_cents) : ""} inputMode="decimal" required />
        <Field label="Paga i senyal (€)" name="deposit" defaultValue={service ? toEuros(service.deposit_cents) : "10"} inputMode="decimal" required />
      </div>
    </StateForm>
  );
}

function Range({ prefix, d, h }: { prefix: string; d: number; h?: OpeningHour }) {
  return (
    <span className="flex items-center gap-1">
      <input type="time" name={`${prefix}_start_${d}`} defaultValue={h?.start_time.slice(0, 5)} className="input w-auto py-1.5" step={900} />
      <span className="text-stone-400">–</span>
      <input type="time" name={`${prefix}_end_${d}`} defaultValue={h?.end_time.slice(0, 5)} className="input w-auto py-1.5" step={900} />
    </span>
  );
}

function Field({ label, name, ...props }: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <input className="input" id={name} name={name} {...props} />
    </div>
  );
}
