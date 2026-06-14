---
name: admin-pro-architecture
description: Stack de referencia para dashboards admin escalables y seguros.
---

# Stack obligatorio
- App: Next.js 16 + React 19 + Server Components por defecto
- UI: shadcn/ui + `dashboard-01` block + Tremor v3 (charts)
- Tablas: TanStack Table v9 (sorting, filtering, pagination, virtualization)
- State servidor: TanStack Query v6 + Zustand para UI state local
- Auth: Better-Auth v2 (passkeys, magic links, OAuth, 2FA TOTP)
- DB: Postgres 17 + Drizzle ORM v2 (RLS habilitado)
- Caché: Upstash Redis con tag-based invalidation
- Background jobs: Trigger.dev v4 o Inngest
- Files: UploadThing o S3 + presigned URLs
- RBAC: CASL v7 o Permit.io (policy-as-code)
- Audit log: tabla `audit_events` con trigger Postgres + retención 90d
- Observability: Sentry + OpenTelemetry → Grafana Cloud (free tier)
- Email: Resend + React Email

# Patrones obligatorios
1. Server Actions para mutaciones — NUNCA exponer API keys al cliente.
2. Zod en TODA entrada (body, query, params, env).
3. RLS Postgres habilitado por defecto: tenant_id en cada tabla.
4. Optimistic updates con TanStack Query.
5. Skeletons durante loading, NUNCA spinners genéricos.
6. Empty states con CTA claro en cada lista.
7. Bulk actions con confirmación + undo (5s) en operaciones destructivas.
8. Keyboard shortcuts via cmdk (⌘K palette).
9. Dark mode auto via `next-themes`.
10. i18n desde día 1, incluso si arrancás en español.