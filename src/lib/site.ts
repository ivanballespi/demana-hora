// Tot el que depèn del domini o de la marca és aquí.
export const SITE_NAME = "CalcularOnline";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://calcularonline.es").replace(/\/$/, "");
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || `hola@${new URL(SITE_URL).hostname}`;
// AdSense: ca-pub-XXXXXXXXXXXXXXXX. Sense valor, no es carrega cap anunci.
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-2363497274081725";
// Google Search Console (etiqueta HTML de verificació de calcularonline.es)
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "xsT7gQSkfP_qhvXWt6jy7ISbjPTXngXUMn_LTfsAUMI";
// Titular de la web (LSSI: aviso legal i privacitat)
export const LEGAL_NAME = process.env.NEXT_PUBLIC_LEGAL_NAME || "Ivan Ballespi";
export const LEGAL_NIF = process.env.NEXT_PUBLIC_LEGAL_NIF || "48253383G";
export const LEGAL_ADDRESS = process.env.NEXT_PUBLIC_LEGAL_ADDRESS || "Carrer Castell Baix, 21";
