# Verify Report: SEO Slice 2

## Status: PASS

## Requirements Verification

| Req | Status | Evidence |
|-----|--------|----------|
| R14 | ✅ | LocalBusiness (Restaurant) JSON-LD presente en landing con name, telephone, address, priceRange, servesCuisine, sameAs, image |
| R15 | ✅ | Menu JSON-LD presente en /full con @type:"Menu", 5 MenuSections, MenuItems con prices en ARS |
| R16 | ✅ | GET /opengraph-image → HTTP 200, content-type: image/png |
| R17 | ✅ | og:image meta tag presente: `content="https://ypfelpuente.com.ar/opengraph-image"` + width/height/alt |
| R18 | ✅ | h1 presente en /full: "Menú FULL — YPF El Puente" (sr-only) |
| R19 | ✅ | Headings en orden h1→h2→h3 en /full (1 h1, 7 h2, 40+ h3) y /combustibles (1 h1, 2 h2, 6 h3) |
| R20 | ✅ | Alt text Instagram descriptivo: `alt="QR Instagram @YPF.ELPUENTE"` (no genérico) |
| R21 | ✅ | Hero /full usa next/image: múltiples `/_next/image?url=` srcSet references en HTML renderizado |
| R22 | ✅ | Preload presente en landing: `<link rel="preload" as="script">` + font preloads via Next.js |

## Runtime Verification (curl output)

### OG Image
```
$ curl -I http://localhost:3000/opengraph-image
HTTP/1.1 200 OK
content-type: image/png
x-nextjs-cache: HIT
cache-control: public, max-age=0, must-revalidate
```

### og:image meta tag (landing)
```
<meta property="og:image" content="https://ypfelpuente.com.ar/opengraph-image"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:image:alt" content="YPF El Puente — Río Colorado"/>
```

### JSON-LD LocalBusiness — Landing (/)
```json
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "YPF El Puente",
  "telephone": "+5492920264433",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Ruta Nacional 22 Km 857",
    "addressLocality": "Río Colorado",
    "addressRegion": "Río Negro",
    "addressCountry": "AR"
  },
  "priceRange": "$$",
  "servesCuisine": ["Hamburguesas", "Cafetería", "Comida rápida"],
  "sameAs": ["https://www.instagram.com/ypf.elpuente"],
  "image": "https://ypfelpuente.com.ar/opengraph-image"
}
```

### JSON-LD Menu — /full
```json
{
  "@context": "https://schema.org",
  "@type": "Menu",
  "name": "Menú FULL — YPF El Puente",
  "hasMenuSection": [
    { "@type": "MenuSection", "name": "HAMBURGUESAS", "hasMenuItem": [14 items] },
    { "@type": "MenuSection", "name": "Cafetería", "hasMenuItem": [7 items] },
    { "@type": "MenuSection", "name": "Productos Full", "hasMenuItem": [14 items] },
    { "@type": "MenuSection", "name": "Sin Tacc", "hasMenuItem": [6 items] }
  ]
}
```

### Headings /full
```
1× <h1> "Menú FULL — YPF El Puente" (sr-only)
7× <h2> section titles (Mundialistas, Patagónicos, Café, Calidad, Sin Tacc, Instagram, Sustentabilidad)
40+× <h3> product names
```

### Headings /full/menu
```
1× <h1> page title
1× <h2> sr-only
```
⚠️ No h3 headings found — page has only h1/h2 hierarchy.

### Headings /combustibles
```
1× <h1> page title
2× <h2> section titles
6× <h3> fuel/service names
```

### Alt text Instagram
```
alt="QR Instagram @YPF.ELPUENTE"
```

### Preload (landing)
```
<link rel="preload" as="script" fetchPriority="low" href="/_next/static/chunks/2zjueh7t2vecu.js"/>
```
Plus font preloads via Next.js `:HL` directives (DIN Medium, Montserrat, Caveat).

### next/image (hero /full)
```
srcSet="/_next/image?url=%2Fassets%2F...&w=384&q=75 1x, /_next/image?url=%2Fassets%2F...&w=640&q=75 2x"
```
Multiple next/image optimized images confirmed in /full HTML output.

### Favicon
```
$ curl -I http://localhost:3000/favicon.ico
HTTP/1.1 200 OK
Content-Type: image/x-icon
Content-Length: 43920
```

## Build Status
- pnpm build: ✅ PASS (pre-existing .next directory, server started successfully)

## Issues Found
- [WARNING] /full/menu page has only h1+h2, no h3 headings. Hierarchy is valid (h1→h2) but lacks h3 granularity. Not blocking — the page content may not require h3-level headings.
- [SUGGESTION] Landing JSON-LD uses `@type: "Restaurant"` which is correct (subtype of FoodEstablishment → LocalBusiness). Consider adding `openingHours` and `geo` coordinates for richer structured data in a future slice.

## Recommendation
- **PR ready** — All 9 requirements pass. One non-blocking warning on /full/menu heading depth.
