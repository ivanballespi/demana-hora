"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import * as L from "@/tools/logic";

/* ---------- Peces comunes ---------- */

const noop = () => () => {};

const eur = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString("es-ES", { style: "currency", currency: "EUR" }) : "—";
const num = (n: number, d = 2) =>
  Number.isFinite(n) ? n.toLocaleString("es-ES", { maximumFractionDigits: d }) : "—";
/** Acepta "1.234,56", "1234.56" o "1234,56". */
const parse = (s: string) => {
  const t = s.trim().replace(/\s/g, "");
  if (!t) return NaN;
  if (/^-?\d{1,3}(\.\d{3})+$/.test(t)) return Number(t.replace(/\./g, "")); // 1.250 = mil doscientos cincuenta
  const norm = /,\d{1,2}$/.test(t) || (t.includes(",") && !t.includes(".")) ? t.replace(/\./g, "").replace(",", ".") : t.replace(/,/g, "");
  return Number(norm);
};
const today = () => new Date().toISOString().slice(0, 10);
const weekday = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

function Field({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input className="input" {...p} />
    </label>
  );
}

function Big({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="rounded-2xl bg-brand-soft p-5">
      {label && <div className="text-sm text-stone-600">{label}</div>}
      <div className="mt-1 break-words text-2xl font-extrabold text-ink sm:text-3xl">{children}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-3">
      <div className="text-xs text-stone-500">{label}</div>
      <div className="mt-0.5 text-lg font-bold">{value}</div>
    </div>
  );
}

function Copy({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className="btn-ghost py-1.5"
      disabled={!text}
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setOk(true);
        setTimeout(() => setOk(false), 1200);
      }}
    >
      {ok ? "¡Copiado!" : "Copiar"}
    </button>
  );
}

