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

/* ---------- Fracciones ---------- */

export type Fraccion = { n: number; d: number };

export function parseFraccion(s: string): Fraccion | null {
  const t = s.trim().replace(",", ".");
  const mixto = t.match(/^(-?\d+)\s+(\d+)\/(\d+)$/); // 1 1/2
  if (mixto) {
    const e = Number(mixto[1]), n = Number(mixto[2]), d = Number(mixto[3]);
    if (!d) return null;
    return simplificar({ n: e * d + (e < 0 ? -n : n), d });
  }
  const f = t.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
  if (f) return Number(f[2]) ? simplificar({ n: Number(f[1]), d: Number(f[2]) }) : null;
  if (/^-?\d+(\.\d+)?$/.test(t)) {
    const dec = (t.split(".")[1] ?? "").length;
    const d = 10 ** dec;
    return simplificar({ n: Math.round(Number(t) * d), d });
  }
  return null;
}

export function simplificar({ n, d }: Fraccion): Fraccion {
  if (d < 0) { n = -n; d = -d; }
  const g = mcd([Math.abs(n), d]) || 1;
  return { n: n / g, d: d / g };
}

export function operarFracciones(a: Fraccion, b: Fraccion, op: "+" | "-" | "×" | "÷"): Fraccion | null {
  switch (op) {
    case "+": return simplificar({ n: a.n * b.d + b.n * a.d, d: a.d * b.d });
    case "-": return simplificar({ n: a.n * b.d - b.n * a.d, d: a.d * b.d });
    case "×": return simplificar({ n: a.n * b.n, d: a.d * b.d });
    case "÷": return b.n === 0 ? null : simplificar({ n: a.n * b.d, d: a.d * b.n });
  }
}

export const fraccionATexto = (f: Fraccion) => (f.d === 1 ? String(f.n) : `${f.n}/${f.d}`);
export function fraccionMixta(f: Fraccion) {
  const e = Math.trunc(f.n / f.d);
  const r = Math.abs(f.n % f.d);
  return e === 0 || r === 0 ? null : `${e} ${r}/${f.d}`;
}

/* ---------- Estadística ---------- */

export function estadistica(nums: number[]) {
  const n = nums.length;
  const orden = [...nums].sort((a, b) => a - b);
  const suma = nums.reduce((s, x) => s + x, 0);
  const media = suma / n;
  const mediana = n % 2 ? orden[(n - 1) / 2] : (orden[n / 2 - 1] + orden[n / 2]) / 2;
  const freq = new Map<number, number>();
  nums.forEach((x) => freq.set(x, (freq.get(x) ?? 0) + 1));
  const max = Math.max(...freq.values());
  const moda = max > 1 ? [...freq.entries()].filter(([, c]) => c === max).map(([v]) => v).sort((a, b) => a - b) : [];
  const sq = nums.reduce((s, x) => s + (x - media) ** 2, 0);
  return {
    n, suma, media, mediana, moda, min: orden[0], max: orden[n - 1], rango: orden[n - 1] - orden[0],
    desviacion: Math.sqrt(sq / n), desviacionMuestral: n > 1 ? Math.sqrt(sq / (n - 1)) : NaN,
  };
}

/* ---------- Geometría ---------- */

export function figura(tipo: "cuadrado" | "rectangulo" | "circulo" | "triangulo", v: number[]) {
  switch (tipo) {
    case "cuadrado": return { area: v[0] ** 2, perimetro: 4 * v[0] };
    case "rectangulo": return { area: v[0] * v[1], perimetro: 2 * (v[0] + v[1]) };
    case "circulo": return { area: Math.PI * v[0] ** 2, perimetro: 2 * Math.PI * v[0] };
    case "triangulo": {
      const [a, b, c] = v;
      if (a + b <= c || a + c <= b || b + c <= a) return { area: NaN, perimetro: NaN };
      const s = (a + b + c) / 2; // fórmula de Herón
      return { area: Math.sqrt(s * (s - a) * (s - b) * (s - c)), perimetro: a + b + c };
    }
  }
}

/* ---------- Deporte ---------- */

