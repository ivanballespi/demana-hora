# Google Ads: campanya per copiar i enganxar

**Objectiu:** sortir a dalt quan algú busca "corrector C1 català" i similars, i saber exactament quants registres i vendes ens porta cada euro.

**Regla de prudència:** prova amb **50 €** (10 dies a 5 €/dia). Si en acabar no hi ha cap venda i menys de 10 registres, para-ho. No té sentit insistir.

## 1. Connectar el seguiment (15 min)

1. Crea el compte a https://ads.google.com. Quan et proposi crear una campanya "intel·ligent", tria **"Canvia al mode expert"**.
2. Ves a **Objectius → Conversions → Nova acció de conversió → Lloc web**, posa-hi el teu domini i tria **"Afegeix una acció de conversió manualment"**. N'has de crear dues:
   - **Registre**: categoria *Registre*, valor *No utilitzis cap valor*, recompte *Una*. És una acció **secundària**.
   - **Compra**: categoria *Compra*, valor *Utilitza valors diferents per a cada conversió* (el codi ja els envia), recompte *Totes*. És l'acció **principal**.
3. A cada acció, ves a **Configuració de l'etiqueta → Instal·la l'etiqueta tu mateix**. Hi veuràs un `send_to: 'AW-123456789/AbCdEf...'`:
   - La part `AW-123456789` va a `NEXT_PUBLIC_GOOGLE_ADS_ID`.
   - El que hi ha després de la barra va a `NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_LABEL` (si és l'acció de registre) o a `NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL` (si és la de compra).
4. Posa aquestes tres variables a Vercel i fes **Redeploy**. A partir d'aquí:
   - Surt l'avís de galetes a la portada.
   - Google només es carrega si l'usuari l'accepta.
   - El registre i la compra es comptabilitzen sols.

## 2. La campanya

- **Tipus:** Cerca (*Search*). **Desactiva** la Xarxa de Display i els socis de cerca.
- **Ubicacions:** Catalunya, Comunitat Valenciana, Illes Balears i Andorra. Opció "Presència: persones que són o hi van regularment".
- **Idiomes:** català **i castellà**. Molta gent té el navegador en castellà encara que busqui en català.
- **Pressupost:** 5 €/dia.
- **Licitació:** la primera setmana, *Maximitza els clics* amb un CPC màxim de 0,60 €. Quan tinguis 15 conversions o més, canvia a *Maximitza les conversions*.

### Paraules clau (en concordança de frase, amb cometes)

```
"corrector c1 català"
"corregir redacció c1"
"redacció c1 català"
"examen c1 català redacció"
"model examen c1 català"
"c1 valencià redacció"
"corrector redaccions català"
"preparar c1 català"
"redacció c2 català"
"corrector catalan c1"
"redaccion c1 catalan"
"examen c1 catalan"
```

### Paraules clau negatives

```
inscripció
resultats
notes
convocatòria
dates
pdf
llibre
feina
treball
curs presencial
```

### Anunci (adaptable de cerca)

**Títols** (tots tenen 30 caràcters o menys):
```
Corrector C1 de català
Aprovaries la redacció C1?
Nota sobre 40 en 1 minut
Primera correcció gratis
Errors explicats un per un
C1 i C2: català i valencià
Corregeix la teva redacció
Criteris oficials del C1
Sense subscripcions
Prepara el C1 de valencià
Detecta els castellanismes
Des de 7,90 €
```

**Descripcions** (totes tenen 90 caràcters o menys):
```
Enganxa la redacció i en 1 minut tens la nota sobre 40 i tots els errors explicats.
Corregim amb els criteris oficials: adequació, coherència, cohesió, correcció i riquesa.
La primera correcció és gratis. Després, des de 7,90 €. Pagament únic, sense subscripció.
Et tornem el teu text millorat perquè vegis exactament què has de canviar per aprovar.
```

- **URL final:** `https://apte.cat`
- **Ruta visible:** `apte.cat/C1/corrector`

## 3. Com saber si funciona

- Un **Pack 5** et deixa uns 5,40 € nets i l'**Intensiu**, uns 8,80 €. Per tant, **si cada venda et costa menys de 5 € en anuncis, guanyes diners**.
- Cada 2-3 dies mira **Paraules clau → Termes de cerca**. Qualsevol cerca que no tingui res a veure amb nosaltres, afegeix-la com a negativa.
- Pots trigar 1-2 setmanes a veure vendes, sobretot si encara no s'acosta cap examen. **Funciona molt millor les 4-6 setmanes abans de cada convocatòria**: concentra-hi el pressupost.
