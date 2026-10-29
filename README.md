# Senyal

Pàgina de reserves en català amb **paga i senyal obligatòria** per acabar amb les plantades.
Per a professionals que viuen de l'agenda: fisios, esteticistes, barbers, psicòlegs, tatuadors...

- **Per al client:** tria el servei, el dia i l'hora, paga la paga i senyal (targeta, Apple Pay, Google Pay) i rep una confirmació i un recordatori el dia abans. Pot cancel·lar amb un clic i, si ho fa a temps, se li retorna sola.
- **Per al negoci:** té un panell amb l'agenda, marca qui ha vingut i qui l'ha plantat, i veu els diners assegurats. Els diners van directes al seu Stripe.
- **Model:** 15 €/mes + IVA, 14 dies de prova sense targeta.

## Stack

Next.js 16 (App Router) · Supabase (Postgres + Auth) · Stripe (Billing + Connect amb comptes que paguen les seves comissions) · Resend · Vercel Cron.

- `supabase/schema.sql`: tot l'esquema. Els solapaments de reserves els impedeix la base de dades mateixa (restricció d'exclusió), no el codi.
- `src/app/r/[slug]`: pàgina pública de reserves.
- `src/app/panell`: panell del negoci.
- `src/app/api/stripe/webhook`: un sol endpoint per als webhooks de la plataforma i de Connect.
- `src/app/api/cron/reminders`: recordatoris diaris i neteja de reserves sense pagar.

## Desenvolupament

```bash
cp .env.example .env.local   # omple les claus
npm install
npm run dev
```

## Documents

- **[DEPLOY.md](DEPLOY.md)**: guia per llançar-ho pas a pas
- **[docs/VENDES.md](docs/VENDES.md)**: mercat, oferta, missatges i pla per als primers clients
