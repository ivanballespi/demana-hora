import Link from "next/link";
import { CASTELLANISMES } from "@/content/castellanismes";

export type Guide = {
  slug: string;
  title: string;
  description: string;
  updated: string;
  body: () => React.ReactNode;
};

const DIACRITICS: [string, string, string][] = [
  ["bé", "be", "Està bé / un be (xai)"],
  ["déu", "deu", "Déu meu / en deu minuts"],
  ["és", "es", "És important / es diu"],
  ["mà", "ma", "Dona'm la mà / ma casa"],
  ["més", "mes", "Molt més / el mes de maig"],
  ["món", "mon", "Tot el món / mon pare"],
  ["pèl", "pel", "Un pèl / pel carrer"],
  ["què", "que", "Què vols? / que vinguis"],
  ["sé", "se", "No ho sé / se'n va"],
  ["sí", "si", "Sí, vull / si vols"],
  ["sòl", "sol", "El sòl urbà / fa sol"],
  ["són", "son", "Són aquí / tinc son"],
  ["té", "te", "Té raó / te'l dono"],
  ["ús", "us", "L'ús del mòbil / us ho dic"],
  ["vós", "vos", "Vós sou / vos estimo"],
];

const CONNECTORS: [string, string[]][] = [
  ["Per començar o introduir el tema", ["En primer lloc", "Per començar", "D'entrada", "Avui dia", "En els darrers anys"]],
  ["Per afegir idees", ["A més (a més)", "Així mateix", "També cal tenir en compte que", "D'altra banda", "Endemés"]],
  ["Per contraposar", ["Ara bé", "Tanmateix", "No obstant això", "En canvi", "Malgrat això", "Amb tot"]],
  ["Per expressar causa", ["Atès que", "Ja que", "Com que (a l'inici de la frase)", "Perquè", "A causa de"]],
  ["Per expressar conseqüència", ["Per tant", "Així doncs", "En conseqüència", "Per això", "De manera que"]],
  ["Per posar exemples", ["Per exemple", "Així", "És el cas de", "Com ara", "Pensem, per exemple, en"]],
  ["Per aclarir o reformular", ["És a dir", "O sigui", "En altres paraules", "Dit d'una altra manera"]],
  ["Per expressar opinió", ["Al meu parer", "Des del meu punt de vista", "Considero que", "Estic convençut/da que", "Em sembla que"]],
  ["Per concedir (reconèixer l'altra postura)", ["Si bé és cert que", "És veritat que..., però", "Encara que", "Tot i que"]],
  ["Per concloure", ["En conclusió", "En definitiva", "Per acabar", "En resum", "Tot plegat"]],
];

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-stone-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-stone-100"><tr>{head.map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i} className="border-t border-stone-200">{r.map((c, j) => <td key={j} className="px-3 py-2 align-top">{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export const GUIDES: Guide[] = [
  {
    slug: "castellanismes-mes-frequents",
    title: "Els castellanismes més freqüents a l'examen de C1 de català (i com evitar-los)",
    description:
      "Llista dels castellanismes i calcs que més resten a la redacció del C1 i el C2: «en quant a», «hi han», «donar-se compte», «tenir que»... amb la forma correcta de cadascun.",
    updated: "2026-10-29",
    body: () => (
      <>
        <p>
          A la redacció dels exàmens de català, els castellanismes són un dels errors que més puntuació fan perdre al criteri de
          correcció lingüística. El problema és que molts no els veus, perquè els sents cada dia. Aquí tens els que apareixen més
          sovint a les redaccions, amb l&apos;alternativa correcta.
        </p>
        <p>
          Truc ràpid: enganxa la teva redacció al <Link href="/detector-castellanismes">detector de castellanismes gratuït</Link> i
          te&apos;ls marcarà tots.
        </p>
        <h2>Llista de castellanismes i formes correctes</h2>
        <Table
          head={["❌ Evita", "✅ Escriu", "Nota"]}
          rows={CASTELLANISMES.map((c) => [
            <span key="a" className="text-red-700">{c.match.slice(0, 3).join(", ")}</span>,
            <b key="b" className="text-emerald-700">{c.ok}</b>,
            c.note ?? "",
          ])}
        />
        <h2>Els tres que més suspenen</h2>
        <h3>1. «Hi han»</h3>
        <p>
          El verb <i>haver-hi</i> és impersonal i no concorda amb el que ve darrere: <b>hi ha</b> molts problemes, <b>hi havia</b> tres
          opcions, <b>hi haurà</b> canvis. Als registres col·loquials se sent «hi han», però en una redacció d&apos;examen és un error
          clar.
        </p>
        <h3>2. «Tenir que» per expressar obligació</h3>
        <p>
          En català l&apos;obligació s&apos;expressa amb <b>haver de</b> o <b>caldre</b>: «<b>Hem de</b> reduir l&apos;ús del cotxe» o «<b>Cal</b>
          reduir l&apos;ús del cotxe». A més, «cal» et dona un to impersonal molt adequat per a un text argumentatiu.
        </p>
        <h3>3. L&apos;article neutre «lo»</h3>
        <p>
          «Lo més important», «lo que diu l&apos;autor»... En català estàndard no hi ha article neutre. Tens moltes alternatives: <b>el
          més important</b>, <b>allò que</b> diu l&apos;autor, <b>el que</b> diu l&apos;autor.
        </p>
        <h2>Com practicar-ho</h2>
        <p>
          Llegir una llista ajuda, però el que funciona de debò és escriure i que algú et marqui els errors que fas tu. Per això
          hem creat <Link href="/registre">Apte</Link>: corregeix la teva redacció amb els criteris oficials, et dona una nota
          estimada sobre 40 i t&apos;explica cada error. La primera correcció és gratis.
        </p>
      </>
    ),
  },
  {
    slug: "connectors-c1-catala",
    title: "Connectors per a la redacció del C1 de català: llista per funcions",
    description:
      "Els millors connectors per a un text argumentatiu de nivell C1 i C2, organitzats per funció: afegir, contraposar, causa, conseqüència, opinió i conclusió.",
    updated: "2026-10-29",
    body: () => (
      <>
        <p>
          Al criteri de <b>cohesió</b>, els correctors miren si fas servir connectors variats i ben triats. Repetir «a més» i
          «però» a cada paràgraf et pot fer baixar de banda. Aquesta és la llista que hauries de tenir al cap el dia de
          l&apos;examen.
        </p>
        {CONNECTORS.map(([group, items]) => (
          <section key={group}>
            <h2>{group}</h2>
            <p>{items.map((c, i) => <span key={c}>{i > 0 && " · "}<b>{c}</b></span>)}</p>
          </section>
        ))}
        <h2>Tres errors típics amb els connectors</h2>
        <ul>
          <li><b>«Com que» va a l&apos;inici</b>: «Com que plou, no sortim», no «No sortim com que plou».</li>
          <li><b>«Sinó» i «si no» no són el mateix</b>: «No és car, <b>sinó</b> barat» (contraposició) / «<b>Si no</b> estudies, suspendràs» (condició).</li>
          <li><b>No abusis de «doncs» com a causa</b>: en registre formal, per expressar causa és més segur «ja que» o «atès que». «Doncs» funciona millor com a conseqüència o continuació («Així doncs...»).</li>
        </ul>
        <h2>Com saber si els uses bé</h2>
        <p>
          Escriu una redacció i fes-la corregir: <Link href="/registre">Apte</Link> valora la cohesió del teu text de l&apos;A a l&apos;E
          i et diu exactament on falten connectors o on n&apos;has fet servir un de malament. La primera correcció és gratis.
        </p>
      </>
    ),
  },
  {
    slug: "estructura-redaccio-argumentativa-c1",
    title: "Com estructurar una redacció argumentativa per al C1 de català (amb plantilla)",
    description:
      "Plantilla pas a pas per escriure el text argumentatiu de l'examen de C1: introducció amb tesi, arguments, contraargument i conclusió, amb frases fetes per a cada part.",
    updated: "2026-10-29",
    body: () => (
      <>
        <p>
          La tasca d&apos;expressió escrita del C1 sol demanar un text argumentatiu (article d&apos;opinió, carta, correu formal...)
          sovint a partir d&apos;unes fonts. Comprova sempre el format exacte i l&apos;extensió a la teva convocatòria oficial. Sigui
          com sigui, l&apos;estructura que funciona és sempre la mateixa.
        </p>
        <h2>1. Introducció (2-4 frases)</h2>
        <p>Presenta el tema i deixa clara la teva <b>tesi</b> des del primer paràgraf. El corrector ha de saber de seguida què defenses.</p>
        <blockquote>«En els darrers anys, el debat sobre [tema] ha guanyat pes a la nostra societat. Al meu parer, [tesi], i a continuació n&apos;exposaré els motius.»</blockquote>
        <h2>2. Arguments (2 o 3 paràgrafs)</h2>
        <p>Un argument per paràgraf. Obre&apos;l amb un connector, explica la idea i aporta-hi un exemple o una dada de les fonts, <b>amb les teves paraules</b>.</p>
        <blockquote>«En primer lloc, cal tenir en compte que... Així, segons les dades disponibles, ... D&apos;altra banda, ...»</blockquote>
        <h2>3. Contraargument (1 paràgraf)</h2>
        <p>Reconèixer l&apos;altra postura i rebatre-la demostra maduresa argumentativa i et fa pujar a coherència.</p>
        <blockquote>«Si bé és cert que [argument contrari], no és menys cert que... Per tant, ...»</blockquote>
        <h2>4. Conclusió (2-3 frases)</h2>
        <p>Reprèn la tesi amb altres paraules i tanca amb una proposta o una reflexió. No hi afegeixis arguments nous.</p>
        <blockquote>«En definitiva, considero que... Caldria, doncs, que...»</blockquote>
        <h2>Errors que et fan perdre punts encara que l&apos;estructura sigui bona</h2>
        <ul>
          <li><b>Copiar frases de les fonts</b>: penalitza a adequació. Reformula-les sempre.</li>
          <li><b>No respectar l&apos;extensió</b>: queda&apos;t a prop del nombre de paraules que demanen.</li>
          <li><b>Registre inadequat</b>: si és una carta formal, res de col·loquialismes.</li>
          <li><b>Paràgrafs d&apos;una sola frase</b> o un sol bloc de text sense paràgrafs.</li>
          <li><b>Castellanismes</b>: mira la <Link href="/guia/castellanismes-mes-frequents">llista dels més freqüents</Link>.</li>
        </ul>
        <h2>Posa-ho a prova</h2>
        <p>
          Escriu una redacció amb aquesta estructura i <Link href="/registre">fes-la corregir amb Apte</Link>: et diem la nota
          estimada sobre 40, què et falla a cada criteri i com quedaria el teu text a nivell d&apos;examen. La primera és gratis.
        </p>
      </>
    ),
  },
  {
    slug: "accents-diacritics",
    title: "Accents diacrítics en català: la llista que has de saber per al C1",
    description:
      "Els 15 accents diacrítics de la normativa actual de l'IEC (bé, és, més, món, què, sé, sí, són, té...) amb exemples, per no perdre punts a l'examen.",
    updated: "2026-10-29",
    body: () => (
      <>
        <p>
          Des de la reforma ortogràfica de l&apos;IEC del 2016, la llista de monosíl·labs amb accent diacrític es va reduir molt.
          Moltes persones que van estudiar abans encara posen accents que ja no toquen (com a «dóna» o «sóc»), o se n&apos;obliden
          algun dels que sí que s&apos;han mantingut.
        </p>
        <h2>Els 15 diacrítics que es mantenen</h2>
        <Table head={["Amb accent", "Sense accent", "Exemple"]} rows={DIACRITICS.map(([a, b, e]) => [<b key="a">{a}</b>, b, e])} />
        <h2>Els que ja no porten accent</h2>
        <p>
          Formes com <b>dona</b> (del verb donar), <b>soc</b>, <b>os</b> o <b>net</b> ja no porten accent diacrític. Si l&apos;hi poses,
          compta com a error.
        </p>
        <p>
          <b>Atenció si t&apos;examines de valencià:</b> l&apos;AVL té la seva pròpia normativa i hi pot haver alguna diferència.
          Consulta-la abans de l&apos;examen.
        </p>
        <h2>Comprova la teva redacció</h2>
        <p>
          Els accents són un dels errors que <Link href="/registre">Apte</Link> marca automàticament a la teva redacció, juntament
          amb els castellanismes, les preposicions i els pronoms febles. La primera correcció és gratis.
        </p>
      </>
    ),
  },
  {
    slug: "model-redaccio-c1-corregida",
    title: "Model de redacció del C1 de català corregida (amb errors explicats)",
    description:
      "Exemple real d'una redacció argumentativa de nivell C1 amb els errors marcats, la correcció i una versió millorada, per veure què valoren els correctors.",
    updated: "2026-10-29",
    body: () => (
      <>
        <p>
          Aquest és un exemple de redacció d&apos;un alumne que es prepara el C1, amb els errors típics que es repeteixen a les
          proves. Tasca: <i>article d&apos;opinió sobre la prohibició dels mòbils a les escoles</i>.
        </p>
        <h2>La redacció original</h2>
        <blockquote>
          Avui en dia <mark>hi han</mark> molts alumnes que passen la major part del dia mirant el mòbil. <mark>En quant a</mark> la
          prohibició, crec que <mark>es tracta de que</mark> els joves aprenguin a desconnectar. <mark>Lo</mark> més important és que al pati
          tornin a jugar i a parlar. Els pares <mark>tenen que</mark> entendre que l&apos;escola no és un lloc per estar connectat. <mark>Per
          lo tant</mark>, estic a favor de la prohibició.
        </blockquote>
        <h2>Els errors, un per un</h2>
        <ol>
          <li><b>hi han → hi ha</b>: <i>haver-hi</i> és impersonal.</li>
          <li><b>En quant a → Pel que fa a</b>: castellanisme.</li>
          <li><b>es tracta de que → es tracta que</b>: davant de «que» la preposició «de» cau.</li>
          <li><b>Lo → El</b>: no hi ha article neutre en català.</li>
          <li><b>tenen que → han de</b>: obligació amb «haver de».</li>
          <li><b>Per lo tant → Per tant</b>.</li>
        </ol>
        <h2>Versió millorada</h2>
        <blockquote>
          Avui dia, molts alumnes passen bona part de la jornada pendents del mòbil. Pel que fa a la prohibició, considero que es
          tracta que els joves aprenguin a desconnectar. El més important és que, a l&apos;hora del pati, tornin a jugar i a
          conversar. Les famílies, per la seva banda, han d&apos;entendre que l&apos;escola no és un espai per estar connectat. Per tant,
          em mostro clarament a favor de la prohibició.
        </blockquote>
        <h2>Què canvia a la nota</h2>
        <p>
          L&apos;original tenia idees clares, però la quantitat d&apos;errors bàsics l&apos;hauria baixat de banda a correcció lingüística, i
          el lèxic pla l&apos;hauria penalitzat a riquesa. La versió millorada manté les mateixes idees amb un registre propi
          d&apos;un C1.
        </p>
        <h2>Vols aquesta correcció amb el teu text?</h2>
        <p>
          <Link href="/registre">Apte</Link> fa exactament això amb la teva redacció en un minut: et marca els errors, te&apos;ls
          explica, et dona la nota estimada sobre 40 i et proposa una versió millorada. La primera és gratis.
        </p>
      </>
    ),
  },
  {
    slug: "c1-valencia-redaccio",
    title: "Redacció del C1 de valencià: formes valencianes que pots (i hauries) de fer servir",
    description:
      "Si t'examines del C1 de valencià (JQCV), aquestes són les formes pròpies del valencià estàndard de l'AVL que són correctes i que donen naturalitat al teu text.",
    updated: "2026-10-29",
    body: () => (
      <>
        <p>
          Molts estudiants del C1 de valencià tenen por de fer servir les formes valencianes, perquè pensen que el corrector les
          comptarà com a error. És al revés: l&apos;estàndard de l&apos;Acadèmia Valenciana de la Llengua (AVL) les inclou, i usar-les amb
          coherència dona naturalitat i precisió al text.
        </p>
        <h2>Formes valencianes correctes</h2>
        <Table
          head={["Categoria", "Forma valenciana", "També correcte"]}
          rows={[
            ["Demostratius", <b key="a">este, esta, estos, estes / eixe, eixa</b>, "aquest, aquesta / aqueix"],
            ["Possessius", <b key="b">meua, teua, seua</b>, "meva, teva, seva"],
            ["Verbs incoatius", <b key="c">servix, patix, oferix</b>, "serveix, pateix, ofereix"],
            ["1a persona del present", <b key="d">cante, servisc</b>, "canto, serveixo"],
            ["Infinitius", <b key="e">tindre, vindre</b>, "tenir, venir"],
            ["Lèxic", <b key="f">hui, xiquet, eixir, espill</b>, "avui, nen, sortir, mirall"],
          ]}
        />
        <h2>La regla d&apos;or: coherència</h2>
        <p>
          El que sí que penalitza és barrejar models sense criteri: «este problema» en un paràgraf i «aquest problema» en el
          següent, o «meua» i «seva» a la mateixa frase. Tria un model i mantén-lo al llarg de tot el text.
        </p>
        <h2>Errors que també compten al valencià</h2>
        <ul>
          <li><b>Castellanismes</b> com «en quant a», «tindre que» o «lo»: mira la <Link href="/guia/castellanismes-mes-frequents">llista completa</Link>.</li>
          <li><b>Concordança de «haver-hi»</b>: «hi ha molts problemes», mai «hi han».</li>
          <li><b>Connectors pobres</b>: tens idees a la <Link href="/guia/connectors-c1-catala">llista de connectors</Link>.</li>
        </ul>
        <p>Consulta sempre la Gramàtica normativa valenciana de l&apos;AVL si tens dubtes concrets.</p>
        <h2>Corregeix la teva redacció en valencià</h2>
        <p>
          A <Link href="/registre">Apte</Link> pots triar «Valencià (AVL)»: la correcció accepta les formes valencianes i et marca
          només els errors reals. La primera correcció és gratis.
        </p>
      </>
    ),
  },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
