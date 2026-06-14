---
name: clone-master-website
description: Clona cualquier sitio web objetivo a un app moderno Next.js + Tailwind + TS, manteniendo design tokens y heurísticas UX.
---

# Pipeline (no negociable)
1. Legal check — ¿tenés derecho a clonar? Si es marca registrada con copyright,
   sólo "design inspiration" (NO copiar logos/marcas/copy literal).
2. Discover & scrape con Firecrawl MCP:
   - `firecrawl.scrape(url, { formats: ['markdown','screenshot','html'] })`
   - Para SPA pesado: `formats: ['screenshot@2x']`
3. Extract design system:
   - Colores (OKLCH), tipografía, spacing, radius, shadows.
   - Guardar en `design-tokens.json`.
4. Recreate component-by-component:
   - Usar `shadcn` MCP para inyectar componentes equivalentes.
   - Mapear cada sección a un bloque Tailwind/shadcn.
5. Replace media:
   - Imágenes propias o stock libre (Unsplash, Pexels).
   - Logos propios.
   - Copy reescrito (NO copiar verbatim).
6. A11y + Perf pass con Vercel skills.
7. Diff visual con Playwright screenshots side-by-side.

# Comandos típicos
- "Clone the hero section of stripe.com style for my fintech LATAM"
- "Extract the design system from @url and apply to my project"
- "Recreate the pricing section of linear.app with my plans"