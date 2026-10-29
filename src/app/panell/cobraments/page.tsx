import { connectStripe, openBillingPortal, subscribe } from "@/app/panell/actions";
import { isActive, requireBusiness, trialDaysLeft } from "@/lib/business";
import { stripe } from "@/lib/stripe";
import { admin } from "@/lib/supabase/admin";

export const metadata = { title: "Cobraments i pla" };

const STATUS: Record<string, string> = {
  active: "Actiu ✅",
  trialing: "En prova",
  past_due: "Pagament pendent ⚠️",
  canceled: "Cancel·lat",
  unpaid: "Impagat",
  incomplete: "Incomplet",
};

export default async function Page({ searchParams }: PageProps<"/panell/cobraments">) {
  const params = await searchParams;
  const { business } = await requireBusiness();
  if (params.tornada && business.stripe_account_id && !business.stripe_charges_enabled) {
    // Tornada de l'alta a Stripe: no esperem el webhook per mostrar l'estat.
    const account = await stripe().accounts.retrieve(business.stripe_account_id);
    business.stripe_charges_enabled = account.charges_enabled;
    await admin().from("businesses").update({ stripe_charges_enabled: account.charges_enabled }).eq("id", business.id);
  }
  const subscribed = ["active", "trialing", "past_due"].includes(business.subscription_status ?? "");

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Cobraments i pla</h1>

      <section className="card">
        <h2 className="text-lg font-semibold">1. Cobrar la paga i senyal</h2>
        <p className="mt-1 text-sm text-stone-600">
          Els diners de la paga i senyal van <b>directament al teu compte de Stripe</b> i d&apos;allà al teu banc. Senyal no
          toca els teus diners ni et cobra comissió: només les tarifes de Stripe (~1,5% + 0,25 € per pagament europeu).
        </p>
        {business.stripe_charges_enabled ? (
          <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
            ✅ Stripe connectat. Ja pots cobrar paga i senyal.
          </p>
        ) : (
          <form action={connectStripe} className="mt-4">
            <button className="btn-primary">
              {business.stripe_account_id ? "Continuar la connexió amb Stripe" : "Connectar Stripe (5 min)"}
            </button>
            <p className="mt-2 text-xs text-stone-500">
              Necessitaràs el DNI/NIF i l&apos;IBAN. Mentre no estigui connectat, els serveis amb paga i senyal no es poden reservar.
            </p>
          </form>
        )}
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold">2. El teu pla</h2>
        {params.subscrit && (
          <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">Gràcies! 🧡 La subscripció s&apos;està activant (pot trigar uns segons).</p>
        )}
        {subscribed ? (
          <>
            <p className="mt-2 text-sm">Senyal Pro · estat: <b>{STATUS[business.subscription_status!] ?? business.subscription_status}</b></p>
            <form action={openBillingPortal} className="mt-4">
              <button className="btn-ghost">Factures, targeta i cancel·lació</button>
            </form>
          </>
        ) : (
          <>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold">15 €</span>
              <span className="text-stone-500">/mes + IVA · sense permanència</span>
            </div>
            <p className="mt-2 text-sm text-stone-600">
              {isActive(business)
                ? `Et queden ${trialDaysLeft(business)} dies de prova. Si actives ara, no perds cap dia: et cobrem quan s'acabi la prova.`
                : "La prova s'ha acabat. Activa el pla perquè la teva pàgina torni a acceptar reserves."}
            </p>
            <p className="mt-1 text-sm text-stone-600">Amb evitar <b>una sola plantada al mes</b> ja surt a compte.</p>
            {business.stripe_customer_id && (
              <form action={openBillingPortal} className="mt-2">
                <button className="text-sm text-stone-500 underline">Veure factures anteriors</button>
              </form>
            )}
            <form action={subscribe} className="mt-4">
              <button className="btn-primary">Activar Senyal Pro</button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
