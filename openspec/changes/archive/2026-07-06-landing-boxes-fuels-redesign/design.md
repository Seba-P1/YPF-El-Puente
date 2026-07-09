# Design: Landing, Boxes & Combustibles Redesign

## Technical Approach

Extract 6 inline sections from the 1092-line `LandingClient.tsx` into independent, reusable components in `components/public/`. Create a `boxes_services` DB table with seed data to replace hardcoded service arrays. Rewrite both `/boxes` and `/combustibles` pages as dark-themed pages using shared components and CSS custom properties. Landing page becomes a thin composition layer. All three pages share `FooterSection` for visual consistency.

## Architecture Decisions

### Decision: Component Boundaries

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Each component = full `<section>` wrapper + content | Less flexible for alternate page layouts | **Chosen** — spec mandates zero inline section JSX (LP-1). Section headers differ slightly but acceptably across pages. |
| Components = content-only (grid, list etc.) | Flexible but LandingClient still needs section markup | Rejected — violates LP-1 zero-inline requirement |
| Compound components (parent + sub-components) | More files, more granularity | Over-engineering for 6 sections |

**Rationale**: Each of the 6 extracted components is a complete visual section that can be dropped into any page. The landing page becomes pure composition. Standalone pages (`/boxes`, `/combustibles`) reuse some and add page-specific inline content (hours cards, Infinia info, hero banners) which is structurally different enough to not warrant extraction.

### Decision: Icons in BoxesServicesSection

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Map `icono_slug` string → Lucide component in the component itself | Couples DB slugs to Lucide | **Chosen** — lightweight, localised, no registry needed |
| Dynamic `lucide-react` import by name | Fragile, tree-shaking risk | Rejected |
| Store icon name in DB as raw Lucide import path | DB leaky abstraction | Rejected |

**Rationale**: 6 icons are fixed and known at design time. A static map in `BoxesServicesSection.tsx` (`'Droplets' → Droplets, 'Gauge' → Gauge, ...`) is simple, type-safe, and survives tree-shaking.

### Decision: Shared Animation Variants

Extract `containerVariants` and `itemVariants` from `LandingClient.tsx` into a shared utility file (`src/lib/utils/public.ts`). Also extract `getCombustibleColor()` into the same file. Animation logic is consistent across landing and standalone pages — duplication would drift.

### Decision: useCountUp Hook

Extract the `useCountUp` hook into `src/hooks/useCountUp.ts`. It is used by `BoxesServicesSection` and is a clean custom hook. No existing hook file structure exists yet; placing it in `src/hooks/` follows Next.js convention.

### Decision: Dark Theme for Boxes / Combustibles Pages

