# Proposal: SEO Slice 1 — Fundamentos + Migración a Netlify

> Deja al sitio indexable con dominio canónico, metadata correcta y hosting migrado de Vercel a Netlify. Sin Schema.org, sin imagen OG física, sin cambios de contenido.

## 1. Executive Summary

Este slice resuelve los cimientos de SEO técnico de YPF El Puente: se migra el hosting de Vercel a Netlify, se corrige el dominio canónico a `https://ypfelpuente.com.ar`, se agrega `metadataBase` en el root layout, se agregan canonical URLs y metadata específica en cada página pública, se actualizan `robots.ts` y `sitemap.ts`, se elimina la metadata duplicada del grupo `(full)` y se genera un favicon. Al finalizar, el sitio estará técnicamente indexable y listo para el Slice 2 de enriquecimiento (Schema.org, imagen OG, corrección de h1, etc.).

## 2. Motivation / Problem

La auditoría previa detectó gaps críticos que impiden que Google indexe correctamente el sitio:

- **Dominio incorrecto en SEO**: `robots.ts` y `sitemap.ts` apuntan a `ypfelpuente.com` (sin `.ar`).
- **Sin `metadataBase`**: `src/app/layout.tsx` no define `metadataBase`, lo que bloquea la resolución automática de URLs relativas en OpenGraph y canonicals.
- **Landing sin metadata propia**: `src/app/(public)/page.tsx` hereda todo del root; no tiene OG ni descripción específica de landing.
- **Metadata duplicada**: `src/app/(full)/layout.tsx` y `src/app/(full)/full/layout.tsx` repiten título y descripción.
- **Hosting pendiente**: `vercel.json` aún define el rewrite `/menu → /full`; hay que migrar a Netlify.
- **Favicon ausente**: no hay `icon.tsx`, `favicon.ico` ni `apple-icon.tsx`.
- **Páginas de error sin metadata**: `not-found.tsx` y `error.tsx` no tienen título ni `noindex`.
- **Variable de entorno faltante**: no existe `NEXT_PUBLIC_SITE_URL` ni `.env.example` que la documente.

## 3. Proposed Changes

### 3.1 Migración de hosting Vercel → Netlify

| Archivo | Cambio |
| ------- | ------ |
| `next.config.ts` | Agregar `async rewrites()` con `{ source: '/menu', destination: '/full' }` (status 200, proxy interno). |
| `netlify.toml` | Crear con `command = "pnpm build"` y `[[plugins]] package = "@netlify/plugin-nextjs"`. Sin redirects. |
| `vercel.json` | Eliminar del proyecto. |
| `.env.local` | Agregar `NEXT_PUBLIC_SITE_URL=https://ypfelpuente.com.ar`. |
| `.env.example` | Crear con documentación de `NEXT_PUBLIC_SITE_URL` y variables existentes. |

### 3.2 Root layout y metadata base

| Archivo | Cambio |
| ------- | ------ |
| `src/app/layout.tsx` | Agregar `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ypfelpuente.com.ar')` al objeto `metadata`. |

### 3.3 Metadata + canonical por página pública

| Archivo | Cambio |
| ------- | ------ |
| `src/app/(public)/page.tsx` | Crear `metadata` propia con title/description/keywords/OpenGraph específicos para la landing y `alternates: { canonical: '/' }`. |
| `src/app/(public)/combustibles/page.tsx` | Agregar `alternates: { canonical: '/combustibles' }` y `openGraph` específico. |
| `src/app/(full)/layout.tsx` | Agregar `alternates: { canonical: '/full' }` y `openGraph` específico; mantener title/description. |
| `src/app/(full)/full/menu/page.tsx` | Tipar `metadata` con `Metadata`, agregar `alternates: { canonical: '/full/menu' }` y `openGraph` específico. |
| `src/app/(full)/full/layout.tsx` | Eliminar exportación de `metadata` (redundante). Se decide en el proposal si eliminar el archivo completo o dejarlo vacío. |

### 3.4 Sitemap y robots

| Archivo | Cambio |
| ------- | ------ |
| `src/app/sitemap.ts` | Usar `process.env.NEXT_PUBLIC_SITE_URL || 'https://ypfelpuente.com.ar'`. Agregar `/combustibles` (weekly, 0.7) y `/full/menu` (daily, 0.8). Mantener `/` (daily, 1) y `/full` (weekly, 0.9). |
| `src/app/robots.ts` | Usar `NEXT_PUBLIC_SITE_URL` para `sitemap`. Corregir dominio a `.com.ar`. Mantener `allow: ['/', '/full']` y `disallow: ['/admin/', '/api/']`. |

### 3.5 Favicon

| Archivo | Cambio |
| ------- | ------ |
| `src/app/icon.tsx` | Crear icono generado con `ImageResponse` (next/og) usando el logo/marca existente. Exportar `size` (32x32) y `contentType` (`image/png`). Opcional: `apple-icon.tsx` (180x180). |

### 3.6 Páginas de error

