# Spec: Infrastructure — SEO & Hosting Foundation

## Purpose

Base spec for cross-cutting infrastructure decisions: hosting platform, canonical domain configuration, sitemap, robots, favicon, and environment defaults. These are not page-specific — they affect the entire application.

---

## ADDED Requirements

### Capability: hosting-seo-foundation

| ID | Requirement | Strength |
|----|-------------|----------|
| HF-1 | The system SHALL build and deploy on **Netlify** using `pnpm build` via `@netlify/plugin-nextjs`; `vercel.json` SHALL be removed | SHALL |
| HF-2 | `next.config.ts` SHALL define `async rewrites()` returning `{ source: '/menu', destination: '/full' }` — status 200, internal proxy, no redirect | SHALL |
| HF-3 | `.env.local` SHALL define `NEXT_PUBLIC_SITE_URL=https://ypfelpuente.com.ar`; `.env.example` SHALL document all env vars (SUPABASE_URL, SUPABASE_ANON_KEY, SERVICE_ROLE_KEY, WHATSAPP_NUMBER, SITE_NAME, SITE_URL) | SHALL |
| HF-4 | `src/app/layout.tsx` SHALL define `metadataBase: new URL(CANONICAL_DOMAIN)` to resolve relative SEO URLs against the canonical domain | SHALL |
| HF-5 | `src/app/sitemap.ts` SHALL use `CANONICAL_DOMAIN` as base URL and list 4 entries: `/` (weekly, 1.0), `/full` (weekly, 0.9), `/combustibles` (weekly, 0.7), `/full/menu` (daily, 0.8); `/boxes` SHALL NOT be included | SHALL |
| HF-6 | `src/app/robots.ts` SHALL point `Sitemap` to `https://ypfelpuente.com.ar/sitemap.xml` using `CANONICAL_DOMAIN`; keep `Allow: /`, `Allow: /full`, `Disallow: /admin/`, `Disallow: /api/` | SHALL |
| HF-7 | A static favicon SHALL exist at `public/favicon.ico` sourced from the existing YPF logo; no `ImageResponse` or `src/app/icon.tsx` | SHALL |
| HF-8 | All canonical-domain-dependent files (`sitemap.ts`, `robots.ts`, `metadataBase`) SHALL use a shared `CANONICAL_DOMAIN` constant with fallback `https://ypfelpuente.com.ar` | SHALL |

#### Scenario: HF-1 — Netlify build
- GIVEN `netlify.toml` exists with `command = "pnpm build"` and plugin `@netlify/plugin-nextjs`
- WHEN Netlify triggers a build
- THEN the site builds successfully and `vercel.json` does not exist in the repository

#### Scenario: HF-2 — Menu rewrite
- GIVEN a request to `/menu`
- WHEN Next.js rewrites execute
- THEN `/full` is served with HTTP 200 (not a redirect 3xx)

#### Scenario: HF-5 — Sitemap content
- GIVEN the sitemap is generated at build time
- WHEN fetched at `/sitemap.xml`
- THEN it SHALL contain exactly 4 `<url>` entries with `https://ypfelpuente.com.ar` prefix
- AND SHALL NOT contain `/boxes`

#### Scenario: HF-6 — Robots content
- GIVEN the robots directive is generated at build time
- WHEN fetched at `/robots.txt`
- THEN `Sitemap` SHALL be `https://ypfelpuente.com.ar/sitemap.xml`
- AND `Allow` SHALL include `/` and `/full`
- AND `Disallow` SHALL include `/admin/` and `/api/`

#### Scenario: HF-7 — Favicon served
- GIVEN a browser requests `/favicon.ico`
- WHEN the static file is served
- THEN HTTP 200 SHALL be returned with an image content-type and the YPF El Puente logo SHALL be the content

#### Scenario: HF-8 — Single source of truth
- GIVEN `CANONICAL_DOMAIN` is defined in `src/lib/seo/constants.ts`
- WHEN `sitemap.ts`, `robots.ts`, or `metadataBase` reference the canonical domain
- THEN all SHALL import from the shared constant rather than hardcoding the string

---

## Technical Constraints

