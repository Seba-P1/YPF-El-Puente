# Proposal: SEO Slice 2 — Enriquecimiento de Contenido

> Segundo slice de SEO para YPF El Puente. Agrega Schema.org JSON-LD, imagen OG física, jerarquía de headings correcta, alt text mejorado, migración del hero a `next/image` y priority hints. Construye directamente sobre los fundamentos ya verificados del Slice 1.

## 1. Executive Summary

El Slice 1 dejó al sitio indexable con dominio canónico, metadata base, canonicals, sitemap, robots, favicon y páginas de error con `noindex`. El Slice 2 enriquece el contenido indexable: agrega `LocalBusiness`/`Restaurant` y `Menu` schemas, genera una imagen OG 1200x630, corrige saltos de encabezados `h1→h3`, agrega el `h1` faltante en `/full`, mejora el `alt` text de Instagram, migra el hero a `next/image` y aplica priority hints solo en el hero above-the-fold. Es un slice contenido, sin cambios de arquitectura ni dependencias nuevas.

## 2. Motivation / Problem

Google ya puede rastrear el sitio, pero aún no recibe señales de relevancia local ni semántica de contenido:

- **Sin structured data**: no hay JSON-LD que identifique al negocio como restaurante/cafetería ni que exponga el menú como `Menu` schema.
- **Sin imagen OG**: los shares en redes y resultados de búsqueda muestran solo texto, reduciendo CTR.
- **Jerarquía de headings rota**: `/full/menu` y `/combustibles` saltan de `h1` a `h3`, lo que dificulta la comprensión del documento.
- **Sin `<h1>` en `/full`**: el hero es un logo SVG sin título semántico principal.
- **Alt text genérico**: las tarjetas de Instagram usan `"Publicación de Instagram"` para todas las imágenes.
- **Hero con `<img>` nativo**: pierde optimización automática de `next/image` y no aproveita priority hints.

## 3. Proposed Changes (R14-R22)

| ID | Requerimiento | Archivo objetivo |
|----|---------------|------------------|
| R14 | Renderizar `Restaurant` JSON-LD en la landing | `src/app/(public)/page.tsx` |
| R15 | Renderizar `Menu` schema.org dinámico en `/full` | `src/app/(full)/full/page.tsx` |
| R16 | Generar imagen OG 1200x630 | `src/app/(public)/opengraph-image.tsx` + `src/app/icon.tsx` fallback |
| R17 | Metadata OG con imagen en páginas públicas | `src/lib/seo/metadata.ts`, metadatas de página |
| R18 | Agregar `<h1>` semántico en `/full` | `src/app/(full)/full/FullClient.tsx` |
| R19 | Corregir saltos `h1→h3` a `h1→h2→h3` | `src/app/(full)/full/menu/page.tsx`, `src/app/(public)/combustibles/page.tsx` |
| R20 | Alt text específico en Instagram | `src/components/public/FullInstagramSection.tsx` |
| R21 | Migrar hero `<img>` nativo a `next/image` | `src/app/(full)/full/FullClient.tsx` |
| R22 | Priority hints solo en hero above-the-fold | `src/app/(public)/LandingClient.tsx` (hero landing) |

### Capabilities SDD

**New:**
- `local-business-schema`: JSON-LD `Restaurant` en landing.
- `menu-schema`: JSON-LD `Menu` dinámico desde productos curados de `/full`.
- `og-image`: Generación de imagen OpenGraph 1200x630 vía `ImageResponse`.
- `heading-structure`: Corrección de jerarquía semántica de headings.
- `image-optimization`: `next/image` con `<picture>` art-direction y priority hints.

**Modified:**
- `page-metadata-seo`: Agregar campo `images` a OG en metadata de páginas públicas.
- `full-instagram-section`: Alt text descriptivo para posts de Instagram.

## 4. Technical Approach

### 4.1 Schema.org JSON-LD

- Usar `<script type="application/ld+json">` con `dangerouslySetInnerHTML` y `JSON.stringify(...).replace(/</g, '\\u003c')` (recomendación oficial de Next.js 16).
- `Restaurant` schema en landing (`src/app/(public)/page.tsx`) con datos cerrados:
  ```ts
  {
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
  ```
- `Menu` schema en `/full` (`src/app/(full)/full/page.tsx`) construido desde productos destacados/categorías con `precio > 0`.

