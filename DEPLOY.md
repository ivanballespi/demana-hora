# Llançar Senyal avui: guia pas a pas

Calcula unes 2 hores, la majoria esperant verificacions. Fes-ho en aquest ordre: cada pas et dona claus que necessites al següent.
Ves apuntant les claus en una nota, que al pas 5 les enganxaràs totes a Vercel.

---

## 0. Domini (10 min · ~15 €/any)

1. Comprova si **senyal.cat** està lliure (a dominis.cat, Dinahosting, Raiola o Gandi). Si no ho està, les alternatives per ordre de preferència són `senyal.app`, `ambsenyal.cat` i `pagaisenyal.cat`.
2. Compra'l. **No toquis els DNS encara.**
3. Si el domini final no és `senyal.cat`, cerca `senyal.cat` al codi (és a la landing, al correu de suport i a la pàgina legal) i canvia'l.

## 1. Supabase: base de dades i login (15 min · gratis)

1. Ves a https://supabase.com, crea't un compte i fes **New project**. Regió: **West EU (Paris)** o **Central EU (Frankfurt)**, que les dades han de quedar a la UE.
2. Obre **SQL Editor → New query**, enganxa-hi tot el contingut de `supabase/schema.sql` i fes **Run**. Ha de dir "Success".
3. A **Authentication → URL Configuration**:
   - Site URL: `https://senyal.cat`
   - Redirect URLs: afegeix `https://senyal.cat/auth/callback` i `http://localhost:3000/auth/callback`
4. A **Authentication → Sign In / Providers → Email**, **desactiva "Confirm email"** per ara. El correu per defecte de Supabase només n'envia 2 per hora, i un client que no rep la confirmació és un client perdut. Quan tinguis Resend (pas 3), si vols el pots tornar a activar amb SMTP propi (Authentication → Emails → SMTP Settings, amb les dades SMTP de Resend).
5. A **Project Settings → API Keys** apunta't:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` / publishable key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` / secret key → `SUPABASE_SERVICE_ROLE_KEY` (**és secreta: no la passis mai a ningú**)

## 2. Stripe (30-60 min · sense quota fixa)

Fes tot primer en **mode Test** (l'interruptor de dalt a la dreta) i, quan funcioni, repeteix els passos 2.2 a 2.5 en mode Live.

1. **Activa el compte** amb les dades d'autònom (NIF, IBAN). Sense això no pots cobrar en mode Live.
2. **Connect**: menú **Connect → Get started**. Tria que ets una *plataforma* i que els teus usuaris cobren als seus clients. Omple el perfil de plataforma (descripció: "Programari de reserves amb paga i senyal per a professionals"). A **Connect → Settings → Branding** posa-hi el nom Senyal, el color `#e8590c` i la icona.
3. **Producte**: **Product catalog → Add product**:
   - Nom: `Senyal Pro`
   - Preu: `15,00 EUR`, **Recurring, Monthly**, tax behavior **Exclusive**
   - Copia l'ID del preu (`price_...`) → `STRIPE_PRICE_ID`
4. **IVA**: **Product catalog → Tax rates → New**: "IVA", 21 %, Spain, *exclusive*. Copia l'ID `txr_...` → `STRIPE_TAX_RATE_ID`.
5. **Portal de clients**: **Settings → Billing → Customer portal → Activate**. Permet-hi cancel·lar, canviar la targeta i veure factures.
6. **Factures**: a **Settings → Billing → Invoices** posa-hi el NIF i l'adreça fiscal, perquè surtin a les factures automàtiques.
7. **Claus**: **Developers → API keys → Secret key** → `STRIPE_SECRET_KEY`.
8. **Webhooks**: **Developers → Webhooks**. N'has de crear **DOS**, tots dos a la URL `https://senyal.cat/api/stripe/webhook`:
   - **A) "Events on Your account"** amb aquests events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`. El signing secret va a → `STRIPE_WEBHOOK_SECRET`.
   - **B) "Events on Connected accounts"** amb aquests events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.expired`, `account.updated`. El signing secret va a → `STRIPE_CONNECT_WEBHOOK_SECRET`.

