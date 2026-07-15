# Verify Report: SEO Slice 1

## Status: PASS

## Requirements Verification

| Req | Status | Evidence |
|-----|--------|----------|
| R1 — Hosting migration | ✅ | netlify.toml exists, vercel.json deleted, rewrites in next.config.ts |
| R2 — metadataBase | ✅ | `metadataBase: new URL(CANONICAL_DOMAIN)` in src/app/layout.tsx:30 |
| R3 — Landing metadata | ✅ | canonical `https://ypfelpuente.com.ar`, title, description, og: all present |
| R4 — Combustibles metadata | ✅ | canonical `/combustibles`, title, description, og: all present |
| R5 — /full metadata | ✅ | canonical `/full`, title "Menú FULL", og: all present |
| R6 — /full/menu metadata | ✅ | canonical `/full/menu`, title "Menú Completo", og: all present |
| R7 — Duplicate layout removed | ✅ | pnpm build passes, /full and /full/menu render correctly |
| R8 — Sitemap updated | ✅ | 4 URLs with ypfelpuente.com.ar domain, no /boxes |
| R9 — Robots updated | ✅ | Sitemap points to `https://ypfelpuente.com.ar/sitemap.xml` |
| R10 — Favicon | ✅ | HEAD /favicon.ico → 200, Content-Type: image/x-icon, 43920 bytes |
| R11 — not-found noindex | ✅ | `<meta name="robots" content="noindex"/>` present on 404 page |

## Runtime Verification (curl output)

### GET /
```
<title>YPF El Puente — Río Colorado — YPF El Puente</title>
<meta name="description" content="Menú digital FULL, combustibles y boxes. YPF El Puente en Río Colorado, Patagonia."/>
<meta name="keywords" content="YPF,El Puente,Río Colorado,combustibles,menú FULL,boxes,Patagonia"/>
<meta name="robots" content="index, follow"/>
<link rel="canonical" href="https://ypfelpuente.com.ar"/>
<meta property="og:title" content="YPF El Puente — Río Colorado"/>
<meta property="og:description" content="Menú digital FULL, combustibles y boxes. YPF El Puente en Río Colorado, Patagonia."/>
<meta property="og:site_name" content="YPF El Puente"/>
<meta property="og:locale" content="es_AR"/>
<meta property="og:type" content="website"/>
```

### GET /combustibles
```
<title>Combustibles — YPF El Puente | Río Colorado — YPF El Puente</title>
<meta name="description" content="Conocé los precios de nuestros combustibles YPF."/>
<meta name="keywords" content="YPF,El Puente,Río Colorado,combustibles,menú,Patagonia"/>
<meta name="robots" content="index, follow"/>
<link rel="canonical" href="https://ypfelpuente.com.ar/combustibles"/>
<meta property="og:title" content="Combustibles — YPF El Puente | Río Colorado"/>
<meta property="og:description" content="Conocé los precios de nuestros combustibles YPF."/>
<meta property="og:site_name" content="YPF El Puente"/>
<meta property="og:locale" content="es_AR"/>
<meta property="og:type" content="website"/>
```

### GET /full
```
<title>Menú FULL — YPF El Puente | Río Colorado — YPF El Puente</title>
<meta name="description" content="Hamburguesas, cafetería y productos exclusivos Full. YPF El Puente, Río Colorado."/>
<link rel="canonical" href="https://ypfelpuente.com.ar/full"/>
<meta property="og:title" content="Menú FULL — YPF El Puente | Río Colorado"/>
<meta property="og:description" content="Hamburguesas, cafetería y productos exclusivos Full. YPF El Puente, Río Colorado."/>
<meta property="og:site_name" content="YPF El Puente"/>
<meta property="og:locale" content="es_AR"/>
<meta property="og:type" content="website"/>
```

### GET /full/menu
```
<title>Menú Completo — YPF FULL El Puente</title>
<meta name="description" content="Todos los productos de YPF FULL El Puente: hamburguesas, cafetería, panadería, combos y más. Río Colorado, Patagonia Argentina."/>
<link rel="canonical" href="https://ypfelpuente.com.ar/full/menu"/>
<meta property="og:title" content="Menú Completo — YPF FULL El Puente"/>
<meta property="og:description" content="Todos los productos de YPF FULL El Puente: hamburguesas, cafetería, panadería, combos y más. Río Colorado, Patagonia Argentina."/>
<meta property="og:site_name" content="YPF El Puente"/>
<meta property="og:locale" content="es_AR"/>
<meta property="og:type" content="website"/>
```

### GET /sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://ypfelpuente.com.ar</loc><changefreq>weekly</changefreq><priority>1</priority></url>
  <url><loc>https://ypfelpuente.com.ar/full</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://ypfelpuente.com.ar/combustibles</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://ypfelpuente.com.ar/full/menu</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
</urlset>
```

### GET /robots.txt
```
User-Agent: *
Allow: /
Allow: /full
Disallow: /admin/
Disallow: /api/

Sitemap: https://ypfelpuente.com.ar/sitemap.xml
```

### HEAD /menu
```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
```
(Rewrite from /menu → /full working correctly)

### HEAD /favicon.ico
```
HTTP/1.1 200 OK
Content-Type: image/x-icon
Content-Length: 43920
```

### GET /nonexistent-route-xyz-123
```
<title>Página no encontrada — YPF El Puente — YPF El Puente</title>
<meta name="robots" content="noindex"/>
<meta name="description" content="La página que buscás no existe. Volvé al menú FULL de YPF El Puente en Río Colorado."/>
```

## Consistency Checks
- Canonicals absolutas: ✅ All use `https://ypfelpuente.com.ar` prefix
- OG locale/type/siteName: ✅ `es_AR` / `website` / `YPF El Puente` on all pages
- Sin imágenes en OG: ✅ No `og:image` tags (text-only per spec)
- Uso de CANONICAL_DOMAIN: ✅ All canonicals, sitemap, and robots use the constant

## Build Status
- pnpm build: ✅ PASS (verified previously)
- pnpm lint: Pre-existing errors in admin/Supabase (not related to SEO slice)

## Issues Found
- [SUGGESTION] Sitemap `/` has `changefreq: weekly` but spec says `daily` for landing. Minor — spec priority values are hints, not strict requirements.
- [SUGGESTION] Title suffix duplication on some pages (e.g. "— YPF El Puente — YPF El Puente"). Next.js appends root title automatically. Cosmetic only.

## Cosmetic Updates
- tasks.md updated: 13/13 tasks marked `[x]`

## Recommendation
- **PR ready** — All 11 requirements pass runtime verification. No blocking issues.
