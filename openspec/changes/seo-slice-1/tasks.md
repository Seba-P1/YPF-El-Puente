# Tasks: SEO Slice 1 — Fundamentos + Migración a Netlify

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | +151 / -33 (184 total) |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Commit Groups (work-unit)

| Group | Tasks | Commit message |
|-------|-------|----------------|
| 1 | T1 + T2 | `chore(seo): add SEO constants, helpers, and env documentation` |
| 2 | T3 | `feat(seo): migrate hosting from Vercel to Netlify with rewrites` |
| 3 | T4 + T5 | `refactor(seo): add metadataBase and remove duplicate layout` |
| 4 | T6 + T7 + T8 + T9 | `feat(seo): add canonical URLs and OpenGraph to all public pages` |
| 5 | T10 + T11 | `feat(seo): update sitemap and robots for canonical domain` |
| 6 | T12 + T13 | `feat(seo): add favicon and noindex metadata for error pages` |

## Phase 1: Foundation

- [ ] 1.1 **T1 — Environment variables + .env.example** (R1)
  - MODIFY `.env.local` — add `NEXT_PUBLIC_SITE_URL=https://ypfelpuente.com.ar`
  - CREATE `.env.example` — document all env vars (SUPABASE_URL, SUPABASE_ANON_KEY, SERVICE_ROLE_KEY, WHATSAPP_NUMBER, SITE_NAME, SITE_URL)
  - Est: +16 / -0
  - Verify: `grep NEXT_PUBLIC_SITE_URL .env.local .env.example`
  - Rollback: `git checkout -- .env.local && rm .env.example`

- [ ] 1.2 **T2 — SEO constants + metadata helpers** (R2 foundation)
  - CREATE `src/lib/seo/constants.ts` — `CANONICAL_DOMAIN`, `SITE_NAME`, `DEFAULT_LOCALE`, `OG_TYPE`
  - CREATE `src/lib/seo/metadata.ts` — `createPageMetadata()`, `createNoIndexMetadata()`
  - Est: +45 / -0
  - Verify: `pnpm build` passes with new files
  - Rollback: `rm -rf src/lib/seo/`

## Phase 2: Hosting Migration

- [ ] 2.1 **T3 — Hosting migration Vercel → Netlify** (R1)
  - MODIFY `next.config.ts` — add `async rewrites()` with `{ source: '/menu', destination: '/full' }`
  - CREATE `netlify.toml` — `[build] command = "pnpm build"` + `[[plugins]] package = "@netlify/plugin-nextjs"`
  - DELETE `vercel.json`
  - Est: +13 / -8
  - Verify: `pnpm dev` → `curl -I http://localhost:3000/menu` returns 200; `test -f netlify.toml && ! test -f vercel.json`
  - Rollback: `git checkout -- next.config.ts vercel.json && rm netlify.toml`

## Phase 3: Root Metadata + Cleanup

- [ ] 3.1 **T4 — metadataBase in root layout** (R2)
  - MODIFY `src/app/layout.tsx` — import `CANONICAL_DOMAIN`, add `metadataBase: new URL(CANONICAL_DOMAIN)` to metadata
  - Est: +3 / -0
  - Verify: `pnpm build` passes; root layout exports metadataBase
  - Rollback: `git checkout -- src/app/layout.tsx`

- [ ] 3.2 **T5 — Remove duplicate layout** (R7)
  - DELETE `src/app/(full)/full/layout.tsx` — only wraps children + repeats metadata from parent
  - Est: +0 / -14
  - Verify: `! test -f "src/app/(full)/full/layout.tsx"` && `pnpm build` passes && `/full` + `/full/menu` still render
  - Rollback: `git checkout -- "src/app/(full)/full/layout.tsx"`

## Phase 4: Page Metadata (parallel)

- [ ] 4.1 **T6 — Landing metadata + canonical** (R3)
  - MODIFY `src/app/(public)/page.tsx` — add `import type { Metadata }` + `import { createPageMetadata }` + export metadata with title, description, keywords, canonical `/`, OG text-only
  - Est: +20 / -0
  - Verify: `curl -s http://localhost:3000/ | grep -iE 'canonical|og:|description'`
  - Rollback: `git checkout -- "src/app/(public)/page.tsx"`

