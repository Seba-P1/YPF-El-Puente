# Tasks: Landing, Boxes & Combustibles Redesign

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1250–1500 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (Foundation + Components) → PR 2 (Pages rewrite + Build) |
| Delivery strategy | auto-forecast |
| Chain strategy | pending — ask user |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Foundation (migration + types + queries + utils + hook) + 6 components | PR 1 | Base: `main`. All new files, no page rewrites. Visual output of landing page unchanged after extraction. |
| 2 | LandingClient refactor + boxes/combustibles rewrite + build cleanup | PR 2 | Base: `main` (after PR 1). Rewrites 3 pages, removes dead inline code. Final build verification. |

---

## Phase 1: Foundation (Migration + Types + Query + Utils + Hook)

- [x] **T1** Create `supabase/migrations/0003_add_boxes_services.sql` — table, seed data (6 rows), RLS policies (public SELECT, admin ALL). Covers BS-1, BS-3, NF-5.
  - *Files*: `supabase/migrations/0003_add_boxes_services.sql` (new)
  - *Acceptance*: Migration runs without error; table has 6 seeded rows; public SELECT works, authenticated ALL works.
  - *Dependencies*: None.

- [x] **T2** Add `BoxService` type to `Database.public.Tables` in `src/lib/supabase/types.ts` — Row/Insert/Update for `boxes_services`. Export `BoxService` derived type. Covers BS-1, BS-2.
  - *Files*: `src/lib/supabase/types.ts` (modify)
  - *Acceptance*: TypeScript strict compile passes; `BoxService` type matches DB columns.
  - *Dependencies*: T1 (schema known).

- [x] **T3** Add `getBoxesServices()` server query to `src/lib/supabase/queries.ts` — filters `disponible=true`, orders by `orden` asc, throws on error, returns `BoxService[]`. Covers BS-2.
  - *Files*: `src/lib/supabase/queries.ts` (modify)
  - *Acceptance*: TypeScript strict compile passes; follows existing query patterns (`server-only`, `createServerSupabaseClient`).
  - *Dependencies*: T2.

- [x] **T4** Create `src/lib/utils/public.ts` — extract `getCombustibleColor()`, `containerVariants`, `itemVariants` from LandingClient.tsx. Covers LP-3.
  - *Files*: `src/lib/utils/public.ts` (new); `src/app/(public)/LandingClient.tsx` (modify — remove these declarations, add imports)
  - *Acceptance*: TypeScript strict compile passes; LandingClient imports utilities without duplicate definitions.
  - *Dependencies*: None.

- [x] **T5** Create `src/hooks/useCountUp.ts` — extract `useCountUp` hook from LandingClient.tsx. 'use client', uses `useState`/`useEffect`/`useRef`. Covers LS-7.
  - *Files*: `src/hooks/useCountUp.ts` (new)
  - *Acceptance*: TypeScript strict compile passes; hook retains same behavior (counts to target over duration when inView).
  - *Dependencies*: None.

## Phase 2: Extract Shared Components

- [x] **T6** Create `src/components/public/LandingHero.tsx` — hero with grid overlay, brand mark, location badge, tagline, two CTAs, scroll-down indicator. framer-motion staggered fade-up. No hardcoded colors. Covers LS-1, LS-7, LS-8.
  - *Files*: `src/components/public/LandingHero.tsx` (new)
  - *Acceptance*: Renders all hero elements; uses `var(--)` tokens; animations match existing patterns.
  - *Dependencies*: T4 (variants from public.ts).

- [x] **T7** Create `src/components/public/TickerMarquee.tsx` — `#FFD100` marquee with repeating text, pause-on-hover via existing CSS. No hardcoded colors (brand yellow is accent, permitted). Covers LS-2.
  - *Files*: `src/components/public/TickerMarquee.tsx` (new)
  - *Acceptance*: Text scrolls continuously; pauses on hover; matches existing marquee CSS.
  - *Dependencies*: None.

- [x] **T8** Create `src/components/public/CombustiblesGrid.tsx` — accepts `Combustible[]`, renders section header + fuel cards with color strip, icon, name, octanaje badge, price, description. Empty state: "Precios no disponibles temporalmente." framer-motion `whileInView` stagger. No hardcoded colors. Covers LS-3, LS-7, LS-8.
  - *Files*: `src/components/public/CombustiblesGrid.tsx` (new)
  - *Acceptance*: Renders fuel card grid matching original layout; empty state renders fallback text; uses `var(--)` tokens.
  - *Dependencies*: T4 (getCombustibleColor, variants).

