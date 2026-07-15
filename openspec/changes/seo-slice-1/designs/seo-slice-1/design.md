# Design: SEO Slice 1 — Fundamentos + Migración a Netlify

## Overview

Este diseño técnico describe cómo implementar los 12 requirements del SEO Slice 1 sin modificar el scope aprobado. El enfoque es: configurar primero el entorno y el dominio canónico, luego derivar toda la metadata desde un punto único de verdad, y finalmente agregar los assets estáticos y las páginas de error.

---

## Implementation Order

El orden busca minimizar conflictos de merge, reducir el riesgo de regressión y asegurar que cada paso pueda validarse antes de continuar.

| # | Requirement | Archivos principales | Dependencias | Notas |
|---|-------------|----------------------|--------------|-------|
| 1 | **R1** Hosting migration | `next.config.ts`, `netlify.toml`, `vercel.json`, `.env.local`, `.env.example` | Ninguna | Habilita el deploy objetivo y el rewrite `/menu → /full`. |
| 2 | **R2** metadataBase | `src/app/layout.tsx` | R1 (entorno) | Prerequisito técnico de todos los canonicals y OG. |
| 3 | **R7** Remove duplicate layout | `src/app/(full)/full/layout.tsx` | R2 | Limpiar antes de tocar metadata en `(full)`; verificar que no tenga lógica oculta. |
| 4 | **R3** Landing metadata | `src/app/(public)/page.tsx` | R2 | Puede hacerse en paralelo con R4-R6. |
| 5 | **R4** Combustibles metadata | `src/app/(public)/combustibles/page.tsx` | R2 | Puede hacerse en paralelo con R3, R5, R6. |
| 6 | **R5** /full metadata | `src/app/(full)/layout.tsx` | R2, R7 | Puede hacerse en paralelo con R3, R4, R6. |
| 7 | **R6** /full/menu metadata | `src/app/(full)/full/menu/page.tsx` | R2, R7 | Puede hacerse en paralelo con R3-R5. |
| 8 | **R8** Sitemap | `src/app/sitemap.ts` | R2 | Depende del dominio canónico. |
| 9 | **R9** Robots | `src/app/robots.ts` | R2 | Depende del dominio canónico. |
| 10 | **R10** Favicon | `public/favicon.ico`, `public/apple-icon.png` | Ninguna | Independiente; conviene hacerlo después de R1-R2 para no dispersar el foco. |
| 11 | **R11** not-found metadata | `src/app/not-found.tsx` | Ninguna | Independiente. |
| 12 | **R12** Error metadata | `src/app/error/layout.tsx` | Ninguna | Independiente. |

### Punto de no retorno

**R7 — eliminar `src/app/(full)/full/layout.tsx`** es el punto de no retorno. Si el archivo contiene providers, estilos globales o contexto no detectado en la lectura inicial, su eliminación romperá `/full` y `/full/menu`. Antes de borrarlo se debe:

1. Revisar todos los imports que apuntan a él (`rg "full/layout"` en `src/`).
2. Ejecutar `pnpm build` con el archivo aún presente pero sin exportar `metadata`.
3. Si pasa, eliminar el archivo y volver a correr `pnpm build`.

---

## Architecture Decisions

### AD-1: Constantes SEO centralizadas

Se crea `src/lib/seo/constants.ts` como única fuente de verdad para valores repetidos.

```typescript
export const CANONICAL_DOMAIN =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://ypfelpuente.com.ar'

export const SITE_NAME = 'YPF El Puente'
export const DEFAULT_LOCALE = 'es_AR'
export const OG_TYPE = 'website'
```

**Justificación:** evita magic strings, garantiza consistencia en `siteName`, `locale` y `type` de OpenGraph, y centraliza el fallback del dominio.

### AD-2: Helper opcional para metadata de página

Se crea `src/lib/seo/metadata.ts` con un helper que arma objetos `Metadata` text-only.

