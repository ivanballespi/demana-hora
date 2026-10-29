"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { adsEnabled, getConsent, loadGtag, setConsent, trackConversion } from "@/lib/ads";

export function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!adsEnabled()) return;
    const c = getConsent();
    if (c === "yes") loadGtag();
    // Llegir localStorage només és possible al client, després de muntar.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else if (c === null) setOpen(true);
  }, []);

  // A l'àrea privada no tapem res: la decisió ja s'ha pres (o es pren) a les pàgines públiques.
  if (!open || pathname.startsWith("/app")) return null;
  const choose = (v: "yes" | "no") => {
    setConsent(v);
    setOpen(false);
  };
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl bg-ink p-4 text-sm text-white shadow-2xl sm:flex-row sm:items-center">
        <p className="flex-1">
          Fem servir galetes de Google Ads per saber quins anuncis funcionen. Res més.{" "}
          <Link href="/legal#galetes" className="underline">Més info</Link>
        </p>
        <div className="flex gap-2">
          <button onClick={() => choose("no")} className="btn border border-white/30 py-2 text-white hover:bg-white/10">Rebutjar</button>
          <button onClick={() => choose("yes")} className="btn bg-white py-2 text-ink hover:bg-stone-200">Acceptar</button>
        </div>
      </div>
    </div>
  );
}

export function ResetConsent() {
  return (
    <button
      type="button"
      className="font-semibold text-brand underline"
      onClick={() => {
        setConsent(null);
        window.location.reload();
      }}
    >
      Canviar les preferències de galetes
    </button>
  );
}

export function Conversion({ kind, value, id }: { kind: "signup" | "purchase"; value?: number; id?: string }) {
  useEffect(() => {
    trackConversion(kind, { value, id });
  }, [kind, value, id]);
  return null;
}
