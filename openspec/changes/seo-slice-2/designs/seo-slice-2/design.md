# Design: SEO Slice 2 — Enriquecimiento de Contenido

## Overview

Este diseño técnico describe cómo implementar los 9 requirements del SEO Slice 2 sobre la base ya verificada del Slice 1. El enfoque es: generar primero la imagen OG (porque otros requirements la referencian), luego conectarla a la metadata, después agregar los dos schemas JSON-LD, y finalmente aplicar los fixes semánticos y de performance que no alteran el scope aprobado.

---

## Implementation Order

El orden busca que cada paso tenga sus dependencias resueltas y pueda validarse de forma aislada.

| # | Requirement | Archivos principales | Dependencias | Notas |
|---|-------------|----------------------|--------------|-------|
| 1 | **R16** OpenGraph image | `src/app/opengraph-image.tsx` (new), `public/assets/og-image.png` (fallback) | Ninguna | Genera `/opengraph-image` 1200×630. Prerrequisito de R14 y R17. |
| 2 | **R17** OG metadata con imagen | `src/lib/seo/metadata.ts`, `src/app/(public)/page.tsx`, `src/app/(public)/combustibles/page.tsx`, `src/app/(full)/layout.tsx`, `src/app/(full)/full/menu/page.tsx` | R16 | Extender helper y actualizar 4 páginas públicas. |
| 3 | **R14** LocalBusiness JSON-LD | `src/components/seo/LocalBusinessSchema.tsx` (new), `src/app/(public)/page.tsx` | R16 (usa `/opengraph-image` como `image`) | Datos hardcodeados; TODO markers para datos del cliente. |
| 4 | **R15** Menu JSON-LD | `src/components/seo/MenuSchema.tsx` (new), `src/app/(full)/full/page.tsx` | R16 | Construido desde categorías/productos con `precio > 0`. |
| 5 | **R18** h1 en `/full` | `src/app/(full)/full/FullClient.tsx` | Ninguna | Integrado visualmente al hero, no `sr-only`. |
| 6 | **R19** Heading fixes | `src/app/(full)/full/menu/MenuClient.tsx`, `src/app/(public)/combustibles/page.tsx` | Ninguna | Insertar `h2` intermedio sin cambiar estilos visibles. |
| 7 | **R20** Alt text Instagram | `src/components/public/FullInstagramSection.tsx` | Ninguna | Cambio localizado de un string. |
| 8 | **R21** Hero `<img>` → `next/image` | `src/app/(full)/full/FullClient.tsx` | Ninguna | `getImageProps` + `<picture>` manteniendo art-direction. |
| 9 | **R22** Preload landing hero | `src/components/public/LandingHero.tsx` | Ninguna | Solo el fallback del hero above-the-fold. |

### Punto de no retorno

**R21 — migración del hero de `/full` a `next/image`** es el punto de no retorno visual. Si `getImageProps` o el `<picture>` resultante no respeta el art-direction mobile/desktop, el hero se romperá en un breakpoint claro. Antes de mergear se debe:

1. Verificar en `pnpm dev` que `/full` muestra `RDP7-mobile.webp` por debajo de 768px y `RDP7.webp` por encima.
2. Verificar en `pnpm build` + `pnpm start` que el HTML generado contiene el `<picture>` con los `srcSet` correctos.
3. Revisar en desktop 1440px y mobile 320px que no hay regresión de layout.

---

## Architecture Decisions

### AD-1: JSON-LD como Server Components en `src/components/seo/`

Se crean dos componentes puros que solo renderizan `<script type="application/ld+json">`:

- `src/components/seo/LocalBusinessSchema.tsx` — schema `Restaurant` con datos cerrados.
- `src/components/seo/MenuSchema.tsx` — schema `Menu` construido desde props tipados.

Ambos usan `dangerouslySetInnerHTML` con `JSON.stringify(...).replace(/</g, '\\u003c')`, siguiendo la recomendación oficial de Next.js 16. El contenido es hardcodeado o generado internamente a partir de datos ya validados, por lo que el riesgo de inyección es nulo.