```typescript
import type { Metadata } from 'next'
import { CANONICAL_DOMAIN, DEFAULT_LOCALE, OG_TYPE, SITE_NAME } from './constants'

interface PageMetaInput {
  title: string
  description: string
  keywords?: string[]
  canonical: string
}

export function createPageMetadata(input: PageMetaInput): Metadata {
  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical: input.canonical },
    openGraph: {
      title: input.title,
      description: input.description,
      locale: DEFAULT_LOCALE,
      type: OG_TYPE,
      siteName: SITE_NAME,
    },
  }
}

export function createNoIndexMetadata(
  title: string,
  description: string
): Metadata {
  return {
    title,
    description,
    robots: { index: false },
  }
}
```

**Justificación:** reduce la duplicación entre las 4 páginas públicas con OG idéntico en estructura; mantiene la metadata inline en cada página para que el spec siga siendo fácil de trazar.

### AD-3: Canonicals relativas resueltas por metadataBase

Todas las páginas usan `alternates: { canonical: '/ruta' }`. La URL absoluta se resuelve automáticamente desde `metadataBase` en `src/app/layout.tsx`.

**Justificación:** es la convención documentada de Next.js 16 y evita ensuciar cada página con concatenaciones de dominio.

### AD-4: Favicon como archivo estático en `public/`

Se copia el logo más cuadrado a `public/favicon.ico` y opcionalmente `public/apple-icon.png`. No se usa `src/app/icon.tsx` ni `ImageResponse`.

**Justificación:** es la decisión cerrada en el spec (R10). Se elige `public/favicon.ico` porque los navegadores lo solicitan por convención sin necesidad de inyección de `<link>` por parte de Next.js.

### AD-5: Metadata de error en `src/app/error/layout.tsx`

Se crea un Server Component `src/app/error/layout.tsx` que renderiza `children` y exporta metadata `noindex`. `src/app/error.tsx` permanece como Client Component.

**Justificación:** Next.js no permite exportar `metadata` desde un Client Component. El layout Server Component más cercano a la ruta `error` es la forma idiomática de proveer metadata sin alterar la lógica del boundary.

---

## Component Structure

### Archivos nuevos

| Archivo | Propósito |
|---------|-----------|
| `netlify.toml` | Build command `pnpm build` y plugin `@netlify/plugin-nextjs`. |
| `.env.example` | Documentación de `NEXT_PUBLIC_SITE_URL` y variables existentes. |
| `src/lib/seo/constants.ts` | Constantes compartidas de SEO. |
| `src/lib/seo/metadata.ts` | Helpers `createPageMetadata` y `createNoIndexMetadata`. |
| `src/app/error/layout.tsx` | Layout Server Component para la página de error global. |
| `public/favicon.ico` | Logo YPF copiado como favicon. |
| `public/apple-icon.png` | (Opcional) Icono Apple 180×180. |

### Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `next.config.ts` | Agregar `async rewrites()` con `{ source: '/menu', destination: '/full' }`. |
| `.env.local` | Agregar `NEXT_PUBLIC_SITE_URL=https://ypfelpuente.com.ar`. |
| `src/app/layout.tsx` | Agregar `metadataBase: new URL(CANONICAL_DOMAIN)`. |
| `src/app/(public)/page.tsx` | Exportar metadata propia con title, description, keywords, canonical y OG. |
| `src/app/(public)/combustibles/page.tsx` | Mantener title/description; agregar canonical y OG. |
| `src/app/(full)/layout.tsx` | Mantener title/description; agregar canonical y OG. |
| `src/app/(full)/full/menu/page.tsx` | Tipar metadata como `Metadata`; agregar canonical y OG. |
| `src/app/sitemap.ts` | Usar `CANONICAL_DOMAIN`; incluir `/`, `/full`, `/combustibles`, `/full/menu`. |
| `src/app/robots.ts` | Usar `CANONICAL_DOMAIN` para la URL del sitemap. |
| `src/app/not-found.tsx` | Exportar metadata `noindex` con título y descripción. |

### Archivos eliminados

| Archivo | Razón |
|---------|-------|
| `vercel.json` | Migración a Netlify finalizada. |
| `src/app/(full)/full/layout.tsx` | Solo repetía metadata de `src/app/(full)/layout.tsx`. |

---

## Shared Constants Strategy

Las constantes SEO viven en `src/lib/seo/constants.ts`:

