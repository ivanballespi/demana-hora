"use client";

import { useState } from "react";

export function RoiCalculator() {
  const [noShows, setNoShows] = useState(4);
  const [price, setPrice] = useState(35);
  const monthly = noShows * price;
  return (
    <div className="rounded-3xl bg-ink p-6 text-white sm:p-8">
      <h3 className="text-xl font-bold">Quant et costen les plantades?</h3>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <label className="block text-sm">
          Plantades al mes: <b className="text-lg">{noShows}</b>
          <input type="range" min={1} max={20} value={noShows} onChange={(e) => setNoShows(+e.target.value)} className="mt-2 w-full accent-brand" />
        </label>
        <label className="block text-sm">
          Preu mitjà d&apos;una visita: <b className="text-lg">{price} €</b>
          <input type="range" min={10} max={150} step={5} value={price} onChange={(e) => setPrice(+e.target.value)} className="mt-2 w-full accent-brand" />
        </label>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div>
          <div className="text-3xl font-extrabold text-brand">{monthly} €</div>
          <div className="text-sm text-stone-400">perds cada mes</div>
        </div>
        <div>
          <div className="text-3xl font-extrabold text-brand">{(monthly * 12).toLocaleString("ca-ES")} €</div>
          <div className="text-sm text-stone-400">perds cada any</div>
        </div>
        <div>
          <div className="text-3xl font-extrabold">15 €</div>
          <div className="text-sm text-stone-400">el que costa Senyal al mes</div>
        </div>
      </div>
    </div>
  );
}