## 3. Resend: correus de confirmació i recordatori (15 min · gratis fins a 3.000/mes)

1. Ves a https://resend.com, crea't un compte, fes **Domains → Add domain** amb `senyal.cat` i afegeix els registres DNS que et doni al proveïdor del domini.
2. **API Keys → Create** → `RESEND_API_KEY`.
3. `EMAIL_FROM=Senyal <hola@senyal.cat>`
4. Configura també una bústia per **rebre** a hola@senyal.cat. La redirecció de correu del registrador sol ser gratis; envia'l al teu Gmail.

## 4. Vercel (10 min)

1. Ves a https://vercel.com, fes **Add New → Project** i importa el repo `demana-hora` de GitHub (branca `main` un cop fusionada, o `senyal-mvp`).
2. A **Environment Variables** enganxa-hi totes les variables de `.env.example` amb els teus valors:
   - `NEXT_PUBLIC_APP_URL=https://senyal.cat`
   - `CRON_SECRET`: una cadena llarga aleatòria (per exemple, una contrasenya de 40 caràcters del teu gestor de contrasenyes)
   - `LEGAL_NAME`, `LEGAL_NIF`, `LEGAL_ADDRESS`: les teves dades d'autònom (són obligatòries a la pàgina legal)
3. Fes **Deploy**.
4. A **Settings → Domains** afegeix `senyal.cat` i `www.senyal.cat` i posa al registrador els DNS que t'indiqui.
5. ⚠️ El pla **Hobby** (gratuït) de Vercel **no permet ús comercial**. Per provar-ho et serveix, però el dia que cobris el primer client passa a **Pro (20 $/mes)**. Una alternativa és Netlify, que sí que ho permet al pla gratuït. El cron de recordatoris (`vercel.json`) funciona en tots dos plans de Vercel.

## 5. Prova-ho tot en mode test (20 min)

1. Entra a `https://senyal.cat/registre` i crea un negoci de prova.
2. A **Cobraments i pla → Connectar Stripe**: en mode test pots saltar la verificació amb les dades de prova que et proposa Stripe.
3. Obre la teva pàgina `/r/...` des del mòbil, reserva i paga amb la targeta `4242 4242 4242 4242` (qualsevol data futura i qualsevol CVC).
4. Comprova que:
   - la reserva surt al panell
   - t'arriben els dos correus (el del client i el del negoci)
   - si cancel·les des de l'enllaç del correu, el reemborsament surt a Stripe
5. A **Activar Senyal Pro**, subscriu-te amb la 4242 i comprova que l'estat passa a "Actiu ✅".
6. Quan tot funcioni: canvia a les claus **Live** de Stripe (pas 2, en mode Live: preu, taxa, webhooks i clau secreta), actualitza-les a Vercel i fes **Redeploy**.

## 6. Crea un negoci demo per vendre

Registra un compte "**Barberia Demo**" amb enllaç `demo`, un parell de serveis amb paga i senyal i Stripe connectat. Aquesta pàgina (`senyal.cat/r/demo`) és la que ensenyaràs als clients potencials des del mòbil. Mira `docs/VENDES.md`.

---

### Costos fixos reals

| Concepte | Cost |
|---|---|
| Domini | ~15 €/any |
| Vercel Pro (quan cobris) | 20 $/mes |
| Supabase, Resend | 0 € fins a molts clients |
| Stripe | 0 fix; ~1,5 % + 0,25 € per cobrament |

**Amb 2 clients ja cobreixes costos. Amb 10, fas uns 130 €/mes nets. Amb 100, uns 1.480 €/mes.**

### Problemes típics

- **"Aquest negoci encara no pot cobrar la paga i senyal"**: el negoci no ha acabat l'alta de Stripe. Que entri a Cobraments i pla i la completi.
- **No arriben correus**: revisa que el domini estigui verificat a Resend i que `EMAIL_FROM` utilitzi aquest domini.
- **La subscripció no s'activa**: revisa a Stripe → Webhooks que l'endpoint A no tingui errors 400. Si en té, el `STRIPE_WEBHOOK_SECRET` està malament.
