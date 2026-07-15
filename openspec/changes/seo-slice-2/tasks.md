# Tasks: SEO Slice 2 — Enriquecimiento de Contenido

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~215 (≈ +200 / -15) |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | OG image + metadata wiring | PR 1 | Foundation — other reqs reference OG image URL |
| 2 | LocalBusiness JSON-LD | PR 1 | Same PR, independent of OG image route at build time |
| 3 | Menu JSON-LD | PR 1 | Same PR, depends on product data already available |
| 4 | Heading hierarchy fixes | PR 1 | Same PR, semantic-only changes |
| 5 | Image accessibility + performance | PR 1 | Same PR, alt text + next/image + preload |

## Phase 1: OG Image Foundation

- [ ] 1.1 **T1 — OpenGraph image generation** (R16)
  - CREATE `src/app/opengraph-image.tsx` — `ImageResponse` from `next/og`, exports `alt`, `size` (1200×630), `contentType` (`image/png`), default async function with gradient + brand text
  - Est: ~35 / -0
  - Verify: `curl -I http://localhost:3000/opengraph-image` → `200`, `image/png`; browser shows 1200×630 with "YPF El Puente"
  - Rollback: `rm src/app/opengraph-image.tsx`
  - Commit: `feat(seo): add OpenGraph image generation` (with T2)

- [ ] 1.2 **T2 — Extend metadata helper with OG image** (R17)
  - MODIFY `src/lib/seo/metadata.ts` — add `image?: string` to `PageMetaInput`; inject `openGraph.images: [{ url, width: 1200, height: 630, alt: OG_IMAGE_ALT }]` when present
  - Est: ~8 / -0
  - Verify: `pnpm build` passes; typecheck OK
  - Rollback: `git checkout -- src/lib/seo/metadata.ts`

- [ ] 1.3 **T3 — Wire OG image into public page metadatas** (R17)
  - MODIFY `src/app/(public)/page.tsx` — add `image: '/opengraph-image'` to `createPageMetadata` call
  - MODIFY `src/app/(full)/layout.tsx` — add `images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'YPF El Puente — Río Colorado' }]` to existing `openGraph`
  - MODIFY `src/app/(public)/combustibles/page.tsx` — add `images` to existing `openGraph` object
  - MODIFY `src/app/(full)/full/menu/page.tsx` — add `images` to existing `openGraph` object
  - Est: ~12 / -0
  - Verify: `curl -s http://localhost:3000/ | grep 'og:image'` → `https://ypfelpuente.com.ar/opengraph-image`; same for `/combustibles`, `/full`, `/full/menu`
  - Rollback: `git checkout -- "src/app/(public)/page.tsx" "src/app/(full)/layout.tsx" "src/app/(public)/combustibles/page.tsx" "src/app/(full)/full/menu/page.tsx"`

## Phase 2: Structured Data

- [ ] 2.1 **T4 — LocalBusinessSchema component** (R14)
  - CREATE `src/components/seo/LocalBusinessSchema.tsx` — Server Component with hardcoded `Restaurant` JSON-LD; `dangerouslySetInnerHTML` + `.replace(/</g, '\\u003c')`; `image` from `CANONICAL_DOMAIN + '/opengraph-image'`; `// TODO(client):` markers for `openingHoursSpecification` and `geo`
  - Est: ~40 / -0
  - Verify: component renders `<script type="application/ld+json">` with `@type: "Restaurant"`; no `openingHoursSpecification`/`geo` in output
  - Rollback: `rm src/components/seo/LocalBusinessSchema.tsx`

- [ ] 2.2 **T5 — Render LocalBusinessSchema in landing** (R14)
  - MODIFY `src/app/(public)/page.tsx` — import and render `<LocalBusinessSchema />` inside the return
  - Est: ~3 / -0
  - Verify: `curl -s http://localhost:3000/ | grep -A30 'application/ld+json'` → `"@type":"Restaurant"`, `name`, `telephone`, `address`, `priceRange`, `servesCuisine`, `sameAs`, `image`
  - Rollback: `git checkout -- "src/app/(public)/page.tsx"`
  - Commit: `feat(seo): add LocalBusiness structured data` (with T4)