| Archivo | Cambio |
| ------- | ------ |
| `src/app/not-found.tsx` | Agregar `metadata` con `title: 'Página no encontrada — YPF El Puente'`, `description` y `robots: { index: false }`. |
| `src/app/error.tsx` | Agregar `metadata` con `title: 'Error — YPF El Puente'`, `description` y `robots: { index: false }`. Nota: `error.tsx` es Client Component, por lo que la metadata debe exportarse como objeto separado o manejarse en el layout padre. |

## 4. Technical Approach

### 4.1 Rewrites: Camino A (next.config.ts nativo)

Se usa la API `async rewrites()` de `next.config.ts` en lugar de `netlify.toml` porque el rewrite es un comportamiento de la aplicación, no de la plataforma. Esto mantiene el código portable y testeable localmente con `pnpm dev`.

```ts
async rewrites() {
  return [
    { source: '/menu', destination: '/full' },
  ]
}
```

### 4.2 netlify.toml mínimo

Solo build command y plugin oficial de Next.js. Los redirects se manejan en `next.config.ts`.

```toml
[build]
  command = "pnpm build"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 4.3 metadataBase y canonicals

`metadataBase` se define en el root layout con fallback al dominio final. Las páginas públicas usan `alternates: { canonical: '/ruta' }`; Next.js las resuelve a URLs absolutas usando `metadataBase`.

### 4.4 Consolidación de layouts `(full)`

Se mantiene `src/app/(full)/layout.tsx` como dueño de la metadata del grupo `/full` porque es el layout real que también renderiza la UI (navbar, bottom bar, etc.). `src/app/(full)/full/layout.tsx` solo envuelve `children` y repite metadata, por lo que se elimina su exportación de `metadata` (o el archivo completo si no se usa para otra cosa). `src/app/(full)/full/menu/page.tsx` conserva su propia metadata para `/full/menu`.

### 4.5 `/boxes` como redirect

Se mantiene `src/app/(public)/boxes/page.tsx` como `redirect('/#boxes')`. **No se agrega canonical ni se incluye en el sitemap** porque no hay contenido propio que indexar; Google seguirá el redirect al landing.

### 4.6 Favicon

Se propone `src/app/icon.tsx` generado con `ImageResponse` (Next.js App Router). Ventajas: no requiere archivos estáticos, escala bien, puede adaptarse a dark mode y evita depender de paths como `public/assets/ypf imagenes/logo-modooscuro.png` que contienen espacios. Si el logo es demasiado complejo para renderizar en SVG/JSX, se recurre a copiar un PNG a `public/favicon.ico` o `public/icon.png`.

### 4.7 Metadata en páginas de error

`not-found.tsx` puede exportar `metadata` directamente porque es Server Component. `error.tsx` es Client Component (`'use client'`), por lo que se debe exportar `metadata` en un archivo separado (por ejemplo, `src/app/error.metadata.ts` importado por el layout) o manejarlo vía el layout padre. Se recomienda la opción más simple en el proposal.

## 5. Scope Boundaries

### In Scope (Slice 1)

- Migración de hosting: `next.config.ts` rewrites, `netlify.toml`, eliminar `vercel.json`.
- Variable `NEXT_PUBLIC_SITE_URL` y `.env.example`.
- `metadataBase` en root layout.
- Metadata + canonical en `/`, `/combustibles`, `/full`, `/full/menu`.
- Actualización de `sitemap.ts` y `robots.ts` con dominio `.com.ar`.
- Eliminación de metadata duplicada en `(full)/full/layout.tsx`.
- Favicon (`icon.tsx` y opcional `apple-icon.tsx`).
- Metadata en `not-found.tsx` y `error.tsx` (con `noindex`).

### Out of Scope (Slice 1)

- Schema.org JSON-LD (LocalBusiness, Restaurant, Menu).
- Imagen OG física 1200x630.
- Corrección de `<h1>` faltantes o saltos h1→h3.
- Auditoría de `alt` text.
- Migración de `<img>` nativo a `next/image`.
- Priority hints en imágenes.
- Configuración de Google Search Console / Business Profile.

## 6. Assumptions

- El dominio final del sitio será `https://ypfelpuente.com.ar`.
- El hosting objetivo es **Netlify Free** y la build se ejecuta con `pnpm build`.
- `NEXT_PUBLIC_SITE_URL` estará disponible en build time para que `sitemap.ts`, `robots.ts` y `metadataBase` funcionen.
- El logo/marca existente en `public/assets/ypf imagenes/` es usable para generar el favicon.
- `src/app/(full)/full/layout.tsx` no tiene otra responsabilidad más que envolver `children`.
- `src/app/(public)/boxes/page.tsx` debe seguir siendo un redirect a `/#boxes`.

## 7. Risks & Open Questions