- `CANONICAL_DOMAIN`: usado por `metadataBase`, `sitemap.ts`, `robots.ts`.
- `SITE_NAME`: usado en `openGraph.siteName` y en títulos por defecto.
- `DEFAULT_LOCALE`: usado en `openGraph.locale` (`es_AR`).
- `OG_TYPE`: usado en `openGraph.type` (`website`).

**No se agregan** constantes para keywords de landing al archivo compartido; esas keywords son específicas de la página y viven inline en `src/app/(public)/page.tsx`.

---

## Verification Strategy

### Comandos base

```bash
pnpm lint
pnpm build
```

Después del build, para verificar HTML renderizado:

```bash
pnpm start &
# esperar a que levante en :3000
curl -s http://localhost:3000 | grep -iE '<title|<meta|<link rel="canonical"'
```

### Checklist por requirement

| Req | Verificación manual / curl | Qué debe aparecer |
|-----|---------------------------|-------------------|
| R1 | `curl -I http://localhost:3000/menu` | `HTTP/1.1 200 OK` (no 308) y body de `/full`. `netlify.toml` presente; `vercel.json` ausente. |
| R2 | `curl -s http://localhost:3000/ | grep canonical` | `https://ypfelpuente.com.ar/` (absoluto). |
| R3 | `curl -s http://localhost:3000/ | grep -iE 'og:|title|description|canonical'` | Título landing, description, keywords, canonical `/`, OG text-only con `locale: es_AR`, `type: website`, `siteName: YPF El Puente`. |
| R4 | `curl -s http://localhost:3000/combustibles | grep -iE 'og:|title|canonical'` | Mantiene título actual; canonical `/combustibles`; OG text-only. |
| R5 | `curl -s http://localhost:3000/full | grep -iE 'og:|title|canonical'` | Mantiene título actual; canonical `/full`; OG text-only. |
| R6 | `curl -s http://localhost:3000/full/menu | grep -iE 'og:|title|canonical'` | Metadata tipada; canonical `/full/menu`; OG text-only. |
| R7 | `pnpm build` | Pasa sin `src/app/(full)/full/layout.tsx`; `/full` y `/full/menu` renderizan. |
| R8 | `curl -s http://localhost:3000/sitemap.xml` | Contiene URLs absolutas para `/`, `/full`, `/combustibles`, `/full/menu`; NO contiene `/boxes`. |
| R9 | `curl -s http://localhost:3000/robots.txt` | `Sitemap: https://ypfelpuente.com.ar/sitemap.xml`; `Allow: /`, `/full`; `Disallow: /admin/`, `/api/`. |
| R10 | `curl -I http://localhost:3000/favicon.ico` | `HTTP/1.1 200 OK` y content-type de imagen. |
| R11 | `curl -s http://localhost:3000/ruta-inexistente | grep -iE 'noindex|title'` | Título `Página no encontrada — YPF El Puente`; meta robots `noindex`. |
| R12 | Forzar error temporal en una página o inspeccionar código | `src/app/error/layout.tsx` exporta metadata con `robots: { index: false }`; `error.tsx` sigue siendo Client Component. |

### Checklist post-build manual

- [ ] `pnpm lint` sin errores.
- [ ] `pnpm build` sin errores de metadata.
- [ ] Ningún `<meta property="og:image"` en el HTML de las rutas públicas.
- [ ] Canonical de cada ruta es absoluta y comienza con `https://ypfelpuente.com.ar`.
- [ ] `/boxes` devuelve redirect a `/#boxes` y no aparece en sitemap.
- [ ] El favicon se ve en la pestaña del navegador (modo claro y oscuro).

---

## Safety & Rollback

### Cambios seguros (bajo riesgo de UI)

