# Delta Spec: SEO Slice 1 — Fundamentos + Migración a Netlify

## Overview

Hace al sitio técnicamente indexable: migra hosting a Netlify, fija dominio canónico `https://ypfelpuente.com.ar`, agrega `metadataBase`, canonicals y OpenGraph por página pública, actualiza sitemap/robots, elimina metadata duplicada y agrega favicon y metadata de error.

---

## ADDED Requirements

### R1 — Hosting migration (Vercel → Netlify)

The system MUST route `/menu` to `/full` via Next.js rewrites and build on Netlify with pnpm.

**Files affected:** `next.config.ts`, `netlify.toml` (new), `vercel.json` (delete), `.env.local`, `.env.example` (new)

**Scenarios:**
- GIVEN a request to `/menu`; WHEN rewrites execute; THEN `/full` is served with HTTP 200.
- GIVEN `netlify.toml` exists; WHEN Netlify builds; THEN it runs `pnpm build` via `@netlify/plugin-nextjs`.

**Acceptance criteria:**
- [ ] `async rewrites()` returns `{ source: '/menu', destination: '/full' }`.
- [ ] `netlify.toml` has `[build] command = "pnpm build"` and `[[plugins]] package = "@netlify/plugin-nextjs"`.
- [ ] `vercel.json` is removed; `.env.local` and `.env.example` define `NEXT_PUBLIC_SITE_URL=https://ypfelpuente.com.ar`.

### R10 — Static favicon from existing YPF logo

The system MUST expose a favicon copied from the existing YPF El Puente logo.

**Files affected:** `public/assets/ypf imagenes/logo-modooscuro.png` or `logo-modoclaro.png` (source); `public/favicon.ico` or `public/icon.png` (new); optional `public/apple-icon.png` (new)

**Scenario:**
- GIVEN a browser requests `/favicon.ico` or `/icon.png`; WHEN the static file is served; THEN the YPF El Puente logo is returned.

**Acceptance criteria:**
- [ ] Most suitable square-ish logo is identified in `public/assets/ypf imagenes/` and copied to `public/favicon.ico` or `public/icon.png`.
- [ ] No `ImageResponse` or `src/app/icon.tsx` is used; optional `public/apple-icon.png` (180×180) is created.

### R12 — Error page metadata via auxiliary layout

The system MUST serve `noindex` metadata for the global error page while keeping `error.tsx` as a Client Component.

**Files affected:** `src/app/error/layout.tsx` (new); `src/app/error.tsx` (untouched)

**Scenario:**
- GIVEN a runtime error triggers the global error boundary; WHEN rendered inside `src/app/error/layout.tsx`; THEN the HTML `<head>` contains `noindex` metadata.

**Acceptance criteria:**
- [ ] `src/app/error/layout.tsx` is a Server Component rendering `children` with metadata including `title: 'Error — YPF El Puente'`, description, and `robots: { index: false }`.
- [ ] `src/app/error.tsx` remains a Client Component.

---

## MODIFIED Requirements

### R2 — metadataBase in root layout

The root layout MUST resolve relative SEO URLs against the canonical domain.

**Files affected:** `src/app/layout.tsx`

**Scenario:**
- GIVEN `metadataBase` is configured; WHEN a page exports relative `alternates.canonical` or `openGraph`; THEN Next.js resolves it to `https://ypfelpuente.com.ar/...`.

**Acceptance criteria:**
- [ ] `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ypfelpuente.com.ar')` is added.

### R3 — Landing metadata + canonical

The landing page MUST expose its own title, description, keywords, canonical and OpenGraph metadata.

**Files affected:** `src/app/(public)/page.tsx`

**Scenario:**
- GIVEN a request to `/`; WHEN the page renders; THEN the HTML `<head>` contains landing-specific metadata and canonical URL.

**Acceptance criteria:**
- [ ] Exports `metadata: Metadata` with title, description, keywords (YPF, El Puente, Río Colorado, combustibles, menú FULL, boxes, Patagonia), `alternates: { canonical: '/' }`.
- [ ] `openGraph` has `{ title, description, locale: 'es_AR', type: 'website', siteName: 'YPF El Puente' }` without `images`.

### R4 — Combustibles metadata + canonical

The combustibles page MUST add canonical and OpenGraph metadata while keeping existing title and description.

**Files affected:** `src/app/(public)/combustibles/page.tsx`

**Scenario:**
- GIVEN a request to `/combustibles`; WHEN the page renders; THEN the HTML `<head>` contains canonical and OpenGraph metadata.

**Acceptance criteria:**
- [ ] Keeps existing `title` and `description`; adds `alternates: { canonical: '/combustibles' }`.
- [ ] Adds text-only `openGraph` with `locale: 'es_AR'`, `type: 'website'`, `siteName: 'YPF El Puente'`.

### R5 — /full metadata + canonical

The `/full` route group layout MUST add canonical and OpenGraph metadata while keeping existing title and description.

**Files affected:** `src/app/(full)/layout.tsx`

**Scenario:**
- GIVEN a request to `/full`; WHEN the layout renders; THEN the HTML `<head>` contains canonical and OpenGraph metadata.