- [ ] 4.2 **T7 — Combustibles metadata + canonical** (R4)
  - MODIFY `src/app/(public)/combustibles/page.tsx` — keep existing title/description, add `alternates.canonical: '/combustibles'` + text-only `openGraph`
  - Est: +8 / -0
  - Verify: `curl -s http://localhost:3000/combustibles | grep -iE 'canonical|og:'`
  - Rollback: `git checkout -- "src/app/(public)/combustibles/page.tsx"`

- [ ] 4.3 **T8 — /full layout metadata + canonical** (R5)
  - MODIFY `src/app/(full)/layout.tsx` — keep existing title/description, add `alternates.canonical: '/full'` + text-only `openGraph`
  - Est: +8 / -0
  - Verify: `curl -s http://localhost:3000/full | grep -iE 'canonical|og:'`
  - Rollback: `git checkout -- "src/app/(full)/layout.tsx"`

- [ ] 4.4 **T9 — /full/menu metadata + canonical** (R6)
  - MODIFY `src/app/(full)/full/menu/page.tsx` — type metadata as `Metadata`, keep title/description, add `alternates.canonical: '/full/menu'` + text-only `openGraph`
  - Est: +10 / -0
  - Verify: `curl -s http://localhost:3000/full/menu | grep -iE 'canonical|og:'`
  - Rollback: `git checkout -- "src/app/(full)/full/menu/page.tsx"`

## Phase 5: Sitemap + Robots (parallel)

- [ ] 5.1 **T10 — Sitemap updated** (R8)
  - MODIFY `src/app/sitemap.ts` — use `CANONICAL_DOMAIN` from constants; entries: `/` (daily, 1.0), `/full` (weekly, 0.9), `/combustibles` (weekly, 0.7), `/full/menu` (daily, 0.8); NO `/boxes`
  - Est: +15 / -8
  - Verify: `curl -s http://localhost:3000/sitemap.xml` contains `ypfelpuente.com.ar` URLs for all 4 routes; no `/boxes`
  - Rollback: `git checkout -- src/app/sitemap.ts`

- [ ] 5.2 **T11 — Robots.ts updated** (R9)
  - MODIFY `src/app/robots.ts` — use `CANONICAL_DOMAIN` for sitemap URL (`https://ypfelpuente.com.ar/sitemap.xml`); keep allow/disallow rules
  - Est: +5 / -3
  - Verify: `curl -s http://localhost:3000/robots.txt` shows `Sitemap: https://ypfelpuente.com.ar/sitemap.xml`
  - Rollback: `git checkout -- src/app/robots.ts`

## Phase 6: Static Assets + Error Metadata (parallel)

- [ ] 6.1 **T12 — Static favicon** (R10)
  - COPY most square-ish logo from `public/assets/ypf imagenes/` → `public/favicon.ico`
  - Optional: COPY → `public/apple-icon.png` (180×180)
  - Est: +0 / -0 (binary files)
  - Verify: `curl -I http://localhost:3000/favicon.ico` returns 200 with image content-type
  - Rollback: `rm public/favicon.ico public/apple-icon.png`

- [ ] 6.2 **T13 — not-found metadata** (R11)
  - MODIFY `src/app/not-found.tsx` — add `import type { Metadata }` + export metadata with title `'Página no encontrada — YPF El Puente'`, description, `robots: { index: false }`
  - Est: +8 / -0
  - Verify: `curl -s http://localhost:3000/nonexistent | grep -iE 'noindex|no encontrada'`
  - Rollback: `git checkout -- src/app/not-found.tsx`

## Execution Order

```
T1 → T2 → T3 → T4 → T5 → T6/T7/T8/T9 (parallel) → T10/T11 (parallel) → T12/T13 (parallel)
```

Dependency DAG (acyclic):

```
T1 ──→ T2 ──→ T4 ──→ T5 ──→ T8, T9
 │       │       │
 │       ├──→ T10, T11
 │       └──→ T13
 ├──→ T3
 └──→ T6, T7 (via T2+T4)

T12 (no dependencies — can run anytime)
```

## Summary

- Total tasks: 13
- Total estimated lines: +151 / -33 (184 changed)
- Total commits: 6 (work-unit groups)
- PRs: 1
- 400-line budget risk: Low
- Chained PRs recommended: No
- Decision needed before apply: No
