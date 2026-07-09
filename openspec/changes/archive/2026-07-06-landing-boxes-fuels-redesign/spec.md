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
