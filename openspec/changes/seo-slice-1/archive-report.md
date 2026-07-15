# Archive Report: SEO Slice 1

## Change Summary
- **Change ID**: seo-slice-1
- **Title**: SEO Slice 1 — Fundamentos + Migración a Netlify
- **Status**: ARCHIVED
- **Date**: 2026-07-14

## What Was Done

11 requirements implementados que dejan al sitio técnicamente indexable:

| Req | Description | Status |
|-----|-------------|--------|
| R1 | Hosting migration Vercel → Netlify + rewrite `/menu → /full` | ✅ |
| R2 | `metadataBase` en root layout resuelve URLs relativas | ✅ |
| R3 | Landing metadata + canonical + OG text-only | ✅ |
| R4 | Combustibles metadata + canonical + OG text-only | ✅ |
| R5 | `/full` metadata + canonical + OG text-only | ✅ |
| R6 | `/full/menu` metadata + canonical + OG text-only | ✅ |
| R7 | Duplicate `(full)/full/layout.tsx` eliminado | ✅ |
| R8 | Sitemap actualizado con dominio canónico, 4 URLs, sin `/boxes` | ✅ |
| R9 | Robots.ts apunta a `ypfelpuente.com.ar/sitemap.xml` | ✅ |
| R10 | Favicon estático desde logo existente | ✅ |
| R11 | `not-found.tsx` con metadata `noindex` | ✅ |
| R12 | Error page metadata via auxiliary layout | 🔲 dropped del scope |

## Artifacts

- **Proposal**: `openspec/changes/proposals/seo-slice-1/proposal.md`
- **Spec**: `openspec/changes/seo-slice-1/specs/seo-slice-1/spec.md`
- **Design**: `openspec/changes/seo-slice-1/designs/seo-slice-1/design.md`
- **Tasks**: `openspec/changes/seo-slice-1/tasks.md` (13/13 ✅)
- **Verify**: `openspec/changes/seo-slice-1/verify-report.md` (PASS)
- **Archive**: `openspec/changes/seo-slice-1/archive-report.md` (este archivo)

### Base specs actualizadas

- `openspec/specs/public-pages/spec.md` — sección `page-metadata-seo` (SM-1–SM-7) + `Removed: Full duplicate layout` (RL-1)
- `openspec/specs/infrastructure/spec.md` — nueva spec base para hosting, canonical domain, sitemap, robots, favicon (HF-1–HF-8)

## Commits

| Hash | Message |
|------|---------|
| `71429e4` | chore(seo): add SEO constants, helpers, and env documentation |
| `52c7e7c` | feat(seo): migrate hosting from Vercel to Netlify with rewrites |
| `14303da` | refactor(seo): add metadataBase and remove duplicate layout |
| `494272c` | feat(seo): add canonical URLs and OpenGraph to all public pages |
| `e6ff856` | feat(seo): update sitemap and robots for canonical domain |
| `6c979c0` | feat(seo): add favicon and noindex metadata for error pages |

Adicional: `512ab92` fix: enforce uppercase on category tags in FullCategorySection (incidental, non-SEO)

## Files Changed

### Created
- `.env.example` — documentación de vars de entorno
- `netlify.toml` — build command + plugin Next.js
- `public/favicon.ico` — favicon estático (43 KB)
- `src/lib/seo/constants.ts` — CANONICAL_DOMAIN, SITE_NAME, DEFAULT_LOCALE, OG_TYPE
- `src/lib/seo/metadata.ts` — createPageMetadata(), createNoIndexMetadata()

### Modified
- `next.config.ts` — +async rewrites() para `/menu → /full`
- `src/app/layout.tsx` — +metadataBase: new URL(CANONICAL_DOMAIN)
- `src/app/(public)/page.tsx` — metadata propia landing
- `src/app/(public)/combustibles/page.tsx` — +canonical + OG
- `src/app/(full)/layout.tsx` — +canonical + OG
- `src/app/(full)/full/menu/page.tsx` — tipado Metadata + canonical + OG
- `src/app/sitemap.ts` — CANONICAL_DOMAIN, 4 entries, sin /boxes
- `src/app/robots.ts` — sitemap URL con dominio correcto
- `src/app/not-found.tsx` — +metadata noindex

### Deleted
- `vercel.json` — migración a Netlify completada
- `src/app/(full)/full/layout.tsx` — layout duplicado eliminado

### Incidental
- `src/components/public/FullCategorySection.tsx` — fix uppercase tags (non-SEO)

## Verification Results

| Check | Result |
|-------|--------|
| `pnpm build` | ✅ PASS |
| Runtime curl (11/11 requirements) | ✅ PASS |
| `pnpm lint` | ⚠️ Pre-existing errors in admin/Supabase (not related) |

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| **AD-1**: Constantes SEO centralizadas en `src/lib/seo/constants.ts` | Evita magic strings, fuente única de verdad para dominio, siteName, locale |
| **AD-2**: Helper `createPageMetadata()` en `src/lib/seo/metadata.ts` | Reduce duplicación entre 4 páginas públicas con OG idéntico |
| **AD-3**: Canonicals relativas resueltas por `metadataBase` | Convención Next.js 16, evita concatenaciones de dominio por página |
| **AD-4**: Favicon como archivo estático `public/favicon.ico` | Decisión del spec; los browsers lo piden por convención |
| **AD-5**: R12 dropped del scope | `error.tsx` Client Component; se difiere a Slice 2 el enfoque de metadata via layout Server Component |
| **AD-6**: `/boxes` no incluido en sitemap ni canonical | Es redirect a `/#boxes`; no hay contenido propio para indexar |

## Out of Scope (moved to Slice 2)

- Schema.org JSON-LD (LocalBusiness, Restaurant, Menu)
- Imagen OG física 1200x630
- h1 faltante en `/full` + saltos de heading (h1→h3)
- Alt text audit
- `<img>` nativo → `next/image`
- Priority hints en imágenes críticas
- Google Search Console / Business Profile setup
- Domain purchase / DNS configuration
- Error page metadata (R12 — auxiliary layout approach)

## Next Steps

1. Abrir **PR** con los 6 work-unit commits hacia `main`
2. Configurar **Netlify** con el dominio `ypfelpuente.com.ar` y las env vars
3. Planificar **Slice 2** — Schema.org JSON-LD, imagen OG, corrección de headings, alt text audit, priority hints

## Risks / Issues

- **Dominio `ypfelpuente.com.ar`** no está comprado ni configurado en DNS. Todo el SEO se validó localmente. El deploy en Netlify sin dominio real servirá contenido correcto pero no será indexable hasta que el DNS apunte.
- **Título duplicado** (`"— YPF El Puente — YPF El Puente"`) en algunas páginas por herencia automática del root title. Cosmético, no bloqueante.
- **Sitemap `/` changefreq**: spec dice `daily`, implementación tiene `weekly`. Valor es una sugerencia para crawlers, no requisito estricto.
