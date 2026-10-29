// Castellanismes i calcs frequents a les redaccions d'examen.
// `match`: formes incorrectes (sense distingir majúscules); `ok`: forma recomanada.

export type Castellanisme = { match: string[]; ok: string; note?: string };

export const CASTELLANISMES: Castellanisme[] = [
  { match: ["en quant a"], ok: "pel que fa a, quant a", note: "«Quant a» és correcte; el que sobra és la «en»." },
  { match: ["hi han", "hi havien", "hi hauran", "hi hagueren", "hi haurien"], ok: "hi ha, hi havia, hi haurà...", note: "Haver-hi és impersonal: sempre en singular." },
  { match: ["donar-se compte", "es dona compte", "es donen compte", "em dono compte", "ens donem compte", "us doneu compte", "et dones compte"], ok: "adonar-se", note: "Calc de «darse cuenta»." },
  { match: ["tenir que", "tinc que", "tens que", "té que", "tenim que", "teniu que", "tenen que", "tenia que", "tindria que"], ok: "haver de (he de, has de...), caldre", note: "Per expressar obligació: «Hem de reduir...», «Cal reduir...»." },
  { match: ["per lo tant"], ok: "per tant" },
  { match: ["a lo millor"], ok: "potser, tal vegada" },
  { match: ["per lo general"], ok: "en general, generalment" },
  { match: ["per lo menys"], ok: "almenys, si més no" },
  { match: ["lo"], ok: "el, allò, el que", note: "L'article neutre «lo» no existeix: «el més important», «allò que diu»." },
  { match: ["en base a"], ok: "a partir de, segons, sobre la base de" },
  { match: ["a nivell de"], ok: "pel que fa a, en l'àmbit de", note: "Només és correcte quan parles d'un nivell real («a nivell del mar»)." },
  { match: ["donat que"], ok: "atès que, com que, ja que", note: "En registre formal, millor «atès que»." },
  { match: ["degut a"], ok: "a causa de, per culpa de", note: "En una redacció formal, «a causa de» és més segur." },
  { match: ["en vistes a"], ok: "amb vista a, de cara a" },
  { match: ["per suposat"], ok: "per descomptat, és clar" },
  { match: ["de totes formes"], ok: "de tota manera, de totes maneres" },
  { match: ["a medida que"], ok: "a mesura que" },
  { match: ["desde"], ok: "des de" },
  { match: ["hasta"], ok: "fins, fins a" },
  { match: ["luego"], ok: "després, més tard" },
  { match: ["entonces"], ok: "llavors, aleshores" },
  { match: ["pues"], ok: "doncs" },
  { match: ["bueno"], ok: "bé, doncs, bo" },
  { match: ["vale"], ok: "d'acord" },
  { match: ["algo"], ok: "alguna cosa, quelcom" },
  { match: ["ademés"], ok: "a més, a més a més" },
  { match: ["aconteixement", "aconteixements"], ok: "esdeveniment" },
  { match: ["disfrutar", "disfruten", "disfruta"], ok: "gaudir, fruir" },
  { match: ["apretar"], ok: "prémer, estrènyer" },
  { match: ["sitio"], ok: "lloc" },
  { match: ["rato"], ok: "estona" },
  { match: ["basura"], ok: "escombraries, deixalles" },
  { match: ["cumplir"], ok: "complir" },
];

/** Regex per a una forma: respecta lletres accentuades als límits de paraula. */
export function patternFor(form: string) {
  const escaped = form.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return `(?<![\\p{L}'’·-])${escaped}(?![\\p{L}'’·-])`;
}