| Riesgo / Pregunta | Impacto | Recomendación / Mitigación |
| ----------------- | ------- | -------------------------- |
| **¿Incluir `/full/menu` en el sitemap?** | Medio | Sí, incluirlo con `priority: 0.8` y `changeFrequency: 'daily'`. Tiene contenido propio y es diferente de `/full`. |
| **¿Qué hacer con `/boxes`?** | Medio | Mantener como redirect. No agregar canonical ni sitemap. Si más adelante se quiere una página real, va en un slice separado. |
| **Paths con espacios en `public/assets/ypf imagenes/`** | Bajo | Evitar usarlos directamente para el favicon. Generar `icon.tsx` con SVG/JSX o copiar un PNG a `public/icon.png`. |
| **Metadata en `error.tsx` (Client Component)** | Bajo | Exportar metadata desde un archivo auxiliar o manejarla en el layout padre. |
| **Scripts de test/typecheck no aparecen en `package.json`** | Bajo | El `AGENTS.md` menciona `pnpm test` y `pnpm typecheck`, pero `package.json` no los tiene. Confirmar si se deben agregar o si se valida solo con `pnpm build` + `pnpm lint`. |
| **Dominio aún no comprado** | Medio | Usar `https://ypfelpuente.com.ar` en código y variables. Antes del deploy final en Netlify se debe confirmar la propiedad del dominio. |

### Decisiones que necesitan confirmación del usuario

1. **Confirmar que `/boxes` se mantiene como redirect** (recomendación: sí, opción a).
2. **Confirmar el enfoque de favicon**: `icon.tsx` generado con `ImageResponse` usando la marca textual "YPF El Puente" o un logo simplificado.
3. **Confirmar que se elimina `src/app/(full)/full/layout.tsx` completo** (recomendación: sí, si no hay otra lógica) o solo su metadata.
4. **Confirmar scripts de validación**: ¿se agregan `test` y `typecheck` a `package.json` o se usan los que ya existan?

## 8. Out of Scope (Slice 2)

- Schema.org JSON-LD: `LocalBusiness`, `Restaurant`, `Menu`.
- Imagen OG física 1200x630 en `/public/assets/og-image.jpg`.
- Metadata de OG con imagen en cada página.
- Corrección de `<h1>` en `/full` y saltos de encabezado (h1→h3).
- Auditoría y mejora de `alt` text en imágenes.
- Migración de `<img>` nativo del hero a `next/image`.
- `priority` y `loading` en imágenes críticas.
- Tareas fuera del código: Google Search Console, Google Business Profile, compra del dominio, configuración de DNS en Netlify.

## 9. Success Criteria

- [ ] `vercel.json` eliminado; `netlify.toml` creado con build y plugin.
- [ ] `next.config.ts` incluye `rewrites()` para `/menu → /full`.
- [ ] `.env.local` y `.env.example` contienen `NEXT_PUBLIC_SITE_URL=https://ypfelpuente.com.ar`.
- [ ] `src/app/layout.tsx` define `metadataBase` con `NEXT_PUBLIC_SITE_URL` y fallback.
- [ ] `src/app/(public)/page.tsx` exporta metadata propia con título, descripción, keywords y OG.
- [ ] `src/app/(public)/combustibles/page.tsx`, `src/app/(full)/layout.tsx` y `src/app/(full)/full/menu/page.tsx` tienen `alternates.canonical` y `openGraph`.
- [ ] `src/app/(full)/full/layout.tsx` ya no exporta metadata duplicada (o se elimina).
- [ ] `src/app/sitemap.ts` usa `NEXT_PUBLIC_SITE_URL` e incluye `/`, `/full`, `/combustibles`, `/full/menu`.
- [ ] `src/app/robots.ts` apunta a `https://ypfelpuente.com.ar/sitemap.xml`.
- [ ] `src/app/icon.tsx` existe y genera el favicon correctamente.
- [ ] `src/app/not-found.tsx` y `src/app/error.tsx` tienen metadata con `noindex`.
- [ ] Build pasa (`pnpm build`) sin errores de metadata.

## 10. Estimated Effort

| Archivos afectados | Tipo | Líneas aproximadas |
| ------------------ | ---- | ------------------ |
| `next.config.ts` | Modificar | +5 líneas |
| `netlify.toml` | Crear | ~8 líneas |
| `vercel.json` | Eliminar | -8 líneas |
| `.env.local` | Modificar | +1 línea |
| `.env.example` | Crear | ~12 líneas |
| `src/app/layout.tsx` | Modificar | +5 líneas |
| `src/app/(public)/page.tsx` | Modificar | +25 líneas |
| `src/app/(public)/combustibles/page.tsx` | Modificar | +15 líneas |
| `src/app/(full)/layout.tsx` | Modificar | +10 líneas |
| `src/app/(full)/full/layout.tsx` | Modificar / eliminar | -8 líneas |
| `src/app/(full)/full/menu/page.tsx` | Modificar | +15 líneas |
| `src/app/sitemap.ts` | Modificar | +15 líneas |
| `src/app/robots.ts` | Modificar | +5 líneas |
| `src/app/icon.tsx` | Crear | ~35 líneas |
| `src/app/not-found.tsx` | Modificar | +10 líneas |
| `src/app/error.tsx` o metadata auxiliar | Modificar | +10 líneas |

**Total estimado**: ~11 archivos modificados/creados, ~150 líneas netas (crear + modificar - eliminar). Es un slice de un solo PR, idealmente < 250 líneas para revisión rápida.

---

**skill_resolution**: paths-injected
