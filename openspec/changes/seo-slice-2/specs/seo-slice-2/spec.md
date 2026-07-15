# Delta Spec: SEO Slice 2 — Enriquecimiento de Contenido

## Overview

Segundo slice de SEO para YPF El Puente. Agrega structured data JSON-LD (`Restaurant` y `Menu`), imagen OpenGraph 1200x630, jerarquía semántica de headings, alt text descriptivo, migración del hero de `/full` a `next/image` y preload hints en el hero above-the-fold de la landing. Construye directamente sobre los fundamentos del Slice 1.

---

## ADDED Requirements

### R14 — LocalBusinessSchema (JSON-LD `Restaurant`)

The system MUST render a `Restaurant` JSON-LD script in the landing page (`/`) with the closed business data.

**Files affected:** `src/components/seo/LocalBusinessSchema.tsx` (new); `src/app/(public)/page.tsx` (modified)

**Scenarios:**
- GIVEN a request to `/`; WHEN the landing page renders; THEN the HTML contains a `<script type="application/ld+json">` with `@type: "Restaurant"`.
- GIVEN the script is present; WHEN parsed; THEN it contains `name: "YPF El Puente"`, `telephone: "+5492920264433"`, `priceRange: "$$"`, `servesCuisine` and `sameAs` pointing to Instagram.
- GIVEN the address object; WHEN parsed; THEN it contains `streetAddress: "Ruta Nacional 22 Km 857"`, `addressLocality: "Río Colorado"`, `addressRegion: "Río Negro"`, `addressCountry: "AR"`.
- GIVEN the script is serialized; THEN it does NOT contain `openingHoursSpecification`, `geo`, `latitude` or `longitude`.

**Acceptance criteria:**
- [ ] `src/components/seo/LocalBusinessSchema.tsx` exists and exports a Server Component that renders `<script type="application/ld+json">` with `dangerouslySetInnerHTML`.
- [ ] JSON is built from an internal object (no user input) and serialized with `.replace(/</g, '\\u003c')`.
- [ ] Schema type is `Restaurant` (`https://schema.org/Restaurant`).
- [ ] Required fields: `name`, `telephone`, `address`, `priceRange`, `servesCuisine`, `sameAs`, `image`.
- [ ] `image` points to the canonical OG image URL (resolved from `CANONICAL_DOMAIN`).
- [ ] `openingHoursSpecification` and `geo` are omitted and marked with `// TODO(client): ...` comments.
- [ ] Component is rendered only inside `src/app/(public)/page.tsx`.
- [ ] `pnpm build` and `pnpm lint` pass.

---

### R15 — MenuSchema (JSON-LD `Menu`)

The system MUST render a `Menu` JSON-LD script in `/full` built from curated category sections, including only products with `precio > 0`.

**Files affected:** `src/components/seo/MenuSchema.tsx` (new); `src/app/(full)/full/page.tsx` (modified)

**Scenarios:**
- GIVEN a request to `/full`; WHEN the page renders; THEN the HTML contains a `<script type="application/ld+json">` with `@type: "Menu"`.
- GIVEN the Menu schema is built; WHEN a section has no products with `precio > 0`; THEN that section is omitted from the schema.
- GIVEN a product with `precio <= 0`; WHEN the schema is serialized; THEN that product is omitted.
- GIVEN the Menu schema includes a section; THEN it contains `name` (section) and `hasMenuSection` / `hasMenuItem` entries with `name` and `offers.price` for each product.

**Acceptance criteria:**
- [ ] `src/components/seo/MenuSchema.tsx` exists and accepts a typed prop with sections `{ name: string; products: { name: string; price: number }[] }[]`.
- [ ] It filters out products with `price <= 0` and sections that become empty after filtering.
- [ ] It renders `<script type="application/ld+json">` with `dangerouslySetInnerHTML` and `.replace(/</g, '\\u003c')`.
- [ ] It is rendered in `src/app/(full)/full/page.tsx` using category/product data fetched server-side.
- [ ] `pnpm build` and `pnpm lint` pass.