- [x] **T9** Create `src/components/public/BoxesServicesSection.tsx` — accepts `BoxService[]`, renders left text column + right stat panel with `useCountUp`. Icon slug → Lucide component map inside. No hardcoded colors. Covers LS-4, LS-7, LS-8, BS-4.
  - *Files*: `src/components/public/BoxesServicesSection.tsx` (new)
  - *Acceptance*: Renders services list + stats; icon slugs map to correct Lucide icons; counter animates on scroll; uses `var(--)` tokens.
  - *Dependencies*: T5 (useCountUp hook), T2 (BoxService type).

- [x] **T10** Create `src/components/public/CTASection.tsx` — "¿Tenés hambre?" CTA linking to `/full`. framer-motion staggered fade-up. No hardcoded colors. Covers LS-5.
  - *Files*: `src/components/public/CTASection.tsx` (new)
  - *Acceptance*: Renders CTA with heading, subtitle, and button linking to `/full`; uses `var(--)` tokens.
  - *Dependencies*: None.

- [x] **T11** Create `src/components/public/FooterSection.tsx` — brand logo, nav links (Combustibles, Boxes, Menú FULL), WhatsApp link, copyright. Static (no animation). No hardcoded colors. Covers LS-6.
  - *Files*: `src/components/public/FooterSection.tsx` (new)
  - *Acceptance*: Renders all footer links and branding; uses `var(--)` tokens; matches design spec structure.
  - *Dependencies*: None.

## Phase 3: Page Wiring

- [x] **T12** Rewrite `src/app/(public)/LandingClient.tsx` — compose LandingHero, TickerMarquee, CombustiblesGrid, BoxesServicesSection, CTASection, FooterSection from imported components. Zero inline section JSX. Accept `Combustible[]` + `BoxService[]` as props. Covers LP-1, LP-2.
  - *Files*: `src/app/(public)/LandingClient.tsx` (rewrite)
  - *Acceptance*: Landing page renders all sections identically to before extraction; zero inline section JSX visible in file.
  - *Dependencies*: T6, T7, T8, T9, T10, T11 (all components exist), T4 (utilities refactored out).

- [x] **T13** Modify `src/app/(public)/page.tsx` — add `getBoxesServices()` call, pass `servicios` prop to `LandingClient`. Covers LP-1 wiring.
  - *Files*: `src/app/(public)/page.tsx` (modify)
  - *Acceptance*: Landing page receives both `combustibles` and `servicios` props; build passes.
  - *Dependencies*: T3 (getBoxesServices query), T12 (LandingClient accepts servicios prop).

- [x] **T14** Rewrite `src/app/(public)/boxes/page.tsx` — async server component fetching `getBoxesServices()`. Dark theme tokens throughout. Uses `BoxesServicesSection` + `FooterSection`. Preserves Hours & Location cards + WhatsApp CTA. Covers BP-1, BP-2, BP-3.
  - *Files*: `src/app/(public)/boxes/page.tsx` (rewrite)
  - *Acceptance*: Boxes page renders DB-backed services in dark theme; Hours/Location/CTA preserved; no hardcoded light colors.
  - *Dependencies*: T3 (getBoxesServices), T9 (BoxesServicesSection), T11 (FooterSection).

- [x] **T15** Rewrite `src/app/(public)/combustibles/page.tsx` — async server component fetching `getCombustibles()`. Dark theme tokens throughout. Uses shared `CombustiblesGrid` + `FooterSection`. Preserves Infinia info section + WhatsApp CTA. Covers CP-1, CP-2, CP-3.
  - *Files*: `src/app/(public)/combustibles/page.tsx` (rewrite)
  - *Acceptance*: Combustibles page renders shared grid in dark theme; Infinia info/CTA preserved; no hardcoded light colors.
  - *Dependencies*: T8 (CombustiblesGrid), T11 (FooterSection).

## Phase 4: Verification

- [x] **T16** Run `pnpm typecheck` + `pnpm build` — fix all type errors, broken imports, and dead-code references. Ensure LandingClient.tsx has no remaining inline section JSX. Covers NF-4.
  - *Files*: All modified files
  - *Acceptance*: `pnpm typecheck` passes, `pnpm build` succeeds with zero errors. LandingClient contains only imports and composition.
  - *Dependencies*: T12, T13, T14, T15.

- [x] **T17** Visual regression check — compare landing, boxes, and combustibles pages at 320px, 768px, 1024px, 1440px. Verify no horizontal overflow at 320px and `max-width: min(1280px, 92vw)` at 1440px. Covers NF-1.
  - *Files*: None (manual browser verification)
  - *Acceptance*: All 3 pages render correctly at all 4 breakpoints; no regression on landing page vs production.
  - *Dependencies*: T16.
