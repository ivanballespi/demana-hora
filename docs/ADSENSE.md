# Com cobrar amb anuncis (pas a pas)

## Ara: la web ja és en línia
La web és a https://calcularonline.es (allotjada a GitHub Pages, amb el domini comprat a DonDominio).

## 1. Que Google la conegui (avui, gratis)
1. A https://search.google.com/search-console, afegeix la propietat amb el prefix d'URL `https://calcularonline.es/` i verifica-la amb l'etiqueta HTML. Passa'm el codi i el poso a `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
2. Envia-hi el sitemap: `https://calcularonline.es/sitemap.xml`.

## 2. Domini
Ja el tens: `calcularonline.es` (comprat per 3 anys).

## 3. AdSense
1. A https://adsense.google.com, afegeix el lloc `calcularonline.es`.
2. Copia l'identificador `ca-pub-...` i passa-me'l: el poso a `NEXT_PUBLIC_ADSENSE_CLIENT`, que activa l'script i l'`ads.txt`.
3. A AdSense, ves a **Privacitat i missatges** i activa el missatge de consentiment del RGPD (és gratis i obligatori a la UE).
4. Activa els **anuncis automàtics**.
5. Omple `NEXT_PUBLIC_LEGAL_NAME` i `NEXT_PUBLIC_LEGAL_NIF` (a l'avís legal).

Google sol trigar entre uns dies i unes setmanes a revisar-ho.

## Expectatives honestes
- Es cobra aproximadament entre 1 i 5 € per cada 1.000 visites. Les pàgines de finances (hipoteca, interès compost) paguen més.
- Els primers 2-3 mesos, Google tot just indexa la web, i les visites seran poques.
- El trànsit creix **afegint eines**: cada eina nova és una porta d'entrada nova des de Google. Demana-me'n més quan vulguis.
