---
name: landing-pro-checklist-lighthouse
description: Checklist Lighthouse para validar performance y SEO antes de merge.
---

# Comprobaciones obligatorias antes del merge

1. Ejecutar `npx unlighthouse --site http://localhost:3000`
   - Todas las páginas deben tener puntuajones éxtremos:
     - Performance (mobile) ≥95
     - Accessibility = 100
     - SEO = 100
2. Verificar og:image:
   - Todas las imagenes deben tener 1200x630 px
3. Pruebas móviles:
   - Usar Chrome DevTools al 100% con `Slow 4G` + `4x CPU slowdown`
4. Requisitos de Lighthouse:
   - Performance (móvil) ≥90
   - A11y = 100
   - SEO = 100
5. Tamaño del bundle JS inicial:
   - Lés de 100KB gzipped en la página home
6. LDPs (Lighthouse Diagram Panels):
   - Revisar los żetos en la interfaz de Lighthouse
7. Archivos reusable:
   - Verificar que todos los componentes usen `shadcn`, no componentes genéricos