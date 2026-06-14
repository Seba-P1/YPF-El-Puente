---
name: clone-master-mobile
description: Toma un sitio web responsive y genera la app móvil nativa equivalente con Expo + NativeWind.
---

# Flujo
1. Crawl con Firecrawl → markdown + screenshots desktop+móvil.
2. Identificar flujos: auth, listing, detail, checkout, profile.
3. Generar proyecto Expo con `mobile-pro-baseline` skill.
4. Mapear:
   - Web route → Expo Router file route
   - Modals/Drawers → Native Sheets (`@gorhom/bottom-sheet`)
   - Tables → FlashList
   - Forms → React Hook Form igual
5. Reemplazar `<img>` → `expo-image`.
6. Reemplazar `<a>` → `Link` de Expo Router.
7. Push notifications + deep links + share sheet nativos.
8. Lanzar dev client + EAS Build preview.