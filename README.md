# Apte

Corrector de redaccions dels exàmens de català **C1 i C2** amb IA (català, valencià i balear).
Enganxes la redacció i, en un minut, tens:

- la nota estimada sobre 40, amb el veredicte (apte, al límit o no apte)
- els 5 criteris oficials, amb una banda de l'A a l'E
- cada error subratllat al text, amb la correcció i l'explicació
- una versió millorada del teu text

**Model de negoci:** la primera correcció és gratis; després, 7,90 € per 5 correccions o 14,90 € per 30 dies il·limitats. És pagament únic, sense subscripcions.

## Stack

Next.js 16 · Supabase (Auth + Postgres) · Claude Opus 5.5 (amb sortida estructurada) · Stripe Checkout · Vercel.

- `src/lib/grader.ts`: el prompt i l'esquema de la correcció. **Aquí és on s'afina la qualitat.**
- `supabase/schema.sql`: les taules i les funcions atòmiques per gastar i afegir crèdits.
- `src/app/api/corrections`: crea la correcció. Si la IA falla, retorna el crèdit.
- `src/app/api/stripe/webhook`: aplica les compres. És idempotent, i la pàgina de tornada de Stripe també les aplica.

## Desenvolupament

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Documents

- **[DEPLOY.md](DEPLOY.md)**: guia de llançament pas a pas
- **[docs/VENDES.md](docs/VENDES.md)**: mercat, canals i missatges per aconseguir les primeres vendes