Both pages currently use hardcoded light-color classes (`bg-white`, `text-[#003C6E]`, `bg-gray-50`, etc.) and lack a wrapping `<div>` with theme context. Since the parent `layout.tsx` already wraps children in `<ThemeProvider attribute="class" forcedTheme="dark">`, the pages will automatically use `.dark` CSS custom properties. The rewrite simply replaces hardcoded colors with `var(--bg-*)`, `var(--text-*)`, and `var(--border)` tokens, and removes explicit light-mode class names.

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│  SERVER COMPONENTS (page.tsx)                                       │
│                                                                     │
│  LandingPage                        BoxesPage        CombustiblesPage│
│  ┌─────────────────────┐            ┌──────────┐    ┌─────────────┐ │
│  │ getCombustibles()   │            │getBoxes- │    │getCombusti- │ │
│  │ getBoxesServices()  │            │Services()│    │bles()       │ │
│  └────────┬────────────┘            └────┬─────┘    └──────┬──────┘ │
│           │                              │                  │        │
│           ▼                              ▼                  ▼        │
│  ┌──────────────────┐           ┌───────────────┐  ┌────────────────┐│
│  │ LandingClient    │           │ BoxesPage     │  │ CombustiblesPg ││
│  │ (client component)│          │ (client)      │  │ (client)       ││
│  └──────────────────┘           └───────────────┘  └────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
           │                              │                  │
           │ compose                      │ compose          │ compose
           ▼                              ▼                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  SHARED CLIENT COMPONENTS (components/public/*.tsx)                  │
│                                                                     │
│  ┌──────────┐ ┌──────────┐ ┌───────────────┐ ┌──────────────────┐  │
│  │Landing   │ │Ticker    │ │Combustibles   │ │BoxesServices     │  │
│  │Hero      │ │Marquee   │ │Grid           │ │Section           │  │
│  │(no prop) │ │(no prop) │ │(combustibles) │ │(servicios)       │  │
│  └──────────┘ └──────────┘ └───────────────┘ └──────────────────┘  │
│                                                                     │
│  ┌──────────┐ ┌──────────┐                                          │
│  │CTA       │ │Footer    │  ← shared by ALL 3 pages                 │
│  │Section   │ │Section   │                                          │
│  │(no prop) │ │(no prop) │                                          │
│  └──────────┘ └──────────┘                                          │
└─────────────────────────────────────────────────────────────────────┘
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `supabase/migrations/XXXXX_add_boxes_services.sql` | Create | Migration: `boxes_services` table + seed data + RLS |
| `src/lib/supabase/types.ts` | Modify | Add `BoxService` type to `Database` interface |
| `src/lib/supabase/queries.ts` | Modify | Add `getBoxesServices()` server query |
| `src/lib/utils/public.ts` | Create | Shared utilities: `getCombustibleColor()`, `containerVariants`, `itemVariants` |
| `src/hooks/useCountUp.ts` | Create | Extracted `useCountUp` hook |
| `src/components/public/LandingHero.tsx` | Create | Hero section (extracted from `LandingClient.tsx`) |
| `src/components/public/TickerMarquee.tsx` | Create | Yellow scrolling ticker (extracted) |
| `src/components/public/CombustiblesGrid.tsx` | Create | Fuel cards grid with section header + empty state |
| `src/components/public/BoxesServicesSection.tsx` | Create | Services list + stat panel + icon slug→component map |
| `src/components/public/CTASection.tsx` | Create | "¿Tenés hambre?" menu CTA (extracted) |
| `src/components/public/FooterSection.tsx` | Create | Shared footer for all 3 public pages |
| `src/app/(public)/LandingClient.tsx` | Rewrite | Compose from extracted components, remove all inline section JSX |
| `src/app/(public)/page.tsx` | Modify | Add `getBoxesServices()` call, pass `servicios` to `LandingClient` |
| `src/app/(public)/boxes/page.tsx` | Rewrite | DB-backed, dark theme tokens, shared `BoxesServicesSection` + `FooterSection` |
| `src/app/(public)/combustibles/page.tsx` | Rewrite | Dark theme tokens, shared `CombustiblesGrid` + `FooterSection` |

## Interfaces / Contracts

### BoxService Type (added to `types.ts` `Database.public.Tables`)

```typescript
boxes_services: {
  Row: {
    id: string
    nombre: string
    descripcion: string | null
    icono_slug: string
    disponible: boolean
    orden: number
  }
  Insert: Omit<Database['public']['Tables']['boxes_services']['Row'], 'id'> & { id?: string }
  Update: Partial<Database['public']['Tables']['boxes_services']['Insert']>
}
```

### Query Function (added to `queries.ts`)

```typescript
export async function getBoxesServices(): Promise<BoxService[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('boxes_services')
    .select('*')
    .eq('disponible', true)
    .order('orden', { ascending: true })
  if (error) throw new Error(`Error fetching boxes services: ${error.message}`)
  return data ?? []
}
```

### Component Props

| Component | Props Interface | Notes |
|-----------|----------------|-------|
| `LandingHero` | (none) | Self-contained. Uses `containerVariants`/`itemVariants` from `@/lib/utils/public` |
| `TickerMarquee` | (none) | Self-contained. Relies on existing `.marquee-wrapper` / `.marquee-track` CSS in `globals.css` |
| `CombustiblesGrid` | `{ combustibles: Combustible[] }` | Renders badge + h2 + subtitle + card grid + empty state |
| `BoxesServicesSection` | `{ servicios: BoxService[] }` | Renders left text column + right stat panel. Uses `useCountUp` hook |
| `CTASection` | (none) | Self-contained. Links to `/full` |
| `FooterSection` | (none) | Shared across all 3 pages. Links: `/combustibles`, `/boxes`, `/full`, WhatsApp |

### Icon Slug → Lucide Component Map (inside `BoxesServicesSection.tsx`)

```typescript
import { Droplets, Gauge, Thermometer, Eye, Activity, CheckCircle2, Car } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  Droplets,
  Gauge,
  Thermometer,
  Eye,
  Activity,
  CheckCircle2,
}

// Usage: const Icon = ICON_MAP[servicio.icono_slug] ?? Car
```

### Shared Utilities (`src/lib/utils/public.ts`)

```typescript
import type { Combustible } from '@/lib/supabase/types'

export function getCombustibleColor(nombre: string, colorHex: string | null): string {
  // same logic as current LandingClient.tsx lines 21-30
}

export const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}
```

### useCountUp Hook (`src/hooks/useCountUp.ts`)

```typescript
'use client'
import { useState, useEffect, useRef } from 'react'

export function useCountUp(target: number, duration = 2000, inView: boolean) {
  // same logic as current LandingClient.tsx lines 48-69
}
```

## Migration SQL

```sql
-- Migration: add_boxes_services
-- Creates the boxes_services table with seed data for public display

CREATE TABLE boxes_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  icono_slug TEXT NOT NULL,
  disponible BOOLEAN DEFAULT true,
  orden INTEGER NOT NULL
);

-- Seed data (6 services matching current hardcoded values)
INSERT INTO boxes_services (nombre, descripcion, icono_slug, orden) VALUES
  ('Cambio de aceite',      'Lubricantes Elaion con la mejor tecnología.',   'Droplets',    1),
  ('Inflado de neumáticos', 'Control de presión y calibración.',            'Gauge',       2),
  ('Agua y refrigerante',   'Revisión y reposición de fluidos.',            'Thermometer', 3),
  ('Limpieza de parabrisas','Para tu máxima visibilidad en la ruta.',       'Eye',         4),
  ('Control de presión',    'Seguridad garantizada para tu viaje.',         'Activity',    5),
  ('Revisión general',      'Chequeo de 20 puntos clave de tu vehículo.',   'CheckCircle2',6);

-- RLS
ALTER TABLE boxes_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON boxes_services
  FOR SELECT USING (true);

CREATE POLICY "Admin full access" ON boxes_services
  FOR ALL USING (auth.role() = 'authenticated');
```

### Page Compositions

#### LandingClient.tsx (after refactor)

```tsx
'use client'
import type { Combustible, BoxService } from '@/lib/supabase/types'
import { LandingHero } from '@/components/public/LandingHero'
import { TickerMarquee } from '@/components/public/TickerMarquee'
import { CombustiblesGrid } from '@/components/public/CombustiblesGrid'
import { BoxesServicesSection } from '@/components/public/BoxesServicesSection'
import { CTASection } from '@/components/public/CTASection'
import { FooterSection } from '@/components/public/FooterSection'

interface LandingClientProps {
  combustibles: Combustible[]
  servicios: BoxService[]
}

export function LandingClient({ combustibles, servicios }: LandingClientProps) {
  return (
    <div className="flex flex-col w-full" style={{ background: 'var(--bg-base)', marginTop: -68 }}>
      <LandingHero />
      <TickerMarquee />
      <CombustiblesGrid combustibles={combustibles} />
      <BoxesServicesSection servicios={servicios} />
      <CTASection />
      <FooterSection />
    </div>
  )
}
```

#### Boxes Page (after rewrite)

```tsx
import type { Metadata } from 'next'
import { getBoxesServices } from '@/lib/supabase/queries'
import { BoxesServicesSection } from '@/components/public/BoxesServicesSection'
import { FooterSection } from '@/components/public/FooterSection'
import { Clock, MapPin } from 'lucide-react'

export const metadata: Metadata = { /* ... */ }
export const revalidate = 60