- [ ] 2.3 **T6 — MenuSchema component** (R15)
  - CREATE `src/components/seo/MenuSchema.tsx` — Server Component accepting `sections: { name: string; products: { name: string; price: number }[] }[]`; filters `price <= 0` and empty sections; renders `Menu` JSON-LD with `hasMenuSection`/`hasMenuItem`
  - Est: ~40 / -0
  - Verify: renders `<script type="application/ld+json">` with `@type: "Menu"`; no products with price ≤ 0
  - Rollback: `rm src/components/seo/MenuSchema.tsx`

- [ ] 2.4 **T7 — Render MenuSchema in /full** (R15)
  - MODIFY `src/app/(full)/full/page.tsx` — import `MenuSchema`; build `menuSections` from existing `fullHamburguesas`, `fullCafeteria`, `fullMarca`, `fullSinTacc` data (map `nombre`→`name`, `precio`→`price`); render `<MenuSchema sections={menuSections} />`
  - Est: ~15 / -0
  - Verify: `curl -s http://localhost:3000/full | grep -A40 'application/ld+json'` → `"@type":"Menu"`, `hasMenuSection`, `hasMenuItem`, `offers.price`
  - Rollback: `git checkout -- "src/app/(full)/full/page.tsx"`
  - Commit: `feat(seo): add Menu structured data` (with T6)

## Phase 3: Heading Hierarchy

- [ ] 3.1 **T8 — Add semantic h1 to /full hero** (R18)
  - MODIFY `src/app/(full)/full/FullClient.tsx` — add `<h1>` inside `renderHeroSection` with text "Menú FULL — YPF El Puente"; visually integrated below logo RDP7 using existing typography tokens; exactly one `h1` in `/full`
  - Est: ~8 / -0
  - Verify: `curl -s http://localhost:3000/full | grep -i '<h1'` → exactly one `<h1>`; visual check at 320px/1440px
  - Rollback: `git checkout -- "src/app/(full)/full/FullClient.tsx"`

- [ ] 3.2 **T9 — Fix heading jumps h1→h3** (R19)
  - MODIFY `src/app/(full)/full/menu/MenuClient.tsx` — insert `<h2 className="sr-only">Productos</h2>` before product grid (inside the `max-w` div, after result count)
  - MODIFY `src/app/(public)/combustibles/page.tsx` — insert `<h2 className="sr-only">Listado de combustibles</h2>` before `<CombustiblesGrid />`
  - Est: ~4 / -0
  - Verify: `curl -s http://localhost:3000/full/menu | grep -iE '<h[123]'` → outline `h1 → h2 → h3`; same for `/combustibles`; no visual regression
  - Rollback: `git checkout -- "src/app/(full)/full/menu/MenuClient.tsx" "src/app/(public)/combustibles/page.tsx"`
  - Commit: `fix(seo): improve heading hierarchy across public pages` (T8 + T9)

## Phase 4: Image Accessibility + Performance

- [x] 4.1 **T10 — Descriptive alt text for Instagram** (R20)
  - MODIFY `src/components/public/FullInstagramSection.tsx` — change `alt="Publicación de Instagram"` (line 242) to `alt="Post de Instagram — @YPF.ELPUENTE"`; QR code alt unchanged
  - Est: ~1 / -1
  - Verify: inspect `/full` HTML → `alt="Post de Instagram — @YPF.ELPUENTE"` in image cards
  - Rollback: `git checkout -- src/components/public/FullInstagramSection.tsx`

