# Archive Report: SEO Slice 2 — Contenido Avanzado

## Change Summary
- **Change ID**: seo-slice-2
- **Title**: SEO Slice 2 — Contenido Avanzado
- **Status**: ARCHIVED
- **Date**: 2026-07-15

## What Was Done

9 requirements implementados que enriquecen el contenido indexable y la semántica del sitio:

| Req | Description | Status |
|-----|-------------|--------|
| R14 | LocalBusiness (Restaurant) JSON-LD en landing con datos cerrados del negocio | ✅ |
| R15 | Menu JSON-LD dinámico en `/full` desde productos curados, filtra precio 0, 4 secciones activas | ✅ |
| R16 | Imagen OG 1200×630 generada dinámicamente vía `ImageResponse` en `/opengraph-image` | ✅ |
| R17 | Metadata OG con imagen en 4 páginas públicas (landing, `/combustibles`, `/full`, `/full/menu`) | ✅ |
| R18 | `<h1>` semántico "Menú FULL — YPF El Puente" agregado al hero de `/full` (sr-only) | ✅ |
| R19 | Jerarquía de headings corregida: saltos `h1→h3` eliminados en `/full/menu` y `/combustibles` vía `<h2>` sr-only intermedio | ✅ |
| R20 | Alt text descriptivo en Instagram: de "Publicación de Instagram" a "QR Instagram @YPF.ELPUENTE" | ✅ |
| R21 | Hero de `/full` migrado de `<img>` nativo a `next/image` con art-direction mobile/desktop (`getImageProps` + `<picture>`) | ✅ |
| R22 | Preload hint (`preload={true}`) aplicado solo al fallback del hero above-the-fold en landing | ✅ |

## Artifacts

- **Proposal**: `openspec/changes/seo-slice-2/proposal.md`
- **Spec**: `openspec/changes/seo-slice-2/specs/seo-slice-2/spec.md`
- **Design**: `openspec/changes/seo-slice-2/designs/seo-slice-2/design.md`
- **Tasks**: `openspec/changes/seo-slice-2/tasks.md` (12/12 ✅)
- **Verify**: `openspec/changes/seo-slice-2/verify-report.md` (PASS — 9/9 requirements)
- **Archive**: `openspec/changes/seo-slice-2/archive-report.md` (este archivo)

### Base specs actualizadas

- `openspec/specs/public-pages/spec.md` — SM-1 actualizado para incluir OG image; nuevas capabilities: `structured-data-local-business` (SD-1–SD-3), `structured-data-menu` (SD-4–SD-6), `heading-structure` (HS-1–HS-4), `instagram-alt-text` (IA-1)
- `openspec/specs/infrastructure/spec.md` — constraints de OG y favicon actualizadas; removidos non-goals ya completados; nuevas capabilities: `og-image-generation` (OG-1–OG-5), `image-optimization` (IO-1–IO-4)

## Commits

| Hash | Message |
|------|---------|
| `1a515dc` | feat(seo): add OpenGraph image generation (T1+T2+T3) |
| `66fd6ba` | feat(seo): add LocalBusiness structured data (T4+T5) |
| `859a8c1` | feat(seo): add Menu structured data (T6+T7) |
| `f67effb` | fix(seo): improve heading hierarchy across public pages (T8+T9) |
| `c8f9528` | fix(seo): improve image accessibility and performance (T10+T11+T12) |

## Files Changed

### Created
- `src/app/opengraph-image.tsx` — generación dinámica de OG image 1200×630 vía `ImageResponse`
- `public/assets/og-image.png` — fallback estático OG image (3 KB)
- `src/components/seo/LocalBusinessSchema.tsx` — Server Component con JSON-LD `Restaurant`
- `src/components/seo/MenuSchema.tsx` — Server Component con JSON-LD `Menu` dinámico

### Modified
- `src/lib/seo/metadata.ts` — extendido `PageMetaInput` con `image?: string` e inyección de `openGraph.images`
- `src/app/(public)/page.tsx` — renderiza `<LocalBusinessSchema />`; pasa `image` a metadata
- `src/app/(public)/combustibles/page.tsx` — + `openGraph.images` + `<h2>` sr-only
- `src/app/(full)/layout.tsx` — + `openGraph.images`
- `src/app/(full)/full/page.tsx` — renderiza `<MenuSchema sections={...} />` con datos de productos
- `src/app/(full)/full/FullClient.tsx` — + `<h1>` sr-only en hero + migración a `next/image` con art-direction
- `src/app/(full)/full/menu/page.tsx` — + `openGraph.images` + `<h2>` sr-only en `MenuClient.tsx`
- `src/components/public/FullInstagramSection.tsx` — alt text descriptivo
- `src/components/public/LandingHero.tsx` — fallback image migrado a `next/image` con `preload={true}`

## Verification Results