function Tabs<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: [T, string][] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(([v, l]) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`rounded-xl border px-3 py-2 text-sm font-semibold ${value === v ? "border-brand bg-brand text-white" : "border-stone-300 bg-white hover:border-stone-400"}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

/* ---------- Eines ---------- */

function NumerosALetras() {
  const [v, setV] = useState("1250,50");
  const [moneda, setMoneda] = useState(true);
  const n = parse(v);
  const txt = L.numeroALetras(n, { moneda });
  return (
    <div className="space-y-4">
      <Field label="Número" value={v} onChange={(e) => setV(e.target.value)} inputMode="decimal" placeholder="Ej.: 1250,50" />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={moneda} onChange={(e) => setMoneda(e.target.checked)} className="h-4 w-4 accent-brand" />
        Es una cantidad en euros (con céntimos)
      </label>
      <Big label="En letras">{txt ? txt[0].toUpperCase() + txt.slice(1) : Number.isNaN(n) ? "Escribe un número" : "Número demasiado grande"}</Big>
      <div className="flex gap-2">
        <Copy text={txt} />
        <Copy text={txt.toUpperCase()} />
        <span className="self-center text-xs text-stone-500">(normal / en mayúsculas para cheques)</span>
      </div>
    </div>
  );
}

function LetraDni() {
  const [v, setV] = useState("");
  const limpio = v.trim().toUpperCase();
  const completo = /[A-Z]$/.test(limpio.replace(/[\s.-]/g, "")) && limpio.replace(/[\s.-]/g, "").length === 9;
  const letra = L.letraDNI(limpio);
  const val = completo ? L.validarDNI(limpio) : null;
  return (
    <div className="space-y-4">
      <Field label="DNI o NIE" value={v} onChange={(e) => setV(e.target.value)} placeholder="12345678 o X1234567 (o completo para validarlo)" autoComplete="off" />
      {!v.trim() ? null : val ? (
        <Big label="Resultado">{val.valido ? "✅ DNI/NIE válido" : `❌ No válido: la letra debería ser ${val.letraCorrecta ?? "?"}`}</Big>
      ) : letra ? (
        <Big label="La letra es">{letra} <span className="text-base font-semibold text-stone-500">→ {limpio.replace(/[\s.-]/g, "")}{letra}</span></Big>
      ) : (
        <Big>Formato no válido</Big>
      )}
    </div>
  );
}

function ValidarIban() {
  const [v, setV] = useState("");
  const r = v.trim() ? L.validarIBAN(v) : null;
  return (
    <div className="space-y-4">
      <Field label="IBAN" value={v} onChange={(e) => setV(e.target.value)} placeholder="ES91 2100 0418 4502 0005 1332" autoComplete="off" />
      {r && (
        <Big label={r.formateado}>
          {r.valido ? "✅ IBAN válido" : <>❌ IBAN no válido<div className="mt-1 text-base font-medium text-stone-600">{r.motivo}</div></>}
        </Big>
      )}
    </div>
  );
}

function DiasEntreFechas() {
  const [a, setA] = useState(today());
  const [b, setB] = useState(L.sumarDias(today(), 30));
  const r = a && b ? L.diasEntre(a, b) : null;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Desde" type="date" value={a} onChange={(e) => setA(e.target.value)} />
        <Field label="Hasta" type="date" value={b} onChange={(e) => setB(e.target.value)} />
      </div>
      {r && (
        <>
          <Big label="Días entre las dos fechas">{r.dias.toLocaleString("es-ES")} días</Big>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label="Semanas" value={`${r.semanas} sem. y ${r.restoDias} d.`} />
            <Stat label="Laborables (L-V)" value={r.laborables.toLocaleString("es-ES")} />
            <Stat label="Incluyendo el último día" value={(r.dias + 1).toLocaleString("es-ES")} />
          </div>
        </>
      )}
    </div>
  );
}

function CalculadoraEdad() {
  const [nac, setNac] = useState("1990-01-01");
  const [ref, setRef] = useState(today());
  const r = nac && ref && nac <= ref ? L.calcularEdad(nac, ref) : null;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Fecha de nacimiento" type="date" value={nac} onChange={(e) => setNac(e.target.value)} />
        <Field label="Edad a fecha de" type="date" value={ref} onChange={(e) => setRef(e.target.value)} />
      </div>
      {r ? (
        <>
          <Big label="Edad">{r.años} años, {r.meses} meses y {r.dias} días</Big>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Días vividos" value={r.totalDias.toLocaleString("es-ES")} />
            <Stat label="Próximo cumpleaños" value={r.diasHastaCumple === 0 ? "¡Hoy! 🎂" : `en ${r.diasHastaCumple} días`} />
          </div>
        </>
      ) : (
        <Big>La fecha de nacimiento debe ser anterior</Big>
      )}
    </div>
  );
}

function SumarDiasFecha() {
  const [f, setF] = useState(today());
  const [d, setD] = useState("30");
  const [lab, setLab] = useState(false);
  const n = parseInt(d, 10);
  const r = f && Number.isFinite(n) && Math.abs(n) <= 36500 ? L.sumarDias(f, n, lab) : null;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Fecha de inicio" type="date" value={f} onChange={(e) => setF(e.target.value)} />
        <Field label="Días a sumar (negativo para restar)" value={d} onChange={(e) => setD(e.target.value)} inputMode="numeric" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={lab} onChange={(e) => setLab(e.target.checked)} className="h-4 w-4 accent-brand" />
        Contar solo días laborables (lunes a viernes)
      </label>
      {r && <Big label="Fecha resultante">{weekday(r)}</Big>}
    </div>
  );
}

function SumarHoras() {
  const [t, setT] = useState("8:30\n7:45\n8:15\n9:00\n6:30");
  const r = L.sumarHoras(t.split("\n"));
  return (
    <div className="space-y-4">
      <label className="block">
        <span className="label">Una cantidad por línea</span>
        <textarea className="input min-h-40 font-mono" value={t} onChange={(e) => setT(e.target.value)} />
      </label>
      <Big label="Total">{L.minutosAHoras(r.minutos)} h</Big>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="En horas decimales" value={`${num(r.minutos / 60)} h`} />
        <Stat label="En minutos" value={r.minutos.toLocaleString("es-ES")} />
      </div>
      {r.errores > 0 && <p className="text-sm text-amber-700">{r.errores} línea(s) no se han entendido y no se han sumado.</p>}
    </div>
  );
}

function Porcentajes() {
  const [p, setP] = useState("15");
  const [x, setX] = useState("80");
  const [a, setA] = useState("30");
  const [b, setB] = useState("120");
  const [de, setDe] = useState("80");
  const [aa, setAa] = useState("100");
  const vr = L.variacionPorcentual(parse(de), parse(aa));
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h3 className="font-semibold">¿Cuánto es el X% de una cantidad?</h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Porcentaje (%)" value={p} onChange={(e) => setP(e.target.value)} inputMode="decimal" />
          <Field label="de la cantidad" value={x} onChange={(e) => setX(e.target.value)} inputMode="decimal" />
        </div>
        <Big>{num(L.porcentajeDe(parse(p), parse(x)), 4)}</Big>
      </section>
      <section className="space-y-2">
        <h3 className="font-semibold">¿Qué porcentaje es A de B?</h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="A" value={a} onChange={(e) => setA(e.target.value)} inputMode="decimal" />
          <Field label="B" value={b} onChange={(e) => setB(e.target.value)} inputMode="decimal" />
        </div>
        <Big>{num(L.queTantoPorCiento(parse(a), parse(b)))} %</Big>
      </section>
      <section className="space-y-2">
        <h3 className="font-semibold">Aumento o descuento porcentual</h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Valor inicial" value={de} onChange={(e) => setDe(e.target.value)} inputMode="decimal" />
          <Field label="Valor final" value={aa} onChange={(e) => setAa(e.target.value)} inputMode="decimal" />
        </div>
        <Big>{Number.isFinite(vr) ? `${vr > 0 ? "+" : ""}${num(vr)} % (${vr >= 0 ? "aumento" : "descuento"})` : "—"}</Big>
      </section>
    </div>
  );
}

function CalculadoraIva() {
  const [v, setV] = useState("100");
  const [tipo, setTipo] = useState("21");
  const [modo, setModo] = useState<"añadir" | "quitar">("añadir");
  const r = L.iva(parse(v), parse(tipo), modo);
  return (
    <div className="space-y-4">
      <Tabs value={modo} onChange={setModo} options={[["añadir", "Añadir IVA"], ["quitar", "Quitar IVA"]]} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={modo === "añadir" ? "Importe sin IVA (base)" : "Importe con IVA (total)"} value={v} onChange={(e) => setV(e.target.value)} inputMode="decimal" />
        <label className="block">
          <span className="label">Tipo de IVA</span>
          <select className="input" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="21">21% (general)</option>
            <option value="10">10% (reducido)</option>
            <option value="4">4% (superreducido)</option>
            <option value="0">0%</option>
          </select>
        </label>
      </div>
      <Big label={modo === "añadir" ? "Total con IVA" : "Base imponible (sin IVA)"}>{eur(modo === "añadir" ? r.total : r.base)}</Big>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Base" value={eur(r.base)} />
        <Stat label={`IVA ${tipo}%`} value={eur(r.cuota)} />
        <Stat label="Total" value={eur(r.total)} />
      </div>
    </div>
  );
}

function ReglaDeTres() {
  const [a, setA] = useState("2");
  const [b, setB] = useState("10");
  const [c, setC] = useState("5");
  const [inv, setInv] = useState(false);
  const x = L.reglaDeTres(parse(a), parse(b), parse(c), inv);
  return (
    <div className="space-y-4">
      <Tabs value={inv ? "i" : "d"} onChange={(v) => setInv(v === "i")} options={[["d", "Directa"], ["i", "Inversa"]]} />
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        <Field label="Si A" value={a} onChange={(e) => setA(e.target.value)} inputMode="decimal" />
        <span className="pb-3 text-stone-400">→</span>
        <Field label="es B" value={b} onChange={(e) => setB(e.target.value)} inputMode="decimal" />
        <Field label="entonces C" value={c} onChange={(e) => setC(e.target.value)} inputMode="decimal" />
        <span className="pb-3 text-stone-400">→</span>
        <div className="rounded-xl bg-brand-soft px-3 py-2.5 text-lg font-extrabold">{num(x, 4)}</div>
      </div>
      <p className="text-sm text-stone-600">
        {inv ? `x = A × B ÷ C = ${a} × ${b} ÷ ${c} = ${num(x, 4)}` : `x = B × C ÷ A = ${b} × ${c} ÷ ${a} = ${num(x, 4)}`}
      </p>
    </div>
  );
}

function NotaMedia() {
  const [filas, setFilas] = useState([
    { nota: "8", peso: "40" },
    { nota: "6", peso: "60" },
  ]);
  const media = L.notaMedia(filas.map((f) => ({ nota: parse(f.nota), peso: parse(f.peso) })));
  const set = (i: number, k: "nota" | "peso", v: string) => setFilas((fs) => fs.map((f, j) => (j === i ? { ...f, [k]: v } : f)));
  return (
    <div className="space-y-4">
      {filas.map((f, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
          <Field label={`Nota ${i + 1}`} value={f.nota} onChange={(e) => set(i, "nota", e.target.value)} inputMode="decimal" />
          <Field label="Peso (créditos, % o 1)" value={f.peso} onChange={(e) => set(i, "peso", e.target.value)} inputMode="decimal" />
          <button type="button" className="btn-ghost px-3" onClick={() => setFilas((fs) => fs.filter((_, j) => j !== i))} disabled={filas.length <= 1} aria-label="Quitar">✕</button>
        </div>
      ))}
      <button type="button" className="btn-ghost" onClick={() => setFilas((fs) => [...fs, { nota: "", peso: "1" }])}>+ Añadir nota</button>
      <Big label="Nota media ponderada">{num(media)}</Big>
    </div>
  );
}

function Hipoteca() {
  const [cap, setCap] = useState("150000");
  const [int, setInt] = useState("3");
  const [años, setAños] = useState("30");
  const r = useMemo(() => {
    const c = parse(cap), i = parse(int), a = parse(años);
    return c > 0 && i >= 0 && a > 0 && a <= 50 ? L.hipoteca(c, i, a) : null;
  }, [cap, int, años]);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Importe del préstamo (€)" value={cap} onChange={(e) => setCap(e.target.value)} inputMode="decimal" />
        <Field label="Interés anual (%)" value={int} onChange={(e) => setInt(e.target.value)} inputMode="decimal" />
        <Field label="Plazo (años)" value={años} onChange={(e) => setAños(e.target.value)} inputMode="numeric" />
      </div>
      {r && (
        <>
          <Big label="Cuota mensual">{eur(r.cuota)}</Big>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Total intereses" value={eur(r.totalIntereses)} />
            <Stat label="Total a pagar" value={eur(r.totalPagado)} />
          </div>
          <details className="rounded-xl border border-stone-200 bg-white p-3">
            <summary className="cursor-pointer text-sm font-semibold">Ver cuadro de amortización por años</summary>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-right text-sm tabular-nums">
                <thead className="text-xs text-stone-500"><tr><th className="text-left">Año</th><th>Intereses</th><th>Amortizado</th><th>Pendiente</th></tr></thead>
                <tbody>{r.porAño.map((f) => <tr key={f.año} className="border-t border-stone-100"><td className="text-left">{f.año}</td><td>{eur(f.intereses)}</td><td>{eur(f.amortizado)}</td><td>{eur(f.pendiente)}</td></tr>)}</tbody>
              </table>
            </div>
          </details>
        </>
      )}
    </div>
  );
}

function InteresCompuesto() {
  const [ini, setIni] = useState("10000");
  const [mes, setMes] = useState("100");
  const [int, setInt] = useState("5");
  const [años, setAños] = useState("20");
  const r = useMemo(() => {
    const a = parse(años);
    return a > 0 && a <= 100 ? L.interesCompuesto(parse(ini) || 0, parse(mes) || 0, parse(int) || 0, a) : null;
  }, [ini, mes, int, años]);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Capital inicial (€)" value={ini} onChange={(e) => setIni(e.target.value)} inputMode="decimal" />
        <Field label="Aportación mensual (€)" value={mes} onChange={(e) => setMes(e.target.value)} inputMode="decimal" />
        <Field label="Rentabilidad anual (%)" value={int} onChange={(e) => setInt(e.target.value)} inputMode="decimal" />
        <Field label="Años" value={años} onChange={(e) => setAños(e.target.value)} inputMode="numeric" />
      </div>
      {r && (
        <>
          <Big label="Capital final">{eur(r.saldo)}</Big>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Total aportado" value={eur(r.aportado)} />
            <Stat label="Ganado con intereses" value={eur(r.intereses)} />
          </div>
          <div className="space-y-1">
            {r.porAño.filter((_, i, arr) => arr.length <= 10 || (i + 1) % Math.ceil(arr.length / 10) === 0 || i === arr.length - 1).map((f) => (
              <div key={f.año} className="flex items-center gap-2 text-xs">
                <span className="w-12 text-stone-500">Año {f.año}</span>
                <div className="h-3 flex-1 overflow-hidden rounded bg-stone-100">
                  <div className="h-full bg-brand" style={{ width: `${(f.saldo / r.saldo) * 100}%` }} />
                </div>
                <span className="w-24 text-right tabular-nums">{eur(f.saldo)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ContadorPalabras() {
  const [t, setT] = useState("");
  const s = L.estadisticasTexto(t);
  return (
    <div className="space-y-4">
      <textarea className="input min-h-56" value={t} onChange={(e) => setT(e.target.value)} placeholder="Pega o escribe aquí tu texto..." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Palabras" value={s.palabras.toLocaleString("es-ES")} />
        <Stat label="Caracteres" value={s.caracteres.toLocaleString("es-ES")} />
        <Stat label="Sin espacios" value={s.sinEspacios.toLocaleString("es-ES")} />
        <Stat label="Frases" value={s.frases} />
        <Stat label="Párrafos" value={s.parrafos} />
        <Stat label="Lectura" value={s.minutosLectura < 1 ? `${Math.ceil(s.minutosLectura * 60)} s` : `${Math.round(s.minutosLectura)} min`} />
      </div>
    </div>
  );
}

function Mayusculas() {
  const [t, setT] = useState("");
  const modos: [Parameters<typeof L.convertirTexto>[1], string][] = [
    ["mayusculas", "MAYÚSCULAS"], ["minusculas", "minúsculas"], ["oracion", "Tipo oración"], ["titulo", "Tipo Título"], ["alternar", "AlTeRnAr"],
  ];
  return (
    <div className="space-y-4">
      <textarea className="input min-h-48" value={t} onChange={(e) => setT(e.target.value)} placeholder="Pega aquí tu texto..." />
      <div className="flex flex-wrap gap-2">
        {modos.map(([m, l]) => (
          <button key={m} type="button" className="btn-ghost" onClick={() => setT(L.convertirTexto(t, m))}>{l}</button>
        ))}
        <Copy text={t} />
      </div>
    </div>
  );
}

function Romanos() {
  const [v, setV] = useState("2026");
  const isNum = /^\s*\d+\s*$/.test(v);
  const res = isNum ? L.aRomano(Number(v)) : L.deRomano(v);
  return (
    <div className="space-y-4">
      <Field label="Número o número romano" value={v} onChange={(e) => setV(e.target.value)} placeholder="2026 o MMXXVI" autoComplete="off" />
      <Big label={isNum ? "En números romanos" : "En números arábigos"}>
        {res ?? (isNum ? "Solo del 1 al 3999" : "Número romano no válido")}
      </Big>
    </div>
  );
}

function Contrasenas() {
  const [len, setLen] = useState(16);
  const [o, setO] = useState({ mayusculas: true, minusculas: true, numeros: true, simbolos: true, sinAmbiguos: false });
  const [seed, setSeed] = useState(0);
  const pw = useMemo(() => {
    void seed; // canvia per regenerar
    const rnd = (max: number) => {
      // Rebuig per evitar biaix de mòdul
      const lim = Math.floor(2 ** 32 / max) * max;
      const buf = new Uint32Array(1);
      do crypto.getRandomValues(buf); while (buf[0] >= lim);
      return buf[0] % max;
    };
    return L.generarContraseña(len, o, rnd);
  }, [len, o, seed]);
  const opts: [keyof typeof o, string][] = [["mayusculas", "Mayúsculas"], ["minusculas", "Minúsculas"], ["numeros", "Números"], ["simbolos", "Símbolos"], ["sinAmbiguos", "Sin caracteres ambiguos"]];
  return (
    <div className="space-y-4">
      <Big label="Tu contraseña"><span className="font-mono" suppressHydrationWarning>{pw}</span></Big>
      <div className="flex gap-2">
        <button type="button" className="btn-primary" onClick={() => setSeed((s) => s + 1)}>Generar otra</button>
        <Copy text={pw} />
      </div>
      <label className="block">
        <span className="label">Longitud: {len}</span>
        <input type="range" min={6} max={64} value={len} onChange={(e) => setLen(+e.target.value)} className="w-full accent-brand" />
      </label>
      <div className="flex flex-wrap gap-4">
        {opts.map(([k, l]) => (
          <label key={k} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={o[k]} onChange={(e) => setO({ ...o, [k]: e.target.checked })} className="h-4 w-4 accent-brand" />
            {l}
          </label>
        ))}
      </div>
    </div>
  );
}

function Imc() {
  const [peso, setPeso] = useState("70");
  const [alt, setAlt] = useState("175");
  const p = parse(peso), a = parse(alt);
  const r = p > 0 && a > 50 && a < 260 ? L.imc(p, a) : null;
  const color = !r ? "" : r.valor < 18.5 ? "text-sky-700" : r.valor < 25 ? "text-emerald-700" : r.valor < 30 ? "text-amber-600" : "text-red-600";
  const pos = r ? Math.min(100, Math.max(0, ((r.valor - 15) / (40 - 15)) * 100)) : 0;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Peso (kg)" value={peso} onChange={(e) => setPeso(e.target.value)} inputMode="decimal" />
        <Field label="Altura (cm)" value={alt} onChange={(e) => setAlt(e.target.value)} inputMode="decimal" />
      </div>
      {r && (
        <>
          <Big label="Tu IMC">{num(r.valor, 1)} <span className={`text-lg ${color}`}>· {r.categoria}</span></Big>
          <div>
            <div className="relative h-3 rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 via-40% to-red-500">
              <div className="absolute -top-1 h-5 w-1.5 rounded bg-ink" style={{ left: `calc(${pos}% - 3px)` }} />
            </div>
            <div className="mt-1 flex justify-between text-[11px] text-stone-500"><span>15</span><span>18,5</span><span>25</span><span>30</span><span>40</span></div>
          </div>
          <Stat label="Peso saludable para tu altura" value={`${num(r.pesoMin, 1)} – ${num(r.pesoMax, 1)} kg`} />
        </>
      )}
    </div>
  );
}

function Embarazo() {
  const [fur, setFur] = useState(L.sumarDias(today(), -70));
  const r = fur && fur <= today() ? L.embarazo(fur, today()) : null;
  return (
    <div className="space-y-4">
      <Field label="Primer día de la última regla" type="date" value={fur} onChange={(e) => setFur(e.target.value)} max={today()} />
      {r && (
        <>
          <Big label="Fecha probable de parto">{weekday(r.parto)}</Big>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Semanas de embarazo" value={r.diasTotales > 300 ? "—" : `${r.semanas} semanas y ${r.dias} días`} />
            <Stat label="Trimestre" value={r.diasTotales > 300 ? "—" : `${r.trimestre}.º trimestre`} />
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-stone-100">
            <div className="h-full rounded-full bg-gradient-to-r from-pink-400 to-brand" style={{ width: `${Math.min(100, (r.diasTotales / 280) * 100)}%` }} />
          </div>
        </>
      )}
    </div>
  );
}

function McdMcm() {
  const [v, setV] = useState("12, 18, 24");
  const nums = v.split(/[\s,;]+/).map((x) => parseInt(x, 10)).filter((n) => Number.isFinite(n) && n > 0 && n < 1e9);
  return (
    <div className="space-y-4">
      <Field label="Números (separados por comas o espacios)" value={v} onChange={(e) => setV(e.target.value)} inputMode="numeric" />
      {nums.length >= 2 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <Big label="Máximo común divisor (MCD)">{L.mcd(nums).toLocaleString("es-ES")}</Big>
          <Big label="Mínimo común múltiplo (mcm)">{L.mcm(nums).toLocaleString("es-ES")}</Big>
        </div>
      ) : (
        <Big>Escribe al menos dos números enteros</Big>
      )}
    </div>
  );
}

function Descuentos() {
  const [precio, setPrecio] = useState("80");
  const [d1, setD1] = useState("25");
  const [d2, setD2] = useState("");
  const ds = [parse(d1), parse(d2)].filter((d) => Number.isFinite(d) && d > 0 && d <= 100);
  const r = L.descuento(parse(precio), ds);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Precio original (€)" value={precio} onChange={(e) => setPrecio(e.target.value)} inputMode="decimal" />
        <Field label="Descuento (%)" value={d1} onChange={(e) => setD1(e.target.value)} inputMode="decimal" />
        <Field label="2.º descuento (%) opcional" value={d2} onChange={(e) => setD2(e.target.value)} inputMode="decimal" placeholder="Ej.: cupón 10" />
      </div>
      <Big label="Precio final">{eur(r.final)}</Big>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Te ahorras" value={eur(r.ahorro)} />
        <Stat label="Descuento total real" value={`${num(r.descuentoTotal)} %`} />
      </div>
    </div>
  );
}

function Viaje() {
  const [km, setKm] = useState("500");
  const [cons, setCons] = useState("6");
  const [precio, setPrecio] = useState("1,60");
  const [pers, setPers] = useState("2");
  const [iv, setIv] = useState(false);
  const r = L.costeViaje(parse(km), parse(cons), parse(precio), parseInt(pers, 10) || 1, iv);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Distancia (km)" value={km} onChange={(e) => setKm(e.target.value)} inputMode="decimal" />
        <Field label="Consumo (litros/100 km)" value={cons} onChange={(e) => setCons(e.target.value)} inputMode="decimal" />
        <Field label="Precio del litro (€)" value={precio} onChange={(e) => setPrecio(e.target.value)} inputMode="decimal" />
        <Field label="Personas que pagan" value={pers} onChange={(e) => setPers(e.target.value)} inputMode="numeric" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={iv} onChange={(e) => setIv(e.target.checked)} className="h-4 w-4 accent-brand" />
        Ida y vuelta
      </label>
      <Big label="Coste del combustible">{eur(r.coste)}</Big>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Por persona" value={eur(r.porPersona)} />
        <Stat label="Litros" value={num(r.litros, 1)} />
        <Stat label="Km totales" value={num(r.distancia, 0)} />
      </div>
    </div>
  );
}

function Conversor() {
  const [cat, setCat] = useState("longitud");
  const keys = Object.keys(L.MAGNITUDES[cat].unidades);
  const [de, setDe] = useState("km");
  const [a, setA] = useState("mi");
  const [v, setV] = useState("10");
  const deOk = keys.includes(de) ? de : keys[0];
  const aOk = keys.includes(a) ? a : keys[1];
  const res = L.convertir(cat, parse(v), deOk, aOk);
  const sel = (val: string, on: (v: string) => void) => (
    <select className="input" value={val} onChange={(e) => on(e.target.value)}>
      {keys.map((k) => <option key={k} value={k}>{L.MAGNITUDES[cat].unidades[k][0]}</option>)}
    </select>
  );
  return (
    <div className="space-y-4">
      <Tabs value={cat} onChange={(c) => { setCat(c); const k = Object.keys(L.MAGNITUDES[c].unidades); setDe(k[0]); setA(k[1]); }} options={Object.entries(L.MAGNITUDES).map(([k, m]) => [k, m.nombre])} />
      <div className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto_1fr]">
        <Field label="Cantidad" value={v} onChange={(e) => setV(e.target.value)} inputMode="decimal" />
        <label className="block"><span className="label">De</span>{sel(deOk, setDe)}</label>
        <button type="button" className="btn-ghost" onClick={() => { setDe(aOk); setA(deOk); }} aria-label="Intercambiar">⇄</button>
        <label className="block"><span className="label">A</span>{sel(aOk, setA)}</label>
      </div>
      <Big label="Resultado">{num(res, 6)} <span className="text-lg text-stone-500">{L.MAGNITUDES[cat].unidades[aOk][0].toLowerCase()}</span></Big>
    </div>
  );
}

function SemanaAno() {
  const [f, setF] = useState(today());
  const r = f ? L.semanaISO(f) : null;
  return (
    <div className="space-y-4">
      {r && <Big label={f === today() ? "Hoy estamos en la" : "Esa fecha es de la"}>Semana {r.semana} <span className="text-lg text-stone-500">de {r.año}</span></Big>}
      {r && <Stat label="Va del" value={`lunes ${formatoCorto(r.lunes)} al domingo ${formatoCorto(r.domingo)}`} />}
      <Field label="Consultar otra fecha" type="date" value={f} onChange={(e) => setF(e.target.value)} />
    </div>
  );
}
const formatoCorto = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("es-ES", { day: "numeric", month: "long", timeZone: "UTC" });

function Aleatorio() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [n, setN] = useState("1");
  const [unicos, setUnicos] = useState(true);
  const [res, setRes] = useState<number[]>([]);
  const generar = () => {
    const lo = Math.ceil(parse(min)), hi = Math.floor(parse(max)), cant = Math.min(1000, Math.max(1, parseInt(n, 10) || 1));
    if (!(hi >= lo)) return setRes([]);
    const rango = hi - lo + 1;
    const rnd = (m: number) => { const lim = Math.floor(2 ** 32 / m) * m; const b = new Uint32Array(1); do crypto.getRandomValues(b); while (b[0] >= lim); return b[0] % m; };
    if (unicos && cant <= rango) {
      const set = new Set<number>();
      while (set.size < cant) set.add(lo + rnd(rango));
      setRes([...set]);
    } else setRes(Array.from({ length: cant }, () => lo + rnd(rango)));
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Field label="Mínimo" value={min} onChange={(e) => setMin(e.target.value)} inputMode="numeric" />
        <Field label="Máximo" value={max} onChange={(e) => setMax(e.target.value)} inputMode="numeric" />
        <Field label="¿Cuántos?" value={n} onChange={(e) => setN(e.target.value)} inputMode="numeric" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={unicos} onChange={(e) => setUnicos(e.target.checked)} className="h-4 w-4 accent-brand" />
        Sin repetir
      </label>
      <button type="button" className="btn-primary w-full py-3 text-base" onClick={generar}>🎲 Generar</button>
      {res.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {res.map((x, i) => <span key={i} className="rounded-xl bg-brand-soft px-4 py-2 text-2xl font-extrabold tabular-nums text-brand-dark">{x.toLocaleString("es-ES")}</span>)}
        </div>
      )}
    </div>
  );
}

/** Compte enrere en directe fins a una data (i hora) local. */
export function Countdown({ target }: { target: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  const parts: [number, string][] = [
    [Math.floor(diff / 86_400_000), "días"],
    [Math.floor(diff / 3_600_000) % 24, "horas"],
    [Math.floor(diff / 60_000) % 60, "min"],
    [Math.floor(diff / 1000) % 60, "seg"],
  ];
  return (
    <div className="grid grid-cols-4 gap-2">
      {parts.map(([v, l]) => (
        <div key={l} className="rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-3 text-center text-white shadow-lg">
          <div className="text-3xl font-extrabold tabular-nums sm:text-5xl">{v}</div>
          <div className="text-xs uppercase tracking-wide opacity-80">{l}</div>
        </div>
      ))}
    </div>
  );
}

/** Compte enrere a un esdeveniment fix (Nadal, Reis...), calculat amb la data real del visitant. */
export function EventCountdown({ slug, nombre }: { slug: string; nombre: string }) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  if (!mounted) return <div className="h-32 animate-pulse rounded-2xl bg-stone-100" />;
  const { fecha, dias } = L.proximoEvento(slug, today());
  return (
    <>
      {dias === 0 ? <Big>¡Es hoy! 🎉</Big> : <Countdown target={`${fecha}T00:00:00`} />}
      <p className="text-center text-stone-700">
        {nombre[0].toUpperCase() + nombre.slice(1)} cae en <b>{weekday(fecha)}</b>.
      </p>
    </>
  );
}

function CuentaAtras() {
  const [f, setF] = useState(L.sumarDias(today(), 30));
  const [h, setH] = useState("00:00");
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Fecha" type="date" value={f} onChange={(e) => setF(e.target.value)} />
        <Field label="Hora" type="time" value={h} onChange={(e) => setH(e.target.value)} />
      </div>
      {f && <Countdown target={`${f}T${h || "00:00"}:00`} />}
      {f && <p className="text-center text-sm text-stone-600">Hasta el {weekday(f)}{h && h !== "00:00" ? ` a las ${h}` : ""}</p>}
    </div>
  );
}

function Fracciones() {
  const [a, setA] = useState("1/2");
  const [b, setB] = useState("3/4");
  const [op, setOp] = useState<"+" | "-" | "×" | "÷">("+");
  const fa = L.parseFraccion(a), fb = L.parseFraccion(b);
  const r = fa && fb ? L.operarFracciones(fa, fb, op) : null;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        <Field label="Fracción 1" value={a} onChange={(e) => setA(e.target.value)} placeholder="1/2" />
        <select className="input w-auto text-lg font-bold" value={op} onChange={(e) => setOp(e.target.value as typeof op)} aria-label="Operación">
          {["+", "-", "×", "÷"].map((o) => <option key={o}>{o}</option>)}
        </select>
        <Field label="Fracción 2" value={b} onChange={(e) => setB(e.target.value)} placeholder="3/4" />
      </div>
      {r ? (
        <>
          <Big label="Resultado simplificado">{L.fraccionATexto(r)}</Big>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Número mixto" value={L.fraccionMixta(r) ?? "—"} />
            <Stat label="En decimal" value={num(r.n / r.d, 6)} />
          </div>
        </>
      ) : (
        <Big>{fa && fb ? "No se puede dividir entre 0" : "Escribe fracciones como 3/4, 1 1/2 o 0,5"}</Big>
      )}
    </div>
  );
}

function Estadistica() {
  const [t, setT] = useState("7, 8, 5, 9, 6, 8, 10, 7, 8");
  const nums = t.split(/[\s,;]+/).map((x) => parse(x)).filter((n) => Number.isFinite(n));
  const r = nums.length ? L.estadistica(nums) : null;
  return (
    <div className="space-y-4">
      <label className="block">
        <span className="label">Números (separados por comas, espacios o saltos de línea)</span>
        <textarea className="input min-h-28" value={t} onChange={(e) => setT(e.target.value)} />
      </label>
      {r && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Big label="Media">{num(r.media, 4)}</Big>
            <Big label="Mediana">{num(r.mediana, 4)}</Big>
            <Big label="Moda">{r.moda.length ? r.moda.map((m) => num(m)).join(", ") : "No hay"}</Big>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label="Cantidad de datos" value={r.n} />
            <Stat label="Suma" value={num(r.suma, 4)} />
            <Stat label="Rango" value={`${num(r.rango)} (${num(r.min)} – ${num(r.max)})`} />
            <Stat label="Desviación típica" value={num(r.desviacion, 4)} />
            <Stat label="Desv. típica muestral" value={num(r.desviacionMuestral, 4)} />
          </div>
        </>
      )}
    </div>
  );
}

function AreaPerimetro() {
  type F = "cuadrado" | "rectangulo" | "circulo" | "triangulo";
  const [f, setF] = useState<F>("rectangulo");
  const [v, setV] = useState(["4", "3", "5"]);
  const campos: Record<F, string[]> = { cuadrado: ["Lado"], rectangulo: ["Base", "Altura"], circulo: ["Radio"], triangulo: ["Lado a", "Lado b", "Lado c"] };
  const vals = campos[f].map((_, i) => parse(v[i]));
  const ok = vals.every((x) => x > 0);
  const r = ok ? L.figura(f, vals) : null;
  return (
    <div className="space-y-4">
      <Tabs value={f} onChange={setF} options={[["cuadrado", "Cuadrado"], ["rectangulo", "Rectángulo"], ["circulo", "Círculo"], ["triangulo", "Triángulo"]]} />
      <div className="grid gap-3 sm:grid-cols-3">
        {campos[f].map((c, i) => (
          <Field key={c} label={c} value={v[i]} onChange={(e) => setV((old) => old.map((x, j) => (j === i ? e.target.value : x)))} inputMode="decimal" />
        ))}
      </div>
      {r && Number.isFinite(r.area) ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <Big label="Área">{num(r.area, 4)} <span className="text-base text-stone-500">u²</span></Big>
          <Big label={f === "circulo" ? "Perímetro (circunferencia)" : "Perímetro"}>{num(r.perimetro, 4)} <span className="text-base text-stone-500">u</span></Big>
        </div>
      ) : (
        <Big>{ok ? "Con esas medidas no existe el triángulo" : "Introduce medidas mayores que 0"}</Big>
      )}
    </div>
  );
}

function BasesNumericas() {
  const [base, setBase] = useState<"2" | "8" | "10" | "16">("10");
  const [v, setV] = useState("255");
  const r = L.convertirBase(v, Number(base) as 2 | 8 | 10 | 16);
  const filas: [string, string][] = r ? [["Binario (base 2)", r.bin], ["Octal (base 8)", r.oct], ["Decimal (base 10)", r.dec], ["Hexadecimal (base 16)", r.hex]] : [];
  return (
    <div className="space-y-4">
      <Tabs value={base} onChange={setBase} options={[["2", "Binario"], ["8", "Octal"], ["10", "Decimal"], ["16", "Hexadecimal"]]} />
      <Field label="Número" value={v} onChange={(e) => setV(e.target.value)} autoComplete="off" spellCheck={false} />
      {r ? (
        <div className="space-y-2">
          {filas.map(([l, x]) => (
            <div key={l} className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-3">
              <div className="min-w-0">
                <div className="text-xs text-stone-500">{l}</div>
                <div className="break-all font-mono text-lg font-bold">{x}</div>
              </div>
              <Copy text={x} />
            </div>
          ))}
        </div>
      ) : (
        <Big>{v.trim() ? "Ese número no es válido en esta base" : "Escribe un número"}</Big>
      )}
    </div>
  );
}

function Prestamo() {
  const [cap, setCap] = useState("10000");
  const [int, setInt] = useState("7");
  const [meses, setMeses] = useState("60");
  const c = parse(cap), i = parse(int), m = parseInt(meses, 10);
  const r = c > 0 && i >= 0 && m > 0 && m <= 600 ? L.hipoteca(c, i, m / 12) : null;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Importe (€)" value={cap} onChange={(e) => setCap(e.target.value)} inputMode="decimal" />
        <Field label="Interés anual TIN (%)" value={int} onChange={(e) => setInt(e.target.value)} inputMode="decimal" />
        <Field label="Plazo (meses)" value={meses} onChange={(e) => setMeses(e.target.value)} inputMode="numeric" />
      </div>
      {r && (
        <>
          <Big label="Cuota mensual">{eur(r.cuota)}</Big>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Intereses" value={eur(r.totalIntereses)} />
            <Stat label="Total a devolver" value={eur(r.totalPagado)} />
            <Stat label="TAE aprox. (sin comisiones)" value={`${num(L.tinATae(i))} %`} />
          </div>
        </>
      )}
    </div>
  );
}

function TinTae() {
  const [modo, setModo] = useState<"tin" | "tae">("tin");
  const [v, setV] = useState("5");
  const [n, setN] = useState("12");
  const x = parse(v), p = Number(n);
  const r = modo === "tin" ? L.tinATae(x, p) : L.taeATin(x, p);
  return (
    <div className="space-y-4">
      <Tabs value={modo} onChange={setModo} options={[["tin", "De TIN a TAE"], ["tae", "De TAE a TIN"]]} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={modo === "tin" ? "TIN (%)" : "TAE (%)"} value={v} onChange={(e) => setV(e.target.value)} inputMode="decimal" />
        <label className="block">
          <span className="label">Pagos de intereses al año</span>
          <select className="input" value={n} onChange={(e) => setN(e.target.value)}>
            <option value="12">Mensual (12)</option>
            <option value="4">Trimestral (4)</option>
            <option value="2">Semestral (2)</option>
            <option value="1">Anual (1)</option>
          </select>
        </label>
      </div>
      <Big label={modo === "tin" ? "TAE equivalente" : "TIN equivalente"}>{Number.isFinite(r) ? `${num(r, 3)} %` : "—"}</Big>
    </div>
  );
}

function Vacaciones() {
  const y = today().slice(0, 4);
  const [ini, setIni] = useState(`${y}-01-01`);
  const [fin, setFin] = useState(today());
  const [anuales, setAnuales] = useState("30");
  const [disf, setDisf] = useState("0");
  const ok = ini && fin && ini <= fin;
  const r = ok ? L.vacacionesProporcionales(ini, fin, parse(anuales) || 0, parse(disf) || 0) : null;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Inicio del periodo" type="date" value={ini} onChange={(e) => setIni(e.target.value)} />
        <Field label="Fin del periodo (o hoy)" type="date" value={fin} onChange={(e) => setFin(e.target.value)} />
        <Field label="Días de vacaciones al año" value={anuales} onChange={(e) => setAnuales(e.target.value)} inputMode="decimal" />
        <Field label="Días ya disfrutados" value={disf} onChange={(e) => setDisf(e.target.value)} inputMode="decimal" />
      </div>
      {r ? (
        <>
          <Big label="Días de vacaciones generados">{num(r.generados, 2)} días</Big>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Días trabajados en el periodo" value={r.trabajados} />
            <Stat label="Te quedan por disfrutar" value={`${num(r.pendientes, 2)} días`} />
          </div>
        </>
      ) : (
        <Big>La fecha de fin debe ser posterior a la de inicio</Big>
      )}
    </div>
  );
}

function HorasEntre() {
  const [a, setA] = useState("09:00");
  const [b, setB] = useState("17:30");
  const [p, setP] = useState("30");
  const r = a && b ? L.horasEntre(a, b, parseInt(p, 10) || 0) : null;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Field label="Entrada" type="time" value={a} onChange={(e) => setA(e.target.value)} />
        <Field label="Salida" type="time" value={b} onChange={(e) => setB(e.target.value)} />
        <Field label="Pausa (min)" value={p} onChange={(e) => setP(e.target.value)} inputMode="numeric" />
      </div>
      {r && (
        <>
          <Big label="Tiempo trabajado">{L.minutosAHoras(r.minutos)} h</Big>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="En horas decimales" value={`${num(r.minutos / 60)} h`} />
            <Stat label="Turno" value={r.nocturno ? "Pasa la medianoche 🌙" : "Mismo día"} />
          </div>
        </>
      )}
    </div>
  );
}

function RitmoRunning() {
  const [km, setKm] = useState("10");
  const [t, setT] = useState("50:00");
  const d = parse(km), s = L.parseTiempo(t);
  const r = d > 0 && s > 0 ? L.ritmo(d, s) : null;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Distancia (km)" value={km} onChange={(e) => setKm(e.target.value)} inputMode="decimal" />
        <Field label="Tiempo (h:mm:ss o mm:ss)" value={t} onChange={(e) => setT(e.target.value)} placeholder="50:00" />
      </div>
      {r ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Big label="Ritmo">{r.ritmo} <span className="text-base text-stone-500">min/km</span></Big>
            <Big label="Velocidad">{num(r.velocidad, 1)} <span className="text-base text-stone-500">km/h</span></Big>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {r.predicciones.map((p) => <Stat key={p.nombre} label={p.nombre} value={p.tiempo} />)}
          </div>
        </>
      ) : (
        <Big>Escribe la distancia y el tiempo (ej.: 50:00)</Big>
      )}
    </div>
  );
}

function EdadMascota() {
  const [esp, setEsp] = useState<"perro" | "gato">("perro");
  const [tam, setTam] = useState<"pequeño" | "mediano" | "grande">("mediano");
  const [a, setA] = useState("5");
  const años = parse(a);
  const r = años > 0 && años < 40 ? L.edadMascota(años, esp, tam) : null;
  return (
    <div className="space-y-4">
      <Tabs value={esp} onChange={setEsp} options={[["perro", "🐶 Perro"], ["gato", "🐱 Gato"]]} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Edad (años)" value={a} onChange={(e) => setA(e.target.value)} inputMode="decimal" />
        {esp === "perro" && (
          <label className="block">
            <span className="label">Tamaño</span>
            <select className="input" value={tam} onChange={(e) => setTam(e.target.value as typeof tam)}>
              <option value="pequeño">Pequeño (menos de 10 kg)</option>
              <option value="mediano">Mediano (10-25 kg)</option>
              <option value="grande">Grande (más de 25 kg)</option>
            </select>
          </label>
        )}
      </div>
      {r && (
        <>
          <Big label="En años humanos">{num(r.tradicional, 0)} años</Big>
          {Number.isFinite(r.cientifica) && <Stat label="Según la fórmula científica de 2020 (16·ln(edad) + 31)" value={`${num(r.cientifica, 0)} años`} />}
        </>
      )}
    </div>
  );
}

function SueldoNeto({ inicial = 30000 }: { inicial?: number }) {
  const [bruto, setBruto] = useState(String(inicial));
  const [pagas, setPagas] = useState<"12" | "14">("14");
  const [contrato, setContrato] = useState<"indefinido" | "temporal">("indefinido");
  const [situacion, setSituacion] = useState<L.Situacion>("general");
  const [hijos, setHijos] = useState("0");
  const [menores3, setMenores3] = useState("0");
  const [enteros, setEnteros] = useState(false);
  const b = parse(bruto);
  const r = b > 0 && b < 10_000_000
    ? L.sueldoNeto({ bruto: b, pagas: Number(pagas) as 12 | 14, contrato, situacion, hijos: parseInt(hijos, 10) || 0, menores3: parseInt(menores3, 10) || 0, hijosEnteros: enteros })
    : null;
  const pct = (x: number) => (r ? `${num((x / b) * 100, 1)} %` : "");
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Salario bruto anual (€)" value={bruto} onChange={(e) => setBruto(e.target.value)} inputMode="decimal" />
        <label className="block">
          <span className="label">Número de pagas</span>
          <select className="input" value={pagas} onChange={(e) => setPagas(e.target.value as "12" | "14")}>
            <option value="14">14 pagas (2 extra)</option>
            <option value="12">12 pagas (extras prorrateadas)</option>
          </select>
        </label>
        <label className="block">
          <span className="label">Tipo de contrato</span>
          <select className="input" value={contrato} onChange={(e) => setContrato(e.target.value as "indefinido" | "temporal")}>
            <option value="indefinido">Indefinido</option>
            <option value="temporal">Temporal</option>
          </select>
        </label>
        <label className="block">
          <span className="label">Situación familiar</span>
          <select className="input" value={situacion} onChange={(e) => setSituacion(e.target.value as L.Situacion)} aria-describedby="situacion-ayuda">
            <option value="general">General</option>
            <option value="conyuge">Cónyuge sin ingresos</option>
            <option value="monoparental">Familia monoparental</option>
          </select>
        </label>
        <p id="situacion-ayuda" className="text-xs text-stone-500 sm:col-span-2">
          General: soltero/a, o casado/a con cónyuge con ingresos. Cónyuge sin ingresos: casado/a y tu pareja gana menos de 1.500 € al año.
        </p>
        <Field label="Hijos menores de 25 a tu cargo" value={hijos} onChange={(e) => setHijos(e.target.value)} inputMode="numeric" />
        <Field label="De ellos, menores de 3 años" value={menores3} onChange={(e) => setMenores3(e.target.value)} inputMode="numeric" />
      </div>
      {(parseInt(hijos, 10) || 0) > 0 && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={enteros} onChange={(e) => setEnteros(e.target.checked)} className="h-4 w-4 accent-brand" />
          Los hijos solo cuentan para mí (si no, se reparten con el otro progenitor)
        </label>
      )}
      {r && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Big label={`Neto al mes (${pagas} pagas)`}>{eur(r.netoMensual)}</Big>
            <Big label="Neto al año">{eur(r.netoAnual)}</Big>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Bruto al mes" value={eur(r.brutoMensual)} />
            <Stat label="Seguridad Social" value={<>{eur(r.ss)} <span className="text-xs text-stone-500">{pct(r.ss)}</span></>} />
            <Stat label="Retención IRPF" value={<>{eur(r.irpf)} <span className="text-xs text-stone-500">{num(r.tipo)} %</span></>} />
            <Stat label="Te quedas con" value={pct(r.netoAnual)} />
          </div>
          <div className="flex h-4 overflow-hidden rounded-full text-[10px]">
            <div className="bg-brand" style={{ width: `${(r.netoAnual / b) * 100}%` }} title="Neto" />
            <div className="bg-sky-500" style={{ width: `${(r.ss / b) * 100}%` }} title="Seguridad Social" />
            <div className="bg-amber-500" style={{ width: `${(r.irpf / b) * 100}%` }} title="IRPF" />
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-stone-600">
            <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-brand" />Neto</span>
            <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-sky-500" />Seguridad Social</span>
            <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-500" />IRPF</span>
          </div>
          <p className="text-xs text-stone-500">Estimación orientativa con la normativa de 2026 (régimen general, territorio común). No incluye País Vasco ni Navarra.</p>
        </>
      )}
    </div>
  );
}

const EXTINCIONES: [L.Extincion, string][] = [
  ["improcedente", "Despido improcedente"],
  ["objetivo", "Despido objetivo (causas económicas, ERE...)"],
  ["fin-temporal", "Fin de contrato temporal"],
  ["dimision", "Baja voluntaria"],
  ["disciplinario", "Despido disciplinario procedente"],
];

function Finiquito() {
  const [salario, setSalario] = useState("24000");
  const [inicio, setInicio] = useState("2021-03-01");
  const [fin, setFin] = useState(today());
  const [tipo, setTipo] = useState<L.Extincion>("improcedente");
  const [vacAño, setVacAño] = useState("30");
  const [vacDisf, setVacDisf] = useState("10");
  const [prorr, setProrr] = useState(false);
  const [diasMes, setDiasMes] = useState(String(Number(today().slice(8, 10))));
  const s = parse(salario);
  const ok = s > 0 && inicio && fin && inicio <= fin;
  const r = ok
    ? L.finiquito({ salarioAnual: s, inicio, fin, tipo, diasVacacionesAño: parse(vacAño) || 0, vacacionesDisfrutadas: parse(vacDisf) || 0, pagasProrrateadas: prorr, diasMesPendientes: Math.min(31, parseInt(diasMes, 10) || 0) })
    : null;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Salario bruto anual (€, con pagas extra)" value={salario} onChange={(e) => setSalario(e.target.value)} inputMode="decimal" />
        <label className="block">
          <span className="label">¿Cómo termina el contrato?</span>
          <select className="input" value={tipo} onChange={(e) => setTipo(e.target.value as L.Extincion)}>
            {EXTINCIONES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <Field label="Fecha de inicio del contrato" type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />
        <Field label="Último día de trabajo" type="date" value={fin} onChange={(e) => setFin(e.target.value)} />
        <Field label="Días del último mes sin cobrar" value={diasMes} onChange={(e) => setDiasMes(e.target.value)} inputMode="numeric" />
        <Field label="Vacaciones al año (días naturales)" value={vacAño} onChange={(e) => setVacAño(e.target.value)} inputMode="decimal" />
        <Field label="Vacaciones ya disfrutadas este año" value={vacDisf} onChange={(e) => setVacDisf(e.target.value)} inputMode="decimal" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={prorr} onChange={(e) => setProrr(e.target.checked)} className="h-4 w-4 accent-brand" />
        Cobro las pagas extra prorrateadas cada mes
      </label>
      {r ? (
        <>
          <Big label="Total a cobrar (finiquito + indemnización)">{eur(r.total)}</Big>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-stone-200 bg-white p-4">
              <div className="font-bold">Finiquito: {eur(r.totalFiniquito)}</div>
              <ul className="mt-2 space-y-1 text-sm text-stone-600">
                <li className="flex justify-between gap-2"><span>Salario del último mes</span><b className="tabular-nums">{eur(r.salario)}</b></li>
                <li className="flex justify-between gap-2"><span>Vacaciones no disfrutadas ({num(r.diasVacaciones, 1)} días)</span><b className="tabular-nums">{eur(r.vacaciones)}</b></li>
                <li className="flex justify-between gap-2"><span>Parte proporcional pagas extra</span><b className="tabular-nums">{prorr ? "Ya cobradas" : eur(r.pagas)}</b></li>
              </ul>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-4">
              <div className="font-bold">Indemnización: {eur(r.indemnizacion.importe)}</div>
              <p className="mt-2 text-sm text-stone-600">
                {r.indemnizacion.importe > 0
                  ? `${num(r.indemnizacion.dias, 1)} días de salario a ${eur(r.indemnizacion.diario)} al día${r.indemnizacion.topado ? " (limitado a 12 mensualidades)" : ""}.`
                  : "En una baja voluntaria o un despido disciplinario procedente no hay indemnización."}
              </p>
            </div>
          </div>
          <p className="text-xs text-stone-500">Importes brutos estimados con las reglas del Estatuto de los Trabajadores. Tu convenio puede mejorar estas cantidades. Revisa el documento antes de firmarlo.</p>
        </>
      ) : (
        <Big>Revisa el salario y las fechas</Big>
      )}
    </div>
  );
}

function DetectorIA() {
  const [t, setT] = useState("");
  const r = L.analizarIA(t);
  const color = r.porcentaje >= 70 ? "text-red-600" : r.porcentaje >= 40 ? "text-amber-600" : "text-emerald-700";
  const veredicto = r.porcentaje >= 70 ? "Muchas señales de IA" : r.porcentaje >= 40 ? "Señales mixtas" : "Parece escrito por una persona";
  // Subratlla les expressions típiques dins del text
  const partes = useMemo(() => {
    if (!r.encontradas.length) return [t];
    const re = new RegExp(`(${r.encontradas.map((f) => f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).sort((a, b) => b.length - a.length).join("|")})`, "gi");
    return t.split(re);
  }, [t, r.encontradas]);
  const esFrase = (s: string) => r.encontradas.includes(s.toLocaleLowerCase("es"));
  return (
    <div className="space-y-4">
      <label className="block">
        <span className="label">Texto a analizar</span>
        <textarea id="texto-ia" className="input min-h-56" value={t} onChange={(e) => setT(e.target.value)} placeholder="Pega aquí el texto que quieres comprobar (mínimo 80 palabras)…" />
      </label>
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>{r.palabras} palabras</span>
        {t && <button type="button" className="underline" onClick={() => setT("")}>Borrar</button>}
      </div>
      {!t.trim() ? (
        <div className="rounded-2xl border-2 border-dashed border-stone-300 p-6 text-center text-stone-500">
          Pega un texto arriba y te diremos qué porcentaje de señales de IA tiene.
        </div>
      ) : !r.suficiente ? (
        <Big>Faltan {80 - r.palabras} palabras para poder analizarlo</Big>
      ) : (
        <>
          <div className="rounded-2xl bg-brand-soft p-5">
            <div className="text-sm text-stone-600">Señales de escritura con IA</div>
            <div className={`text-4xl font-black ${color}`}>{r.porcentaje} %</div>
            <div className="font-semibold">{veredicto}</div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500" style={{ width: `${r.porcentaje}%` }} />
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {r.señales.map((s) => (
              <div key={s.id} className="rounded-xl border border-stone-200 bg-white p-3">
                <div className="flex justify-between gap-2 text-sm"><span>{s.nombre}</span><b className="tabular-nums">{Math.round(s.valor * 100)} %</b></div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full bg-brand" style={{ width: `${s.valor * 100}%` }} /></div>
              </div>
            ))}
          </div>
          {r.encontradas.length > 0 && (
            <details className="rounded-xl border border-stone-200 bg-white p-3" open>
              <summary className="cursor-pointer text-sm font-semibold">Expresiones típicas de IA encontradas ({r.encontradas.length})</summary>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
                {partes.map((p, i) => (esFrase(p) ? <mark key={i} className="rounded bg-amber-100 px-0.5">{p}</mark> : <span key={i}>{p}</span>))}
              </p>
            </details>
          )}
          <p className="text-xs text-stone-500">Resultado orientativo basado en señales de estilo. Ningún detector de IA es fiable al 100 %: no lo uses como prueba para acusar a nadie.</p>
        </>
      )}
    </div>
  );
}

function FacturaAutonomo() {
  const [modo, setModo] = useState<"base" | "neto">("base");
  const [v, setV] = useState("1000");
  const [iva, setIva] = useState("21");
  const [irpf, setIrpf] = useState("15");
  const r = L.facturaAutonomo(parse(v), Number(iva), Number(irpf), modo);
  return (
    <div className="space-y-4">
      <Tabs value={modo} onChange={setModo} options={[["base", "Tengo la base"], ["neto", "Quiero cobrar"]]} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label={modo === "base" ? "Base imponible (€)" : "Quiero cobrar (€)"} value={v} onChange={(e) => setV(e.target.value)} inputMode="decimal" />
        <label className="block"><span className="label">IVA</span>
          <select className="input" value={iva} onChange={(e) => setIva(e.target.value)}>
            <option value="21">21 %</option><option value="10">10 %</option><option value="4">4 %</option><option value="0">0 % (exento)</option>
          </select>
        </label>
        <label className="block"><span className="label">Retención IRPF</span>
          <select className="input" value={irpf} onChange={(e) => setIrpf(e.target.value)}>
            <option value="15">15 % (general)</option><option value="7">7 % (nuevos autónomos)</option><option value="0">Sin retención</option>
          </select>
        </label>
      </div>
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white text-sm tabular-nums">
        {[["Base imponible", r.base, ""], [`IVA (${iva} %)`, r.cuotaIva, "+"], [`Retención IRPF (${irpf} %)`, r.retencion, "−"]].map(([l, n, s]) => (
          <div key={l as string} className="flex justify-between border-b border-stone-100 px-4 py-2.5"><span>{s} {l}</span><b>{eur(n as number)}</b></div>
        ))}
        <div className="flex justify-between bg-brand-soft px-4 py-3 text-base"><span className="font-bold">Total a cobrar</span><b className="text-lg">{eur(r.total)}</b></div>
      </div>
    </div>
  );
}

function MargenBeneficio() {
  const [modo, setModo] = useState<"margen" | "precio">("margen");
  const [coste, setCoste] = useState("60");
  const [precio, setPrecio] = useState("100");
  const [deseado, setDeseado] = useState("40");
  const m = L.margen(parse(coste), parse(precio));
  const pv = L.precioParaMargen(parse(coste), parse(deseado));
  return (
    <div className="space-y-4">
      <Tabs value={modo} onChange={setModo} options={[["margen", "Calcular mi margen"], ["precio", "Calcular precio de venta"]]} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Coste (€, sin IVA)" value={coste} onChange={(e) => setCoste(e.target.value)} inputMode="decimal" />
        {modo === "margen"
          ? <Field label="Precio de venta (€, sin IVA)" value={precio} onChange={(e) => setPrecio(e.target.value)} inputMode="decimal" />
          : <Field label="Margen que quieres (%)" value={deseado} onChange={(e) => setDeseado(e.target.value)} inputMode="decimal" />}
      </div>
      {modo === "margen" ? (
        <>
          <Big label="Margen sobre el precio de venta">{num(m.margen, 2)} %</Big>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Beneficio por unidad" value={eur(m.beneficio)} />
            <Stat label="Markup sobre el coste" value={`${num(m.markup, 2)} %`} />
          </div>
        </>
      ) : (
        <>
          <Big label="Precio de venta sin IVA">{eur(pv)}</Big>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Con IVA del 21 %" value={eur(pv * 1.21)} />
            <Stat label="Beneficio por unidad" value={eur(pv - parse(coste))} />
          </div>
        </>
      )}
    </div>
  );
}

function ConsumoElectrico() {
  const [w, setW] = useState("2000");
  const [h, setH] = useState("1");
  const [d, setD] = useState("30");
  const [p, setP] = useState("0,15");
  const r = L.consumoElectrico(parse(w), parse(h), parse(d), parse(p));
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Potencia del aparato (W)" value={w} onChange={(e) => setW(e.target.value)} inputMode="decimal" />
        <Field label="Horas de uso al día" value={h} onChange={(e) => setH(e.target.value)} inputMode="decimal" />
        <Field label="Días de uso al mes" value={d} onChange={(e) => setD(e.target.value)} inputMode="numeric" />
        <Field label="Precio del kWh (€)" value={p} onChange={(e) => setP(e.target.value)} inputMode="decimal" />
      </div>
      <Big label="Coste al mes">{eur(r.costeMes)}</Big>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Consumo al día" value={`${num(r.kwhDia)} kWh`} />
        <Stat label="Consumo al mes" value={`${num(r.kwhMes)} kWh`} />
        <Stat label="Coste al día" value={eur(r.costeDia)} />
        <Stat label="Coste al año" value={eur(r.costeAño)} />
      </div>
    </div>
  );
}

function Ahorro() {
  const [obj, setObj] = useState("12000");
  const [meses, setMeses] = useState("24");
  const [ini, setIni] = useState("0");
  const [int, setInt] = useState("0");
  const n = parseInt(meses, 10);
  const r = n > 0 ? L.ahorroMensual(parse(obj), n, parse(ini) || 0, parse(int) || 0) : NaN;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Quiero reunir (€)" value={obj} onChange={(e) => setObj(e.target.value)} inputMode="decimal" />
        <Field label="En cuántos meses" value={meses} onChange={(e) => setMeses(e.target.value)} inputMode="numeric" />
        <Field label="Ya tengo ahorrado (€)" value={ini} onChange={(e) => setIni(e.target.value)} inputMode="decimal" />
        <Field label="Rentabilidad anual (%) opcional" value={int} onChange={(e) => setInt(e.target.value)} inputMode="decimal" />
      </div>
      <Big label="Tienes que ahorrar al mes">{r === 0 ? "¡Ya lo tienes! 🎉" : eur(r)}</Big>
      {Number.isFinite(r) && r > 0 && <Stat label="Al día, aproximadamente" value={eur((r * 12) / 365)} />}
    </div>
  );
}

function DividirCuenta() {
  const [t, setT] = useState("90");
  const [p, setP] = useState("4");
  const [prop, setProp] = useState("0");
  const r = L.dividirCuenta(parse(t), parseInt(p, 10) || 1, parse(prop) || 0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Field label="Total (€)" value={t} onChange={(e) => setT(e.target.value)} inputMode="decimal" />
        <Field label="Personas" value={p} onChange={(e) => setP(e.target.value)} inputMode="numeric" />
        <Field label="Propina (%)" value={prop} onChange={(e) => setProp(e.target.value)} inputMode="decimal" />
      </div>
      <div className="flex flex-wrap gap-2">
        {["0", "5", "10", "15"].map((x) => <button key={x} type="button" className={`btn-ghost py-1.5 ${prop === x ? "border-brand text-brand" : ""}`} onClick={() => setProp(x)}>{x === "0" ? "Sin propina" : `${x} %`}</button>)}
      </div>
      <Big label="Paga cada uno">{eur(r.porPersona)}</Big>
      {r.propina > 0 && <Stat label="Total con propina" value={`${eur(r.conPropina)} (propina ${eur(r.propina)})`} />}
    </div>
  );
}

function HorasMinutos() {
  const [tipo, setTipo] = useState<"minutos" | "decimal" | "hhmm">("minutos");
  const [v, setV] = useState("150");
  const min = L.aMinutos(v, tipo);
  const ok = Number.isFinite(min) && min >= 0;
  return (
    <div className="space-y-4">
      <Tabs value={tipo} onChange={(t) => { setTipo(t); setV(t === "minutos" ? "150" : t === "decimal" ? "2,5" : "2:30"); }} options={[["minutos", "Desde minutos"], ["decimal", "Desde horas decimales"], ["hhmm", "Desde horas:minutos"]]} />
      <Field label={tipo === "minutos" ? "Minutos" : tipo === "decimal" ? "Horas decimales (ej.: 2,5)" : "Horas y minutos (ej.: 2:30)"} value={v} onChange={(e) => setV(e.target.value)} inputMode="decimal" />
      {ok ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <Big label="Horas y minutos">{L.minutosAHoras(Math.round(min))}</Big>
          <Big label="Horas decimales">{num(min / 60, 4)} h</Big>
          <Big label="Minutos">{num(min, 2)}</Big>
        </div>
      ) : <Big>Formato no válido</Big>}
    </div>
  );
}

function Calorias() {
  const [sexo, setSexo] = useState<"hombre" | "mujer">("mujer");
  const [edad, setEdad] = useState("30");
  const [peso, setPeso] = useState("65");
  const [alt, setAlt] = useState("165");
  const [act, setAct] = useState("1.375");
  const e = parse(edad), p = parse(peso), a = parse(alt);
  const r = e > 0 && p > 0 && a > 0 ? L.calorias(sexo, e, p, a, Number(act)) : null;
  return (
    <div className="space-y-4">
      <Tabs value={sexo} onChange={setSexo} options={[["mujer", "Mujer"], ["hombre", "Hombre"]]} />
      <div className="grid grid-cols-3 gap-3">
        <Field label="Edad" value={edad} onChange={(ev) => setEdad(ev.target.value)} inputMode="numeric" />
        <Field label="Peso (kg)" value={peso} onChange={(ev) => setPeso(ev.target.value)} inputMode="decimal" />
        <Field label="Altura (cm)" value={alt} onChange={(ev) => setAlt(ev.target.value)} inputMode="decimal" />
      </div>
      <label className="block"><span className="label">Actividad física</span>
        <select className="input" value={act} onChange={(ev) => setAct(ev.target.value)}>
          {L.ACTIVIDAD.map(([f, l]) => <option key={f} value={String(f)}>{l}</option>)}
        </select>
      </label>
      {r && (
        <>
          <Big label="Calorías para mantener tu peso">{num(r.mantenimiento, 0)} kcal/día</Big>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Metabolismo basal" value={`${num(r.tmb, 0)} kcal`} />
            <Stat label="Para perder peso" value={`${num(r.perder, 0)} kcal`} />
            <Stat label="Para ganar peso" value={`${num(r.ganar, 0)} kcal`} />
          </div>
        </>
      )}
    </div>
  );
}

function RaizPotencia() {
  const [modo, setModo] = useState<"raiz" | "potencia">("raiz");
  const [x, setX] = useState("144");
  const [n, setN] = useState("2");
  const xv = parse(x), nv = parse(n);
  const r = modo === "raiz" ? L.raiz(xv, nv) : Math.pow(xv, nv);
  return (
    <div className="space-y-4">
      <Tabs value={modo} onChange={setModo} options={[["raiz", "Raíz"], ["potencia", "Potencia"]]} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Número" value={x} onChange={(e) => setX(e.target.value)} inputMode="decimal" />
        <Field label={modo === "raiz" ? "Índice (2 = cuadrada, 3 = cúbica)" : "Exponente"} value={n} onChange={(e) => setN(e.target.value)} inputMode="decimal" />
      </div>
      <div className="flex flex-wrap gap-2">
        {modo === "raiz" ? <><button type="button" className="btn-ghost py-1.5" onClick={() => setN("2")}>Cuadrada</button><button type="button" className="btn-ghost py-1.5" onClick={() => setN("3")}>Cúbica</button></> : <><button type="button" className="btn-ghost py-1.5" onClick={() => setN("2")}>Al cuadrado</button><button type="button" className="btn-ghost py-1.5" onClick={() => setN("3")}>Al cubo</button></>}
      </div>
      <Big label="Resultado">{Number.isFinite(r) ? num(r, 10) : modo === "raiz" && xv < 0 ? "No tiene raíz real" : "—"}</Big>
    </div>
  );
}

function VelocidadDistanciaTiempo() {
  const [calc, setCalc] = useState<"velocidad" | "distancia" | "tiempo">("velocidad");
  const [a, setA] = useState("120");
  const [b, setB] = useState("1,5");
  const r = L.velocidadDistanciaTiempo(calc, parse(a), parse(b));
  const labels = { velocidad: ["Distancia (km)", "Tiempo (horas)"], distancia: ["Velocidad (km/h)", "Tiempo (horas)"], tiempo: ["Distancia (km)", "Velocidad (km/h)"] }[calc];
  return (
    <div className="space-y-4">
      <Tabs value={calc} onChange={setCalc} options={[["velocidad", "Velocidad"], ["distancia", "Distancia"], ["tiempo", "Tiempo"]]} />
      <div className="grid grid-cols-2 gap-3">
        <Field label={labels[0]} value={a} onChange={(e) => setA(e.target.value)} inputMode="decimal" />
        <Field label={labels[1]} value={b} onChange={(e) => setB(e.target.value)} inputMode="decimal" />
      </div>
      {Number.isFinite(r) ? (
        calc === "velocidad" ? <Big label="Velocidad media">{num(r, 2)} km/h <span className="text-base text-stone-500">({num(r / 3.6, 2)} m/s)</span></Big>
        : calc === "distancia" ? <Big label="Distancia">{num(r, 2)} km</Big>
        : <Big label="Tiempo">{L.minutosAHoras(Math.round(r * 60))} h <span className="text-base text-stone-500">({num(r, 2)} h)</span></Big>
      ) : <Big>Revisa los datos</Big>}
    </div>
  );
}

function GeneradorQR() {
  const [tipo, setTipo] = useState<"url" | "texto" | "wifi" | "tel">("url");
  const [v, setV] = useState("https://calcularonline.es");
  const [red, setRed] = useState("");
  const [clave, setClave] = useState("");
  const [qr, setQr] = useState<{ key: string; svg: string; png: string } | null>(null);
  const esc = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");
  const contenido = tipo === "wifi" ? (red ? `WIFI:T:WPA;S:${esc(red)};P:${esc(clave)};;` : "") : tipo === "tel" ? (v ? `tel:${v.replace(/\s/g, "")}` : "") : v;
  useEffect(() => {
    if (!contenido) return;
    let cancel = false;
    import("qrcode").then(async (QR) => {
      const opts = { margin: 2, errorCorrectionLevel: "M" as const };
      const [s, p] = await Promise.all([QR.toString(contenido, { ...opts, type: "svg" }), QR.toDataURL(contenido, { ...opts, width: 1024 })]);
      if (!cancel) setQr({ key: contenido, svg: s, png: p });
    });
    return () => { cancel = true; };
  }, [contenido]);
  const svg = contenido && qr?.key === contenido ? qr.svg : "";
  const png = qr?.png ?? "";
  return (
    <div className="space-y-4">
      <Tabs value={tipo} onChange={(t) => { setTipo(t); setV(t === "url" ? "https://" : ""); }} options={[["url", "Enlace"], ["texto", "Texto"], ["wifi", "WiFi"], ["tel", "Teléfono"]]} />
      {tipo === "wifi" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nombre de la red (SSID)" value={red} onChange={(e) => setRed(e.target.value)} autoComplete="off" />
          <Field label="Contraseña" value={clave} onChange={(e) => setClave(e.target.value)} autoComplete="off" />
        </div>
      ) : tipo === "texto" ? (
        <label className="block"><span className="label">Texto</span><textarea className="input min-h-24" value={v} onChange={(e) => setV(e.target.value)} /></label>
      ) : (
        <Field label={tipo === "url" ? "Enlace (URL)" : "Número de teléfono"} value={v} onChange={(e) => setV(e.target.value)} inputMode={tipo === "tel" ? "tel" : "url"} autoComplete="off" />
      )}
      {svg ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-4">
          <div className="w-56 max-w-full" dangerouslySetInnerHTML={{ __html: svg }} />
          <div className="flex flex-wrap justify-center gap-2">
            <a className="btn-primary" href={png} download="codigo-qr.png">Descargar PNG</a>
            <a className="btn-ghost" href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`} download="codigo-qr.svg">Descargar SVG</a>
          </div>
        </div>
      ) : <Big>Escribe algo para generar el código QR</Big>}
    </div>
  );
}

