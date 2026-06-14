---
name: mythos-sec-pre-commit
description: Use SIEMPRE antes de hacer commit. Corre 5 capas de seguridad y bloquea si algo falla. Anti OWASP Top 10.
---

# Pipeline obligatorio pre-commit
1. Lint + types: `pnpm lint && pnpm typecheck`
2. Secret scan: `gitleaks protect --staged --redact`
3. SAST: `semgrep --config=auto --error --severity ERROR`
4. Deps audit: `pnpm audit --audit-level=high` (alterna con `npm audit`/`yarn`)
5. OWASP review sobre el diff: invoca `owasp-security` skill con el output de `git diff --cached`

Si cualquier paso falla → `process.exit(1)` y mostrá al usuario qué arreglar.