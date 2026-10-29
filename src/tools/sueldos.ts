// Pàgines «X € brutos, ¿cuánto es neto?»: només els sous més buscats, cadascun amb dades pròpies.
import { sueldoNeto, SS_2026 } from "@/tools/logic";

export const SUELDOS = [15000, 16000, 17000, 18000, 20000, 21000, 22000, 24000, 25000, 26000, 28000, 30000, 32000, 35000, 38000, 40000, 45000, 50000, 60000, 70000];

export const sueldoSlug = (n: number) => `${n}-euros-brutos`;
export const sueldoFromSlug = (s: string) => {
  const n = Number(s.replace(/-euros-brutos$/, ""));
  return SUELDOS.includes(n) ? n : null;
};

const base = { pagas: 14 as const, contrato: "indefinido" as const, situacion: "general" as const, hijos: 0, menores3: 0, hijosEnteros: false };

export function datosSueldo(bruto: number) {
  const principal = sueldoNeto({ ...base, bruto });
  const variantes = [
    { nombre: "Soltero/a sin hijos (indefinido)", r: principal },
    { nombre: "Con 1 hijo", r: sueldoNeto({ ...base, bruto, hijos: 1 }) },
    { nombre: "Con 2 hijos", r: sueldoNeto({ ...base, bruto, hijos: 2 }) },
    { nombre: "Con 1 hijo menor de 3 años", r: sueldoNeto({ ...base, bruto, hijos: 1, menores3: 1 }) },
    { nombre: "Contrato temporal", r: sueldoNeto({ ...base, bruto, contrato: "temporal" }) },
  ];
  const notas: string[] = [];
  if (bruto <= 15876) notas.push("Con este sueldo, si estás soltero/a, sin hijos y con un único pagador, no te deberían retener IRPF: el límite está en 15.876 € al año.");
  else if (bruto < 19747.5) notas.push("En sueldos de este tramo se aplica la reducción por rendimientos del trabajo, que rebaja mucho la retención de IRPF. Además, la ley limita la retención al 43 % de lo que ganas por encima del mínimo exento.");
  if (bruto >= 17094 && bruto <= 18000) notas.push("Es un sueldo cercano al salario mínimo interprofesional de 2026 (unos 17.094 € al año en 14 pagas).");
  if (bruto > SS_2026.baseMaximaAnual) notas.push(`Como superas la base máxima de cotización (${SS_2026.baseMaximaAnual.toLocaleString("es-ES")} € al año), la Seguridad Social deja de subir a partir de esa cifra.`);
  if (bruto >= 35200) notas.push("A partir de 35.200 € de base, cada euro adicional tributa en la retención al 37 % o más, por eso el neto crece más despacio.");
  const i = SUELDOS.indexOf(bruto);
  return { principal, variantes, notas, anterior: SUELDOS[i - 1], siguiente: SUELDOS[i + 1] };
}