- [x] 4.2 **T11 — Migrate /full hero to next/image art-direction** (R21)
  - MODIFY `src/app/(full)/full/FullClient.tsx` — remove native `<picture>` + `<img>` hero block; import `getImageProps` from `next/image`; create `HeroPicture` component using `getImageProps` for desktop (`/assets/ypf%20imagenes/RDP7.webp`, 1920×1080) and mobile (`/assets/ypf%20imagenes/RDP7-mobile.webp`, 768×1024); render `<picture>` with `<source media="(max-width: 768px)" srcSet={mobile} />` + `<img {...rest} srcSet={desktop} />`; preserve `alt`, `object-cover`, full-bleed styling
  - Est: ~20 / -10
  - Verify: `curl -s http://localhost:3000/full | grep -iE '<picture|<source|srcset'` → `<picture>` with mobile/desktop srcSets; no native `<img>` for hero; visual check at 320px/768px/1440px
  - Rollback: `git checkout -- "src/app/(full)/full/FullClient.tsx"` (restore pre-T11 state; keep T8 h1 if not affected)
  - **⚠️ Point of no return**: if `getImageProps` does not respect art-direction with `%20` paths, hero breaks at breakpoints. Verify in `pnpm dev` AND `pnpm start`.

- [x] 4.3 **T12 — Preload hint on landing hero fallback** (R22)
  - MODIFY `src/components/public/LandingHero.tsx` — import `Image` from `next/image`; replace native `<img>` (lines 72-77) with `<Image src={videoSources.poster} alt="Hero background" fill className="..." preload={true} />`; video `preload="auto"` unchanged
  - Est: ~5 / -3
  - Verify: inspect `<head>` of `/` for `<link rel="preload" as="image" ...>` when `prefers-reduced-motion`; no other `preload={true}` on landing images
  - Rollback: `git checkout -- src/components/public/LandingHero.tsx`
  - Commit: `fix(seo): improve image accessibility and performance` (T10 + T11 + T12)

## Execution Order

```
T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8 → T9 → T10 → T11 → T12
```

Dependency DAG (acyclic):

```
T1 ──→ T3 (OG image URL used in metadata)
 │
 ├──→ T5 (OG image URL used in Restaurant schema `image`)
 │
T2 ──→ T3 (helper must accept `image` param before pages use it)

T4 ──→ T5 (component must exist before rendering)
T6 ──→ T7 (component must exist before rendering)

T8 ──→ T11 (both modify FullClient.tsx; T8 first for clean diff)
T10, T11, T12 ──→ independent of each other, but T11 shares file with T8

T9 ──→ independent (different files from T8)
```

## Commit Groups (work-unit)

| Group | Tasks | Commit message |
|-------|-------|----------------|
| 1 | T1 + T2 + T3 | `feat(seo): add OpenGraph image generation` |
| 2 | T4 + T5 | `feat(seo): add LocalBusiness structured data` |
| 3 | T6 + T7 | `feat(seo): add Menu structured data` |
| 4 | T8 + T9 | `fix(seo): improve heading hierarchy across public pages` |
| 5 | T10 + T11 + T12 | `fix(seo): improve image accessibility and performance` |

## Summary

- Total tasks: 12
- Total estimated lines: ~215 (≈ +200 / -15)
- Total commits: 5 (work-unit groups)
- PRs: 1
- 400-line budget risk: Low
- Chained PRs recommended: No
- Decision needed before apply: No

## API Verification

| Symbol | Version | Source |
|--------|---------|--------|
| `preload` prop (replaces `priority`) | Next.js 16.2.9 | Context7 `/vercel/next.js/v16.2.9` — image component docs |
| `getImageProps` from `next/image` | Next.js 16.2.9 | Context7 — art-direction with `<picture>` |
| `ImageResponse` from `next/og` | Next.js 16.2.9 | Context7 — OG image file convention |
| `opengraph-image.tsx` exports (`alt`, `size`, `contentType`) | Next.js 16.2.9 | Context7 — file conventions/metadata |
