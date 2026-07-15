# Spec: Landing, Boxes & Combustibles Redesign

## Purpose

Delta spec for redesigning 3 public pages (landing, boxes, combustibles) with dark theme consistency, DB-backed boxes services, and 6 shared components extracted from the monolithic LandingClient.tsx.

## ADDED Requirements

### Capability: boxes-services

| ID | Requirement | Strength |
|----|-------------|----------|
| BS-1 | A `boxes_services` DB table SHALL exist with columns: `id` (uuid PK), `nombre` (text, not null), `descripcion` (text, nullable), `icono_slug` (text, not null — maps to Lucide icon name), `disponible` (boolean, default true), `orden` (integer, not null) | SHALL |
| BS-2 | A `getBoxesServices()` server-only query SHALL return `{ id, nombre, descripcion, icono_slug, disponible, orden }[]` filtered by `disponible=true` and sorted by `orden` ascending | SHALL |
| BS-3 | A seed migration SHALL insert the 6 services: Cambio de aceite (Droplets), Inflado de neumáticos (Gauge), Agua y refrigerante (Thermometer), Limpieza de parabrisas (Eye), Control de presión (Activity), Revisión general (CheckCircle2) — all `disponible=true` | SHALL |
| BS-4 | The `/boxes` page SHALL display active services in a responsive grid using dark theme tokens (`var(--bg-card)`, `var(--border)`, etc.) | SHALL |
| BS-5 | Admin CRUD for boxes_services SHALL NOT be implemented — data managed via DB migrations only | SHALL NOT |

#### Scenario: BS-1 — Table created with seed
- GIVEN no `boxes_services` table exists
- WHEN the migration runs
- THEN the table SHALL have all 6 columns and an RLS policy allowing public read

#### Scenario: BS-2 — Query returns active ordered
- GIVEN 6 services in `boxes_services` with varied `orden`
- WHEN `getBoxesServices()` is called
- THEN it SHALL return only rows where `disponible=true` ordered by `orden`

#### Scenario: BS-3 — Disabled service hidden
- GIVEN a service with `disponible=false`
- WHEN the `/boxes` page renders
- THEN that service SHALL NOT appear in the grid

### Capability: landing-sections

| ID | Requirement | Strength |
|----|-------------|----------|
| LS-1 | A `LandingHero` component SHALL render hero with grid overlay, brand mark (YPF + EL PUENTE), location badge, tagline, two CTAs, and scroll-down indicator | SHALL |
| LS-2 | A `TickerMarquee` component SHALL render a `#FFD100` marquee with repeating text and pause-on-hover | SHALL |
| LS-3 | A `CombustiblesGrid` component SHALL accept `Combustible[]` and render cards with color strip, icon, name, octanaje badge, price, and description. Empty state: "Precios no disponibles temporalmente." | SHALL |
| LS-4 | A `BoxesServicesSection` component SHALL accept a services array and render a text left column + stat panel right column | SHALL |
| LS-5 | A `CTASection` component SHALL render "¿Tenés hambre?" CTA linking to `/full` | SHALL |
| LS-6 | A `FooterSection` component SHALL render brand logo, nav links (Combustibles, Boxes, Menú FULL), WhatsApp link, and copyright | SHALL |
| LS-7 | All components SHOULD use framer-motion `whileInView` for scroll-in animations matching existing patterns | SHOULD |
| LS-8 | All components SHALL use CSS custom properties (`var(--bg-*)`, `var(--text-*)`, `var(--border)`) — no hardcoded color values | SHALL |

#### Scenario: LS-1 — Hero renders all elements
- GIVEN LandingHero is rendered
- THEN the grid overlay, YPF/EL PUENTE text, "Río Colorado" badge, tagline, "Ver Menú FULL →" link, "Combustibles ↓" link, and scroll indicator SHALL be visible

#### Scenario: LS-3 — Empty state
- GIVEN an empty `Combustible[]` array
- WHEN CombustiblesGrid renders
- THEN it SHALL display "Precios no disponibles temporalmente."

#### Scenario: LS-8 — No hardcoded colors
- GIVEN any landing-sections component in dark mode
- THEN all colors SHALL use `var(--)` references, not literal hex values outside of brand accents

### Modified: Landing page

| ID | Requirement | Strength |
|----|-------------|----------|
| LP-1 | LandingClient.tsx SHALL compose Hero, TickerMarquee, CombustiblesGrid, BoxesServicesSection, CTASection, and FooterSection from extracted components — zero inline section JSX | SHALL |
| LP-2 | Visual output SHALL NOT regress after extraction (same layout, animations, spacing, colors) | SHALL |
| LP-3 | The `getCombustibleColor()` function and stagger animation variants SHALL be extracted to the shared component or a utilities file | SHALL |

#### Scenario: LP-1 — Zero inline section JSX
- GIVEN the refactored LandingClient.tsx
- WHEN the file is inspected
- THEN it SHALL contain only imports and composition calls, NOT inline JSX for any section