/** "1:05:30", "45:00" o "50" (minutos) → segundos */
export function parseTiempo(s: string): number {
  const p = s.trim().split(":").map(Number);
  if (!p.length || p.some((x) => !Number.isFinite(x) || x < 0)) return NaN;
  if (p.length === 1) return p[0] * 60;
  if (p.length === 2) return p[0] * 60 + p[1];
  if (p.length === 3) return p[0] * 3600 + p[1] * 60 + p[2];
  return NaN;
}

export function formatoTiempo(seg: number): string {
  const s = Math.round(seg);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}` : `${m}:${String(r).padStart(2, "0")}`;
}

export function ritmo(km: number, segundos: number) {
  const segPorKm = segundos / km;
  return {
    ritmo: formatoTiempo(segPorKm),
    velocidad: km / (segundos / 3600),
    predicciones: [["5 km", 5], ["10 km", 10], ["Media maratón", 21.0975], ["Maratón", 42.195]].map(([n, d]) => ({
      nombre: n as string,
      tiempo: formatoTiempo(segPorKm * (d as number)),
    })),
  };
}

/* ---------- TIN / TAE ---------- */

export const tinATae = (tin: number, periodos = 12) => (Math.pow(1 + tin / 100 / periodos, periodos) - 1) * 100;
export const taeATin = (tae: number, periodos = 12) => (Math.pow(1 + tae / 100, 1 / periodos) - 1) * periodos * 100;

/* ---------- Trabajo ---------- */

/** Vacaciones proporcionales: días anuales × días trabajados ÷ días del año. */
export function vacacionesProporcionales(inicio: string, fin: string, diasAnuales: number, disfrutados = 0) {
  const trabajados = Math.round((parseFecha(fin) - parseFecha(inicio)) / DIA) + 1;
  const y = Number(inicio.slice(0, 4));
  const diasAño = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 366 : 365;
  const generados = (diasAnuales * trabajados) / diasAño;
  return { trabajados, generados, pendientes: generados - disfrutados };
}

/** Horas entre dos horas del día; si la de salida es anterior, se entiende que se pasa la medianoche. */
export function horasEntre(entrada: string, salida: string, pausaMin = 0) {
  const a = toMin(entrada), b = toMin(salida);
  let min = b - a;
  const nocturno = min < 0;
  if (nocturno) min += 24 * 60;
  return { minutos: Math.max(0, min - pausaMin), nocturno };
}
const toMin = (h: string) => { const [x, y] = h.split(":").map(Number); return x * 60 + y; };

/* ---------- Bases numéricas ---------- */

export function convertirBase(valor: string, base: 2 | 8 | 10 | 16) {
  const v = valor.trim().toLowerCase().replace(/^0[bxo]/, "").replace(/[\s_]/g, "");
  const validos = { 2: /^[01]+$/, 8: /^[0-7]+$/, 10: /^\d+$/, 16: /^[0-9a-f]+$/ }[base];
  if (!v || !validos.test(v)) return null;
  const prefijo = { 2: "0b", 8: "0o", 10: "", 16: "0x" }[base];
  const n = BigInt(prefijo + v);
  return { bin: n.toString(2), oct: n.toString(8), dec: n.toString(10), hex: n.toString(16).toUpperCase() };
}

/* ---------- Mascotas ---------- */

/** Edad equivalente en años humanos (reglas orientativas habituales en veterinaria). */
export function edadMascota(años: number, especie: "perro" | "gato", tamaño: "pequeño" | "mediano" | "grande" = "mediano") {
  const porAño = especie === "gato" ? 4 : { pequeño: 4, mediano: 5, grande: 6 }[tamaño];
  const tradicional = años <= 1 ? años * 15 : años <= 2 ? 15 + (años - 1) * 9 : 24 + (años - 2) * porAño;
  // Wang et al. (2020), basada en la metilación del ADN en labradores: 16·ln(edad) + 31
  const cientifica = especie === "perro" && años >= 1 ? 16 * Math.log(años) + 31 : NaN;
  return { tradicional, cientifica };
}

/* ---------- Sueldo neto 2026 (estimación con el procedimiento general de retenciones de la AEAT) ---------- */

export const SS_2026 = { indefinido: 0.065, temporal: 0.0655, baseMaximaAnual: 5101.2 * 12 };
const ESCALA_RETENCION: [number, number][] = [[12450, 0.19], [20200, 0.24], [35200, 0.3], [60000, 0.37], [300000, 0.45], [Infinity, 0.47]];

function escala(base: number) {
  let cuota = 0, desde = 0;
  for (const [hasta, tipo] of ESCALA_RETENCION) {
    if (base <= desde) break;
    cuota += (Math.min(base, hasta) - desde) * tipo;
    desde = hasta;
  }
  return cuota;
}

/** Reducción por obtención de rendimientos del trabajo (art. 20 LIRPF, vigente desde 2024). */
export function reduccionTrabajo(rn: number) {
  if (rn <= 14852) return 7302;
  if (rn <= 17673.52) return 7302 - 1.75 * (rn - 14852);
  if (rn < 19747.5) return 2364.34 - 1.14 * (rn - 17673.52);
  return 0;
}

export type Situacion = "general" | "conyuge" | "monoparental";

/** Límites por debajo de los cuales no se practica retención (art. 81 RIRPF): [0 hijos, 1 hijo, 2 o más]. */
const LIMITE_EXENTO: Record<Situacion, [number, number, number]> = {
  monoparental: [15876, 17644, 18694],
  conyuge: [17197, 18130, 19262],
  general: [15876, 16342, 16867],
};

export function sueldoNeto(opts: {
  bruto: number; pagas: 12 | 14; contrato: "indefinido" | "temporal";
  situacion: Situacion; hijos: number; menores3: number; hijosEnteros: boolean;
}) {
  const { bruto, pagas, contrato, situacion, hijos, menores3, hijosEnteros } = opts;
  const ss = Math.min(bruto, SS_2026.baseMaximaAnual) * SS_2026[contrato];
  const rnPrevio = bruto - ss;
  const reduccion = Math.min(Math.max(0, reduccionTrabajo(rnPrevio)), Math.max(0, rnPrevio - 2000));
  const base = Math.max(0, rnPrevio - 2000 - reduccion);

  const porHijo = [2400, 2700, 4000, 4500];
  let minDesc = 0;
  for (let i = 0; i < hijos; i++) minDesc += porHijo[Math.min(i, 3)];
  minDesc += Math.min(menores3, hijos) * 2800;
  if (!hijosEnteros) minDesc /= 2;
  const minimo = 5550 + minDesc;

  let cuota = base > minimo ? escala(base) - escala(minimo) : 0;
  const situ = situacion === "monoparental" && hijos === 0 ? "general" : situacion;
  const exento = LIMITE_EXENTO[situ][Math.min(hijos, 2)];
  if (bruto <= exento) cuota = 0;
  cuota = Math.min(cuota, Math.max(0, 0.43 * (bruto - exento)));
  const tipo = bruto > 0 ? Math.floor((cuota / bruto) * 10000) / 100 : 0; // la AEAT expresa el tipo con dos decimales
  const irpf = (bruto * tipo) / 100;
  const netoAnual = bruto - ss - irpf;
  return { ss, irpf, tipo, netoAnual, netoMensual: netoAnual / pagas, brutoMensual: bruto / pagas, base, minimo };
}

/* ---------- Finiquito e indemnización ---------- */

/** Meses de antigüedad entre dos fechas (ambas incluidas); un mes empezado cuenta como entero. */
export function mesesAntiguedad(desde: string, hasta: string) {
  if (hasta < desde) return 0;
  const [y, m, d] = desde.split("-").map(Number);
  const fin = parseFecha(hasta) + DIA; // exclusivo
  let meses = 0;
  while (true) {
    const ny = y + Math.floor((m - 1 + meses + 1) / 12);
    const nm = ((m - 1 + meses + 1) % 12) + 1;
    const ultimo = new Date(Date.UTC(ny, nm, 0)).getUTCDate();
    if (Date.UTC(ny, nm - 1, Math.min(d, ultimo)) > fin) break;
    meses++;
  }
  const exacto = (() => {
    const ny = y + Math.floor((m - 1 + meses) / 12);
    const nm = ((m - 1 + meses) % 12) + 1;
    const ultimo = new Date(Date.UTC(ny, nm, 0)).getUTCDate();
    return Date.UTC(ny, nm - 1, Math.min(d, ultimo)) === fin;
  })();
  return exacto ? meses : meses + 1;
}

export type Extincion = "dimision" | "fin-temporal" | "objetivo" | "improcedente" | "disciplinario";

export function indemnizacion(tipo: Extincion, salarioAnual: number, inicio: string, fin: string) {
  const diario = salarioAnual / 365;
  const mensual = salarioAnual / 12;
  const corte = "2012-02-12";
  let dias = 0;
  if (tipo === "fin-temporal") dias = (12 * mesesAntiguedad(inicio, fin)) / 12;
  if (tipo === "objetivo") dias = (20 * mesesAntiguedad(inicio, fin)) / 12; // tope: 12 mensualidades (abajo)
  if (tipo === "improcedente") {
    if (inicio < corte) {
      const antes = (45 * mesesAntiguedad(inicio, sumarDias(corte, -1))) / 12;
      const despues = fin >= corte ? (33 * mesesAntiguedad(corte, fin)) / 12 : 0;
      // DT 11.ª ET: tope de 720 días, salvo que el tramo anterior ya supere esa cifra (entonces, ese tramo con un máximo de 42 mensualidades)
      dias = antes > 720 ? Math.min(antes, 42 * 30) : Math.min(antes + despues, 720);
    } else {
      dias = Math.min((33 * mesesAntiguedad(inicio, fin)) / 12, 720);
    }
  }
  const importe = tipo === "objetivo" ? Math.min(dias * diario, 12 * mensual) : dias * diario;
  return { dias, importe, diario, topado: tipo === "objetivo" && dias * diario > 12 * mensual };
}

export function finiquito(opts: {
  salarioAnual: number; inicio: string; fin: string; tipo: Extincion;
  diasVacacionesAño: number; vacacionesDisfrutadas: number; pagasProrrateadas: boolean; diasMesPendientes: number;
}) {
  const { salarioAnual, inicio, fin, tipo, diasVacacionesAño, vacacionesDisfrutadas, pagasProrrateadas, diasMesPendientes } = opts;
  const diario = salarioAnual / 365;
  const salario = diasMesPendientes * diario;
  const y = fin.slice(0, 4);
  const desdeAño = inicio > `${y}-01-01` ? inicio : `${y}-01-01`;
  const vac = vacacionesProporcionales(desdeAño, fin, diasVacacionesAño, vacacionesDisfrutadas);
  const vacaciones = Math.max(0, vac.pendientes) * diario;
  let pagas = 0;
  if (!pagasProrrateadas) {
    // Dos pagas extra de una mensualidad (salario anual ÷ 14) que se generan por semestres: enero-junio y julio-diciembre.
    const semestre = Number(fin.slice(5, 7)) <= 6 ? `${y}-01-01` : `${y}-07-01`;
    const desde = inicio > semestre ? inicio : semestre;
    const finSem = Number(fin.slice(5, 7)) <= 6 ? `${y}-06-30` : `${y}-12-31`;
    const total = Math.round((parseFecha(finSem) - parseFecha(semestre)) / DIA) + 1;
    const hechos = Math.round((parseFecha(fin) - parseFecha(desde)) / DIA) + 1;
    pagas = (salarioAnual / 14) * (hechos / total);
  }
  const ind = indemnizacion(tipo, salarioAnual, inicio, fin);
  const totalFiniquito = salario + vacaciones + pagas;
  return { salario, vacaciones, diasVacaciones: Math.max(0, vac.pendientes), pagas, indemnizacion: ind, totalFiniquito, total: totalFiniquito + ind.importe };
}

/* ---------- Analizador de señales de texto escrito con IA (heurístico y orientativo) ---------- */

/** Expressions que els models d'IA fan servir molt més que les persones (en castellà). */
export const FRASES_IA = [
  "es importante destacar", "cabe destacar", "es importante tener en cuenta", "es fundamental", "es esencial", "es crucial",
  "juega un papel", "desempeña un papel", "un papel crucial", "un papel fundamental", "en el mundo actual", "en la actualidad",
  "en el panorama", "en conclusión", "en resumen", "en definitiva", "en última instancia", "sin lugar a dudas", "no cabe duda",
  "en este sentido", "a lo largo de", "un aspecto clave", "aspectos clave", "una amplia gama", "una gran variedad",
  "no solo", "sino también", "por otro lado", "además,", "asimismo", "de manera significativa", "de forma significativa",
  "fomentar", "potenciar", "abordar", "garantizar", "optimizar", "aprovechar", "sumergirse", "adentrarse", "explorar",
  "fascinante", "vibrante", "robusto", "integral", "innovador", "transformador", "crucial", "panorama", "enriquecedor",
  "en un mundo", "cada vez más", "hoy en día", "en constante evolución", "ofrece una", "permite a los",
];

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

export function analizarIA(texto: string) {
  const t = texto.replace(/\r/g, "").trim();
  const palabras = t ? t.split(/\s+/).length : 0;
  const frases = (t.match(/[^.!?…]+[.!?…]+/g) ?? []).map((f) => f.trim().split(/\s+/).length).filter((n) => n > 2);
  const parrafos = t.split(/\n\s*\n/).map((p) => p.trim().split(/\s+/).length).filter((n) => n > 5);
  const lower = t.toLocaleLowerCase("es");

  const cv = (xs: number[]) => {
    if (xs.length < 3) return NaN;
    const m = xs.reduce((s, x) => s + x, 0) / xs.length;
    return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / xs.length) / m;
  };

  // 1. Regularitat de les frases: les persones alternen frases curtes i llargues.
  const cvFrases = cv(frases);
  const regularidad = Number.isNaN(cvFrases) ? 0.5 : clamp01((0.65 - cvFrases) / 0.35);

  // 2. Expressions típiques d'IA per cada 100 paraules.
  const encontradas: string[] = [];
  let hits = 0;
  for (const f of FRASES_IA) {
    const n = lower.split(f).length - 1;
    if (n) { hits += n; encontradas.push(f); }
  }
  const frasesIA = clamp01((hits / Math.max(1, palabras)) * 100 / 2.5);

  // 3. Paràgrafs de mida semblant.
  const cvPar = cv(parrafos);
  const parrafosIguales = Number.isNaN(cvPar) ? 0.5 : clamp01((0.5 - cvPar) / 0.35);

  // 4. Trets humans: primera persona, exclamacions, punts suspensius, col·loquialismes, emojis.
  const marcas =
    (lower.match(/\b(yo|me|mi|mí|conmigo|creo que|pienso que)\b/g) ?? []).length +
    (t.match(/[!¡]/g) ?? []).length + (t.match(/\.\.\.|…/g) ?? []).length +
    (lower.match(/\b(jaja\w*|vale|pues|tío|tía|guay|o sea|en plan|osea)\b/g) ?? []).length +
    (t.match(/\p{Extended_Pictographic}/gu) ?? []).length;
  const sinMarcasHumanas = clamp01(1 - (marcas / Math.max(1, palabras)) * 100 / 2);

  const señales = [
    { id: "regularidad", nombre: "Frases de longitud muy regular", valor: regularidad, peso: 0.3 },
    { id: "frases", nombre: "Expresiones típicas de la IA", valor: frasesIA, peso: 0.35 },
    { id: "parrafos", nombre: "Párrafos de tamaño parecido", valor: parrafosIguales, peso: 0.1 },
    { id: "humanas", nombre: "Pocas marcas personales o informales", valor: sinMarcasHumanas, peso: 0.25 },
  ];
  const bruto = señales.reduce((s, x) => s + x.valor * x.peso, 0);
  const porcentaje = Math.round(5 + bruto * 90); // mai 0 ni 100: no hi ha certeses
  return { porcentaje, palabras, frases: frases.length, señales, encontradas, suficiente: palabras >= 80 };
}

/* ---------- Factura de autónomo ---------- */

export function facturaAutonomo(importe: number, iva: number, irpf: number, modo: "base" | "neto") {
  // modo "neto": el importe es lo que quieres cobrar (base + IVA − IRPF)
  const base = modo === "base" ? importe : importe / (1 + iva / 100 - irpf / 100);
  const cuotaIva = (base * iva) / 100;
  const retencion = (base * irpf) / 100;
  return { base, cuotaIva, retencion, total: base + cuotaIva - retencion };
}

/* ---------- Margen y precio de venta ---------- */

export function margen(coste: number, precio: number) {
  return { beneficio: precio - coste, margen: precio ? ((precio - coste) / precio) * 100 : NaN, markup: coste ? ((precio - coste) / coste) * 100 : NaN };
}
/** Precio de venta para conseguir un margen sobre el precio (no sobre el coste). */
export const precioParaMargen = (coste: number, margenPct: number) => (margenPct >= 100 ? NaN : coste / (1 - margenPct / 100));

/* ---------- Consumo eléctrico ---------- */

export function consumoElectrico(vatios: number, horasDia: number, diasMes: number, precioKwh: number) {
  const kwhDia = (vatios * horasDia) / 1000;
  const kwhMes = kwhDia * diasMes;
  return { kwhDia, kwhMes, costeDia: kwhDia * precioKwh, costeMes: kwhMes * precioKwh, costeAño: kwhMes * precioKwh * 12 };
}

/* ---------- Ahorro ---------- */

/** Aportación mensual necesaria para llegar a un objetivo (con rentabilidad opcional, capitalización mensual). */
export function ahorroMensual(objetivo: number, meses: number, inicial = 0, interesAnual = 0) {
  const r = interesAnual / 100 / 12;
  const crece = Math.pow(1 + r, meses);
  const falta = objetivo - inicial * crece;
  if (falta <= 0) return 0;
  return r === 0 ? falta / meses : (falta * r) / (crece - 1);
}

export function dividirCuenta(total: number, personas: number, propinaPct = 0) {
  const conPropina = total * (1 + propinaPct / 100);
  return { conPropina, propina: conPropina - total, porPersona: conPropina / Math.max(1, personas) };
}

/* ---------- Horas y minutos ---------- */

/** "2:30", "2h30", "150" (minutos) o "2,5" (horas decimales) → minutos */
export function aMinutos(valor: string, tipo: "minutos" | "decimal" | "hhmm"): number {
  const v = valor.trim().replace(",", ".");
  if (tipo === "minutos") return Number(v);
  if (tipo === "decimal") return Number(v) * 60;
  const m = v.match(/^(\d+)\s*[:h.]\s*(\d{1,2})$/i);
  return m ? Number(m[1]) * 60 + Number(m[2]) : /^\d+$/.test(v) ? Number(v) * 60 : NaN;
}

/* ---------- Calorías (Mifflin-St Jeor) ---------- */

export const ACTIVIDAD: [number, string][] = [
  [1.2, "Sedentario (poco o nada de ejercicio)"],
  [1.375, "Ligero (1-3 días de ejercicio por semana)"],
  [1.55, "Moderado (3-5 días por semana)"],
  [1.725, "Intenso (6-7 días por semana)"],
  [1.9, "Muy intenso (trabajo físico o doble entrenamiento)"],
];

export function calorias(sexo: "hombre" | "mujer", edad: number, pesoKg: number, alturaCm: number, factor: number) {
  const tmb = 10 * pesoKg + 6.25 * alturaCm - 5 * edad + (sexo === "hombre" ? 5 : -161);
  const mantenimiento = tmb * factor;
  return { tmb, mantenimiento, perder: mantenimiento - 500, ganar: mantenimiento + 300 };
}

/* ---------- Potencias y raíces ---------- */

export function raiz(x: number, n: number) {
  if (n === 0) return NaN;
  if (x < 0) return n % 2 === 1 ? -Math.pow(-x, 1 / n) : NaN;
  return Math.pow(x, 1 / n);
}

/* ---------- Velocidad, distancia y tiempo ---------- */

export function velocidadDistanciaTiempo(calcular: "velocidad" | "distancia" | "tiempo", a: number, b: number) {
  // velocidad: a = km, b = horas · distancia: a = km/h, b = horas · tiempo: a = km, b = km/h
  if (calcular === "velocidad") return b > 0 ? a / b : NaN;
  if (calcular === "distancia") return a * b;
  return b > 0 ? a / b : NaN;
}
