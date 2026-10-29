// Enunciats de pràctica originals, amb l'estructura de les tasques d'expressió
// escrita dels certificats (text argumentatiu a partir de fonts).

export type Task = { id: string; level: "C1" | "C2"; title: string; text: string };

export const TASKS: Task[] = [
  {
    id: "c1-mobils",
    level: "C1",
    title: "Mòbils a les escoles",
    text: `L'ajuntament del teu municipi obre un procés participatiu sobre la prohibició dels telèfons mòbils als centres educatius, també a l'hora del pati. Escriu un article d'opinió per a la revista municipal (unes 400 paraules) en què defensis la teva postura. Aprofita les idees de les fonts sense copiar-les literalment.

Font 1 (notícia): Diversos centres que han prohibit el mòbil diuen que al pati hi ha més joc i menys conflictes, tot i que alguns pares es queixen que no poden localitzar els fills.
Font 2 (opinió d'un pedagog): «Prohibir no és educar. Els joves han d'aprendre a fer un ús responsable de la tecnologia, i l'escola és el lloc on ho han d'aprendre.»
Font 3 (dada): Segons una enquesta, el 70 % dels adolescents admet que consulta el mòbil durant les classes.`,
  },
  {
    id: "c1-turisme",
    level: "C1",
    title: "Taxa turística",
    text: `El diari de la teva comarca demana als lectors la seva opinió sobre si cal apujar la taxa turística per finançar habitatge per als veïns. Escriu una carta al director (unes 400 paraules) en què argumentis la teva posició. Fes servir la informació de les fonts sense copiar-la.

Font 1 (dada): Els pisos turístics representen el 15 % dels habitatges en alguns barris del centre.
Font 2 (opinió d'un hoteler): «Si encarim l'estada, els turistes aniran a altres destinacions i perdrem llocs de treball.»
Font 3 (notícia): Una ciutat europea va doblar la taxa i va destinar-ne els ingressos a comprar pisos per al lloguer social.`,
  },
  {
    id: "c1-teletreball",
    level: "C1",
    title: "Teletreball",
    text: `L'empresa on treballes vol eliminar el teletreball i obligar tota la plantilla a tornar a l'oficina cinc dies a la setmana. Escriu un correu formal a la direcció (unes 400 paraules) en què exposis arguments a favor o en contra de la decisió i proposis una alternativa. Basa't en les fonts sense copiar-les.

Font 1 (estudi): Els treballadors que teletreballen dos o tres dies a la setmana declaren més satisfacció i menys baixes.
Font 2 (opinió d'una directiva): «La creativitat i la cultura d'empresa neixen al passadís, no a les videotrucades.»
Font 3 (dada): Cada treballador que deixa de desplaçar-se estalvia una mitjana de 50 minuts al dia.`,
  },
  {
    id: "c1-llengua",
    level: "C1",
    title: "Català a les xarxes",
    text: `Un mitjà digital juvenil publica un debat sobre l'ús del català a les xarxes socials. Escriu un article d'opinió (unes 400 paraules) sobre què caldria fer perquè els joves facin servir més el català a internet. Aprofita les fonts sense copiar-les.

Font 1 (dada): Només un de cada quatre vídeos que consumeixen els adolescents a les plataformes és en català.
Font 2 (opinió d'una creadora de contingut): «Si fas contingut en català pots créixer igual, però al principi costa més trobar audiència.»
Font 3 (notícia): Una campanya institucional ofereix ajuts als creadors que publiquin en català.`,
  },
  {
    id: "c2-ia",
    level: "C2",
    title: "Intel·ligència artificial i treball",
    text: `Una revista de divulgació prepara un monogràfic sobre la intel·ligència artificial. Escriu un assaig breu (unes 500 paraules) sobre si la intel·ligència artificial amenaça la feina qualificada o, al contrari, n'és una oportunitat. Has de contrastar arguments, matisar-los i arribar a una conclusió pròpia, amb un registre formal i acurat.`,
  },
  {
    id: "c2-ciutat",
    level: "C2",
    title: "El model de ciutat",
    text: `Amb motiu d'unes eleccions municipals, un diari convida experts i ciutadans a reflexionar sobre el model de ciutat. Escriu un article d'opinió (unes 500 paraules) sobre la pacificació dels carrers i la reducció del trànsit privat, i valora'n els beneficis i els costos socials. Cal un text ben argumentat i amb un lèxic precís.`,
  },
];