export default async function BoxesPage() {
  const servicios = await getBoxesServices()
  return (
    <div className="flex flex-col w-full" style={{ background: 'var(--bg-base)' }}>
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[50vh] overflow-hidden bg-hero-gradient">
        {/* grid overlay */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--text-primary)]">...</h1>
        <p className="text-xl md:text-2xl" style={{ color: 'var(--text-secondary)' }}>...</p>
      </section>

      <BoxesServicesSection servicios={servicios} />

      {/* Hours & Location (inline — structurally unique) */}
      <section className="py-16 px-6" style={{ background: 'var(--bg-elevated)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <Clock className="w-8 h-8" style={{ color: 'var(--ypf-blue-bright)' }} />
            <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Horarios de Atención</h3>
            <p style={{ color: 'var(--text-secondary)' }}>...</p>
          </div>
          <div className="p-8 rounded-3xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <MapPin className="w-8 h-8" style={{ color: 'var(--ypf-blue-bright)' }} />
            <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Ubicación</h3>
            <p style={{ color: 'var(--text-secondary)' }}>...</p>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  )
}
```

#### Combustibles Page (after rewrite)

```tsx
import type { Metadata } from 'next'
import { getCombustibles } from '@/lib/supabase/queries'
import { CombustiblesGrid } from '@/components/public/CombustiblesGrid'
import { FooterSection } from '@/components/public/FooterSection'
import { Info } from 'lucide-react'

export const metadata: Metadata = { /* ... */ }
export const revalidate = 60

export default async function CombustiblesPage() {
  const combustibles = await getCombustibles()
  return (
    <div className="flex flex-col w-full" style={{ background: 'var(--bg-base)' }}>
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[50vh] bg-hero-gradient">
        <h1 className="text-4xl md:text-6xl font-black text-[var(--text-primary)]">...</h1>
        <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>...</p>
      </section>

      <CombustiblesGrid combustibles={combustibles} />

      {/* Infinia info (inline — structurally unique) */}
      <section className="py-16 px-6" style={{ background: 'var(--bg-elevated)' }}>
        {/* Info card with technology description */}
      </section>

      <FooterSection />
    </div>
  )
}
```

## Responsive Breakpoint Strategy

| Breakpoint | Target | Grid | Typography | Layout |
|------------|--------|------|------------|--------|
| 320px (mobile) | iPhone SE | 1-col grids | `clamp(28px, 4vw, 44px)` headings | Stacked sections, no gaps |
| 768px (tablet) | iPad | 2-col grids | Larger body | Hero at 50vh, two-column footer |
| 1024px (laptop) | Standard | 3-col grids | Full heading size | BoxesServices side-by-side |
| 1440px (desktop) | Wide | 3-col + max-width | Max heading clamp | `max-width: min(1280px, 92vw)` |

All pages use existing `max-width: min(1280px, 92vw)` central constraint, `clamp()` for typography, and Tailwind's `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` pattern (already established in LandingClient).

## Animation Patterns

| Component | Animation | Mechanism |
|-----------|-----------|-----------|
| `LandingHero` | Staggered fade-up (badge → brand → tagline → CTAs → scroll indicator) | `containerVariants` + `itemVariants` (framer-motion `animate="visible"`) |
| `TickerMarquee` | Continuous horizontal scroll, pause on hover | CSS `@keyframes marquee`, `.marquee-wrapper:hover .marquee-track { animation-play-state: paused; }` (existing in `globals.css`) |
| `CombustiblesGrid` | Cards fade-up staggered by index | framer-motion `whileInView` with `index * 0.08` delay per card |
| `BoxesServicesSection` | Left/right columns slide in from edges on scroll | framer-motion `initial={{ opacity: 0, x: -30 }}` + `animate` triggered by `useInView` |
| `CTASection` | Staggered fade-up (h2 → p → button) | framer-motion `whileInView` with `transition.delay` |
| `FooterSection` | No animation | Static |

Common patterns: `viewport={{ once: true }}`, `ease: [0.25, 0.46, 0.45, 0.94]` (custom cubic-bezier), 0.6s duration.

## Migration / Rollout

1. **Migration first**: Run `supabase/migrations/XXXXX_add_boxes_services.sql` before any code changes
2. **Feature branch**: All changes in a single branch targeting `main`
3. **Verification**: Visual regression check on landing page first, then boxes, then combustibles
4. **Rollback**: `git revert` the merge commit; drop `boxes_services` table via Supabase dashboard if needed

No feature flags needed. This is a pure refactor + data migration with no runtime toggle.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Type | BoxService type matches DB schema | TypeScript strict compile |
| Integration | `getBoxesServices()` returns ordered services | Manual Supabase query verification |
| Visual | All 3 pages render at 4 breakpoints | Manual browser check (320, 768, 1024, 1440) |
| Regression | Landing page has same visual output | Side-by-side comparison with production |
| Build | No broken imports after extraction | `pnpm build` must pass |

Due to the current project setup (no existing component tests for public pages), testing is primarily visual and build-based. If testing infra exists for server queries, add a `getBoxesServices` test.

## Open Questions

- [ ] None — all decisions resolved by existing specs and codebase patterns