---

### R16 — OpenGraph Image 1200x630

The system MUST generate an OpenGraph image of 1200x630 using the Next.js file convention and `ImageResponse` from `next/og`, with a static PNG fallback if dynamic generation is not viable.

**Files affected:** `src/app/opengraph-image.tsx` (new); optional `public/assets/og-image.png` (fallback)

**Scenarios:**
- GIVEN `src/app/opengraph-image.tsx` exists; WHEN Next.js builds the app; THEN a route `/opengraph-image` is generated and returns a 1200x630 PNG.
- GIVEN the generated image; WHEN inspected; THEN it shows brand text "YPF El Puente" and visual identity aligned with YPF colors/logo.
- GIVEN `ImageResponse` fails to render (e.g., local font issues); THEN a static `public/assets/og-image.png` is used and metadata points to it.

**Acceptance criteria:**
- [ ] File is created at `src/app/opengraph-image.tsx` following the Next.js 16 convention.
- [ ] It exports `alt = 'YPF El Puente — Río Colorado'`.
- [ ] It exports `size = { width: 1200, height: 630 }`.
- [ ] It exports `contentType = 'image/png'`.
- [ ] Default export is an async function returning `new ImageResponse(...)` from `next/og`.
- [ ] Design includes logo/marca "YPF El Puente" and brand tagline.
- [ ] If dynamic generation is not viable, a static 1200x630 PNG is placed at `public/assets/og-image.png` and documented.
- [ ] `pnpm build` and `pnpm lint` pass.

---

## MODIFIED Requirements

### R17 — OpenGraph Metadata with Image

The system MUST expose the OG image in the metadata of every public page.

**Files affected:** `src/lib/seo/metadata.ts`, `src/app/(public)/page.tsx`, `src/app/(public)/combustibles/page.tsx`, `src/app/(full)/layout.tsx`, `src/app/(full)/full/menu/page.tsx`

**Scenarios:**
- GIVEN `src/app/opengraph-image.tsx` exists; WHEN a public page renders; THEN `<meta property="og:image" />` is present with an absolute URL.
- GIVEN `createPageMetadata` is called with `image: '/opengraph-image'`; THEN the returned metadata contains `openGraph.images` with `url`, `width: 1200`, `height: 630` and `alt`.
- GIVEN the root layout defines `metadataBase`; WHEN `openGraph.images` uses a relative path; THEN Next.js resolves it to `https://ypfelpuente.com.ar/opengraph-image`.

**Acceptance criteria:**
- [ ] `createPageMetadata` accepts an optional `image?: string` parameter.
- [ ] When `image` is provided, `openGraph.images` is set to `[{ url: image, width: 1200, height: 630, alt: 'YPF El Puente — Río Colorado' }]`.
- [ ] Landing (`/`), `/combustibles`, `/full` (via layout) and `/full/menu` pass the OG image path to their metadata helper.
- [ ] If relying on the automatic `opengraph-image.tsx` discovery, each page still explicitly declares `openGraph.images` so the spec is verifiable.
- [ ] `pnpm build` and `pnpm lint` pass; `og:image` meta is verified in the built HTML.

---

### R18 — Semantic `<h1>` in `/full` Hero

The system MUST include exactly one semantic `<h1>` in the `/full` hero.

**Files affected:** `src/app/(full)/full/FullClient.tsx`

**Scenarios:**
- GIVEN a request to `/full`; WHEN the hero renders; THEN the document contains exactly one `<h1>`.
- GIVEN the hero renders on mobile or desktop; THEN the `<h1>` text is "Menú FULL — YPF El Puente".
- GIVEN the existing visual design; WHEN the `<h1>` is added; THEN no visible layout or style changes occur (uses `sr-only` or equivalent).