```tsx
// src/components/seo/LocalBusinessSchema.tsx
import { CANONICAL_DOMAIN } from '@/lib/seo/constants'

const restaurantSchema = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'YPF El Puente',
  telephone: '+5492920264433',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Ruta Nacional 22 Km 857',
    addressLocality: 'Río Colorado',
    addressRegion: 'Río Negro',
    addressCountry: 'AR',
  },
  priceRange: '$$',
  servesCuisine: ['Hamburguesas', 'Cafetería', 'Comida rápida'],
  sameAs: ['https://www.instagram.com/ypf.elpuente'],
  image: `${CANONICAL_DOMAIN}/opengraph-image`,
  // TODO(client): openingHoursSpecification
  // TODO(client): geo (coordinates)
}

export default function LocalBusinessSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(restaurantSchema).replace(/</g, '\\u003c'),
      }}
    />
  )
}
```

```tsx
// src/components/seo/MenuSchema.tsx
interface MenuSchemaSection {
  name: string
  products: { name: string; price: number }[]
}

interface MenuSchemaProps {
  sections: MenuSchemaSection[]
}

function buildMenuSchema(sections: MenuSchemaSection[]) {
  const validSections = sections
    .map((s) => ({ ...s, products: s.products.filter((p) => p.price > 0) }))
    .filter((s) => s.products.length > 0)

  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: 'Menú FULL — YPF El Puente',
    hasMenuSection: validSections.map((s) => ({
      '@type': 'MenuSection',
      name: s.name,
      hasMenuItem: s.products.map((p) => ({
        '@type': 'MenuItem',
        name: p.name,
        offers: {
          '@type': 'Offer',
          price: p.price.toFixed(2),
          priceCurrency: 'ARS',
        },
      })),
    })),
  }
}

export default function MenuSchema({ sections }: MenuSchemaProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildMenuSchema(sections)).replace(/</g, '\\u003c'),
      }}
    />
  )
}
```

**Justificación:** encapsula la serialización y los TODO markers, evita que los Server Components de página se ensucien con strings JSON, y hace testeable la construcción del schema.

### AD-2: OpenGraph image en `src/app/opengraph-image.tsx`

Se crea el archivo en el segmento raíz del App Router para que la convención de Next.js 16 lo descubra automáticamente en todas las rutas públicas. Se usa `ImageResponse` de `next/og` con exports `alt`, `size` y `contentType`.

```tsx
// src/app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const alt = 'YPF El Puente — Río Colorado'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0070C0 0%, #001428 100%)',
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: '#FFD100',
            letterSpacing: '-0.02em',
          }}
        >
          YPF El Puente
        </div>
        <div
          style={{
            fontSize: 40,
            color: '#FFFFFF',
            marginTop: 16,
          }}
        >
          Río Colorado · Patagonia Argentina
        </div>
      </div>
    ),
    { ...size }
  )
}
```

**Plan B — fallback PNG estático:** si `ImageResponse` falla en build (por ejemplo, problemas de fuentes o memoria en el runner), se coloca una imagen 1200×630 en `public/assets/og-image.png` y las páginas apuntan explícitamente a `/assets/og-image.png` en lugar de `/opengraph-image`.

**Justificación:** el spec aprobado fija la ruta `src/app/opengraph-image.tsx`. Al estar en el segmento raíz, cualquier página pública hereda la imagen OG automáticamente, aunque seguiremos declarando `openGraph.images` explícitamente para que la verificación sea determinista.

### AD-3: Extender `createPageMetadata` con imagen OG

Se agrega un parámetro opcional `image?: string` a `PageMetaInput`. Cuando está presente, el helper inyecta `openGraph.images` con width, height y alt fijos.

