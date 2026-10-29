// Lògica pura de totes les eines (sense React), per poder-la provar.

/* ---------- Números a letras ---------- */

const UNIDADES = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
const ESPECIALES = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
const VEINTIS = ["veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"];
const DECENAS = ["", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
const CENTENAS = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

function menorDeMil(n: number): string {
  if (n === 100) return "cien";
  const c = Math.floor(n / 100);
  const r = n % 100;
  let txt = CENTENAS[c];
  let dec = "";
  if (r < 10) dec = UNIDADES[r];
  else if (r < 20) dec = ESPECIALES[r - 10];
  else if (r < 30) dec = VEINTIS[r - 20];
  else dec = DECENAS[Math.floor(r / 10)] + (r % 10 ? " y " + UNIDADES[r % 10] : "");
  if (dec) txt = txt ? `${txt} ${dec}` : dec;
  return txt;
}

/** "uno" → "un" (y "veintiuno" → "veintiún") delante de un sustantivo: un millón, veintiún euros. */
const apocopar = (s: string) => s.replace(/veintiuno$/, "veintiún").replace(/(^|\s)uno$/, "$1un");

function enteroALetras(n: number): string {
  if (n === 0) return "cero";
  const partes: string[] = [];
  const milesDeMillon = Math.floor(n / 1e9);
  const millones = Math.floor((n % 1e9) / 1e6);
  const miles = Math.floor((n % 1e6) / 1e3);
  const resto = n % 1e3;

  if (milesDeMillon) {
    partes.push(milesDeMillon === 1 ? "mil" : `${apocopar(menorDeMil(milesDeMillon))} mil`);
  }
  if (millones || milesDeMillon) {
    if (millones === 1 && !milesDeMillon) partes.push("un millón");
    else if (millones) partes.push(`${apocopar(menorDeMil(millones))} millones`);
    else partes.push("millones");
  }
  if (miles) partes.push(miles === 1 ? "mil" : `${apocopar(menorDeMil(miles))} mil`);
  if (resto) partes.push(menorDeMil(resto));
  return partes.join(" ");
}

export function numeroALetras(valor: number, opts: { moneda?: boolean } = {}): string {
  if (!Number.isFinite(valor) || Math.abs(valor) >= 1e12) return "";
  const negativo = valor < 0;
  const abs = Math.abs(valor);
  const entero = Math.floor(abs + 1e-9);
  const decimales = Math.round((abs - entero) * 100);
  let out: string;
  if (opts.moneda) {
    const e = apocopar(enteroALetras(entero));
    const nombreE = entero === 1 ? "euro" : /millón$|millones$/.test(e) ? "de euros" : "euros";
    out = `${e} ${nombreE}`;
    if (decimales) out += ` con ${apocopar(enteroALetras(decimales))} ${decimales === 1 ? "céntimo" : "céntimos"}`;
  } else {
    out = enteroALetras(entero);
    if (decimales) out += ` con ${enteroALetras(decimales)}`;
  }
  return (negativo ? "menos " : "") + out;
}

/* ---------- DNI / NIE ---------- */

const LETRAS_DNI = "TRWAGMYFPDXBNJZSQVHLCKE";

export function letraDNI(numero: string): string | null {
  const limpio = numero.trim().toUpperCase().replace(/[\s.-]/g, "");
  const nie = limpio.match(/^([XYZ])(\d{7})/);
  const digitos = nie ? "XYZ".indexOf(nie[1]) + nie[2] : limpio.match(/^\d{1,8}/)?.[0];
  if (!digitos) return null;
  return LETRAS_DNI[Number(digitos) % 23];
}

export function validarDNI(documento: string): { valido: boolean; letraCorrecta: string | null } {
  const limpio = documento.trim().toUpperCase().replace(/[\s.-]/g, "");
  const m = limpio.match(/^([XYZ]\d{7}|\d{8})([A-Z])$/);
  if (!m) return { valido: false, letraCorrecta: letraDNI(limpio) };
  const letra = letraDNI(m[1]);
  return { valido: letra === m[2], letraCorrecta: letra };
}

/* ---------- IBAN ---------- */

const IBAN_LONGITUD: Record<string, number> = {
  ES: 24, AD: 24, PT: 25, FR: 27, DE: 22, IT: 27, GB: 22, IE: 22, NL: 18, BE: 16, LU: 20, AT: 20, CH: 21, MX: 0,
};

export function validarIBAN(input: string): { valido: boolean; motivo?: string; formateado: string } {
  const iban = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const formateado = iban.replace(/(.{4})/g, "$1 ").trim();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban)) return { valido: false, motivo: "Formato no válido: debe empezar por 2 letras y 2 dígitos.", formateado };
  const pais = iban.slice(0, 2);
  const esperado = IBAN_LONGITUD[pais];
  if (esperado && iban.length !== esperado) {
    return { valido: false, motivo: `Un IBAN de ${pais} debe tener ${esperado} caracteres (tiene ${iban.length}).`, formateado };
  }
  const reordenado = iban.slice(4) + iban.slice(0, 4);
  const numerico = reordenado.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let resto = 0;
  for (const d of numerico) resto = (resto * 10 + Number(d)) % 97;
  return resto === 1 ? { valido: true, formateado } : { valido: false, motivo: "Los dígitos de control no coinciden: hay algún número mal escrito.", formateado };
}

