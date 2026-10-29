import { buy } from "@/app/app/actions";

export const metadata = { title: "Preus" };

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Prepara&apos;t per aprovar</h1>
        <p className="mt-1 text-stone-600">Pagament únic. Sense subscripcions ni sorpreses. IVA inclòs.</p>
      </div>
      <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
        <Plan product="pack5" name="Pack 5" price="7,90 €" hint="1,58 € per correcció"
          features={["5 correccions completes", "Nota estimada sobre 40", "Errors explicats i versió millorada", "No caduquen"]} />
        <Plan product="pass30" name="Intensiu 30 dies" price="14,90 €" hint="El més triat abans de l'examen" featured
          features={["Correccions il·limitades* durant 30 dies", "Ideal per escriure una redacció cada dia", "Veus com evoluciona la teva nota", "Tot el que inclou el Pack 5"]} />
      </div>
      <p className="text-center text-xs text-stone-500">
        *Ús raonable: fins a 60 correccions en 30 dies. Una correcció humana costa uns 25 € per text.
      </p>
    </div>
  );
}

function Plan({ product, name, price, hint, features, featured }: { product: string; name: string; price: string; hint: string; features: string[]; featured?: boolean }) {
  return (
    <form action={buy} className={`card flex flex-col ${featured ? "border-2 border-brand" : ""}`}>
      <input type="hidden" name="product" value={product} />
      <div className="text-sm font-semibold uppercase tracking-wide text-brand">{name}</div>
      <div className="mt-2 text-4xl font-extrabold">{price}</div>
      <div className="text-xs text-stone-500">{hint}</div>
      <ul className="mt-4 flex-1 space-y-2 text-sm">
        {features.map((f) => <li key={f} className="flex gap-2"><span className="text-brand">✔</span>{f}</li>)}
      </ul>
      <button className={`${featured ? "btn-primary" : "btn-dark"} mt-6 w-full`}>Comprar</button>
    </form>
  );
}