```ts
// src/lib/seo/metadata.ts
import type { Metadata } from 'next'
import { DEFAULT_LOCALE, OG_TYPE, SITE_NAME } from './constants'

const OG_IMAGE_ALT = 'YPF El Puente — Río Colorado'

interface PageMetaInput {
  title: string
  description: string
  keywords?: string[]
  canonical: string
  image?: string
}

export function createPageMetadata(input: PageMetaInput): Metadata {
  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical: input.canonical },
    openGraph: {
      title: input.title,
      description: input.description,
      locale: DEFAULT_LOCALE,
      type: OG_TYPE,
      siteName: SITE_NAME,
      images: input.image
        ? [{ url: input.image, width: 1200, height: 630, alt: OG_IMAGE_ALT }]
        : undefined,
    },
  }
}
```

Las páginas que no usan `createPageMetadata` (`combustibles`, `full/menu`) se actualizan inline con el mismo objeto `openGraph.images`.

**Justificación:** mantiene un solo helper para las páginas que ya lo usan y un único lugar donde cambiar las dimensiones o el alt de la imagen OG.

### AD-4: `<h1>` en `/full` integrado visualmente

Se agrega exactamente un `<h1>` dentro de `renderHeroSection` en `FullClient.tsx`, con el texto "Menú FULL — YPF El Puente". A diferencia del spec base que permitía `sr-only`, la decisión técnica cerrada es integrarlo al diseño.

Opciones de ubicación (a validar visualmente durante implementación):

1. **Debajo del logo RDP7**, con tipografía `var(--font-din-medium)`, color blanco, tamaño reducido, sin sombras que compitan con el logo.
2. **Encima del logo**, como línea de contexto pequeña en amarillo `#FFD100`.

La implementación final elegirá la opción 1 salvo que el reviewer decida lo contrario; el logo RDP7 sigue siendo el elemento visual dominante y el `<h1>` actúa como subtítulo semántico principal.

**Justificación:** cumple el requerimiento de exactamente un `h1` descriptivo y la decisión cerrada de no usar `sr-only`, aportando valor semántico y visual.

### AD-5: Heading fixes sin alterar estilos

Se insertan `<h2>` intermedios en los dos puntos donde actualmente hay salto `h1 → h3`:

- `src/app/(full)/full/menu/MenuClient.tsx`: `<h2 className="sr-only">Productos</h2>` justo antes del grid de productos.
- `src/app/(public)/combustibles/page.tsx`: `<h2 className="sr-only">Listado de combustibles</h2>` justo antes de `<CombustiblesGrid />`.

```tsx
// En MenuClient.tsx, antes del grid
<h2 className="sr-only">Productos</h2>

// En combustibles/page.tsx, antes de CombustiblesGrid
<h2 className="sr-only">Listado de combustibles</h2>
<CombustiblesGrid combustibles={combustibles} />
```

**Justificación:** corrige la jerarquía semántica sin cambiar el diseño visual. `sr-only` es la forma más segura de no introducir regresiones.

### AD-6: `getImageProps` + `<picture>` en `FullClient.tsx`

Se reemplaza el bloque nativo `<picture> + <img>` por `getImageProps` de `next/image`, generando dos juegos de props (mobile y desktop) y renderizando el `<picture>` manualmente.

```tsx
// src/app/(full)/full/FullClient.tsx
import { getImageProps } from 'next/image'

function HeroPicture() {
  const common = {
    alt: 'RDP7 YPF FULL',
    fill: true,
    sizes: '100vw',
    className: 'w-full h-full object-cover object-center opacity-100',
  }

  const {
    props: { srcSet: desktop, ...rest },
  } = getImageProps({
    ...common,
    src: '/assets/ypf%20imagenes/RDP7.webp',
    width: 1920,
    height: 1080,
  })

  const {
    props: { srcSet: mobile },
  } = getImageProps({
    ...common,
    src: '/assets/ypf%20imagenes/RDP7-mobile.webp',
    width: 768,
    height: 1024,
  })

  return (
    <picture>
      <source media="(max-width: 768px)" srcSet={mobile} />
      <img {...rest} srcSet={desktop} />
    </picture>
  )
}
```