### 4.2 Imagen OG

- Crear `src/app/(public)/opengraph-image.tsx` usando `ImageResponse` de `next/og`.
- Tamaño 1200x630, `contentType: 'image/png'`, `alt: 'YPF El Puente — Río Colorado'`.
- Diseño: fondo con gradiente de identidad YPF + marca textual "YPF El Puente" y tagline.
- Fallback: `src/app/icon.tsx` con mismo enfoque visual para favicon/icono.
- Si la generación dinámica es inviable, usar PNG estático en `public/og-image.jpg` y ajustar metadata.

### 4.3 Metadata OG con imagen

- Extender `createPageMetadata` en `src/lib/seo/metadata.ts` para aceptar `image?: string` y exponer `openGraph.images`.
- Actualizar metadatas de landing, `/combustibles`, `/full` y `/full/menu` para incluir la imagen OG.

### 4.4 Headings

- `/full`: agregar `<h1 className="sr-only">` o visualmente integrado con texto "YPF El Puente — Menú FULL" dentro del hero.
- `/full/menu`: envolver lista de productos con `<h2>Productos</h2>` (visualmente oculto si el diseño no lo requiere) antes de los `h3` de nombres.
- `/combustibles`: agregar `<h2>` intermedio antes de los `h3` existentes (sección Infinia / grid).

### 4.5 Hero con `next/image` + `<picture>`

- Reemplazar el `<picture>` + `<img>` nativo en `FullClient.tsx` por `getImageProps` de `next/image` para art-direction mobile/desktop.
- Mantener source mobile `/assets/ypf%20imagenes/RDP7-mobile.webp` y desktop `/assets/ypf%20imagenes/RDP7.webp`.

### 4.6 Priority hints

- Agregar `priority` (o `preload` en Next.js 16) solo en la imagen hero above-the-fold de la landing.
- No aplicar en el resto de imágenes para no anular el beneficio.

## 5. Scope Boundaries

### In Scope

- R14-R22 completos.
- Generación o fallback de imagen OG 1200x630.
- Actualización de metadata en 4 páginas públicas para incluir imagen OG.
- Corrección semántica de headings sin cambios visuales.
- Migración de hero `<img>` nativo a `next/image` manteniendo art-direction.
- Alt text de Instagram.

### Out of Scope

- Auditoría completa de TODO el alt text del sitio.
- Pruebas reales de performance (Lighthouse, Web Vitals).
- Configuración de Google Search Console / Business Profile.
- Datos pendientes del cliente: horarios, coordenadas GPS, descripción larga del negocio.
- Cambios de arquitectura, dependencias o hosting.

## 6. Assumptions

- El dominio canónico seguirá siendo `https://ypfelpuente.com.ar`.
- Los productos curados de `/full` tienen `precio > 0` y `disponible = true` para incluirse en `Menu` schema.
- El logo/marca existente es usable para renderizar en `ImageResponse`.
- No se requieren cambios visuales; solo ajustes semánticos de HTML.
- El cliente confirmará horarios y coordenadas GPS en un slice posterior.

## 7. Risks & Open Questions

| Risk / Question | Likelihood | Mitigation |
|-----------------|------------|------------|
| `ImageResponse` no renderiza fuentes locales correctamente | Medio | Cargar fuente del sistema o usar PNG estático como fallback. |
| `priority` prop deprecado en Next.js 16 en favor de `preload` | Medio | Usar `preload={true}` si la API de Next.js 16 lo requiere; documentar en implementación. |
| Productos sin precio o con precio 0 rompen `Menu` schema | Bajo | Filtrar `precio > 0` antes de serializar. |
| Cambio de etiquetas heading afecta estilos inesperados | Bajo | Aplicar clases `sr-only` o replicar estilos actuales en nuevos `h2`. |
| Imagen OG no se precarga correctamente por tamaño o path | Bajo | Verificar meta `og:image` en build output y validar URL absoluta. |

## 8. Out of Scope (Slice 3 candidates)

- Breadcrumbs schema en todas las páginas públicas.
- FAQ / HowTo schemas para secciones de combustibles o boxes.
- Lazy loading refinado y `sizes` auditados en todas las imágenes.
- Integración con Google Search Console y Business Profile.
- Reviews / rating schema si el cliente habilita reseñas.
- Optimización de Core Web Vitals con métricas reales.