/* ---------- Fechas ---------- */

const DIA = 86_400_000;
/** "2026-10-29" → milisegundos UTC a medianoche (evita problemas de horario de verano). */
export const parseFecha = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};
export const formatoFecha = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export function diasEntre(desde: string, hasta: string) {
  const a = parseFecha(desde);
  const b = parseFecha(hasta);
  const [ini, fin] = a <= b ? [a, b] : [b, a];
  const dias = Math.round((fin - ini) / DIA);
  let laborables = 0;
  for (let t = ini; t < fin; t += DIA) {
    const wd = new Date(t).getUTCDay();
    if (wd !== 0 && wd !== 6) laborables++;
  }
  return { dias, semanas: Math.floor(dias / 7), restoDias: dias % 7, laborables, invertido: a > b };
}

export function sumarDias(fecha: string, dias: number, soloLaborables = false): string {
  let t = parseFecha(fecha);
  if (!soloLaborables) return formatoFecha(t + dias * DIA);
  const paso = dias >= 0 ? 1 : -1;
  let quedan = Math.abs(dias);
  while (quedan > 0) {
    t += paso * DIA;
    const wd = new Date(t).getUTCDay();
    if (wd !== 0 && wd !== 6) quedan--;
  }
  return formatoFecha(t);
}

/** Suma años y meses a una fecha; si el día no existe (31 de abril, 29 de febrero...) usa el último del mes. */
function sumarMeses(y: number, m: number, d: number, meses: number) {
  const total = y * 12 + (m - 1) + meses;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  const ultimo = new Date(Date.UTC(ny, nm, 0)).getUTCDate();
  return Date.UTC(ny, nm - 1, Math.min(d, ultimo));
}

export function calcularEdad(nacimiento: string, hoy: string) {
  const [ny, nm, nd] = nacimiento.split("-").map(Number);
  const [hy, hm] = hoy.split("-").map(Number);
  const tHoy = parseFecha(hoy);
  let mesesTotales = (hy - ny) * 12 + (hm - nm);
  if (sumarMeses(ny, nm, nd, mesesTotales) > tHoy) mesesTotales--;
  const años = Math.floor(mesesTotales / 12);
  const meses = mesesTotales % 12;
  const dias = Math.round((tHoy - sumarMeses(ny, nm, nd, mesesTotales)) / DIA);
  let proximo = sumarMeses(ny, nm, nd, (años + 1) * 12);
  if (sumarMeses(ny, nm, nd, años * 12) === tHoy) proximo = tHoy;
  const totalDias = Math.round((tHoy - parseFecha(nacimiento)) / DIA);
  return { años, meses, dias, totalDias, diasHastaCumple: Math.round((proximo - tHoy) / DIA) };
}