- `.env.local` y `.env.example`
- `netlify.toml`
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/app/not-found.tsx` (agregar metadata no altera UI)
- `src/app/error/layout.tsx` (nuevo archivo)
- `public/favicon.ico` y `public/apple-icon.png`

### Cambios que requieren testing extra

- **`next.config.ts` rewrites:** probar `/menu` en `pnpm dev` y `next start`.
- **Eliminar `src/app/(full)/full/layout.tsx`:** confirmar que no hay imports ni side effects ocultos.
- **Metadata en `src/app/(full)/layout.tsx`:** confirmar que `/full` y `/full/menu` heredan/overridean correctamente.

### Rollback

- Si un requirement falla en review, revertir su commit de trabajo (work-unit commits recomendados).
- Si R7 rompe la UI, restaurar `src/app/(full)/full/layout.tsx` desde git.
- Si el dominio no resuelve, el fallback hardcodeado mantiene local y build funcionando; el problema se manifiesta solo en producción con DNS.

---

## Risks & Mitigations

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Dominio `ypfelpuente.com.ar` no comprado/resuelve | Alta (estado actual) | Medio | Fallback hardcodeado en `CANONICAL_DOMAIN`; validación local con `pnpm build` + `next start`. |
| Paths con espacios en `public/assets/ypf imagenes/` | Media | Bajo | No referenciar directamente; copiar el logo a `public/favicon.ico` con nombre limpio. |
| `(full)/full/layout.tsx` tiene lógica oculta | Baja | Alto | Verificar imports con `rg` antes de eliminar; correr `pnpm build` tras la eliminación. |
| `error.tsx` Client Component no hereda metadata del nuevo layout | Baja | Medio | Ubicar `src/app/error/layout.tsx` en la jerarquía correcta; verificar en build. |
| Netlify build falla por lockfile/node | Baja | Medio | `netlify.toml` mínimo con `pnpm build`; monitorear primer deploy. |
| Confusión entre rewrite y redirect para `/menu` | Media | Medio | Usar `rewrites` (status 200), no `redirects`; probar con `curl -I`. |
| `metadataBase` ausente hace que canonicals sean relativas | Baja | Alto | R2 es prerequisito estricto; verificar canonical absoluto con curl. |

---

## Notes for Implementer

### R1 snippet — `next.config.ts`

```typescript
async rewrites() {
  return [
    { source: '/menu', destination: '/full' },
  ]
}
```

### R2 snippet — `src/app/layout.tsx`

```typescript
import { CANONICAL_DOMAIN } from '@/lib/seo/constants'

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_DOMAIN),
  // ... existing fields
}
```

### R3 snippet — `src/app/(public)/page.tsx`

```typescript
import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = createPageMetadata({
  title: 'YPF El Puente — Río Colorado',
  description:
    'Menú digital FULL, combustibles y boxes. YPF El Puente en Río Colorado, Patagonia.',
  keywords: [
    'YPF',
    'El Puente',
    'Río Colorado',
    'combustibles',
    'menú FULL',
    'boxes',
    'Patagonia',
  ],
  canonical: '/',
})
```

### R10 — elección de logo

Auditar visualmente `public/assets/ypf imagenes/logo-modooscuro.png` y `logo-modoclaro.png`. Elegir el que tenga mayor contraste y proporción cercana a cuadrada. Convertir/copiar a:

- `public/favicon.ico` (tamaño típico 32×32 o multi-resolución)
- `public/apple-icon.png` (180×180, opcional)

Si el logo no es cuadrado, recortar o agregar padding para evitar deformación en la pestaña del navegador.

---

## Status

- **phase**: design
- **change_id**: seo-slice-1
- **proposal**: approved
- **spec**: approved
- **design**: ready for review

## Artifacts

- `openspec/changes/proposals/seo-slice-1/proposal.md` (input)
- `openspec/changes/seo-slice-1/specs/seo-slice-1/spec.md` (input)
- `openspec/changes/seo-slice-1/designs/seo-slice-1/design.md` (este archivo)

## Next Recommended

1. Revisión del design por el orchestrator / tech lead.
2. Generar tasks (`sdd-tasks`) para cada requirement o grupo paralelo.
3. Ejecutar implementación siguiendo el orden de ejecución definido.

## Risks

- R7 (eliminación de layout) es el punto de no retorno: requiere verificación previa de imports.
- El dominio aún no existe; todo el SEO se valida localmente hasta el deploy en Netlify.
- `public/favicon.ico` sigue la decisión del spec aprobado aunque Next.js 16 documenta preferir `src/app/favicon.ico`; el acceptance criteria se satisface con la existencia del archivo estático.