**Justificación:** es la API documentada de Next.js 16 para art-direction sin perder la optimización de `next/image`. Mantiene los paths exactos del spec (`/assets/ypf%20imagenes/...`).

### AD-7: `preload={true}` solo en el fallback del hero de landing

Se migra el `<img>` nativo del fallback de `LandingHero.tsx` a `next/image` con `preload={true}`. El video mantiene su `preload="auto"` nativo.

```tsx
// src/components/public/LandingHero.tsx
import Image from 'next/image'

{prefersReducedMotion && (
  <Image
    src={videoSources.poster}
    alt="Hero background"
    fill
    className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-60"
    preload={true}
  />
)}
```

**Justificación:** cumple el spec R22 y la API de Next.js 16, que deprecó `priority` en favor de `preload`. Al ser un Client Component, la inyección del `<link rel="preload">` puede ocurrir en el cliente; se verificará en build output y, si es necesario, se inyectará manualmente.

---

## Component Structure

### Archivos nuevos

| Archivo | Propósito |
|---------|-----------|
| `src/components/seo/LocalBusinessSchema.tsx` | Server Component con JSON-LD `Restaurant` para la landing. |
| `src/components/seo/MenuSchema.tsx` | Server Component con JSON-LD `Menu` para `/full`. |
| `src/app/opengraph-image.tsx` | Generación dinámica de imagen OG 1200×630. |
| `public/assets/og-image.png` | Fallback estático si `ImageResponse` no es viable. |

### Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `src/lib/seo/metadata.ts` | Agregar parámetro `image?: string` e inyectar `openGraph.images`. |
| `src/app/(public)/page.tsx` | Renderizar `<LocalBusinessSchema />`; pasar `image` a `createPageMetadata`. |
| `src/app/(full)/full/page.tsx` | Renderizar `<MenuSchema sections={...} />`; preparar datos de productos. |
| `src/app/(full)/layout.tsx` | Pasar `image` a metadata (o actualizar `openGraph.images` inline). |
| `src/app/(public)/combustibles/page.tsx` | Agregar `h2` sr-only y `openGraph.images`. |
| `src/app/(full)/full/menu/page.tsx` | Agregar `h2` sr-only y `openGraph.images`. |
| `src/app/(full)/full/FullClient.tsx` | Agregar `<h1>` visual en hero; migrar hero image a `getImageProps` + `<picture>`. |
| `src/components/public/FullInstagramSection.tsx` | Cambiar alt text de la card de imagen. |
| `src/components/public/LandingHero.tsx` | Migrar fallback image a `next/image` con `preload={true}`. |

### Archivos eliminados

Ninguno.

---

## Shared Strategy

### Constantes y valores reutilizables

- `CANONICAL_DOMAIN` (existente) se usa para construir `image` en `LocalBusinessSchema`.
- `SITE_NAME` (existente) se mantiene en `openGraph.siteName`.
- `OG_IMAGE_ALT = 'YPF El Puente — Río Colorado'` vive en `src/lib/seo/metadata.ts` y se usa tanto en metadata como en `opengraph-image.tsx` (duplicar el string está permitido para mantener el archivo OG autocontenido, o importarlo si se prefiere).

### Convención de paths OG

- Ruta dinámica: `/opengraph-image` (resuelta por `metadataBase` a absoluta).
- Fallback estático: `/assets/og-image.png`.

Si se activa el fallback, se cambia el string `image` en las 4 páginas de `/opengraph-image` a `/assets/og-image.png`.

---

## Verification Strategy

### Comandos base

```bash
pnpm lint
pnpm build
pnpm start
```

### Verificación por requirement

