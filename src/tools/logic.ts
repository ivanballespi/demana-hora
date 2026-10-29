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

/* ---------- Salud ---------- */

export function imc(pesoKg: number, alturaCm: number) {
  const m = alturaCm / 100;
  const valor = pesoKg / (m * m);
  const categoria =
    valor < 18.5 ? "Bajo peso" : valor < 25 ? "Peso normal" : valor < 30 ? "Sobrepeso" : valor < 35 ? "Obesidad grado I" : valor < 40 ? "Obesidad grado II" : "Obesidad grado III";
  return { valor, categoria, pesoMin: 18.5 * m * m, pesoMax: 24.9 * m * m };
}

/** Fecha probable de parto (regla de Naegele: FUR + 280 días) y semanas de embarazo a fecha de hoy. */
export function embarazo(fur: string, hoy: string) {
  const parto = sumarDias(fur, 280);
  const dias = Math.round((parseFecha(hoy) - parseFecha(fur)) / DIA);
  return { parto, semanas: Math.floor(dias / 7), dias: dias % 7, diasTotales: dias, trimestre: dias < 14 * 7 ? 1 : dias < 28 * 7 ? 2 : 3 };
}

/* ---------- Matemáticas ---------- */

const mcd2 = (a: number, b: number): number => (b === 0 ? Math.abs(a) : mcd2(b, a % b));
export const mcd = (nums: number[]) => nums.reduce((a, b) => mcd2(a, b));
export const mcm = (nums: number[]) => nums.reduce((a, b) => (a === 0 || b === 0 ? 0 : Math.abs(a * b) / mcd2(a, b)));

export function descuento(precio: number, porcentajes: number[]) {
  const final = porcentajes.reduce((p, d) => p * (1 - d / 100), precio);
  return { final, ahorro: precio - final, descuentoTotal: precio ? (1 - final / precio) * 100 : 0 };
}

export function costeViaje(km: number, consumo: number, precioLitro: number, personas = 1, idaYVuelta = false) {
  const distancia = idaYVuelta ? km * 2 : km;
  const litros = (distancia * consumo) / 100;
  const coste = litros * precioLitro;
  return { distancia, litros, coste, porPersona: coste / Math.max(1, personas) };
}

/* ---------- Unidades ---------- */

export const MAGNITUDES: Record<string, { nombre: string; unidades: Record<string, [string, number]> }> = {
  longitud: {
    nombre: "Longitud",
    unidades: { mm: ["Milímetros", 0.001], cm: ["Centímetros", 0.01], m: ["Metros", 1], km: ["Kilómetros", 1000], in: ["Pulgadas", 0.0254], ft: ["Pies", 0.3048], yd: ["Yardas", 0.9144], mi: ["Millas", 1609.344] },
  },
  peso: {
    nombre: "Peso",
    unidades: { mg: ["Miligramos", 0.000001], g: ["Gramos", 0.001], kg: ["Kilos", 1], t: ["Toneladas", 1000], oz: ["Onzas", 0.028349523125], lb: ["Libras", 0.45359237] },
  },
  volumen: {
    nombre: "Volumen",
    unidades: { ml: ["Mililitros", 0.001], cl: ["Centilitros", 0.01], l: ["Litros", 1], m3: ["Metros cúbicos", 1000], galUS: ["Galones (EE. UU.)", 3.785411784], taza: ["Tazas (250 ml)", 0.25] },
  },
  superficie: {
    nombre: "Superficie",
    unidades: { cm2: ["cm²", 0.0001], m2: ["m²", 1], ha: ["Hectáreas", 10000], km2: ["km²", 1000000], ft2: ["Pies²", 0.09290304], acre: ["Acres", 4046.8564224] },
  },
  temperatura: { nombre: "Temperatura", unidades: { C: ["Celsius (°C)", 1], F: ["Fahrenheit (°F)", 1], K: ["Kelvin (K)", 1] } },
};

export function convertir(categoria: string, valor: number, de: string, a: string): number {
  if (categoria === "temperatura") {
    const c = de === "C" ? valor : de === "F" ? ((valor - 32) * 5) / 9 : valor - 273.15;
    return a === "C" ? c : a === "F" ? (c * 9) / 5 + 32 : c + 273.15;
  }
  const u = MAGNITUDES[categoria].unidades;
  return (valor * u[de][1]) / u[a][1];
}

/* ---------- Calendario ---------- */

/** Semana ISO 8601 (la que se usa en España: empieza en lunes; la semana 1 contiene el primer jueves). */
export function semanaISO(fecha: string) {
  const t = parseFecha(fecha);
  const wd = (new Date(t).getUTCDay() + 6) % 7; // 0 = lunes
  const jueves = t + (3 - wd) * DIA;
  const año = new Date(jueves).getUTCFullYear();
  const semana = 1 + Math.floor((jueves - Date.UTC(año, 0, 1)) / (7 * DIA));
  return { semana, año, lunes: formatoFecha(t - wd * DIA), domingo: formatoFecha(t + (6 - wd) * DIA) };
}

/** Domingo de Pascua (algoritmo de Meeus/Jones/Butcher, calendario gregoriano). */
export function domingoPascua(y: number) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return formatoFecha(Date.UTC(y, mes - 1, dia));
}

/** n-ésimo día de la semana (0 = domingo) de un mes: p. ej. primer domingo de mayo. */
function enesimoDia(y: number, mes: number, weekday: number, n: number) {
  const primero = new Date(Date.UTC(y, mes - 1, 1)).getUTCDay();
  return formatoFecha(Date.UTC(y, mes - 1, 1 + ((weekday - primero + 7) % 7) + (n - 1) * 7));
}

export const EVENTOS: Record<string, { nombre: string; fecha: (y: number) => string }> = {
  navidad: { nombre: "Navidad", fecha: (y) => `${y}-12-25` },
  nochevieja: { nombre: "Nochevieja", fecha: (y) => `${y}-12-31` },
  "reyes-magos": { nombre: "el Día de Reyes", fecha: (y) => `${y}-01-06` },
  "semana-santa": { nombre: "Semana Santa", fecha: (y) => sumarDias(domingoPascua(y), -7) },
  "san-valentin": { nombre: "San Valentín", fecha: (y) => `${y}-02-14` },
  "dia-del-padre": { nombre: "el Día del Padre", fecha: (y) => `${y}-03-19` },
  "dia-de-la-madre": { nombre: "el Día de la Madre", fecha: (y) => enesimoDia(y, 5, 0, 1) },
  verano: { nombre: "el verano", fecha: (y) => `${y}-06-21` },
  halloween: { nombre: "Halloween", fecha: (y) => `${y}-10-31` },
  "black-friday": { nombre: "el Black Friday", fecha: (y) => sumarDias(enesimoDia(y, 11, 4, 4), 1) },
};

/** Próxima vez que ocurre el evento a partir de hoy (incluido). */
export function proximoEvento(slug: string, hoy: string) {
  const ev = EVENTOS[slug];
  const y = Number(hoy.slice(0, 4));
  let fecha = ev.fecha(y);
  if (fecha < hoy) fecha = ev.fecha(y + 1);
  return { fecha, dias: Math.round((parseFecha(fecha) - parseFecha(hoy)) / DIA) };
}
