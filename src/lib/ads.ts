// Google Ads: només es carrega si l'usuari accepta les galetes.
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const LABELS = {
  signup: process.env.NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_LABEL,
  purchase: process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL,
};
const KEY = "apte_consent";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

export const adsEnabled = () => !!ADS_ID;

export function getConsent(): "yes" | "no" | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "yes" || v === "no" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(v: "yes" | "no" | null) {
  try {
    if (v) localStorage.setItem(KEY, v);
    else localStorage.removeItem(KEY);
  } catch {}
  if (v === "yes") loadGtag();
}

/** Crea la cua de gtag i carrega l'script (una sola vegada). */
export function loadGtag() {
  if (!ADS_ID || window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", ADS_ID);
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`;
  document.head.appendChild(s);
}

export function trackConversion(kind: keyof typeof LABELS, opts: { value?: number; id?: string } = {}) {
  const label = LABELS[kind];
  if (!ADS_ID || !label || getConsent() !== "yes") return;
  loadGtag();
  window.gtag!("event", "conversion", {
    send_to: `${ADS_ID}/${label}`,
    ...(opts.value !== undefined && { value: opts.value, currency: "EUR" }),
    ...(opts.id && { transaction_id: opts.id }),
  });
}