| Req | Comando / inspección | Qué debe aparecer |
|-----|---------------------|-------------------|
| R14 | `curl -s http://localhost:3000/ \| grep -A30 'application/ld+json'` | `@type": "Restaurant"`, `name`, `telephone`, `address`, `priceRange`, `servesCuisine`, `sameAs`, `image`. Sin `openingHoursSpecification` ni `geo`. |
| R15 | `curl -s http://localhost:3000/full \| grep -A40 'application/ld+json'` | `@type": "Menu"`, `hasMenuSection`, `hasMenuItem`, `offers.price`. Sin productos con precio 0. |
| R16 | `curl -I http://localhost:3000/opengraph-image` | `200 OK`, content-type `image/png`. |
| R16 | Abrir `/opengraph-image` en browser / Network | Imagen 1200×630 con marca "YPF El Puente". |
| R17 | `curl -s http://localhost:3000/ \| grep 'og:image'` | URL absoluta `https://ypfelpuente.com.ar/opengraph-image`. |
| R17 | `curl -s http://localhost:3000/combustibles \| grep 'og:image'` | Misma URL absoluta. |
| R17 | `curl -s http://localhost:3000/full \| grep 'og:image'` | Misma URL absoluta. |
| R17 | `curl -s http://localhost:3000/full/menu \| grep 'og:image'` | Misma URL absoluta. |
| R18 | `curl -s http://localhost:3000/full \| grep -i '<h1'` | Exactamente un `<h1>` con texto "Menú FULL — YPF El Puente". |
| R19 | `curl -s http://localhost:3000/full/menu \| grep -iE '<h[123]'` | Outline `h1 → h2 → h3`. |
| R19 | `curl -s http://localhost:3000/combustibles \| grep -iE '<h[123]'` | Outline `h1 → h2 → h3`. |
| R20 | Inspeccionar HTML de `/full` en la sección Instagram | `alt="Post de Instagram — @YPF.ELPUENTE"` en las cards de imagen. |
| R21 | `curl -s http://localhost:3000/full \| grep -iE '<picture|<source|srcset'` | `<picture>` con `<source media="(max-width: 768px)">` apuntando a `RDP7-mobile.webp` e `img` apuntando a `RDP7.webp`. |
| R22 | Inspeccionar `<head>` de `/` | `<link rel="preload" as="image" ...>` para el poster del hero (solo cuando `prefers-reduced-motion`). |

### Herramientas online recomendadas