**Acceptance criteria:**
- [ ] Keeps existing `title` and `description`; adds `alternates: { canonical: '/full' }`.
- [ ] Adds text-only `openGraph` with `locale: 'es_AR'`, `type: 'website'`, `siteName: 'YPF El Puente'`.

### R6 — /full/menu metadata + canonical

The full menu page MUST be typed with `Metadata` and add canonical and OpenGraph metadata.

**Files affected:** `src/app/(full)/full/menu/page.tsx`

**Scenario:**
- GIVEN a request to `/full/menu`; WHEN the page renders; THEN the HTML `<head>` contains typed metadata with canonical and OpenGraph.

**Acceptance criteria:**
- [ ] `metadata` is typed as `Metadata`; keeps existing `title` and `description`; adds `alternates: { canonical: '/full/menu' }`.
- [ ] Adds text-only `openGraph` with `locale: 'es_AR'`, `type: 'website'`, `siteName: 'YPF El Puente'`.

### R8 — Sitemap updated

The sitemap MUST use the canonical domain and list all public indexable routes except `/boxes`.

**Files affected:** `src/app/sitemap.ts`

**Scenario:**
- GIVEN `NEXT_PUBLIC_SITE_URL` is set; WHEN `sitemap.ts` runs at build time; THEN it returns entries for `/`, `/full`, `/combustibles`, `/full/menu`.

**Acceptance criteria:**
- [ ] Uses `process.env.NEXT_PUBLIC_SITE_URL || 'https://ypfelpuente.com.ar'` as base URL.
- [ ] `/` weekly, priority `1.0`; `/full` weekly, `0.9`; `/combustibles` weekly, `0.7`; `/full/menu` daily, `0.8`; `/boxes` is NOT included.

### R9 — Robots.ts updated

The robots directive MUST reference the correct domain and sitemap URL.

**Files affected:** `src/app/robots.ts`

**Scenario:**
- GIVEN `NEXT_PUBLIC_SITE_URL` is set; WHEN `robots.ts` runs at build time; THEN it points to `https://ypfelpuente.com.ar/sitemap.xml`.

**Acceptance criteria:**
- [ ] Uses `NEXT_PUBLIC_SITE_URL` (with fallback) for sitemap URL; sitemap URL is `https://ypfelpuente.com.ar/sitemap.xml`.
- [ ] Keeps `allow: ['/', '/full']` and `disallow: ['/admin/', '/api/']`.

### R11 — not-found metadata

The 404 page MUST expose `noindex` metadata with a custom title and description.

**Files affected:** `src/app/not-found.tsx`

**Scenario:**
- GIVEN a request to a non-existent route; WHEN `not-found.tsx` renders; THEN the HTML `<head>` contains noindex metadata.

**Acceptance criteria:**
- [ ] Exports metadata with `title: 'Página no encontrada — YPF El Puente'`, description, and `robots: { index: false }`.
- [ ] `not-found.tsx` remains a Server Component.

---

## REMOVED Requirements

### R7 — Remove duplicate `(full)/full/layout.tsx`

The nested layout MUST be removed because it only repeats metadata owned by `src/app/(full)/layout.tsx`.

**Files affected:** `src/app/(full)/full/layout.tsx` (delete)

**Scenario:**
- GIVEN `src/app/(full)/full/layout.tsx` is deleted; WHEN a request is made to `/full` or `/full/menu`; THEN the page renders correctly using only `src/app/(full)/layout.tsx`.

**Acceptance criteria:**
- [ ] `src/app/(full)/full/layout.tsx` no longer exists; `src/app/(full)/layout.tsx` still wraps the group; `pnpm build` passes.

---

## Non-Goals

- Schema.org JSON-LD (`LocalBusiness`, `Restaurant`, `Menu`).
- Physical OpenGraph image (`/public/assets/og-image.jpg`); no `images` field in any `openGraph` object.
- Heading audit, `alt` text audit, `<img>` → `next/image` migration, image priority/loading hints.
- Adding `pnpm test` or `pnpm typecheck` scripts.
- Google Search Console / Business Profile setup, domain purchase or DNS configuration.

---

## Technical Constraints

- **Canonical domain:** `https://ypfelpuente.com.ar` everywhere.
- **Environment variable:** `NEXT_PUBLIC_SITE_URL` drives `metadataBase`, `sitemap.ts`, `robots.ts` and fallbacks.
- **Rewrites:** Next.js native `async rewrites()` in `next.config.ts`; `netlify.toml` has no redirects.
- **metadataBase:** defined only in `src/app/layout.tsx` with static fallback.
- **OpenGraph:** text-only; `locale: 'es_AR'`, `type: 'website'`, `siteName: 'YPF El Puente'`; no `images`.
- **`/boxes`:** redirect to `/#boxes`; no canonical and no sitemap entry.
- **`error.tsx`:** stays a Client Component; metadata lives in `src/app/error/layout.tsx`.
- **Favicon:** static file from existing YPF logo in `public/assets/`; no `ImageResponse`.
- **Validation:** `pnpm build` + `pnpm lint` only.