## 9. Success Criteria

- [ ] `Restaurant` JSON-LD presente en HTML de `/` con `name`, `telephone`, `address`, `priceRange`, `servesCuisine`, `sameAs`.
- [ ] `Menu` JSON-LD presente en `/full` con secciones dinámicas y solo productos con `precio > 0`.
- [ ] `src/app/(public)/opengraph-image.tsx` genera imagen 1200x630 accesible en `https://ypfelpuente.com.ar/opengraph-image`.
- [ ] Las 4 páginas públicas incluyen `<meta property="og:image" .../>` con URL absoluta.
- [ ] `/full` tiene exactamente un `<h1>` con texto descriptivo.
- [ ] `/full/menu` y `/combustibles` tienen jerarquía `h1 → h2 → h3` sin saltos.
- [ ] Alt text de Instagram dice "Post de Instagram — @YPF.ELPUENTE" (o similar) en lugar de "Publicación de Instagram".
- [ ] Hero de `/full` usa `next/image` con `<picture>` para mobile/desktop.
- [ ] La imagen hero above-the-fold de la landing tiene `priority`/`preload` activo.
- [ ] `pnpm build` y `pnpm lint` pasan sin errores.
- [ ] No hay regresiones visuales en desktop 1440px ni mobile 320px.

## 10. Estimated Effort

| Archivo | Cambio | Líneas aproximadas |
|---------|--------|--------------------|
| `src/lib/seo/metadata.ts` | Extender `createPageMetadata` con `images` | +10 |
| `src/lib/seo/schemas.ts` (nuevo) | Helpers JSON-LD para Restaurant y Menu | ~50 |
| `src/app/(public)/page.tsx` | Restaurant JSON-LD | +20 |
| `src/app/(full)/full/page.tsx` | Menu JSON-LD | +25 |
| `src/app/(public)/opengraph-image.tsx` | Imagen OG generada | ~35 |
| `src/app/icon.tsx` | Fallback icono generado | ~25 |
| `src/app/(public)/page.tsx` | OG image en metadata | +2 |
| `src/app/(public)/combustibles/page.tsx` | OG image + heading h2 | +8 |
| `src/app/(full)/layout.tsx` | OG image en metadata | +2 |
| `src/app/(full)/full/menu/page.tsx` | OG image + heading h2 | +8 |
| `src/app/(full)/full/FullClient.tsx` | h1 hero + next/image picture | +20 |
| `src/components/public/FullInstagramSection.tsx` | Alt text específico | +1 |
| `src/components/public/LandingHero.tsx` | Priority hint en hero image | +1 |

**Total estimado**: ~12 archivos, ~200 líneas netas. Entra cómodamente en el presupuesto de 400 líneas de revisión; un solo PR es viable.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/lib/seo/` | New/Modified | Helpers de metadata y schemas JSON-LD. |
| `src/app/(public)/page.tsx` | Modified | Restaurant schema + OG image. |
| `src/app/(public)/combustibles/page.tsx` | Modified | OG image + heading h2. |
| `src/app/(full)/layout.tsx` | Modified | OG image en metadata. |
| `src/app/(full)/full/page.tsx` | Modified | Menu schema. |
| `src/app/(full)/full/menu/page.tsx` | Modified | OG image + heading h2. |
| `src/app/(full)/full/FullClient.tsx` | Modified | h1 hero + next/image con picture. |
| `src/components/public/FullInstagramSection.tsx` | Modified | Alt text específico. |
| `src/components/public/LandingHero.tsx` | Modified | Priority hint hero image. |
| `src/app/(public)/opengraph-image.tsx` | New | Imagen OG generada. |
| `src/app/icon.tsx` | New | Fallback icono generado. |

## Rollback Plan

1. Revertir el commit del slice o aplicar `git revert <sha>`.
2. Si se usa PNG estático, eliminar `public/og-image.jpg`.
3. Restaurar versiones anteriores de `FullClient.tsx`, `metadata.ts` y páginas afectadas.
4. Verificar que `pnpm build` pase y que los meta `og:image` desaparezcan.

## Dependencies

- Next.js 16.2.7 (`next/og`, `next/image`, App Router metadata API).
- Fuentes/logo existentes en `public/assets/ypf imagenes/`.
- Datos de productos y categorías desde Supabase (ya disponibles).
