---
name: admin-pro-security
description: Mínimo de seguridad para CUALQUIER admin panel antes de producción.
---

# Checklist no negociable
- [ ] CSP estricto sin `unsafe-inline` ni `unsafe-eval`.
- [ ] HSTS preload + `Strict-Transport-Security` 2 años.
- [ ] CSRF tokens en TODAS las server actions (Next 16 lo hace, verificar).
- [ ] Rate limiting con Upstash Ratelimit por IP + por user.
- [ ] Session cookies: HttpOnly, Secure, SameSite=Lax, rotated 1h.
- [ ] Passwords hasheados con Argon2id (no bcrypt).
- [ ] 2FA obligatorio para roles admin.
- [ ] Audit log inmutable (append-only).
- [ ] Backups Postgres cifrados (pgBackRest) y testeados con restore mensual.
- [ ] Secrets en Doppler / Infisical, NUNCA en `.env` commiteado.
- [ ] Dependabot + Renovate + Snyk Free + `npm audit --production` en CI.
- [ ] WAF: Cloudflare Free tier delante.
- [ ] DDoS protection nativo (Cloudflare / Vercel).
- [ ] Logs sin PII (mask en logger middleware).