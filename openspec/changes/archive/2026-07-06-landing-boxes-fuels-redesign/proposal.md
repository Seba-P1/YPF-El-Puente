# Proposal: Landing, Boxes & Combustibles Redesign

## Intent

Professional UI redesign of the three primary public-facing pages. The landing page is a 1092-line monolithic client component; standalone boxes and combustibles pages use hardcoded light colors (`bg-white`, `#003C6E`) that break the dark theme when navigated from the dark landing. There is no DB table for boxes — data duplicated in landing + standalone page. Fix inconsistency, extract reusable components, create a data model for boxes.

## Scope

### In Scope
1. **Landing page** — professional UI, responsive proportions across all resolutions, section extraction
2. **Boxes page** — adapt existing services data into dark-themed professional UI with DB backing
3. **Combustibles page** — adapt existing DB data into dark-themed professional UI matching landing
4. **boxes_services DB table** — migration + seed from existing hardcoded data
5. **Shared components** — extract LandingClient inline sections into `components/public/`
6. **Dark theme consistency** — standalone pages use CSS custom properties like landing

### Out of Scope
- Full/Menu pages
- Admin panel changes
- Product images
- FullPage scroll-snap behavior
- Cart/Checkout modifications
- Boxes appointment booking

## Capabilities

### New Capabilities
- `boxes-services`: DB-backed boxes services with display on public pages
- `landing-sections`: Shared landing section components (Hero, CombustiblesGrid, BoxesSection, Ticker, CTA, Footer)

### Modified Capabilities
None — no existing specs.

## Approach

1. **DB migration**: Create `boxes_services` table (id, nombre, descripcion, icono_slug, disponible, orden). Seed with same 6 services currently hardcoded.
2. **Extract shared components** from LandingClient.tsx into `components/public/`:
   - `LandingHero.tsx` — hero with grid overlay, badge, brand mark, CTAs
   - `CombustiblesGrid.tsx` — fuel cards grid (shared by landing + combustibles page)
   - `BoxesServicesSection.tsx` — services list + stat panel (shared by landing + boxes page)
   - `TickerMarquee.tsx` — yellow scrolling ticker
   - `CTASection.tsx` — "¿Tenés hambre?" CTA
   - `FooterSection.tsx` — brand, nav, contact (shared across all public pages)
3. **Rewrite** `boxes/page.tsx` and `combustibles/page.tsx` using dark theme tokens, shared components, and DB data.
4. **Refactor** `LandingClient.tsx` to compose from extracted sections only.
5. **Responsive polish**: consistent grid breakpoints, `clamp()` typography, same padding system across all three pages.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/(public)/LandingClient.tsx` | Modified | Inline sections → imported components |
| `src/app/(public)/page.tsx` | Modified | Passes combustibles + boxes_services data |
| `src/app/(public)/boxes/page.tsx` | Rewrite | Dark theme, DB-backed data, shared footer |
| `src/app/(public)/combustibles/page.tsx` | Rewrite | Dark theme, shared CombustiblesGrid, shared footer |
| `src/components/public/LandingHero.tsx` | New | Extracted from LandingClient |
| `src/components/public/CombustiblesGrid.tsx` | New | Shared fuel card grid |
| `src/components/public/BoxesServicesSection.tsx` | New | Shared boxes display |
| `src/components/public/TickerMarquee.tsx` | New | Extracted scrolling ticker |
| `src/components/public/CTASection.tsx` | New | Extracted menu CTA |
| `src/components/public/FooterSection.tsx` | New | Shared footer component |
| `src/lib/supabase/queries.ts` | Modified | Add `getBoxesServices()` |
| `src/lib/supabase/types.ts` | Modified | Add `BoxService` type |
| `supabase/migrations/` | New | `boxes_services` table + seed |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Boxes page breaks if migration fails | Low | Seed migration with existing hardcoded data; fallback to hardcoded array |
| Layout mismatch from shared footer | Low | Visual regression check on all 3 pages |
| Dead inline sections left in LandingClient | Low | Final refactor pass removes all raw JSX sections |

## Rollback Plan

1. `git revert` on boxes/page.tsx, combustibles/page.tsx, LandingClient.tsx
2. Drop `boxes_services` table via Supabase dashboard
3. Delete new component files from `components/public/`

## Dependencies

- Supabase migration permissions (already configured)
- No external npm packages

## Success Criteria

- [ ] Landing page renders all 6 sections from extracted components — no inline section JSX remains
- [ ] Boxes page uses dark theme tokens (`var(--bg-base)`, `var(--text-primary)`, `var(--border)`) — no hardcoded light colors
- [ ] Combustibles page uses dark theme tokens — no hardcoded light colors
- [ ] `boxes_services` table created with seed data matching current 6 services
- [ ] No visual regression on landing page after extraction
- [ ] All 3 pages render correctly at 320px, 768px, 1024px, 1440px
