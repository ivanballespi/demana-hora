# CalculaYa

Calculadoras y herramientas gratis en español, monetizadas con Google AdSense.
Web 100 % estática (Next.js `output: "export"`): se aloja gratis y no tiene servidor ni base de datos.

- `src/tools/logic.ts`: la lógica de cada herramienta (probada).
- `src/tools/registry.ts`: nombre, textos SEO y preguntas frecuentes de cada herramienta. **Añadir una herramienta** = una entrada aquí + un componente en `src/tools/components.tsx`.
- `src/lib/site.ts`: marca, dominio y AdSense (todo por variables de entorno, ver `.env.example`).

```bash
npm install
npm run dev
# Publicar en GitHub Pages (subcarpeta /demana-hora):
NEXT_PUBLIC_SITE_URL=https://ivanballespi.github.io/demana-hora NEXT_PUBLIC_BASE_PATH=/demana-hora npm run build
```

Guía para cobrar con anuncios: [docs/ADSENSE.md](docs/ADSENSE.md).