**Acceptance criteria:**
- [ ] A single `<h1>` is added inside `renderHeroSection` in `FullClient.tsx`.
- [ ] Text is "Menú FULL — YPF El Puente".
- [ ] The `<h1>` is visually hidden (`sr-only` or equivalent) to preserve the existing logo-only hero design.
- [ ] No other `<h1>` is added to `/full`.
- [ ] `pnpm build` and `pnpm lint` pass.

---

### R19 — Fix Heading Jumps (`h1 → h3`)

The system MUST correct heading hierarchy in `/full/menu` and `/combustibles` by inserting an `<h2>` between the existing `<h1>` and the `<h3>` product/fuel titles.

**Files affected:** `src/app/(full)/full/menu/MenuClient.tsx`, `src/app/(public)/combustibles/page.tsx`

**Scenarios:**
- GIVEN `/full/menu` renders; WHEN the heading outline is inspected; THEN it follows `h1 (Menú Completo) → h2 (Productos) → h3 (product name)`.
- GIVEN `/combustibles` renders; WHEN the heading outline is inspected; THEN it follows `h1 (Nuestros Combustibles) → h2 (Listado de combustibles) → h3 (fuel name)`.
- GIVEN the new `<h2>` elements; WHEN rendered; THEN they preserve the existing visual styles or are visually hidden (`sr-only`).

**Acceptance criteria:**
- [ ] In `MenuClient.tsx`, an `<h2>` is inserted before the product grid with text "Productos" (visible or `sr-only`).
- [ ] In `src/app/(public)/combustibles/page.tsx`, an `<h2>` is inserted before `<CombustiblesGrid />` with text "Listado de combustibles" (visible or `sr-only`).
- [ ] Existing `<h3>` tags for product/fuel names are NOT changed to other tags.
- [ ] No visual regressions occur on desktop 1440px or mobile 320px.
- [ ] `pnpm build` and `pnpm lint` pass.

---

### R20 — Descriptive Alt Text for Instagram Posts

The system MUST replace the generic alt text in `FullInstagramSection` with a descriptive alt that references the Instagram account.

**Files affected:** `src/components/public/FullInstagramSection.tsx`

**Scenarios:**
- GIVEN an Instagram post thumbnail renders; WHEN its `<img>` is inspected; THEN the `alt` attribute is "Post de Instagram — @YPF.ELPUENTE" (or equivalent descriptive text).
- GIVEN the old alt text; THEN it no longer appears in the component.

**Acceptance criteria:**
- [ ] The `alt` prop of the `next/image` in the image card branch is changed from `"Publicación de Instagram"` to `"Post de Instagram — @YPF.ELPUENTE"`.
- [ ] QR code and other images in the same component are not affected.
- [ ] `pnpm build` and `pnpm lint` pass.

---

### R21 — Migrate Hero `<img>` to `next/image`

The system MUST replace the native `<picture>` + `<img>` hero background in `/full` with `next/image` art-direction using `getImageProps`.

**Files affected:** `src/app/(full)/full/FullClient.tsx`

**Scenarios:**
- GIVEN `/full` renders on a mobile viewport; THEN the hero shows the mobile image `/assets/ypf%20imagenes/RDP7-mobile.webp`.
- GIVEN `/full` renders on a desktop viewport; THEN the hero shows the desktop image `/assets/ypf%20imagenes/RDP7.webp`.
- GIVEN the migration is complete; THEN no native `<img>` tag remains for the hero background and the page still builds.

**Acceptance criteria:**
- [ ] The native `<picture>` + `<img>` block in `FullClient.tsx` is removed.
- [ ] `getImageProps` from `next/image` is used to generate mobile and desktop `srcSet` values.
- [ ] A `<picture>` element with `<source media="...">` and `<img>` is rendered using the generated props, preserving art-direction.
- [ ] Source paths remain `/assets/ypf%20imagenes/RDP7-mobile.webp` and `/assets/ypf%20imagenes/RDP7.webp`.
- [ ] `alt`, `object-cover` and full-bleed styling are preserved.
- [ ] `pnpm build` and `pnpm lint` pass.

---

### R22 — Preload Hint on Landing Hero Above-the-Fold