- **Canonical domain:** `https://ypfelpuente.com.ar` everywhere.
- **Environment variable:** `NEXT_PUBLIC_SITE_URL` drives `metadataBase`, `sitemap.ts`, `robots.ts` with fallback.
- **Rewrites:** Next.js native `async rewrites()` in `next.config.ts`; `netlify.toml` has no redirects.
- **metadataBase:** defined only in `src/app/layout.tsx` with static fallback.
- **OpenGraph:** all public pages include `images` field pointing to the auto-generated `/opengraph-image` (1200×630 PNG).
- **OG Image Generation:** dynamic 1200×630 PNG via `ImageResponse` from `next/og` at `src/app/opengraph-image.tsx`; static fallback at `public/assets/og-image.png` if dynamic generation fails.
- **Favicon:** static file from existing YPF logo at `public/favicon.ico`.
- **Validation:** `pnpm build` + `pnpm lint` only (no test runner configured).

### Capability: og-image-generation

| ID | Requirement | Strength |
|----|-------------|----------|
| OG-1 | The system SHALL generate an OpenGraph image 1200×630 PNG at `/opengraph-image` using `ImageResponse` from `next/og`, following the Next.js 16 file convention (`src/app/opengraph-image.tsx` with exports `alt`, `size`, `contentType`) | SHALL |
| OG-2 | The OG image SHALL display brand identity: gradient background (YPF blue `#0070C0` → dark `#001428`), brand text "YPF El Puente" in YPF yellow `#FFD100`, and tagline "Río Colorado · Patagonia Argentina" | SHALL |
| OG-3 | The system SHALL provide a static 1200×630 PNG fallback at `public/assets/og-image.png` if `ImageResponse` dynamic generation is not viable | SHALL |
| OG-4 | All public pages (landing, `/combustibles`, `/full`, `/full/menu`) SHALL include `<meta property="og:image" content="https://ypfelpuente.com.ar/opengraph-image" />` with `width: 1200`, `height: 630`, `alt: "YPF El Puente — Río Colorado"` | SHALL |
| OG-5 | The `createPageMetadata` helper SHALL accept an optional `image?: string` parameter and inject `openGraph.images` when present | SHALL |

#### Scenario: OG-1 — OG image route
- GIVEN a request to `/opengraph-image`
- WHEN the route responds
- THEN HTTP 200 SHALL be returned with `content-type: image/png` and the image SHALL be 1200×630

#### Scenario: OG-4 — OG meta tags in public pages
- GIVEN a request to any public page
- WHEN the HTML `<head>` is inspected
- THEN `<meta property="og:image" content="https://ypfelpuente.com.ar/opengraph-image" />` SHALL be present

### Capability: image-optimization

| ID | Requirement | Strength |
|----|-------------|----------|
| IO-1 | The hero background in `/full` SHALL use `next/image` with `getImageProps` for art-direction: mobile source at `/assets/ypf%20imagenes/RDP7-mobile.webp` (max-width: 768px) and desktop source at `/assets/ypf%20imagenes/RDP7.webp` | SHALL |
| IO-2 | The hero background image SHALL preserve existing styling (`object-cover`, full-bleed layout) with no visual regression at 320px, 768px, and 1440px | SHALL |
| IO-3 | The landing hero above-the-fold fallback image (reduced-motion poster) SHALL use `next/image` with `preload={true}` (Next.js 16 API, replaces deprecated `priority`) | SHALL |
| IO-4 | No other image on the landing page SHALL have `preload={true}` | SHALL |

#### Scenario: IO-1 — Art-direction in /full hero
- GIVEN a request to `/full`
- WHEN the HTML is inspected
- THEN the hero SHALL be rendered via `<picture>` with `<source media="(max-width: 768px)">` for mobile WebP and `<img>` with desktop WebP srcSet

#### Scenario: IO-3 — Preload on landing hero
- GIVEN a request to `/` with `prefers-reduced-motion`
- WHEN the HTML `<head>` is inspected
- THEN `<link rel="preload" as="image"` SHALL be present for the hero poster image

## Non-Goals

- Google Search Console / Business Profile setup.
- Domain purchase or DNS configuration.
- Breadcrumbs, FAQ, or HowTo schema types (candidate for future slice).
- Lighthouse / Web Vitals performance measurement.
