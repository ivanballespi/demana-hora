// Tot el que depèn del domini o de la marca és aquí.
export const SITE_NAME = "CalculaYa";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || `hola@${new URL(SITE_URL).hostname}`;
// AdSense: ca-pub-XXXXXXXXXXXXXXXX. Sense valor, no es carrega cap anunci.
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
