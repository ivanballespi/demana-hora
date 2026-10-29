# Llançar Apte avui: guia pas a pas

Calcula unes 2 hores. Ves apuntant les claus en una nota, que al pas 5 les enganxaràs totes a Vercel.

## 0. Domini (~15 €/any)

Comprova si **apte.cat** està lliure (a dominis.cat, Dinahosting, Raiola o Gandi). No ho he pogut verificar des d'aquí. Si no ho està, prova `aptecat.cat`, `apte.app` o `correccioc1.cat`. Si el domini final és un altre, cerca `apte.cat` al codi (`hola@apte.cat` és a la landing, al compte i a la pàgina legal) i canvia'l.

## 1. Supabase: base de dades i comptes (15 min · gratis)

1. Ves a https://supabase.com i fes **New project**. Regió: **West EU (Paris)** o **Central EU (Frankfurt)**.
2. Obre **SQL Editor → New query**, enganxa-hi tot `supabase/schema.sql` i fes **Run**.
3. A **Authentication → URL Configuration**:
   - Site URL: `https://apte.cat`
   - Redirect URLs: afegeix `https://apte.cat/auth/callback`
4. **Confirmació de correu: deixa-la ACTIVADA.** Cada compte nou té una correcció gratis i això ens costa uns 0,15 €. Sense confirmació, algú podria crear 100 comptes amb correus falsos.
   - El problema és que el correu per defecte de Supabase només n'envia 2 per hora. Per això cal posar-hi SMTP propi: crea un compte a https://resend.com, verifica-hi el domini (afegint-hi els registres DNS que et dona) i copia'n les dades SMTP a **Authentication → Emails → SMTP Settings**. El remitent ha de ser `Apte <hola@apte.cat>`.
   - Si avui tens pressa, la pots desactivar, però activa-la en un parell de dies.
5. A **Project Settings → API Keys** apunta't:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` / publishable → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` / secret → `SUPABASE_SERVICE_ROLE_KEY` (és secreta: no la comparteixis mai)

## 2. Anthropic: la IA que corregeix (10 min)

1. Ves a https://console.anthropic.com, crea't un compte i fes **API Keys → Create key** → `ANTHROPIC_API_KEY`.
2. A **Billing**, carrega-hi 20 $ de crèdit (dona per a unes 120 correccions).
3. A **Limits**, posa un **límit de despesa mensual** (per exemple, 50 $), perquè cap sorpresa et buidi el compte. Quan vengui més, l'apuges.

Cost aproximat per correcció: **0,12–0,18 €**.

## 3. Stripe: cobrar (20 min)

Fes-ho tot primer en **mode Test** i, quan funcioni, repeteix-ho en mode Live.

1. Activa el compte amb les dades d'autònom.
2. **Product catalog → Add product**, dos productes de **pagament únic** (*One-off*):
   - `Apte · Pack 5 correccions`: **7,90 EUR**, tax behavior **Inclusive** → copia l'ID del preu a `STRIPE_PRICE_PACK5`
   - `Apte · Intensiu 30 dies`: **14,90 EUR**, **Inclusive** → copia l'ID del preu a `STRIPE_PRICE_PASS30`
3. **Settings → Billing → Invoices**: posa-hi el NIF i l'adreça. El checkout ja genera una factura per a cada compra.
4. **Developers → API keys**: copia la secret key → `STRIPE_SECRET_KEY`.
5. **Developers → Webhooks → Add endpoint**:
   - URL: `https://apte.cat/api/stripe/webhook`
   - Events: `checkout.session.completed` i `checkout.session.async_payment_succeeded`
   - Copia el signing secret → `STRIPE_WEBHOOK_SECRET`
6. Opcional: **Product catalog → Coupons**. Crea un cupó (per exemple, `OPOSITA` amb un 20 %) per repartir a grups i acadèmies. El checkout ja accepta codis.

**IVA:** els preus porten el 21 % inclòs (12,31 € + IVA en el cas dels 14,90 €). Digues-li al gestor que vens serveis digitals a particulars, perquè ho declari bé. Si algun dia vens fora d'Espanya, mira la finestreta única d'IVA (OSS).

## 4. Vercel (10 min)

1. Ves a https://vercel.com, fes **Add New → Project** i importa el repo `demana-hora` (branca `apte-mvp`, o `main` un cop fusionada).
2. A **Environment Variables**, posa-hi totes les variables de `.env.example`, inclosos `NEXT_PUBLIC_APP_URL=https://apte.cat` i les teves dades `LEGAL_*`.
3. Fes **Deploy**. Després, a **Settings → Domains**, afegeix-hi `apte.cat` i configura els DNS que et digui.
4. ⚠️ El pla **Hobby** de Vercel no permet ús comercial. El dia de la primera venda passa a **Pro (20 $/mes)**.

## 5. Prova-ho de debò (15 min)

1. Registra't amb el teu correu, confirma'l i fes la correcció gratis amb una redacció real teva o d'algú que conegui. **Llegeix la correcció a fons:** si la nota o algun error et sembla estrany, digues-m'ho i afinem el prompt (`src/lib/grader.ts`).
2. Compra el Pack 5 amb la targeta de prova `4242 4242 4242 4242` i comprova que el comptador passa a 5.
3. Quan tot funcioni, canvia a les claus **Live** de Stripe (preus, webhook i secret key), actualitza-les a Vercel i fes **Redeploy**.

## 6. Google (10 min, important!)

Les vendes han de venir de Google, així que aquest pas no te'l saltis:
1. A **Google Search Console**, afegeix el domini i posa el codi de verificació a `GOOGLE_SITE_VERIFICATION` a Vercel. Fes redeploy.
2. A **Sitemaps**, envia `https://apte.cat/sitemap.xml`.
3. A **Inspecció d'URL**, demana la indexació de la portada, de `/detector-castellanismes` i de les 6 guies de `/guia`.

Tens tots els detalls a `docs/VENDES.md`.

## Números

| | Ingrés net (sense IVA) | Cost IA + Stripe | Marge |
|---|---|---|---|
| Pack 5 (7,90 €) | 6,53 € | ~1,15 € | **~5,4 €** |
| Intensiu (14,90 €), ús típic (~20 correccions) | 12,31 € | ~3,5 € | **~8,8 €** |
| Intensiu, pitjor cas (60 correccions) | 12,31 € | ~9,5 € | ~2,8 € |

Costos fixos: domini (~15 €/any) i Vercel Pro (20 $/mes). **Amb 3-4 vendes al mes ja cobreixes costos.**
