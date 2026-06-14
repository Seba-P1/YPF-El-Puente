---
name: landing-pro-stack
description: Stack moderno por defecto para landing pages profesionales escalables.
---

# Stack obligatorio
- Framework: Next.js 16 (App Router) + React 19 + Turbopack
- Styling: Tailwind v4 + shadcn/ui (usar `shadcn-skill` para context)
- Anim: Framer Motion 12 para micro-interacciones, GSAP solo si scroll-driven complex
- Imagery: `next/image` con AVIF, `priority` solo en LCP
- Fonts: `next/font/google` self-hosted, `display: swap`
- Forms: React Hook Form + Zod (server actions, never expose API keys)
- Analytics: Vercel Analytics + PostHog (con consent)
- Deploy: Vercel o Cloudflare Pages
- CMS opcional: Sanity v4, Payload v3 o Contentlayer si blog
- i18n: next-intl si LATAM-wide
- Edge: middlewares para A/B testing