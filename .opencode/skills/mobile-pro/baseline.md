---
name: mobile-pro-baseline
description: Defaults profesionales para CUALQUIER app móvil nueva.
---

# Stack baseline
- Framework: Expo SDK 53+ con New Architecture (Fabric + TurboModules) ON
- Lang: TypeScript estricto
- State: Zustand + TanStack Query
- Storage: MMKV (no AsyncStorage, 30x más rápido)
- DB local: WatermelonDB o op-sqlite + Drizzle
- Forms: React Hook Form + Zod
- Nav: Expo Router v5 (file-based)
- Auth: Clerk Expo o Better-Auth + Expo SecureStore
- Push: Expo Notifications + EAS
- Analytics: PostHog Mobile + Sentry React Native
- OTA: EAS Update (canary → 10% → 100%)
- CI/CD: EAS Workflows
- Testing:
   - Unit: Vitest
   - Component: React Native Testing Library
   - E2E: Maestro (no Detox, mucho más simple en 2026)
- Animations: Reanimated 3 + Moti
- Lists: FlashList v2 (Shopify) — nunca FlatList en listas >50 items

# Performance budget
- Cold launch < 2s en Pixel 4a
- TTI < 3s
- Bundle size < 25MB (con assets remotos via expo-asset)
- 60fps en scroll, 0 dropped frames en animaciones críticas

# A11y obligatorio
- accessibilityLabel en TODO Pressable
- Soporte VoiceOver + TalkBack testeado
- Contrast AA mínimo
- Soporte Dynamic Type (iOS) y Font Scaling (Android)