- [Google Rich Results Test](https://search.google.com/test/rich-results) para validar `Restaurant` y `Menu` schemas.
- [Schema.org Validator](https://validator.schema.org/) para verificar sintaxis JSON-LD.
- [OpenGraph.xyz](https://opengraph.xyz/) o Facebook Sharing Debugger para previsualizar el share.
- axe DevTools o [WAVE](https://wave.webaim.org/) para verificar jerarquía de headings.

---

## Safety & Rollback

### Cambios seguros (bajo riesgo de UI)

- `src/components/seo/LocalBusinessSchema.tsx` (nuevo).
- `src/components/seo/MenuSchema.tsx` (nuevo).
- `src/app/opengraph-image.tsx` (nuevo).
- `src/lib/seo/metadata.ts` (solo agrega campo opcional).
- `src/components/public/FullInstagramSection.tsx` (cambio de string).
- Actualizaciones de `openGraph.images` en páginas (solo metadata).

### Cambios que requieren testing extra

- **`src/app/(full)/full/FullClient.tsx`:** migración del hero a `next/image` + `<picture>` y agregado visual de `<h1>`. Requiere revisión visual en 320px, 768px y 1440px.
- **`src/components/public/LandingHero.tsx`:** `preload={true}` en Client Component; verificar que el preload link se genere o inyectar manualmente.
- **`src/app/(full)/full/menu/MenuClient.tsx` y `src/app/(public)/combustibles/page.tsx`:** inserción de `h2`; aunque sea `sr-only`, validar que no rompa layout grid.

### Rollback

1. Si un requirement falla, revertir su commit de trabajo (work-unit commits recomendados).
2. Si `opengraph-image.tsx` no funciona en producción:
   - Generar `public/assets/og-image.png` 1200×630.
   - Cambiar el path de `openGraph.images` de `/opengraph-image` a `/assets/og-image.png` en las 4 páginas.
3. Si el hero de `/full` se rompe visualmente:
   - Restaurar el `<picture> + <img>` nativo original.
   - Mantener el `<h1>` visual si no es la causa de la regresión.
4. Si `preload={true}` en `LandingHero` no inyecta el link o genera warning, degradar a `<img>` nativo con `<link rel="preload" as="image" href={...} />` manual en layout.

---

## Risks & Mitigations

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| `ImageResponse` falla en build por fuentes/memoria | Media | Medio | Fallback estático `public/assets/og-image.png`; cambiar paths en metadata. |
| `preload={true}` en Client Component no inyecta `<link>` SSR | Media | Bajo | Verificar build output; inyectar preload link manual si falta. |
| `getImageProps` no respeta art-direction con paths que contienen `%20` | Baja | Alto | Mantener paths exactos del spec; probar ambos viewports en `pnpm dev` y `pnpm start`. |
| `<h1>` visual en `/full` rompe centrado del hero | Baja | Medio | Validar en 320px/1440px; ajustar posición/margen sin cambiar altura de sección. |
| Heading fixes en componentes compartidos afectan otras páginas | Baja | Medio | Insertar `h2` en wrappers de página, nunca dentro de `CombustiblesGrid`. |
| Datos de productos con `precio <= 0` filtran secciones enteras del Menu schema | Baja | Bajo | El helper ya filtra por precio; revisar en build que no desaparezcan secciones enteras por error. |

---

## Notes for Implementer

### R16 snippet — `src/app/opengraph-image.tsx`

```tsx
import { ImageResponse } from 'next/og'

export const alt = 'YPF El Puente — Río Colorado'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0070C0 0%, #001428 100%)',
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 900, color: '#FFD100' }}>
          YPF El Puente
        </div>
        <div style={{ fontSize: 40, color: '#FFFFFF', marginTop: 16 }}>
          Río Colorado · Patagonia Argentina
        </div>
      </div>
    ),
    { ...size }
  )
}
```

### R15 snippet — construcción de secciones en `src/app/(full)/full/page.tsx`

```tsx
import MenuSchema from '@/components/seo/MenuSchema'

const menuSections = [
  { name: catHamb.nombre, products: fullHamburguesas },
  { name: catCaf.nombre, products: fullCafeteria },
  { name: catFull.nombre, products: initialFullMarca },
  { name: catSinTacc.nombre, products: fullSinTacc },
].map((s) => ({
  name: s.name,
  products: s.products.map((p) => ({ name: p.nombre, price: p.precio })),
}))

return (
  <>
    <MenuSchema sections={menuSections} />
    <FullClient ... />
  </>
)
```

### R22 snippet — fallback image en `LandingHero.tsx`

```tsx
import Image from 'next/image'

{prefersReducedMotion && (
  <Image
    src={videoSources.poster}
    alt="Hero background"
    fill
    className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-60"
    preload={true}
  />
)}
```

---

## Status

- **phase**: design
- **change_id**: seo-slice-2
- **proposal**: approved
- **spec**: approved
- **design**: ready for review

## Artifacts

- `openspec/changes/seo-slice-2/proposal.md` (input)
- `openspec/changes/seo-slice-2/specs/seo-slice-2/spec.md` (input)
- `openspec/changes/seo-slice-2/designs/seo-slice-2/design.md` (este archivo)

## Next Recommended

1. Revisión del design por el orchestrator / tech lead.
2. Generar tasks (`sdd-tasks`) agrupando requirements según el orden de implementación.
3. Ejecutar implementación empezando por R16 (`opengraph-image.tsx`).

## Risks

- R21 (migración del hero a `next/image`) es el punto de no retorno visual: requiere validación de art-direction en ambos breakpoints.
- R18 (`<h1>` visual en `/full`) puede afectar el centrado del hero; debe validarse en viewports extremos.
- R22 (`preload={true}` en Client Component) puede no generar el preload link server-side; requiere verificación post-build.
