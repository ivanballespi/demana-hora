// Tot el que depèn del domini surt d'aquí: canviar de domini = canviar NEXT_PUBLIC_APP_URL.
const host = new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").hostname;

export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || `hola@${host}`;
