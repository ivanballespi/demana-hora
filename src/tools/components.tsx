"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import * as L from "@/tools/logic";

/* ---------- Peces comunes ---------- */

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
};

const noop = () => () => {};

/** Les eines es pinten només al navegador: així «avui» és la data real del visitant, no la del dia de compilació. */
export function ToolWidget({ slug }: { slug: string }) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const C = TOOL_COMPONENTS[slug];
  if (!mounted) return <div className="min-h-64 animate-pulse rounded-2xl bg-stone-100" />;
  return C ? <C /> : null;
}