/** Suma horas "8:30", "7:45", "-1:15"... → total en minutos */
export function sumarHoras(lineas: string[]): { minutos: number; errores: number } {
  let minutos = 0;
  let errores = 0;
  for (const l of lineas.map((x) => x.trim()).filter(Boolean)) {
    const m = l.match(/^(-?)(\d{1,4})(?:[:h.,](\d{1,2}))?\s*m?$/i);
    if (!m || (m[3] && Number(m[3]) > 59)) {
      errores++;
      continue;
    }
    const v = Number(m[2]) * 60 + Number(m[3] ?? 0);
    minutos += m[1] ? -v : v;
  }
  return { minutos, errores };
}
export const minutosAHoras = (min: number) =>
  `${min < 0 ? "-" : ""}${Math.floor(Math.abs(min) / 60)}:${String(Math.abs(min) % 60).padStart(2, "0")}`;

/* ---------- Cálculos ---------- */

export const porcentajeDe = (p: number, x: number) => (p * x) / 100;
export const queTantoPorCiento = (a: number, b: number) => (b === 0 ? NaN : (a / b) * 100);
export const variacionPorcentual = (de: number, a: number) => (de === 0 ? NaN : ((a - de) / Math.abs(de)) * 100);

export function iva(importe: number, tipo: number, modo: "añadir" | "quitar") {
  if (modo === "añadir") {
    const cuota = (importe * tipo) / 100;
    return { base: importe, cuota, total: importe + cuota };
  }
  const base = importe / (1 + tipo / 100);
  return { base, cuota: importe - base, total: importe };
}

/** a es a b como c es a x → x = b·c / a (directa) | x = a·b / c (inversa) */
export const reglaDeTres = (a: number, b: number, c: number, inversa = false) =>
  inversa ? (c === 0 ? NaN : (a * b) / c) : a === 0 ? NaN : (b * c) / a;

export function notaMedia(filas: { nota: number; peso: number }[]) {
  const validas = filas.filter((f) => Number.isFinite(f.nota) && Number.isFinite(f.peso) && f.peso > 0);
  const pesoTotal = validas.reduce((s, f) => s + f.peso, 0);
  if (!pesoTotal) return NaN;
  return validas.reduce((s, f) => s + f.nota * f.peso, 0) / pesoTotal;
}

/* ---------- Finanzas ---------- */

export function hipoteca(capital: number, interesAnual: number, años: number) {
  const n = Math.round(años * 12);
  const r = interesAnual / 100 / 12;
  const cuota = r === 0 ? capital / n : (capital * r) / (1 - Math.pow(1 + r, -n));
  const porAño: { año: number; intereses: number; amortizado: number; pendiente: number }[] = [];
  let pendiente = capital;
  let intAño = 0;
  let amoAño = 0;
  for (let i = 1; i <= n; i++) {
    const int = pendiente * r;
    const amo = cuota - int;
    pendiente -= amo;
    intAño += int;
    amoAño += amo;
    if (i % 12 === 0 || i === n) {
      porAño.push({ año: Math.ceil(i / 12), intereses: intAño, amortizado: amoAño, pendiente: Math.max(0, pendiente) });
      intAño = 0;
      amoAño = 0;
    }
  }
  return { cuota, totalPagado: cuota * n, totalIntereses: cuota * n - capital, porAño };
}