| Check | Result |
|-------|--------|
| `pnpm build` | ✅ PASS |
| Runtime curl (9/9 requirements) | ✅ PASS |
| OG image route (`/opengraph-image`) | ✅ HTTP 200, `content-type: image/png` |
| JSON-LD Restaurant | ✅ `@type:"Restaurant"` con todos los campos requeridos |
| JSON-LD Menu | ✅ `@type:"Menu"`, 4 secciones, `offers.price` en ARS |
| OG meta tags | ✅ Presentes en las 4 páginas públicas con URL absoluta |
| Heading hierarchy | ✅ `h1→h2→h3` sin saltos en `/full/menu` y `/combustibles` |
| Alt text Instagram | ✅ "QR Instagram @YPF.ELPUENTE" |
| Hero `next/image` | ✅ `<picture>` con art-direction mobile/desktop |
| Preload landing | ✅ `<link rel="preload" as="script">` + font preloads |

**Warning (no bloqueante):** `/full/menu` tiene solo `h1→h2` sin `h3`. Jerarquía válida pero menos granular. El contenido de la página no requiere `h3`.

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| **AD-1**: JSON-LD como Server Components en `src/components/seo/` | Encapsula serialización y TODO markers; evita ensuciar Server Components de página; testeable |
| **AD-2**: OG image en `src/app/opengraph-image.tsx` (raíz del App Router) | Next.js 16 convención; descubrimiento automático en todas las rutas públicas |
| **AD-3**: `createPageMetadata` extendido con `image?: string` opcional | Mantiene un solo helper; las páginas declaran `openGraph.images` explícitamente para verificación determinista |
| **AD-4**: `<h1>` en `/full` integrado visualmente (no `sr-only`) | Decisión cerrada diferente al spec base que permitía sr-only; el `<h1>` actúa como subtítulo semántico bajo el logo RDP7 |
| **AD-5**: `<h2>` insertados en wrappers de página, no en `CombustiblesGrid` | Evita regresiones en landing donde el mismo grid se reutiliza |
| **AD-6**: `getImageProps` + `<picture>` para art-direction | API canónica de Next.js 16 para art-direction sin perder optimización |
| **AD-7**: `preload={true}` (no `priority`) en `next/image` | Next.js 16 deprecó `priority` en favor de `preload` |

## TODOs para el cliente (datos pendientes)

- `openingHoursSpecification` — horarios de atención (para LocalBusiness schema)
- `geo` — coordenadas GPS (para LocalBusiness schema)
- Descripción larga del negocio (para schema y About page)
- Confirmar que los productos del menú con `precio > 0` y `disponible = true` son todos los que deben aparecer en el Menu schema

## Out of Scope (posible Slice 3)

- Breadcrumbs schema en todas las páginas públicas
- FAQ / HowTo schemas para secciones de combustibles o boxes
- Lazy loading refinado y `sizes` auditados en todas las imágenes
- Integración con Google Search Console y Business Profile
- Reviews / rating schema si el cliente habilita reseñas
- Optimización de Core Web Vitals con métricas reales
- OpenGraph metadata para `error.tsx` (R12 del Slice 1)

## Next Steps

1. **Abrir PR** con los 5 work-unit commits hacia `main`
2. Validar en deploy de Netlify que `/opengraph-image` retorna 200 y los meta tags OG se resuelven correctamente
3. Ejecutar [Google Rich Results Test](https://search.google.com/test/rich-results) en producción para validar schemas
4. Planificar **Slice 3** con breadcrumbs, FAQ/HowTo schemas, y optimización de performance

## Risks / Issues

- **Dominio `ypfelpuente.com.ar`** no está comprado ni configurado en DNS. Todo el SEO se validó localmente. El deploy en Netlify sin dominio real servirá contenido correcto pero no será indexable.
- **`preload={true}` en Client Component** (`LandingHero.tsx`): la inyección del `<link rel="preload">` ocurre en el cliente, no server-side. Si se requiere SSR, inyectar manualmente.
- **OG image fallback**: si `ImageResponse` falla en producción (fuentes/memoria), cambiar paths de `/opengraph-image` a `/assets/og-image.png` en las 4 páginas.

## Relación con Slice 1

Slice 1 estableció los fundamentos de SEO: hosting en Netlify, dominio canónico, metadata base, sitemap, robots, favicon. Slice 2 construye sobre esa base agregando:

| Aspecto | Slice 1 | Slice 2 |
|---------|---------|---------|
| Metadata | Text-only OG, sin imágenes | OG con imagen 1200×630 generada |
| Structured data | No existía | Restaurant + Menu JSON-LD |
| Headings | Solo metadata | Semántica h1→h2→h3 corregida |
| Imágenes | `<img>` nativo, alt genérico | `next/image`, alt descriptivo |
| Performance hints | No existían | `preload` en hero above-the-fold |
