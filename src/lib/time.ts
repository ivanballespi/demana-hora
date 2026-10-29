// Utilitats de zona horària sense dependències: tot es calcula en l'hora
// local del negoci (per defecte Europe/Madrid) i es guarda en UTC.

function offsetMs(at: Date, tz: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(at);
  const m = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const asUtc = Date.UTC(+m.year, +m.month - 1, +m.day, +m.hour, +m.minute, +m.second);
  return asUtc - Math.floor(at.getTime() / 1000) * 1000;
}

/** "2026-11-03" + "09:30" a Europe/Madrid → instant UTC */
export function localToUtc(day: string, time: string, tz: string): Date {
  const [y, mo, d] = day.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  const first = offsetMs(new Date(guess), tz);
  const second = offsetMs(new Date(guess - first), tz);
  return new Date(guess - second);
}

/** Data local (YYYY-MM-DD) d'un instant */
export function localDay(at: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(at);
}

export function addDays(day: string, n: number): string {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** 0 = diumenge ... 6 = dissabte */
export function weekdayOf(day: string): number {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function fromMinutes(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

export const isDay = (s: unknown): s is string =>
  typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
export const isTime = (s: unknown): s is string =>
  typeof s === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(s);

export function hoursUntil(at: string | Date): number {
  return (new Date(at).getTime() - Date.now()) / 3_600_000;
}