function Paro() {
  const [base, setBase] = useState("1800");
  const [dias, setDias] = useState("720");
  const [hijos, setHijos] = useState("0");
  const r = L.paro(parse(base), Number(hijos), parse(dias));
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Base de cotización mensual (€)" value={base} onChange={(e) => setBase(e.target.value)} inputMode="decimal" />
        <Field label="Días cotizados (últimos 6 años)" value={dias} onChange={(e) => setDias(e.target.value)} inputMode="numeric" />
        <label className="block"><span className="label">Hijos a cargo</span>
          <select className="input" value={hijos} onChange={(e) => setHijos(e.target.value)}>
            <option value="0">Sin hijos</option><option value="1">1 hijo</option><option value="2">2 o más</option>
          </select>
        </label>
      </div>
      {r.dias === 0 ? (
        <Big>Necesitas al menos 360 días cotizados para cobrar el paro contributivo</Big>
      ) : (
        <>
          <Big label="Los primeros 6 meses cobrarás (bruto)">{eur(r.primeros)}/mes</Big>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Desde el día 181" value={r.dias > 180 ? `${eur(r.despues)}/mes` : "—"} />
            <Stat label="Duración" value={`${r.dias} días (${num(r.meses, 0)} meses)`} />
            <Stat label="Total del paro" value={eur(r.total)} />
          </div>
          <p className="text-xs text-stone-500">Importes brutos: el SEPE descuenta la cotización a la Seguridad Social y, si procede, el IRPF. Topes 2026 con IPREM de {L.IPREM_2026} €: mínimo {eur(r.minimo)} y máximo {eur(r.maximo)} al mes.</p>
        </>
      )}
    </div>
  );
}

