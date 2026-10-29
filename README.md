# CalcularOnline (calcularonline.es)

Calculadoras y herramientas gratis en español, monetizadas con Google AdSense.
Web 100 % estática (Next.js `output: "export"`): se aloja gratis y no tiene servidor ni base de datos.

- `src/tools/logic.ts`: la lógica de cada herramienta (probada).
- `src/tools/registry.ts`: nombre, textos SEO y preguntas frecuentes de cada herramienta. **Añadir una herramienta** = una entrada aquí + un componente en `src/tools/components.tsx`.
- `src/lib/site.ts`: marca, dominio y AdSense (todo por variables de entorno, ver `.env.example`).

```bash
npm install
npm run dev
npm run build   # genera out/ per a https://calcularonline.es
# Es publica copiant out/ a la branca gh-pages (GitHub Pages, amb el domini propi via public/CNAME).
```

Guía para cobrar con anuncios: [docs/ADSENSE.md](docs/ADSENSE.md).