### Modified: Boxes page

| ID | Requirement | Strength |
|----|-------------|----------|
| BP-1 | `/boxes/page.tsx` SHALL fetch data from `getBoxesServices()` — no hardcoded services array | SHALL |
| BP-2 | The page SHALL use dark theme tokens exclusively — no `bg-white`, `#003C6E`, or other light-mode values | SHALL |
| BP-3 | Hours & Location cards and WhatsApp CTA footer SHALL be preserved | SHALL |

#### Scenario: BP-1 — DB-backed services
- GIVEN the refactored BoxesPage
- WHEN the page renders
- THEN service data SHALL come from DB query, and removing a row from `boxes_services` SHALL remove it from the page

### Modified: Combustibles page

| ID | Requirement | Strength |
|----|-------------|----------|
| CP-1 | `/combustibles/page.tsx` SHALL use the shared `CombustiblesGrid` component | SHALL |
| CP-2 | The page SHALL use dark theme tokens exclusively — no hardcoded light colors | SHALL |
| CP-3 | Infinia info section and WhatsApp CTA footer SHALL be preserved | SHALL |

#### Scenario: CP-1 — Shared grid
- GIVEN the refactored CombustiblesPage
- WHEN rendered
- THEN the fuel card grid SHALL be an instance of `CombustiblesGrid`, not inline markup

### Capability: page-metadata-seo

| ID | Requirement | Strength |
|----|-------------|----------|
| SM-1 | The landing page (`/`) SHALL expose its own `title`, `description`, `keywords`, `alternates.canonical: '/'`, and `openGraph` with `locale: 'es_AR'`, `type: 'website'`, `siteName: 'YPF El Puente'`, and `images` pointing to the canonical OG image (`/opengraph-image`, 1200×630) | SHALL |
| SM-2 | The `/combustibles` page SHALL keep its existing `title` and `description` and add `alternates.canonical: '/combustibles'` and text-only `openGraph` with `locale: 'es_AR'`, `type: 'website'`, `siteName: 'YPF El Puente'` | SHALL |
| SM-3 | The `/full` route group layout SHALL keep its existing `title` and `description` and add `alternates.canonical: '/full'` and text-only `openGraph` | SHALL |
| SM-4 | The `/full/menu` page SHALL type `metadata` as `Metadata` with existing `title` and `description`, and add `alternates.canonical: '/full/menu'` and text-only `openGraph` | SHALL |
| SM-5 | The `not-found.tsx` page SHALL export `metadata` with `title: 'Página no encontrada — YPF El Puente'`, `description`, and `robots: { index: false }` | SHALL |
| SM-6 | All public page metadata SHALL use shared constants (`CANONICAL_DOMAIN`, `SITE_NAME`, `DEFAULT_LOCALE`, `OG_TYPE`) from `src/lib/seo/constants.ts` as single source of truth | SHALL |
| SM-7 | All canonical URLs SHALL be relative paths (e.g. `'/'`, `'/combustibles'`) resolved to absolute via `metadataBase` in root layout | SHALL |

#### Scenario: SM-1 — Landing renders own metadata
- GIVEN a request to `/`
- WHEN the page renders
- THEN the HTML `<head>` SHALL contain landing-specific title, description, keywords (YPF, El Puente, Río Colorado, combustibles, menú FULL, boxes, Patagonia), `<link rel="canonical" href="https://ypfelpuente.com.ar"/>`, and `<meta property="og:*">` with `locale: es_AR`, `type: website`, `siteName: YPF El Puente`
- AND SHALL contain `<meta property="og:image" content="https://ypfelpuente.com.ar/opengraph-image" />` with `width: 1200`, `height: 630`, `alt: "YPF El Puente — Río Colorado"`

#### Scenario: SM-4 — /full/menu typed metadata
- GIVEN a request to `/full/menu`
- WHEN the page renders
- THEN the `<head>` SHALL contain `<link rel="canonical" href="https://ypfelpuente.com.ar/full/menu"/>` and OG tags

#### Scenario: SM-5 — Not-found noindex
- GIVEN a request to a non-existent route
- WHEN `not-found.tsx` renders
- THEN the HTML `<head>` SHALL contain `<meta name="robots" content="noindex"/>`

### Capability: structured-data-local-business

| ID | Requirement | Strength |
|----|-------------|----------|
| SD-1 | The landing page (`/`) SHALL render a `Restaurant` JSON-LD script with `name: "YPF El Puente"`, `telephone`, `address` (Ruta Nacional 22 Km 857, Río Colorado, Río Negro, AR), `priceRange: "$$"`, `servesCuisine: ["Hamburguesas", "Cafetería", "Comida rápida"]`, `sameAs` (Instagram URL), and `image` pointing to the canonical OG image | SHALL |
| SD-2 | The `Restaurant` schema SHALL be rendered via a Server Component (`LocalBusinessSchema.tsx`) using `dangerouslySetInnerHTML` with `JSON.stringify(...).replace(/</g, '\\u003c')` | SHALL |
| SD-3 | The `Restaurant` schema SHALL omit `openingHoursSpecification` and `geo` — deferred with `// TODO(client):` comments | SHALL |

