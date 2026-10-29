export const DEFAULT_TZ = "Europe/Madrid";

export function euros(cents: number) {
  return new Intl.NumberFormat("ca-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function dateLong(at: string | Date, tz = DEFAULT_TZ) {
  return new Intl.DateTimeFormat("ca-ES", {
    timeZone: tz,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(at));
}

export function timeShort(at: string | Date, tz = DEFAULT_TZ) {
  return new Intl.DateTimeFormat("ca-ES", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(at));
}

export const WEEKDAYS = ["Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte"];
// Ordre de visualització: dilluns primer
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/·/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function parseEuros(input: FormDataEntryValue | null): number {
  const n = Number(String(input ?? "").replace(",", ".").trim());
  if (!Number.isFinite(n) || n < 0) return NaN;
  return Math.round(n * 100);
}