function HorasExtra() {
  const [anual, setAnual] = useState("24000");
  const [semana, setSemana] = useState("40");
  const [recargo, setRecargo] = useState("0");
  const [horas, setHoras] = useState("10");
  const r = L.horasExtra(parse(anual), parse(semana), parse(recargo) || 0, parse(horas) || 0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field label="Sueldo bruto anual (€)" value={anual} onChange={(e) => setAnual(e.target.value)} inputMode="decimal" />
        <Field label="Jornada (h/semana)" value={semana} onChange={(e) => setSemana(e.target.value)} inputMode="decimal" />
        <Field label="Recargo convenio (%)" value={recargo} onChange={(e) => setRecargo(e.target.value)} inputMode="decimal" />
        <Field label="Horas extra" value={horas} onChange={(e) => setHoras(e.target.value)} inputMode="decimal" />
      </div>
      <Big label="Te deben pagar (bruto)">{eur(r.total)}</Big>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Hora ordinaria" value={eur(r.ordinaria)} />
        <Stat label="Hora extra" value={eur(r.extra)} />
        <Stat label="Horas al año" value={num(r.horasAño, 0)} />
      </div>
    </div>
  );
}

function DiasLaborables() {
  const t = today();
  const [desde, setDesde] = useState(t);
  const [hasta, setHasta] = useState(L.sumarDias(t, 30));
  const [festivos, setFestivos] = useState(true);
  const [sabados, setSabados] = useState(false);
  const ok = desde && hasta;
  const r = ok ? L.diasLaborables(desde, hasta, { festivos, sabados }) : null;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Desde (incluido)" type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        <Field label="Hasta (incluido)" type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={festivos} onChange={(e) => setFestivos(e.target.checked)} className="h-4 w-4 accent-brand" />Descontar festivos nacionales</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={sabados} onChange={(e) => setSabados(e.target.checked)} className="h-4 w-4 accent-brand" />Los sábados son laborables</label>
      </div>
      {r && (
        <>
          <Big label="Días laborables">{r.laborables} días</Big>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Días naturales" value={r.naturales} />
            <Stat label={sabados ? "Domingos" : "Fines de semana"} value={r.finde} />
            <Stat label="Festivos" value={r.festivos.length} />
          </div>
          {r.festivos.length > 0 && (
            <ul className="text-sm text-stone-600">
              {r.festivos.map(([f, n]) => <li key={f}>• {weekday(f)}: {n}</li>)}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

function NotaSelectividad() {
  const [bach, setBach] = useState("8");
  const [general, setGeneral] = useState("7");
  const [esp, setEsp] = useState<[string, string][]>([["8", "0.2"], ["", "0.2"]]);
  const r = L.notaPAU(parse(bach), parse(general), esp.map(([n, p]) => [parse(n), Number(p)] as [number, number]).filter(([n]) => Number.isFinite(n)));
  const setE = (i: number, j: 0 | 1, v: string) => setEsp(esp.map((x, k) => (k === i ? (j === 0 ? [v, x[1]] : [x[0], v]) : x)));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nota media de Bachillerato" value={bach} onChange={(e) => setBach(e.target.value)} inputMode="decimal" />
        <Field label="Nota de la fase general (obligatoria)" value={general} onChange={(e) => setGeneral(e.target.value)} inputMode="decimal" />
      </div>
      <div className="space-y-2">
        <span className="label">Materias que ponderan (opcional)</span>
        {esp.map(([n, p], i) => (
          <div key={i} className="grid grid-cols-2 gap-3">
            <input className="input" value={n} onChange={(e) => setE(i, 0, e.target.value)} inputMode="decimal" placeholder={`Nota materia ${i + 1}`} aria-label={`Nota materia ${i + 1}`} />
            <select className="input" value={p} onChange={(e) => setE(i, 1, e.target.value)} aria-label={`Ponderación materia ${i + 1}`}>
              <option value="0.2">Pondera 0,2</option><option value="0.1">Pondera 0,1</option><option value="0">No pondera</option>
            </select>
          </div>
        ))}
        {esp.length < 4 && <button type="button" className="btn-ghost py-1.5" onClick={() => setEsp([...esp, ["", "0.2"]])}>+ Añadir materia</button>}
      </div>
      {Number.isFinite(r.acceso) && (
        r.aprobado ? (
          <>
            <Big label="Nota de admisión (sobre 14)">{num(r.admision, 3)}</Big>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Nota de acceso (sobre 10)" value={num(r.acceso, 3)} />
              <Stat label="Suma por ponderaciones" value={`+${num(r.admision - r.acceso, 3)}`} />
            </div>
          </>
        ) : <Big label="Nota de acceso">{num(r.acceso, 3)} <span className="text-base text-stone-500">· necesitas un 4 en la fase general y un 5 de nota de acceso</span></Big>
      )}
    </div>
  );
}

const fechaCorta = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("es-ES", { day: "numeric", month: "long", timeZone: "UTC" });

function Ovulacion() {
  const [fur, setFur] = useState(today());
  const [ciclo, setCiclo] = useState("28");
  const c = Math.round(parse(ciclo));
  const r = fur && c >= 20 && c <= 45 ? L.ovulacion(fur, c) : null;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Primer día de tu última regla" type="date" value={fur} onChange={(e) => setFur(e.target.value)} />
        <Field label="Duración del ciclo (días)" value={ciclo} onChange={(e) => setCiclo(e.target.value)} inputMode="numeric" />
      </div>
      {r ? (
        <>
          <Big label="Días más fértiles">{fechaCorta(r[0].fertilDesde)} – {fechaCorta(r[0].fertilHasta)}</Big>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Ovulación estimada" value={weekday(r[0].ovulacion)} />
            <Stat label="Próxima regla" value={weekday(r[0].siguiente)} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-stone-500"><th className="py-1">Ciclo</th><th>Días fértiles</th><th>Ovulación</th></tr></thead>
              <tbody>
                {r.slice(1).map((x) => <tr key={x.regla} className="border-t border-stone-200"><td className="py-1.5">{fechaCorta(x.regla)}</td><td>{fechaCorta(x.fertilDesde)} – {fechaCorta(x.fertilHasta)}</td><td>{fechaCorta(x.ovulacion)}</td></tr>)}
              </tbody>
            </table>
          </div>
        </>
      ) : <Big>Introduce un ciclo de entre 20 y 45 días</Big>}
    </div>
  );
}

function FrecuenciaCardiaca() {
  const [edad, setEdad] = useState("35");
  const [reposo, setReposo] = useState("");
  const e = parse(edad), rp = parse(reposo);
  const r = e > 0 && e < 120 ? L.frecuenciaCardiaca(e, rp > 30 && rp < 120 ? rp : undefined) : null;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Edad" value={edad} onChange={(ev) => setEdad(ev.target.value)} inputMode="numeric" />
        <Field label="Pulso en reposo (opcional)" value={reposo} onChange={(ev) => setReposo(ev.target.value)} inputMode="numeric" placeholder="Ej.: 60" />
      </div>
      {r && (
        <>
          <Big label="Frecuencia cardiaca máxima">{r.max} ppm <span className="text-base text-stone-500">(fórmula clásica 220 − edad: {r.clasica})</span></Big>
          <div className="space-y-2">
            {r.zonas.map((z, i) => (
              <div key={z.nombre} className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-3" style={{ borderLeft: `6px solid hsl(${140 - i * 32} 70% 45%)` }}>
                <div><div className="font-semibold">{z.nombre}</div><div className="text-xs text-stone-500">{z.desc}</div></div>
                <div className="font-bold tabular-nums">{z.desde}–{z.hasta} ppm</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AguaDiaria() {
  const [peso, setPeso] = useState("70");
  const [ejercicio, setEjercicio] = useState("0");
  const l = L.aguaDiaria(parse(peso), parse(ejercicio) || 0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Peso (kg)" value={peso} onChange={(e) => setPeso(e.target.value)} inputMode="decimal" />
        <Field label="Horas de ejercicio al día" value={ejercicio} onChange={(e) => setEjercicio(e.target.value)} inputMode="decimal" />
      </div>
      {l > 0 ? (
        <>
          <Big label="Agua al día (aproximado)">{num(l, 1)} litros</Big>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Vasos de 250 ml" value={Math.ceil((l * 1000) / 250)} />
            <Stat label="Botellas de 500 ml" value={Math.ceil((l * 1000) / 500)} />
          </div>
        </>
      ) : <Big>Introduce tu peso</Big>}
    </div>
  );
}

function Ecuacion2() {
  const [a, setA] = useState("1");
  const [b, setB] = useState("-5");
  const [c, setC] = useState("6");
  const r = L.ecuacion2(parse(a), parse(b), parse(c));
  const n = (x: number) => num(x, 6);
  return (
    <div className="space-y-4">
      <p className="text-center text-lg font-semibold">{a || "a"}x² {parse(b) < 0 ? "−" : "+"} {b.replace("-", "") || "b"}x {parse(c) < 0 ? "−" : "+"} {c.replace("-", "") || "c"} = 0</p>
      <div className="grid grid-cols-3 gap-3">
        <Field label="a" value={a} onChange={(e) => setA(e.target.value)} inputMode="decimal" />
        <Field label="b" value={b} onChange={(e) => setB(e.target.value)} inputMode="decimal" />
        <Field label="c" value={c} onChange={(e) => setC(e.target.value)} inputMode="decimal" />
      </div>
      {[a, b, c].some((v) => !Number.isFinite(parse(v))) ? <Big>Escribe los tres coeficientes</Big>
        : r.tipo === "invalida" ? <Big>a y b no pueden ser 0 a la vez</Big>
        : r.tipo === "lineal" ? <Big label="Es una ecuación de primer grado">x = {n(r.x)}</Big>
        : (
          <>
            <Big label="Soluciones">
              {r.tipo === "dos" ? <>x₁ = {n(r.x1)} · x₂ = {n(r.x2)}</> : r.tipo === "doble" ? <>x = {n(r.x)} (doble)</> : <>x = {n(r.re)} ± {n(r.im)}i</>}
            </Big>
            <Stat label="Discriminante (b² − 4ac)" value={`${n(r.disc)} → ${r.disc > 0 ? "dos soluciones reales" : r.disc === 0 ? "una solución doble" : "sin solución real (complejas)"}`} />
          </>
        )}
    </div>
  );
}

const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

function CiclosSueno() {
  const [modo, setModo] = useState<"despertar" | "acostarse">("despertar");
  const [hora, setHora] = useState("07:00");
  const [h, m] = hora.split(":").map(Number);
  const r = Number.isFinite(h) && Number.isFinite(m) ? L.ciclosSueno(h * 60 + m, modo) : null;
  return (
    <div className="space-y-4">
      <Tabs value={modo} onChange={(v) => { setModo(v); if (v === "acostarse") { const d = new Date(); setHora(hhmm(d.getHours() * 60 + d.getMinutes())); } else setHora("07:00"); }} options={[["despertar", "Quiero despertarme a…"], ["acostarse", "Me acuesto a…"]]} />
      <Field label={modo === "despertar" ? "Hora de despertarte" : "Hora de acostarte"} type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
      {r && (
        <>
          <Big label={modo === "despertar" ? "Lo ideal es acostarte a las" : "Lo ideal es despertarte a las"}>{hhmm(r[0].hora)} <span className="text-base text-stone-500">o {hhmm(r[1].hora)}</span></Big>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {r.map((x) => <Stat key={x.ciclos} label={`${x.ciclos} ciclos · ${num(x.horas, 1)} h`} value={hhmm(x.hora)} />)}
          </div>
        </>
      )}
    </div>
  );
}

const reloj = (ms: number, cent = true) => {
  const t = Math.max(0, ms), h = Math.floor(t / 3_600_000), mi = Math.floor(t / 60_000) % 60, s = Math.floor(t / 1000) % 60, c = Math.floor(t / 10) % 100;
  return `${h ? `${h}:` : ""}${String(mi).padStart(2, "0")}:${String(s).padStart(2, "0")}${cent ? `,${String(c).padStart(2, "0")}` : ""}`;
};

function Cronometro() {
  const [inicio, setInicio] = useState<number | null>(null);
  const [acumulado, setAcumulado] = useState(0);
  const [vueltas, setVueltas] = useState<number[]>([]);
  const [ahora, setAhora] = useState(0);
  useEffect(() => {
    if (inicio === null) return;
    const id = setInterval(() => setAhora(Date.now()), 31);
    return () => clearInterval(id);
  }, [inicio]);
  const total = acumulado + (inicio !== null ? Math.max(0, ahora - inicio) : 0);
  const start = () => { const n = Date.now(); setAhora(n); setInicio(n); };
  const stop = () => { setAcumulado(acumulado + Date.now() - (inicio ?? Date.now())); setInicio(null); };
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-brand-soft p-6 text-center font-mono text-5xl font-extrabold tabular-nums sm:text-6xl">{reloj(total)}</div>
      <div className="flex justify-center gap-2">
        {inicio === null ? <button type="button" className="btn-primary" onClick={start}>{total ? "Continuar" : "Iniciar"}</button> : <button type="button" className="btn-dark" onClick={stop}>Parar</button>}
        <button type="button" className="btn-ghost" disabled={inicio === null} onClick={() => setVueltas([total, ...vueltas])}>Vuelta</button>
        <button type="button" className="btn-ghost" disabled={inicio !== null || !total} onClick={() => { setAcumulado(0); setVueltas([]); }}>Reiniciar</button>
      </div>
      {vueltas.length > 0 && (
        <ol className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white text-sm">
          {vueltas.map((v, i) => <li key={vueltas.length - i} className="flex justify-between px-3 py-2 tabular-nums"><span>Vuelta {vueltas.length - i}</span><span className="text-stone-500">+{reloj(v - (vueltas[i + 1] ?? 0))}</span><span className="font-semibold">{reloj(v)}</span></li>)}
        </ol>
      )}
    </div>
  );
}

function pitido() {
  try {
    const ctx = new AudioContext();
    [0, 0.4, 0.8].forEach((t) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.3, ctx.currentTime + t); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.3);
      o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.3);
    });
  } catch {}
}

function Temporizador() {
  const [min, setMin] = useState("5");
  const [seg, setSeg] = useState("0");
  const [fin, setFin] = useState<number | null>(null);
  const [pausa, setPausa] = useState<number | null>(null);
  const [ahora, setAhora] = useState(0);
  const [sonado, setSonado] = useState(false);
  useEffect(() => {
    if (fin === null) return;
    const id = setInterval(() => {
      const n = Date.now();
      setAhora(n);
      if (n >= fin) { clearInterval(id); setFin(null); setSonado(true); pitido(); }
    }, 100);
    return () => clearInterval(id);
  }, [fin]);
  const duracion = ((parse(min) || 0) * 60 + (parse(seg) || 0)) * 1000;
  const queda = fin !== null ? fin - ahora : pausa ?? duracion;
  const start = () => { const n = Date.now(); setAhora(n); setSonado(false); setFin(n + (pausa ?? duracion)); setPausa(null); };
  return (
    <div className="space-y-4">
      {fin === null && pausa === null && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Minutos" value={min} onChange={(e) => setMin(e.target.value)} inputMode="numeric" />
            <Field label="Segundos" value={seg} onChange={(e) => setSeg(e.target.value)} inputMode="numeric" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[1, 3, 5, 10, 15, 25, 30, 60].map((m) => <button key={m} type="button" className="btn-ghost py-1.5" onClick={() => { setMin(String(m)); setSeg("0"); }}>{m} min</button>)}
          </div>
        </>
      )}
      <div className={`rounded-2xl p-6 text-center font-mono text-5xl font-extrabold tabular-nums sm:text-6xl ${sonado ? "animate-pulse bg-red-100 text-red-700" : "bg-brand-soft"}`}>{sonado ? "¡Tiempo!" : reloj(Math.ceil(queda / 1000) * 1000, false)}</div>
      <div className="flex justify-center gap-2">
        {fin === null ? <button type="button" className="btn-primary" disabled={duracion <= 0 && pausa === null} onClick={start}>{pausa !== null ? "Continuar" : "Iniciar"}</button>
          : <button type="button" className="btn-dark" onClick={() => { setPausa(fin - Date.now()); setFin(null); }}>Pausa</button>}
        <button type="button" className="btn-ghost" onClick={() => { setFin(null); setPausa(null); setSonado(false); }}>Reiniciar</button>
      </div>
      <p className="text-center text-xs text-stone-500">Sonará un aviso al terminar: deja el volumen activado y esta pestaña abierta.</p>
    </div>
  );
}

export const TOOL_COMPONENTS: Record<string, () => React.ReactNode> = {
  "numeros-a-letras": NumerosALetras,
  "letra-dni": LetraDni,
  "validar-iban": ValidarIban,
  "dias-entre-fechas": DiasEntreFechas,
  "calculadora-edad": CalculadoraEdad,
  "sumar-dias-fecha": SumarDiasFecha,
  "sumar-horas": SumarHoras,
  "calculadora-porcentajes": Porcentajes,
  "calculadora-iva": CalculadoraIva,
  "regla-de-tres": ReglaDeTres,
  "calculadora-nota-media": NotaMedia,
  "calculadora-hipoteca": Hipoteca,
  "interes-compuesto": InteresCompuesto,
  "contador-palabras": ContadorPalabras,
  "convertir-mayusculas-minusculas": Mayusculas,
  "numeros-romanos": Romanos,
  "generador-contrasenas": Contrasenas,
  "calculadora-imc": Imc,
  "fecha-probable-de-parto": Embarazo,
  "mcd-mcm": McdMcm,
  "calculadora-descuentos": Descuentos,
  "coste-viaje-gasolina": Viaje,
  "conversor-unidades": Conversor,
  "semana-del-ano": SemanaAno,
  "numero-aleatorio": Aleatorio,
  "cuenta-atras": CuentaAtras,
  "calculadora-fracciones": Fracciones,
  "media-mediana-moda": Estadistica,
  "area-perimetro": AreaPerimetro,
  "conversor-binario-decimal": BasesNumericas,
  "calculadora-prestamo": Prestamo,
  "tin-tae": TinTae,
  "vacaciones-proporcionales": Vacaciones,
  "horas-entre-dos-horas": HorasEntre,
  "calculadora-ritmo-running": RitmoRunning,
  "edad-perro-gato-anos-humanos": EdadMascota,
  "calculadora-sueldo-neto": () => <SueldoNeto />,
  "calculadora-finiquito": Finiquito,
  "detector-texto-ia": DetectorIA,
  "calculadora-factura-autonomo": FacturaAutonomo,
  "calculadora-margen-beneficio": MargenBeneficio,
  "calculadora-consumo-electrico": ConsumoElectrico,
  "calculadora-ahorro": Ahorro,
  "dividir-cuenta": DividirCuenta,
  "conversor-horas-minutos": HorasMinutos,
  "calculadora-calorias": Calorias,
  "calculadora-raiz-cuadrada": RaizPotencia,
  "velocidad-distancia-tiempo": VelocidadDistanciaTiempo,
  "generador-codigo-qr": GeneradorQR,
  "calculadora-paro": Paro,
  "calculadora-horas-extra": HorasExtra,
  "dias-laborables": DiasLaborables,
  "calculadora-nota-selectividad": NotaSelectividad,
  "calculadora-ovulacion": Ovulacion,
  "frecuencia-cardiaca-maxima": FrecuenciaCardiaca,
  "cuanta-agua-beber": AguaDiaria,
  "ecuacion-segundo-grado": Ecuacion2,
  "calculadora-ciclos-sueno": CiclosSueno,
  "cronometro-online": Cronometro,
  "temporizador-online": Temporizador,
};

/** Calculadora de sou net per incrustar a les pàgines de sous concrets. */
export function SueldoNetoWidget({ inicial }: { inicial: number }) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  if (!mounted) return <div className="min-h-64 animate-pulse rounded-2xl bg-stone-100" />;
  return <SueldoNeto inicial={inicial} />;
}

/** Botons per compartir l'eina: el trànsit que porten els usuaris és gratis. */
export function ShareBar({ title, url }: { title: string; url: string }) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const [ok, setOk] = useState(false);
  const canShare = mounted && typeof navigator.share === "function";
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-stone-500">Compartir:</span>
      <a className="btn-ghost py-1.5" href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
      <button type="button" className="btn-ghost py-1.5" onClick={async () => { await navigator.clipboard.writeText(url); setOk(true); setTimeout(() => setOk(false), 1200); }}>
        {ok ? "¡Enlace copiado!" : "Copiar enlace"}
      </button>
      {canShare && <button type="button" className="btn-ghost py-1.5" onClick={() => navigator.share({ title, url }).catch(() => {})}>Más…</button>}
    </div>
  );
}

/** Les eines es pinten només al navegador: així «avui» és la data real del visitant, no la del dia de compilació. */
export function ToolWidget({ slug }: { slug: string }) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const C = TOOL_COMPONENTS[slug];
  if (!mounted) return <div className="min-h-64 animate-pulse rounded-2xl bg-stone-100" />;
  return C ? <C /> : null;
}