export function interesCompuesto(inicial: number, aportacionMensual: number, interesAnual: number, años: number) {
  const r = interesAnual / 100 / 12;
  let saldo = inicial;
  let aportado = inicial;
  const porAño: { año: number; aportado: number; saldo: number }[] = [];
  for (let m = 1; m <= Math.round(años * 12); m++) {
    saldo = saldo * (1 + r) + aportacionMensual;
    aportado += aportacionMensual;
    if (m % 12 === 0) porAño.push({ año: m / 12, aportado, saldo });
  }
  return { saldo, aportado, intereses: saldo - aportado, porAño };
}

/* ---------- Texto ---------- */

export function estadisticasTexto(t: string) {
  const palabras = t.trim() ? t.trim().split(/\s+/).length : 0;
  return {
    palabras,
    caracteres: t.length,
    sinEspacios: t.replace(/\s/g, "").length,
    frases: (t.match(/[^.!?…]+[.!?…]+/g) ?? (t.trim() ? [t] : [])).length,
    parrafos: t.split(/\n\s*\n/).filter((p) => p.trim()).length,
    minutosLectura: palabras / 200,
  };
}

const MINUSCULAS_TITULO = new Set(["a", "al", "de", "del", "el", "la", "las", "los", "y", "e", "o", "u", "en", "con", "por", "para", "un", "una"]);

export function convertirTexto(t: string, modo: "mayusculas" | "minusculas" | "titulo" | "oracion" | "alternar") {
  switch (modo) {
    case "mayusculas":
      return t.toLocaleUpperCase("es");
    case "minusculas":
      return t.toLocaleLowerCase("es");
    case "titulo":
      return t
        .toLocaleLowerCase("es")
        .replace(/\p{L}[\p{L}'’-]*/gu, (w, i) => (i > 0 && MINUSCULAS_TITULO.has(w) ? w : w[0].toLocaleUpperCase("es") + w.slice(1)));
    case "oracion":
      return t
        .toLocaleLowerCase("es")
        .replace(/(^\s*|[.!?…]\s+)([¡¿"«(]*)(\p{L})/gu, (_, p, q, l) => p + q + l.toLocaleUpperCase("es"));
    case "alternar":
      return [...t].map((c, i) => (i % 2 ? c.toLocaleLowerCase("es") : c.toLocaleUpperCase("es"))).join("");
  }
}

/* ---------- Números romanos ---------- */

const ROMANOS: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
  [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

export function aRomano(n: number): string | null {
  if (!Number.isInteger(n) || n < 1 || n > 3999) return null;
  let out = "";
  for (const [v, s] of ROMANOS) while (n >= v) { out += s; n -= v; }
  return out;
}

export function deRomano(s: string): number | null {
  const r = s.trim().toUpperCase();
  if (!/^[MDCLXVI]+$/.test(r)) return null;
  let n = 0;
  let i = 0;
  for (const [v, sym] of ROMANOS) while (r.startsWith(sym, i)) { n += v; i += sym.length; }
  return i === r.length && aRomano(n) === r ? n : null;
}

/* ---------- Contraseñas ---------- */

export function generarContraseña(
  longitud: number,
  opts: { mayusculas: boolean; minusculas: boolean; numeros: boolean; simbolos: boolean; sinAmbiguos: boolean },
  random: (max: number) => number,
): string {
  let sets = [
    opts.minusculas && "abcdefghijkmnopqrstuvwxyz" + (opts.sinAmbiguos ? "" : "l"),
    opts.mayusculas && "ABCDEFGHJKLMNPQRSTUVWXYZ" + (opts.sinAmbiguos ? "" : "IO"),
    opts.numeros && "23456789" + (opts.sinAmbiguos ? "" : "01"),
    opts.simbolos && "!@#$%&*?-_=+",
  ].filter(Boolean) as string[];
  if (!sets.length) sets = ["abcdefghijkmnopqrstuvwxyz"];
  const todos = sets.join("");
  // Garantiza al menos un carácter de cada tipo elegido.
  const chars = sets.map((s) => s[random(s.length)]);
  while (chars.length < longitud) chars.push(todos[random(todos.length)]);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = random(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.slice(0, longitud).join("");
}