#### Scenario: SD-1 — Restaurant JSON-LD in landing
- GIVEN a request to `/`
- WHEN the page renders
- THEN the HTML SHALL contain `<script type="application/ld+json">` with `@type: "Restaurant"` and all required fields
- AND the `image` field SHALL be `"https://ypfelpuente.com.ar/opengraph-image"`
- AND `openingHoursSpecification` and `geo` SHALL NOT be present

### Capability: structured-data-menu

| ID | Requirement | Strength |
|----|-------------|----------|
| SD-4 | The `/full` page SHALL render a `Menu` JSON-LD script built from curated category sections, including only products with `precio > 0` | SHALL |
| SD-5 | The `Menu` schema SHALL be rendered via a Server Component (`MenuSchema.tsx`) accepting typed props `{ name: string; products: { name: string; price: number }[] }[]`, filtering out empty sections and products with `price <= 0` | SHALL |
| SD-6 | The schema SHALL include `hasMenuSection` → `hasMenuItem` → `offers.price` in ARS, with `name: "Menú FULL — YPF El Puente"` as the top-level name | SHALL |

#### Scenario: SD-4 — Menu JSON-LD in /full
- GIVEN a request to `/full`
- WHEN the page renders
- THEN the HTML SHALL contain `<script type="application/ld+json">` with `@type: "Menu"`
- AND products with `precio <= 0` SHALL NOT appear in the schema
- AND sections that become empty after filtering SHALL be omitted

### Capability: heading-structure

| ID | Requirement | Strength |
|----|-------------|----------|
| HS-1 | The `/full` page SHALL contain exactly one `<h1>` with text "Menú FULL — YPF El Puente" (visually hidden via `sr-only` to preserve logo hero design) | SHALL |
| HS-2 | The `/full/menu` page SHALL have heading hierarchy `h1` (Menú Completo) → `h2` (Productos, `sr-only`) → `h3` (product names) — no jumps | SHALL |
| HS-3 | The `/combustibles` page SHALL have heading hierarchy `h1` (Nuestros Combustibles) → `h2` (Listado de combustibles, `sr-only`) → `h3` (fuel names) — no jumps | SHALL |
| HS-4 | All `<h2>` insertions SHALL use `sr-only` or equivalent to preserve existing visual design | SHALL |

#### Scenario: HS-2 — Heading hierarchy in /full/menu
- GIVEN a request to `/full/menu`
- WHEN the HTML is inspected for heading elements
- THEN the outline SHALL be `h1 → h2 → h3` with no level skips

### Capability: instagram-alt-text

| ID | Requirement | Strength |
|----|-------------|----------|
| IA-1 | The `FullInstagramSection` component SHALL use descriptive alt text referencing the Instagram account instead of the generic "Publicación de Instagram" | SHALL |

#### Scenario: IA-1 — Descriptive Instagram alt
- GIVEN `/full` renders Instagram post thumbnails
- WHEN the `<img>` is inspected
- THEN the `alt` attribute SHALL be "QR Instagram @YPF.ELPUENTE" (or equivalent descriptive text referencing the account)

### Removed: Full duplicate layout

| ID | Requirement | Strength |
|----|-------------|----------|
| RL-1 | `src/app/(full)/full/layout.tsx` SHALL be deleted — it only duplicated metadata owned by `src/app/(full)/layout.tsx` | SHALL |

#### Scenario: RL-1 — Layout deletion
- GIVEN `src/app/(full)/full/layout.tsx` is deleted
- WHEN a request is made to `/full` or `/full/menu`
- THEN the page SHALL render correctly using only `src/app/(full)/layout.tsx` and `pnpm build` SHALL pass

### Non-functional Requirements

| ID | Requirement | Strength |
|----|-------------|----------|
| NF-1 | All 3 pages SHALL render correctly at 320px, 768px, 1024px, and 1440px breakpoints | SHALL |
| NF-2 | Dark theme SHALL be forced via `ThemeProvider` `forcedTheme="dark"` (existing config) | SHALL |
| NF-3 | Scroll-in animations SHALL use `framer-motion` (existing project dependency) | SHALL |
| NF-4 | All new and modified code SHALL be TypeScript strict — no `any`, no implicit `any` | SHALL |
| NF-5 | `boxes_services` table SHALL have RLS policy allowing `SELECT` for anonymous users, `ALL` for authenticated admin | SHALL |

#### Scenario: NF-1 — Responsive at 320px
- GIVEN any of the 3 pages at 320px viewport width
- THEN no horizontal overflow SHALL occur and content SHALL fit within the viewport

#### Scenario: NF-1 — Responsive at 1440px
- GIVEN any of the 3 pages at 1440px viewport width
- THEN layouts SHALL use `max-width: min(1280px, 92vw)` central constraint and multi-column grids