The system MUST apply the correct Next.js 16 image preload hint to the landing hero's above-the-fold image, and ONLY to that image.

**Files affected:** `src/components/public/LandingHero.tsx`

**Scenarios:**
- GIVEN Next.js 16 deprecates `priority` in favor of `preload`; WHEN the landing hero image is rendered; THEN it uses `preload={true}` (verified against Next.js 16.2.9 docs).
- GIVEN the landing hero uses a background video with a reduced-motion fallback image; WHEN `prefers-reduced-motion` is active; THEN the fallback image is rendered with `next/image` and `preload={true}`.
- GIVEN any other image on the landing page (e.g., fuel cards, boxes, footer); THEN it does NOT have `preload={true}`.

**Acceptance criteria:**
- [ ] The reduced-motion fallback `<img>` in `LandingHero.tsx` is migrated to `next/image` with `preload={true}`.
- [ ] No other `next/image` instance on the landing page receives `preload={true}`.
- [ ] The background video continues to use `preload="auto"` as before.
- [ ] `pnpm build` and `pnpm lint` pass.

---

## Non-Goals

- Full-site alt text audit.
- Lighthouse / Web Vitals performance measurements.
- Google Search Console or Google Business Profile setup.
- Client-provided data that is intentionally deferred: opening hours, GPS coordinates, long business description.
- New dependencies or architecture changes.
- Changes to `/boxes` canonical/sitemap behavior.

---

## Technical Constraints

- **Next.js 16.2.7+ API verification:**
  - `next/image` uses `preload` prop; `priority` is deprecated as of Next.js 16 (verified in Next.js 16.2.9 docs).
  - `ImageResponse` is imported from `next/og` and remains the canonical API for dynamic OG images in Next.js 16.
  - `opengraph-image.tsx` (with optional `alt`, `size`, `contentType` exports) is the canonical App Router file convention.
  - `getImageProps` from `next/image` is the canonical API for art-direction with `<picture>`.
- **Canonical domain:** `https://ypfelpuente.com.ar` must drive absolute OG image URLs via `metadataBase`.
- **JSON-LD:** serialize with `.replace(/</g, '\\u003c')` per Next.js recommendation; content is hard-coded/internal, so `dangerouslySetInnerHTML` is safe.
- **Menu schema:** only products with `precio > 0`; empty sections are dropped.
- **Headings:** semantic fixes must not change visible design; use `sr-only` where necessary.
- **Validation:** `pnpm build` + `pnpm lint` must pass.

---

## Verification Notes

- Use the browser DevTools Elements panel to confirm JSON-LD scripts and `<meta property="og:image" />` tags.
- Use an outline checker or axe DevTools to verify heading hierarchy (`h1 → h2 → h3`).
- Use the Network tab to confirm `/opengraph-image` returns a 1200x630 PNG.
- Inspect the `<head>` for `<link rel="preload" as="image" ...>` generated by `next/image` `preload={true}`.

---

## Status Report

**Status:** `spec-ready`

**Artifacts produced:**
- `openspec/changes/seo-slice-2/specs/seo-slice-2/spec.md`

**Next recommended phase:** `design` (SDD design: component signatures for `LocalBusinessSchema`, `MenuSchema`, `opengraph-image.tsx`, exact metadata helper signature, and `<picture>` art-direction implementation plan).

**Risks:**
- `ImageResponse` may fail with local fonts; mitigation: static PNG fallback at `public/assets/og-image.png`.
- `preload` prop behavior in a Client Component (`LandingHero.tsx`) may not insert the preload link server-side; mitigation: verify in build output and, if needed, inject a preload link for the video poster.
- Heading changes in shared components (`CombustiblesGrid`) must be scoped to avoid regressions on the landing page where the grid is also used; mitigation: insert `<h2>` in the page wrappers, not inside the shared grid component.
- `next/image` art-direction with `getImageProps` cannot use `placeholder="blur"`; mitigation: accept the trade-off or use a CSS background placeholder.
