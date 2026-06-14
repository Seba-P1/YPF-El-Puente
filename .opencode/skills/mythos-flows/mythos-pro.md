# 🔱 Guía Maestra PRO: Skills, Auto-Mejora y Stack Nivel "Mythos" para Cualquier Modelo

> **Documento complementario a `flujo_trabajo_ia_fiable5.md`.**
>
> **Objetivo:** Llevar tu workflow Engram + OpenCode + OpenRouter Free + Spec-Kit del nivel "Fable 5" al nivel **"Mythos"**: que **cualquier modelo gratuito** (Z.ai GLM-4.6, Qwen3-Coder, DeepSeek V3.2, Kimi K2, GLM-Air) produzca código **al nivel de Claude Opus / Sonnet 4.5 pago**, gracias a una librería profesional de Skills, MCPs, hooks y auto-mejora continua.
>
> **Filosofía añadida:** _"El modelo no necesita ser inteligente si el contexto lo es."_ Encapsulamos la inteligencia en Skills auditables, versionadas y compuestas — no en el modelo.

---

## 📑 Tabla de Contenidos

1. [Mapa Mental del Stack "Mythos"](#1-mapa-mental-del-stack-mythos)
2. [FASE 10 — Skills Profesionales Esenciales (Top 25 a instalar YA)](#2-fase-10--skills-profesionales-esenciales-top-25-a-instalar-ya)
3. [FASE 11 — Skill Orquestador: `superpowers` de Obra (el corazón Mythos)](#3-fase-11--skill-orquestador-superpowers-de-obra)
4. [FASE 12 — MCPs Estratégicos (más allá de Engram)](#4-fase-12--mcps-estratégicos-más-allá-de-engram)
5. [FASE 13 — Skill Pack para Landing Pages Ultra Profesionales](#5-fase-13--skill-pack-para-landing-pages-ultra-profesionales)
6. [FASE 14 — Skill Pack para Dashboards y Paneles Administrativos](#6-fase-14--skill-pack-para-dashboards-y-paneles-administrativos)
7. [FASE 15 — Skill Pack de Ciberseguridad (OWASP 2025/2026 + Trail of Bits)](#7-fase-15--skill-pack-de-ciberseguridad)
8. [FASE 16 — Skill Pack para Apps Nativas iOS y Android (Expo + Callstack)](#8-fase-16--skill-pack-para-apps-nativas-ios-y-android)
9. [FASE 17 — Skill Pack para Pasarelas de Pago en LATAM](#9-fase-17--skill-pack-para-pasarelas-de-pago-en-latam)
10. [FASE 18 — Skill Pack para Clonar Webs y Apps (Open Lovable + Firecrawl)](#10-fase-18--skill-pack-para-clonar-webs-y-apps)
11. [FASE 19 — Auto-Mejora Continua del Sistema (cada minuto)](#11-fase-19--auto-mejora-continua-del-sistema-cada-minuto)
12. [FASE 20 — `AGENTS.md` Maestro (validado por ETH Zürich)](#12-fase-20--agentsmd-maestro-validado-por-eth-zürich)
13. [FASE 21 — Routing Avanzado y Verificación Cruzada Multi-Modelo](#13-fase-21--routing-avanzado-y-verificación-cruzada-multi-modelo)
14. [FASE 22 — Hardening del propio ecosistema de Skills (OWASP AST10)](#14-fase-22--hardening-del-propio-ecosistema-de-skills-owasp-ast10)
15. [FASE 23 — Healthcheck PRO, métricas y telemetría](#15-fase-23--healthcheck-pro-métricas-y-telemetría)
16. [Anexo A — Comandos de instalación todo-en-uno](#16-anexo-a--comandos-de-instalación-todo-en-uno)
17. [Anexo B — Plantillas de prompts maestros por dominio](#17-anexo-b--plantillas-de-prompts-maestros-por-dominio)

---

## 1. Mapa Mental del Stack "Mythos"

```
┌─────────────────────────────────────────────────────────────────┐
│                      USUARIO (tú, el humano)                    │
└──────────────────────────────┬──────────────────────────────────┘
                               │  intención cruda
                               ▼
        ┌──────────────────────────────────────────┐
        │   OPENCODE  (CLI agente principal)       │
        │   + AGENTS.md (reglas globales)          │
        └─────┬──────────────┬──────────────┬──────┘
              │              │              │
              ▼              ▼              ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │   SKILLS     │ │     MCPs     │ │   ROUTING    │
    │ (.claude/    │ │ (Engram +    │ │  por fase    │
    │  skills/)    │ │  Context7 +  │ │  y dominio   │
    │              │ │  Serena +    │ │              │
    │ • Mythos     │ │  Playwright+ │ │ Z.ai GLM-4.6 │
    │   pack (25)  │ │  Sequential+ │ │ Qwen3-Coder  │
    │ • LATAM      │ │  Semgrep+    │ │ DeepSeek3.2  │
    │ • Mobile     │ │  shadcn)     │ │ Kimi K2      │
    │ • Security   │ │              │ │ GLM-Air      │
    └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
           │                │                │
           └────────────────┼────────────────┘
                            ▼
           ┌────────────────────────────────┐
           │   SUBAGENTES (Superpowers)     │
           │   spec → plan → tdd → review   │
           │   (cada uno con contexto       │
           │    aislado y skill propia)     │
           └────────────────┬───────────────┘
                            ▼
           ┌────────────────────────────────┐
           │   CÓDIGO VERIFICADO Y COMMIT   │
           │   (con healthcheck + audit)    │
           └────────────────────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │  AUTO-MEJORA (FASE 19)│
                │ healthcheck → telem → │
                │ refinar skills → PR   │
                └───────────────────────┘
```

**Principio rector:** la calidad del output ya **no depende del modelo** sino de la composición de Skills y MCPs. Por eso un Qwen3-Coder gratuito + Mythos stack ≈ Claude Sonnet 4.5 sin stack.

---

## 2. FASE 10 — Skills Profesionales Esenciales (Top 25 a instalar YA)

Estas 25 skills son el **núcleo Mythos**. Se eligieron tras analizar los repos más estrellados de 2025-2026 ([anthropics/skills](https://github.com/anthropics/skills), [obra/superpowers](https://github.com/obra/superpowers), [vercel-labs/agent-skills](https://github.com/vercel-labs/skills), [expo/skills](https://github.com/expo/skills), [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) con 338 skills, y la guía de [Firecrawl Best Claude Code Skills 2026](https://www.firecrawl.dev/blog/best-claude-code-skills)).

### 🧠 Capability Uplift (le dan al modelo poderes que NO tiene)

| # | Skill | Origen | Qué hace |
|---|-------|--------|----------|
| 1 | **superpowers** | [obra/superpowers](https://github.com/obra/superpowers) | Orquesta brainstorm → spec → plan → TDD → review con subagentes |
| 2 | **firecrawl** | Firecrawl team | Scraping confiable, búsqueda web y browser automation |
| 3 | **shadcn-skill** | [ui.shadcn.com/docs/skills](https://ui.shadcn.com/docs/skills) | Inyecta contexto exacto de tu `components.json` antes de cada cambio UI |
| 4 | **webapp-testing** | Anthropic oficial | Ejecuta Playwright contra el navegador real |
| 5 | **playwright-skill** | [lackeyjb/playwright-skill](https://github.com/lackeyjb/playwright-skill) | Genera y ejecuta automation on-the-fly |
| 6 | **trail-of-bits-security** | Trail of Bits | Auditorías profesionales con CodeQL + Semgrep |
| 7 | **owasp-security** | [agamm/claude-code-owasp](https://github.com/agamm/claude-code-owasp) | OWASP Top 10 2025 + ASVS 5.0 + LLM Top 10 + Agentic 2026 |
| 8 | **observability-designer** | alirezarezvani pack | Diseña SLOs, alertas y dashboards |
| 9 | **skill-creator** | Anthropic oficial | Crea nuevas skills siguiendo el spec correctamente |
| 10 | **handoff** | Obra | Comprime una sesión en markdown para retomar sin pérdida de contexto |

### 🎯 Preference Encoding (le imponen al modelo tu estilo profesional)

| # | Skill | Origen | Qué hace |
|---|-------|--------|----------|
| 11 | **vercel-web-design-guidelines** | [vercel-labs](https://github.com/vercel-labs/web-interface-guidelines) | Audita UI contra 100+ reglas de accesibilidad y UX |
| 12 | **vercel-react-best-practices** | vercel-labs | Aplica 57 reglas de performance en React/Next.js |
| 13 | **vercel-composition-patterns** | vercel-labs | Compound components correctamente compuestos |
| 14 | **karpathy-guidelines** | Adapt. Karpathy | "Pensar antes de codear", simplicidad, cambios quirúrgicos |
| 15 | **frontend-design** | Firecrawl team | UI grado producción, no genérico |
| 16 | **grill-me** | Obra | Te entrevista antes de codear para detectar ambigüedades |
| 17 | **caveman** | Anthropic ejemplo | Reduce tokens de salida: borra narración inútil |
| 18 | **context-mode** | Anthropic ejemplo | Filtra ruido de shell, preserva sesión |
| 19 | **code-simplifier** | Anthropic interno | Limpia código recién escrito sin cambiar lógica |
| 20 | **commit-conventional** | Tu repo (Fase 5 anterior) | Mensajes Git estandarizados |

### 📄 Document & Knowledge Skills

| # | Skill | Origen | Qué hace |
|---|-------|--------|----------|
| 21 | **docx / pdf / xlsx / pptx** | [anthropics/skills](https://github.com/anthropics/skills) | Parsear y crear Office docs y PDFs |
| 22 | **doc-coauthoring** | Anthropic | Escritura larga asistida |
| 23 | **dependency-auditor** | alirezarezvani pack | Escaneo multilenguaje de licencias y CVEs |
| 24 | **skill-security-auditor** | alirezarezvani pack | Audita la propia skill antes de instalarla (anti AST01-AST10) |
| 25 | **mcp-builder** | alirezarezvani pack | Crea MCP servers nuevos automáticamente |

### 🚀 Instalación batch con `npx skills` (Vercel CLI universal)

El CLI [`vercel-labs/skills`](https://github.com/vercel-labs/skills) (también conocido como `skills.sh`) soporta **OpenCode**, Claude Code, Codex, Cursor y 67 herramientas más.

```powershell
# Desde la raíz de tu proyecto
npx skills add obra/superpowers
npx skills add anthropics/skills/skills/skill-creator
npx skills add anthropics/skills/skills/webapp-testing
npx skills add vercel-labs/agent-skills/skills/web-design-guidelines
npx skills add vercel-labs/agent-skills/skills/react-best-practices
npx skills add vercel-labs/agent-skills/skills/composition-patterns
npx skills add expo/skills            # pack completo nativo (FASE 16)

# Skills sueltas con curl
curl -sL https://raw.githubusercontent.com/agamm/claude-code-owasp/main/.claude/skills/owasp-security/SKILL.md `
  -o .claude/skills/owasp-security/SKILL.md --create-dirs

# Pack de 338 skills (clonas y eliges)
git clone --depth=1 https://github.com/alirezarezvani/claude-skills %TEMP%\rezvani
# Copiá sólo las que querés:
Copy-Item -Recurse %TEMP%\rezvani\skills\engineering-core\security-scanner .claude\skills\
Copy-Item -Recurse %TEMP%\rezvani\skills\engineering-powerful\observability-designer .claude\skills\
Copy-Item -Recurse %TEMP%\rezvani\skills\marketing\landing .claude\skills\
```

> ⚠️ **Importante (OWASP AST10):** antes de instalar cualquier skill de terceros, ejecutá la skill `skill-security-auditor` sobre la carpeta. Detecta inyecciones, comandos peligrosos y privilegios excesivos. _Ver FASE 22._

---

## 3. FASE 11 — Skill Orquestador: `superpowers` de Obra

Esta skill **sola** sube el nivel de cualquier modelo. Es una metodología completa de desarrollo empaquetada en skills compuestas que se disparan automáticamente.

### Flujo automático que ejecuta

1. **brainstorming** — Te entrevista hasta extraer un spec real (Socratic).
2. **using-git-worktrees** — Crea workspace aislado en una rama nueva, verifica baseline limpio de tests.
3. **writing-plans** — Plan con tareas de 2-5 min, rutas exactas, código completo, pasos de verificación.
4. **subagent-driven-development** — Despacha un subagente por tarea + dos revisiones (compliance + calidad).
5. **test-driven-development** — RED-GREEN-REFACTOR estricto. Borra código escrito sin tests.
6. **requesting-code-review** — Checklist y reporte por severidad.
7. **finishing-a-development-branch** — Verifica tests, opciones merge/PR/discard, limpia worktree.

### Instalación en OpenCode

Dale este comando exacto a OpenCode:

```
Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.opencode/INSTALL.md
```

[Documentación oficial OpenCode](https://github.com/obra/superpowers/blob/main/docs/README.opencode.md).

### Por qué transforma tu workflow

- Las skills **se disparan automáticamente** según contexto — no hay que invocarlas.
- Cada subagente trabaja con **contexto aislado**, evita drift.
- Claude (o Qwen3, GLM-4.6, DeepSeek…) puede trabajar **autónomo 2+ horas** sin desviarse.
- TDD estricto **borra código pre-tests** → cero alucinaciones de funciones inexistentes.

---

## 4. FASE 12 — MCPs Estratégicos (más allá de Engram)

Tu `opencode.json` ya tiene Engram. Agregale estos MCPs para multiplicar capacidades. Lista actualizada [awesome-mcp-servers](https://github.com/wong2/awesome-mcp-servers) y [Toloka Top MCPs 2026](https://toloka.ai/blog/best-mcp-servers-for-ai-agents/).

```jsonc
// opencode.json — sección "mcpServers"
{
  "mcpServers": {
    "engram":  { "command": "engram", "args": ["serve"] },

    // 🔵 Documentación viva (anti-alucinación de APIs)
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    },

    // 🟢 Razonamiento estructurado (cadenas de pensamiento)
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },

    // 🟣 Lectura semántica de codebase (LSP-aware)
    "serena": {
      "command": "uvx",
      "args": ["--from", "git+https://github.com/oraios/serena", "serena-mcp-server"]
    },

    // 🟠 Browser automation y test E2E
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },

    // 🔴 SAST en tiempo real
    "semgrep": {
      "command": "uvx",
      "args": ["semgrep-mcp"]
    },

    // 🟡 Components shadcn (UI consistente)
    "shadcn": {
      "command": "npx",
      "args": ["-y", "shadcn@latest", "mcp"]
    },

    // 🟤 Scraping y clonado (FASE 18)
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": { "FIRECRAWL_API_KEY": "${FIRECRAWL_API_KEY}" }
    },

    // 🩶 GitHub (issues, PRs, releases)
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PAT}" }
    }
  }
}
```

### Tabla de impacto

| MCP | Resuelve qué problema | Modelo donde más rinde |
|-----|----------------------|------------------------|
| **context7** | "Alucina sintaxis vieja" → trae docs vivas | Todos |
| **sequential-thinking** | Razonamiento multi-paso | Modelos pequeños (GLM-Air, DeepSeek-V3) |
| **serena** | Refactors grandes con LSP | Qwen3-Coder |
| **playwright** | Testing E2E sin escribir tests a mano | Todos |
| **semgrep** | Detecta CVEs en vivo | Todos |
| **shadcn** | UI consistente con tu design system | GLM-4.6 |
| **firecrawl** | Clonar webs, scraping confiable | Todos |

---

## 5. FASE 13 — Skill Pack para Landing Pages Ultra Profesionales

Crea estas skills en `.claude/skills/landing-pro/` para que **cualquier landing salga nivel Vercel/Linear/Stripe**.

### Skill 1 — `landing-pro/spec`

```markdown
---
name: landing-pro-spec
description: |
  Use ALWAYS antes de generar una landing page. Fuerza al modelo a definir
  hero, propuesta de valor, social proof, pricing, FAQ, CTA y SEO técnico
  antes de tocar una línea de código.
---

# Spec obligatorio para landing
Antes de codear, completá ESTAS 12 secciones (responde con "DONE" cada una):

1. **Audience**: ¿Quién es el visitante? Industria, rol, dolor concreto.
2. **JTBD** (Jobs to be done): qué viene a "contratar" la landing.
3. **Hero**: headline (≤8 palabras) + subheadline (≤22 palabras) + CTA primario.
4. **Above-the-fold proof**: 3-6 logos / 1 testimonial / 1 métrica killer.
5. **Bento sections**: 3 a 6 bloques de features con visual + microcopy.
6. **Comparison table** (opcional pero recomendado).
7. **Pricing**: 3 planes, badge "Most popular", anchor + descuento anual.
8. **FAQ**: 6-10 preguntas reales (NO inventadas).
9. **Final CTA**: distinto del hero, urgencia o garantía.
10. **SEO**: title (≤60c), meta description (≤155c), JSON-LD Organization+Product.
11. **Performance budget**: LCP < 2.0s, CLS < 0.05, TBT < 200ms.
12. **A11y**: WCAG 2.2 AA, contrast ratio ≥ 4.5, focus visible, navegable con teclado.

NO escribir código hasta tener las 12 marcadas DONE.
```

### Skill 2 — `landing-pro/stack`

```markdown
---
name: landing-pro-stack
description: Stack moderno por defecto para landing pages profesionales escalables.
---

# Stack obligatorio
- **Framework**: Next.js 16 (App Router) + React 19 + Turbopack
- **Styling**: Tailwind v4 + shadcn/ui (usar `shadcn-skill` para context)
- **Anim**: Framer Motion 12 para micro-interacciones, GSAP solo si scroll-driven complex
- **Imagery**: `next/image` con AVIF, `priority` solo en LCP
- **Fonts**: `next/font/google` self-hosted, `display: swap`
- **Forms**: React Hook Form + Zod (server actions, never expose API keys)
- **Analytics**: Vercel Analytics + PostHog (con consent)
- **Deploy**: Vercel o Cloudflare Pages
- **CMS opcional**: Sanity v4, Payload v3 o Contentlayer si blog
- **i18n**: next-intl si LATAM-wide
- **Edge**: middlewares para A/B testing
```

### Skill 3 — `landing-pro/checklist-lighthouse`

```markdown
---
name: landing-pro-lighthouse
description: |
  Al finalizar la landing, correr Lighthouse y unfurl meta checks.
  Bloquea PR si performance/SEO < 95.
---

# Comprobaciones obligatorias antes del merge
1. `npx unlighthouse --site http://localhost:3000` → todas las páginas ≥ 95.
2. Abrir cada og:image y verificar dimensiones 1200x630.
3. Test móvil real con DevTools throttling "Slow 4G + 4x CPU slowdown".
4. Lighthouse mobile Performance ≥ 90, Accessibility = 100, SEO = 100.
5. `next build` → bundle JS inicial ≤ 100KB gzipped en home.
```

### Componentes recomendados (todos via `shadcn` MCP)

`bento-grid`, `marquee`, `globe`, `animated-beam`, `meteors`, `dot-pattern`, `hero-video-dialog`, `pricing`, `testimonial-marquee`, `faq-accordion`.

Recursos: [12 Best shadcn/ui Landing Page Templates 2026](https://adminlte.io/blog/shadcn-ui-landing-page-templates/), [Magic UI](https://magicui.design), [Aceternity UI](https://ui.aceternity.com).

---

## 6. FASE 14 — Skill Pack para Dashboards y Paneles Administrativos

### Skill — `admin-pro/architecture`

```markdown
---
name: admin-pro-architecture
description: Stack de referencia para dashboards admin escalables y seguros.
---

# Stack obligatorio
- **App**: Next.js 16 + React 19 + Server Components por defecto
- **UI**: shadcn/ui + `dashboard-01` block + Tremor v3 (charts)
- **Tablas**: TanStack Table v9 (sorting, filtering, pagination, virtualization)
- **State servidor**: TanStack Query v6 + Zustand para UI state local
- **Auth**: Better-Auth v2 (passkeys, magic links, OAuth, 2FA TOTP)
- **DB**: Postgres 17 + Drizzle ORM v2 (RLS habilitado)
- **Caché**: Upstash Redis con tag-based invalidation
- **Background jobs**: Trigger.dev v4 o Inngest
- **Files**: UploadThing o S3 + presigned URLs
- **RBAC**: CASL v7 o Permit.io (policy-as-code)
- **Audit log**: tabla `audit_events` con trigger Postgres + retención 90d
- **Observability**: Sentry + OpenTelemetry → Grafana Cloud (free tier)
- **Email**: Resend + React Email

# Patrones obligatorios
1. **Server Actions** para mutaciones — NUNCA exponer API keys al cliente.
2. **Zod** en TODA entrada (body, query, params, env).
3. **RLS Postgres** habilitado por defecto: tenant_id en cada tabla.
4. **Optimistic updates** con TanStack Query.
5. **Skeletons** durante loading, NUNCA spinners genéricos.
6. **Empty states** con CTA claro en cada lista.
7. **Bulk actions** con confirmación + undo (5s) en operaciones destructivas.
8. **Keyboard shortcuts** via cmdk (⌘K palette).
9. **Dark mode** auto via `next-themes`.
10. **i18n** desde día 1, incluso si arrancás en español.
```

### Skill — `admin-pro/security-baseline`

```markdown
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
```

### Templates recomendados de referencia

- [shadcn dashboard blocks](https://ui.shadcn.com/blocks) — `dashboard-01` a `dashboard-07`
- [Tremor blocks](https://tremor.so) — KPIs y charts pre-construidos
- [Refine](https://refine.dev) — para CRUD masivo con cero boilerplate

---

## 7. FASE 15 — Skill Pack de Ciberseguridad

Basado en [OWASP Top 10 2025](https://owasp.org/Top10/), [ASVS 5.0](https://owasp.org/www-project-application-security-verification-standard/), [OWASP LLM Top 10 2025](https://genai.owasp.org/llm-top-10/) y [OWASP Agentic 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/).

### Skills imprescindibles

| Skill | Comando instalación |
|-------|---------------------|
| **owasp-security** | `curl -sL https://raw.githubusercontent.com/agamm/claude-code-owasp/main/.claude/skills/owasp-security/SKILL.md -o .claude/skills/owasp-security/SKILL.md --create-dirs` |
| **trail-of-bits-security** | `npx skills add anthropics/skills/skills/trail-of-bits` |
| **dependency-auditor** | `npx skills add alirezarezvani/claude-skills/skills/engineering-powerful/dependency-auditor` |
| **skill-security-auditor** | `npx skills add alirezarezvani/claude-skills/skills/engineering-powerful/skill-security-auditor` |
| **semgrep-mcp** | MCP ya configurado en FASE 12 |

### Skill propia — `mythos-sec/pre-commit`

```markdown
---
name: mythos-sec-pre-commit
description: |
  Use SIEMPRE antes de hacer commit. Corre 5 capas de seguridad
  y bloquea si algo falla. Anti OWASP Top 10.
---

# Pipeline obligatorio pre-commit
1. **Lint + types**: `pnpm lint && pnpm typecheck`
2. **Secret scan**: `gitleaks protect --staged --redact`
3. **SAST**: `semgrep --config=auto --error --severity ERROR`
4. **Deps audit**: `pnpm audit --audit-level=high` (alterna con `npm audit`/`yarn`)
5. **OWASP review** sobre el diff: invoca `owasp-security` skill con el output de `git diff --cached`

Si cualquier paso falla → `process.exit(1)` y mostrá al usuario qué arreglar.
```

Conectalo con un **Husky pre-commit hook**:

```bash
# .husky/pre-commit
#!/bin/sh
opencode run --skill mythos-sec-pre-commit --no-interactive
```

### LLM / Agentic Hardening (OWASP LLM01-LLM10 + ASI01-ASI10)

```markdown
---
name: mythos-sec-llm-hardening
description: Endurece apps que usan LLMs internamente o exponen agentes.
---

# Checks obligatorios
- [ ] **LLM01 Prompt Injection**: input sanitizer + system prompt sealed (no user-injected).
- [ ] **LLM02 Insecure Output**: parsear JSON con Zod, nunca `eval` ni innerHTML.
- [ ] **LLM03 Training Data Poisoning**: pin modelos por hash/version.
- [ ] **LLM04 Model DoS**: rate limit por user + token budget per request.
- [ ] **LLM05 Supply Chain**: pin versions de modelos (OpenRouter exact tag).
- [ ] **LLM06 Sensitive Info Disclosure**: redact PII antes de mandar al LLM (usar Microsoft Presidio).
- [ ] **LLM07 Insecure Plugin/Tool**: whitelist de tools por agente.
- [ ] **LLM08 Excessive Agency**: human-in-the-loop para acciones destructivas.
- [ ] **LLM09 Overreliance**: marca outputs como "AI-generated, verify".
- [ ] **LLM10 Model Theft**: rate limit + watermark de outputs.
- [ ] **ASI03 Over-privileged skills**: manifest de permisos mínimos.
- [ ] **ASI06 Weak Isolation**: subagentes en sandbox / containers.
```

---

## 8. FASE 16 — Skill Pack para Apps Nativas iOS y Android

El pack **oficial de Expo** (mantenido por el equipo de Expo) más el de Callstack (27 skills RN). [Anuncio Callstack](https://www.callstack.com/blog/announcing-react-native-best-practices-for-ai-agents).

### Instalación express

```powershell
# Claude Code
/plugin marketplace add expo/skills
/plugin install expo

# OpenCode (universal)
npx skills add expo/skills
npx skills add callstack/react-native-best-practices-for-ai-agents
```

### Skills incluidas en `expo/skills` (resumen oficial — [docs.expo.dev/skills](https://docs.expo.dev/skills/))

| Skill | Para qué |
|-------|----------|
| `building-native-ui` | Expo Router, styling, animations, navigation, native tabs |
| `expo-tailwind-setup` | Tailwind v4 + NativeWind v5 universal |
| `expo-ui-swift-ui` | SwiftUI views/modifiers nativos en RN |
| `expo-ui-jetpack-compose` | Compose nativo Android dentro de RN |
| `expo-module` | Crear módulos nativos (Swift/Kotlin/TS) |
| `add-app-clip` | iOS App Clips desde URL |
| `expo-brownfield` | Integrar RN en apps nativas existentes (AAR/XCFramework) |
| `expo-deployment` | App Store, Play Store, web, API routes |
| `expo-dev-client` | TestFlight + dev clients |
| `expo-cicd-workflows` | EAS workflows YAML |
| `eas-update-insights` | Salud de OTA updates (crash rate, TTI) |
| `expo-observe` | Métricas: cold/warm launch, TTR, TTI, frame rate |
| `native-data-fetching` | Fetch, React Query, SWR, loaders |
| `upgrading-expo` | SDK upgrades sin romper |
| `use-dom` | Web → native incremental con `'use dom'` |
| `expo-api-routes` | API routes con EAS Hosting |

### Skill propia complementaria — `mobile-pro/baseline`

```markdown
---
name: mobile-pro-baseline
description: Defaults profesionales para CUALQUIER app móvil nueva.
---

# Stack baseline
- **Framework**: Expo SDK 53+ con New Architecture (Fabric + TurboModules) ON
- **Lang**: TypeScript estricto
- **State**: Zustand + TanStack Query
- **Storage**: MMKV (no AsyncStorage, 30x más rápido)
- **DB local**: WatermelonDB o op-sqlite + Drizzle
- **Forms**: React Hook Form + Zod
- **Nav**: Expo Router v5 (file-based)
- **Auth**: Clerk Expo o Better-Auth + Expo SecureStore
- **Push**: Expo Notifications + EAS
- **Analytics**: PostHog Mobile + Sentry React Native
- **OTA**: EAS Update (canary → 10% → 100%)
- **CI/CD**: EAS Workflows
- **Testing**:
   - Unit: Vitest
   - Component: React Native Testing Library
   - E2E: Maestro (no Detox, mucho más simple en 2026)
- **Animations**: Reanimated 3 + Moti
- **Lists**: FlashList v2 (Shopify) — nunca FlatList en listas >50 items

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
```

---

## 9. FASE 17 — Skill Pack para Pasarelas de Pago en LATAM

Datos compilados de [Payment Gateways LATAM 2026 Guide](https://dev.to/cristiantalasanchez/payment-gateways-in-latam-2026-the-guide-you-need-before-collecting-your-first-dollar-1i1h), docs oficiales y [dLocal Predictions 2026](https://www.dlocal.com/blog/dlocal-viewpoint/from-local-to-interoperable-dlocals-5-predictions-for-payments-in-2026/).

### Skill — `payments-latam/router`

```markdown
---
name: payments-latam-router
description: |
  Elige el gateway correcto según país y modelo de negocio.
  Use ANTES de integrar cualquier pasarela.
---

# Matriz de decisión 2026

| País | Gateway principal | Alternativa | Métodos clave |
|------|-------------------|-------------|---------------|
| Argentina | **Mercado Pago** | Ualá Bis, MODO | Tarjeta, transferencia 3.0, cuenta MP, QR |
| Brasil | **Stripe Pix** + Mercado Pago | dLocal, Pagar.me | Pix, boleto, cartão, Pix Parcelado |
| México | **Mercado Pago** | Stripe, Conekta, OpenPay | SPEI, OXXO, tarjeta, CoDi |
| Colombia | **Wompi** (Bancolombia) | PayU, ePayco | PSE, Nequi, Bre-B, tarjeta |
| Chile | **Transbank Webpay** | Mercado Pago, Khipu, Flow | WebPay Plus, Onepay |
| Perú | **Niubiz** / Culqi | Izipay, Mercado Pago | Yape, PagoEfectivo, tarjeta |
| Ecuador | **Kushki** | PayPhone | DataFast, Pago Plus, tarjeta |
| Uruguay | **dLocal Go** | Mercado Pago | Tarjeta, redes cobranza |
| LATAM-wide / cross-border | **dLocal** o **Kushki PSP** | Stripe + Mercado Pago combo | API única 15+ países |

# Reglas
1. SaaS B2C local: empezar con Mercado Pago (cubre AR/MX/BR/CL/CO/PE/UY).
2. Marketplace cross-border: dLocal Go o Stripe + Pix.
3. Recurrencia: Mercado Pago Subscriptions + Stripe Pix recurring (lanzado 2026-04 por Stripe).
4. SIEMPRE soportar al menos: tarjeta + 1 método local (Pix/PSE/SPEI/Yape).
5. Bre-B (Colombia) es OBLIGATORIO desde 2026 si tu volumen es relevante.
```

### Skill — `payments-latam/mercadopago-checkout-pro`

```markdown
---
name: payments-latam-mp-checkout
description: Integración correcta de Mercado Pago Checkout Pro (Node + Next.js).
---

# Implementación canónica (anti-alucinación)
1. Verificar SDK actual: `pnpm i mercadopago@^2`
2. Backend (`/app/api/checkout/route.ts`):

```ts
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { z } from 'zod';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
  options: { timeout: 5000, idempotencyKey: crypto.randomUUID() },
});

const Body = z.object({
  items: z.array(z.object({
    id: z.string(),
    title: z.string().max(256),
    quantity: z.number().int().positive(),
    unit_price: z.number().positive(),
    currency_id: z.enum(['ARS','BRL','MXN','CLP','COP','PEN','UYU']),
  })).min(1),
  payer_email: z.string().email(),
});

export async function POST(req: Request) {
  const data = Body.parse(await req.json());
  const pref = await new Preference(client).create({
    body: {
      items: data.items,
      payer: { email: data.payer_email },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_URL}/pago/exito`,
        failure: `${process.env.NEXT_PUBLIC_URL}/pago/fallo`,
        pending: `${process.env.NEXT_PUBLIC_URL}/pago/pendiente`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.NEXT_PUBLIC_URL}/api/mp-webhook`,
      statement_descriptor: 'MYBRAND',
      external_reference: crypto.randomUUID(),
    },
  });
  return Response.json({ init_point: pref.init_point });
}
```

3. Webhook `/app/api/mp-webhook/route.ts` con verificación HMAC (`x-signature` y `x-request-id`, doc oficial de Mercado Pago).
4. Frontend: `@mercadopago/sdk-react` `<Wallet initialization={{ preferenceId }} />`.
5. Test con `?test=true` y tarjetas de testing oficiales.
6. PCI: nunca tocar PAN/CVV en tu backend — Checkout Pro redirige.

# Reglas de oro
- Idempotency key en cada Preference (evita doble cobro).
- Webhook valida firma HMAC (NO confiar en source IP).
- Guardar `payment_id` + `status` + `status_detail` + `date_approved`.
- Refund vía `Payment.refund(paymentId)` con motivo audit-logged.
```

### Skill — `payments-latam/dlocal-go`

```markdown
---
name: payments-latam-dlocal
description: Integración dLocal Go para cobrar en 15+ países con UNA sola API.
---

# Pasos
1. Crear cuenta en dlocalgo.com → obtener `X-Login` + `X-Trans-Key` + `Secret`.
2. Generar firma HMAC SHA-256: `X-Date + X-Login + body`.
3. POST a `https://api.dlocalgo.com/v1/payments`.
4. Soporta hosted checkout, tokenización o iframe (PCI-DSS Level 1).
5. Webhook con verificación de firma.

# Países cubiertos
AR, BR, MX, CL, CO, PE, UY, BO, EC, PY, CR, GT, DO, PA + India + África.

# Notas
- dLocal cobra 3.49-5.99% típico vs 4.99-6.5% de stacks combinados.
- Usar para B2C cross-border. Para B2B local, gateway local es mejor.
```

### Skill — `payments-latam/security-baseline`

```markdown
---
name: payments-latam-security
description: Seguridad mínima para CUALQUIER integración de pagos.
---

# No negociables
- [ ] PCI-DSS SAQ A (hosted) — NUNCA SAQ D propio salvo equipo dedicado.
- [ ] HTTPS obligatorio, TLS 1.3 only.
- [ ] HSTS preload + CSP estricto.
- [ ] Webhook con HMAC y replay protection (timestamp ±5 min).
- [ ] Idempotency key en TODO POST.
- [ ] No loguear PAN ni CVV NUNCA. Mask en transit.
- [ ] Reconciliación diaria con API del gateway.
- [ ] 3DS 2.x habilitado donde aplique (Argentina: obligatorio).
- [ ] Tokenización para suscripciones (jamás guardar card data).
- [ ] Anti-fraude: Mercado Pago, Stripe Radar, Kushki Smart Routing.
- [ ] Antilavado: KYC obligatorio si volumen alto.
- [ ] Logs PCI: append-only, retención 1 año, cifrado at-rest.
```

---

## 10. FASE 18 — Skill Pack para Clonar Webs y Apps

Construido sobre [Open Lovable](https://github.com/firecrawl/open-lovable) (Firecrawl team) y [Firecrawl MCP](https://www.firecrawl.dev/).

### Skill — `clone-master/website`

```markdown
---
name: clone-master-website
description: |
  Clona cualquier sitio web objetivo a un app moderno Next.js + Tailwind + TS,
  manteniendo design tokens y heurísticas UX.
---

# Pipeline (no negociable)
1. **Legal check** — ¿tenés derecho a clonar? Si es marca registrada con copyright,
   sólo "design inspiration" (NO copiar logos/marcas/copy literal).
2. **Discover & scrape** con Firecrawl MCP:
   - `firecrawl.scrape(url, { formats: ['markdown','screenshot','html'] })`
   - Para SPA pesado: `formats: ['screenshot@2x']`
3. **Extract design system**:
   - Colores (OKLCH), tipografía, spacing, radius, shadows.
   - Guardar en `design-tokens.json`.
4. **Recreate component-by-component**:
   - Usar `shadcn` MCP para inyectar componentes equivalentes.
   - Mapear cada sección a un bloque Tailwind/shadcn.
5. **Replace media**:
   - Imágenes propias o stock libre (Unsplash, Pexels).
   - Logos propios.
   - Copy reescrito (NO copiar verbatim).
6. **A11y + Perf** pass con Vercel skills.
7. **Diff visual** con Playwright screenshots side-by-side.

# Comandos típicos
- "Clone the hero section of stripe.com style for my fintech LATAM"
- "Extract the design system from @url and apply to my project"
- "Recreate the pricing section of linear.app with my plans"
```

### Alternativa: Open Lovable como microservicio local

```powershell
git clone https://github.com/firecrawl/open-lovable
cd open-lovable
pnpm install
# Configurar .env con FIRECRAWL_API_KEY + ANTHROPIC/OPENROUTER_API_KEY
pnpm dev
# Abrir http://localhost:3000 → pegar URL → recibir proyecto React listo
```

[Tutorial paso a paso de Firecrawl](https://www.firecrawl.dev/blog/open-lovable-tutorial).

### Skill — `clone-master/mobile-from-web`

```markdown
---
name: clone-master-mobile
description: |
  Toma un sitio web responsive y genera la app móvil nativa equivalente
  con Expo + NativeWind. Útil para "tengo web, quiero app".
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
```

### Skill — `clone-master/api-shadow`

```markdown
---
name: clone-master-api-shadow
description: |
  Si la web objetivo expone una API pública (REST/GraphQL), generá un
  "shadow client" tipado en TS y mockea para clonar funcionalidad.
---

# Pasos
1. Detectar API: DevTools → Network → filtrar XHR/fetch.
2. Si es REST: usar `openapi-typescript` o `orval` para tipos.
3. Si es GraphQL: `graphql-codegen`.
4. Reemplazar dominio por tu backend stub (Next API routes / Hono).
5. Implementar tus endpoints uno a uno.
```

> ⚠️ **Ética/legal:** clonar la **estética** y **arquitectura UX** es práctica común y legal. Clonar **assets**, **marca**, **copy** o **lógica patentada** NO. Pedile al modelo SIEMPRE que reescriba copy y reemplace media.

---

## 11. FASE 19 — Auto-Mejora Continua del Sistema (cada minuto)

Este es el verdadero salto a Mythos: que tu stack **mejore solo** mientras trabajás.

### Componente 1 — `engram-self-heal` (memoria que se cura)

Cada vez que cerrás una sesión exitosa, una skill captura **patrones recurrentes** y los promueve a permanentes.

```markdown
---
name: engram-self-heal
description: |
  Al final de CADA sesión, analiza qué funcionó, qué falló,
  y actualiza la memoria persistente con nuevos heurísticos.
---

# Trigger
- on: session_end
- on: pr_merged
- on: test_passed_after_N_failures

# Acciones
1. Resumir sesión: archivos tocados, decisiones tomadas, tests escritos.
2. Detectar patrones: ¿este modelo siempre falla en X? ¿este skill se invocó mal?
3. Actualizar `~/.config/engram/learnings.md` con nuevos heurísticos.
4. Si un patrón se repite 3+ veces → proponer crear una skill nueva.
5. Auto-PR a `.claude/skills/learned/` con el draft.
```

### Componente 2 — Cron job de healthcheck (Windows Task Scheduler)

```powershell
# Crear tarea programada cada 30 min
$action = New-ScheduledTaskAction -Execute 'powershell' `
  -Argument '-NoProfile -File C:\Users\<TU>\mythos\healthcheck.ps1'
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) `
  -RepetitionInterval (New-TimeSpan -Minutes 30)
Register-ScheduledTask -TaskName 'MythosHealthcheck' `
  -Action $action -Trigger $trigger -RunLevel Highest
```

**`healthcheck.ps1`:**

```powershell
# 1. Update OpenCode + skills
opencode upgrade
npx skills update

# 2. Update MCPs
npm update -g @upstash/context7-mcp @modelcontextprotocol/server-sequential-thinking

# 3. Audit dependencies
pnpm audit --audit-level=high

# 4. Test baseline skills
opencode run --skill skill-creator --dry-run --no-interactive

# 5. Backup engram
Copy-Item "$env:APPDATA\engram\db.sqlite" "D:\backups\engram-$(Get-Date -f yyyyMMdd-HHmm).sqlite"

# 6. Telemetría local (opcional)
Add-Content "D:\logs\mythos.log" "$(Get-Date) | OK"
```

### Componente 3 — Skill `auto-refine-prompts`

```markdown
---
name: auto-refine-prompts
description: |
  Cuando un prompt produce >2 iteraciones de fix, este skill detecta
  la causa raíz del prompt original y lo reescribe automáticamente.
---

# Lógica
1. Track: cada fix-attempt incrementa un contador local.
2. Si counter ≥ 2 → invocar este skill.
3. Analizar el prompt original vs los fixes.
4. Generar versión mejorada con: more context, fewer assumptions, more constraints.
5. Guardar en `.claude/prompts/refined/<hash>.md` para reuso futuro.
6. Si el patrón se repite, crear `.claude/skills/<dominio>/` automáticamente.
```

### Componente 4 — RAG sobre tu historial (knowledge compounding)

```markdown
---
name: history-rag
description: |
  Indexa todos los archivos que tocaste en los últimos 30 días en un
  vector store local (sqlite-vss o LanceDB) y consultalo antes de
  escribir código nuevo.
---

# Setup
- DB: LanceDB local en `~/.mythos/vec.lance`
- Embeddings: nomic-embed-text-v1.5 vía Ollama (gratis, local)
- Indexar diff de cada commit automáticamente (git post-commit hook).

# Uso (automático)
Antes de escribir cualquier feature, OpenCode consulta:
"¿He resuelto algo similar antes? Tráeme los 5 chunks más relevantes."
```

> Inspirado en investigaciones de [LangChain Continual Learning](https://www.langchain.com/blog/continual-learning-for-ai-agents) y [Self-Improving AI Agents 2026](https://www.technology.org/2026/03/02/self-improving-ai-agents-reinforcement-continual-learning/).

---

## 12. FASE 20 — `AGENTS.md` Maestro (validado por ETH Zürich)

[Estudio ETH Zürich febrero 2026](https://medium.com/@alexefimenko/your-ai-coding-agent-is-only-as-good-as-its-rules-heres-how-to-write-ones-that-actually-work-f6bceb564871) — `AGENTS.md` está reemplazando a `CLAUDE.md`/`.cursorrules`/etc como **estándar abierto** para todos los agentes. [Stack Overflow blog 2026-03-26](https://stackoverflow.blog/2026/03/26/coding-guidelines-for-ai-agents-and-people-too/).

### Plantilla Mythos optimizada (probada)

```markdown
# AGENTS.md
> Reglas obligatorias para CUALQUIER agente trabajando en este repo.
> Last validated: 2026-06-10.

## Stack
- TypeScript estricto, Next.js 16 App Router, React 19, Tailwind v4 + shadcn/ui
- Postgres 17 + Drizzle, Better-Auth, TanStack Query
- Package manager: pnpm (NO npm, NO yarn)

## Reglas no negociables (R1-R10)
R1. **NUNCA inventes APIs**: verificá en docs reales vía MCP `context7` antes de usar.
R2. **NUNCA borres archivos** sin preguntar.
R3. **NUNCA hagas commit** sin tests verdes (`pnpm test` + `pnpm typecheck`).
R4. **NUNCA toques** `.env`, `secrets/`, `*.pem`, `*.key`.
R5. **NUNCA hagas push --force** a `main` ni `dev`.
R6. **SIEMPRE leé** `src/lib/` antes de escribir un util nuevo (puede existir).
R7. **SIEMPRE usá** Zod para validar input (server actions, API routes, env).
R8. **SIEMPRE usá** Server Components por defecto. Cliente sólo si hay interacción.
R9. **SIEMPRE escribí** test antes de implementación (TDD via `superpowers`).
R10. **SIEMPRE corré** `mythos-sec-pre-commit` antes de commitear.

## Convenciones
- Imports: `import type {...}` cuando es type-only.
- Files: kebab-case, `.tsx` solo si JSX.
- Components: PascalCase, una export default por archivo.
- Hooks: prefijo `use`, en `src/hooks/`.
- Server actions: `'use server'` arriba, retornan `{ ok, data?, error? }`.
- Env: typed via `t3-env` o `@t3-oss/env-nextjs`.

## Comandos
- `pnpm dev` — dev server con Turbopack
- `pnpm test` — Vitest + RTL
- `pnpm e2e` — Playwright
- `pnpm lint` — ESLint flat config + Biome
- `pnpm typecheck` — tsc --noEmit
- `pnpm db:push` — Drizzle push
- `pnpm db:studio` — Drizzle Studio

## Skills activas
- superpowers, owasp-security, vercel-web-design-guidelines,
  vercel-react-best-practices, shadcn-skill, webapp-testing, code-simplifier

## MCPs activos
- engram, context7, sequential-thinking, serena, playwright, semgrep, shadcn

## Definition of Done
Una tarea está DONE solo si:
1. Tests verdes (unit + e2e).
2. Lint y typecheck verdes.
3. Lighthouse mobile ≥ 90 (si toca UI).
4. `mythos-sec-pre-commit` passed.
5. PR descripción con: contexto, cambios, riesgos, screenshots.
6. Review humano aprobado.
```

> 💡 Pegá este archivo en **TODOS** tus repos. Los agentes (OpenCode, Claude Code, Cursor, Codex, Gemini CLI, GitHub Copilot CLI) **todos respetan `AGENTS.md`** desde 2026.

---

## 13. FASE 21 — Routing Avanzado y Verificación Cruzada Multi-Modelo

### Tabla de routing actualizada (junio 2026)

| Fase del workflow | Modelo recomendado (OpenRouter free) | Por qué |
|-------------------|--------------------------------------|---------|
| **Brainstorming / Spec** | `z-ai/glm-4.6` o `google/gemini-2.5-flash` | Razonamiento amplio + contexto largo |
| **Plan detallado** | `qwen/qwen3-coder-480b` | Mejor en estructura técnica |
| **Implementación TDD** | `qwen/qwen3-coder-480b` o `deepseek/deepseek-v3.2` | Code generation #1 free |
| **Refactor grande** | `kimi-k2-instruct` (1M tokens context) | Para repos grandes |
| **Code review** | `z-ai/glm-4.6` | Crítico y detallado |
| **Verificación cruzada** | Modelo DIFERENTE al implementador | Segundo par de ojos |
| **Tareas rápidas / sed-like** | `z-ai/glm-4.6-air` | Más barato, rápido |
| **Análisis de seguridad** | `qwen/qwen3-coder-480b` + skill OWASP | Combo SAST + LLM |

### Skill — `cross-verify`

```markdown
---
name: cross-verify
description: |
  Para tareas críticas (auth, pagos, encryption, RLS), ejecuta SIEMPRE
  verificación cruzada con un segundo modelo.
---

# Trigger automático
Si tocás: `auth/`, `payments/`, `crypto/`, `db/migrations/`, `middleware`, `RLS`

# Pipeline
1. Modelo A (Qwen3-Coder) → implementación.
2. Modelo B (GLM-4.6) → review con prompt:
   "Vos sos auditor. Buscá: SQLi, XSS, race conditions, IDOR,
    auth bypass, secret leak, missing input validation,
    incorrect HMAC, weak random."
3. Si B reporta issues → vuelve a A con el diff.
4. Loop hasta B no reporte CRITICAL ni HIGH.
5. Documentar findings en `audit-log.md`.
```

### Multi-model fusion (opcional, avanzado)

[OpenRouter Fusion](https://www.digitalapplied.com/blog/openrouter-fusion-multi-model-ai-responses-guide) permite enviar la misma consulta a 3 modelos en paralelo y sintetizar la mejor respuesta. Ideal para decisiones arquitecturales.

---

## 14. FASE 22 — Hardening del propio ecosistema de Skills (OWASP AST10)

[OWASP Agentic Skills Top 10](https://owasp.org/www-project-agentic-skills-top-10/) — riesgos específicos de las skills mismas:

| Riesgo | Tu mitigación Mythos |
|--------|----------------------|
| **AST01 Malicious Skills** | Sólo skills de orgs verificadas (anthropics, vercel-labs, expo, obra, alirezarezvani) + escaneo con `skill-security-auditor` |
| **AST02 Supply Chain** | Pin a commit hash, no a `main`. Verificá checksum |
| **AST03 Over-Privileged** | Cada skill declara permisos mínimos en su frontmatter |
| **AST04 Insecure Metadata** | Linter de YAML frontmatter (no scripts en `description`) |
| **AST05 Unsafe Deserialization** | Skills NUNCA hacen `eval(JSON)` — usá Zod |
| **AST06 Weak Isolation** | Subagentes en sandbox (Superpowers ya lo hace con worktrees) |
| **AST07 Update Drift** | Lockfile de skills versionadas (próximo: `skills-lock.json`) |
| **AST08 Poor Scanning** | Pipeline semántico + conductual antes de cada install |
| **AST09 No Governance** | Inventario en `~/.config/mythos/skills-inventory.json` |
| **AST10 Cross-Platform Reuse** | Usá formato YAML universal de OWASP AST10 |

### Script de inventario automático

```powershell
# inventory.ps1
$skills = Get-ChildItem -Recurse -Filter 'SKILL.md' .claude/skills/
$inv = $skills | ForEach-Object {
  $meta = (Get-Content $_.FullName -Raw) -match '(?ms)^---(.+?)---' | Out-Null
  [pscustomobject]@{
    Path = $_.FullName
    Hash = (Get-FileHash $_.FullName -Algorithm SHA256).Hash
    Size = $_.Length
    Modified = $_.LastWriteTime
  }
}
$inv | ConvertTo-Json -Depth 3 | Set-Content "$env:USERPROFILE\.config\mythos\skills-inventory.json"
```

---

## 15. FASE 23 — Healthcheck PRO, métricas y telemetría

### Dashboard local de salud (Grafana-free alternativa: simple HTML)

```powershell
# C:\mythos\status.ps1
$report = @{
  date = Get-Date -Format 'yyyy-MM-dd HH:mm'
  opencode_version = (opencode --version)
  engram_running = (Get-Process engram -ErrorAction SilentlyContinue) -ne $null
  mcps_alive = @()
  skills_count = (Get-ChildItem -Recurse -Filter 'SKILL.md' .claude/skills/).Count
  last_commit = (git log -1 --pretty=format:'%h %s')
  pnpm_audit = (pnpm audit --json | ConvertFrom-Json).metadata.vulnerabilities
}
$report | ConvertTo-Json | Set-Content C:\mythos\status.json
```

Abrí `status.json` en VS Code o construí un mini-dashboard estático con Next.js consumiendo este archivo via filesystem.

### KPIs Mythos a medir cada semana

| KPI | Target |
|-----|--------|
| % de PRs auto-merged sin fix | > 70% |
| Tiempo medio idea → merge | < 4 horas |
| Bugs encontrados post-merge | < 1 por semana |
| Alucinaciones detectadas pre-commit | tendiendo a 0 |
| Skills usadas activamente | ≥ 15 de 25 |
| MCPs sin caer | 99% uptime |
| Coverage tests | ≥ 80% |
| Lighthouse mobile promedio | ≥ 92 |

---

## 16. Anexo A — Comandos de instalación todo-en-uno

```powershell
# === ONE-LINER MYTHOS INSTALL (Windows PowerShell) ===

# 1. Skills universales con npx skills
npx -y skills add obra/superpowers
npx -y skills add anthropics/skills/skills/skill-creator
npx -y skills add anthropics/skills/skills/webapp-testing
npx -y skills add anthropics/skills/skills/code-simplifier
npx -y skills add vercel-labs/agent-skills/skills/web-design-guidelines
npx -y skills add vercel-labs/agent-skills/skills/react-best-practices
npx -y skills add vercel-labs/agent-skills/skills/composition-patterns
npx -y skills add expo/skills

# 2. Skills con curl
curl -sL https://raw.githubusercontent.com/agamm/claude-code-owasp/main/.claude/skills/owasp-security/SKILL.md `
  -o ~/.claude/skills/owasp-security/SKILL.md --create-dirs

# 3. Pack 338 skills (cherry-pick)
git clone --depth=1 https://github.com/alirezarezvani/claude-skills $env:TEMP\rezvani
foreach ($s in @('security-scanner','dependency-auditor','observability-designer','landing')) {
  Copy-Item -Recurse $env:TEMP\rezvani\skills\**\$s .claude\skills\
}

# 4. Skills Mythos custom (las que escribimos arriba) → crear manualmente
mkdir .claude\skills\landing-pro, .claude\skills\admin-pro, .claude\skills\mobile-pro,
      .claude\skills\payments-latam, .claude\skills\clone-master, .claude\skills\mythos-sec

# 5. MCPs (agregalos a opencode.json — ver FASE 12)

# 6. AGENTS.md (copiá la plantilla FASE 20 a la raíz)

# 7. Husky + pre-commit
pnpm add -D husky lint-staged
pnpm husky init
echo "opencode run --skill mythos-sec-pre-commit --no-interactive" > .husky/pre-commit

# 8. Cron healthcheck (FASE 19)
# Ejecutar el bloque de Register-ScheduledTask de la FASE 19

# 9. Inventario inicial
.\inventory.ps1

# 10. Verificación final
opencode list skills
opencode list mcps
```

---

## 17. Anexo B — Plantillas de prompts maestros por dominio

### B1. Landing nueva
```
Voy a crear una landing para [PRODUCTO] dirigida a [AUDIENCE LATAM].
Stack: el de mi skill landing-pro-stack.
Antes de codear, ejecutá landing-pro-spec y completá las 12 secciones.
Diseñá inspirándote en [URL1] y [URL2] (sin copiar copy/logos).
Usá shadcn MCP para componentes. Mobile-first. WCAG 2.2 AA.
SEO target keyword: "[KEYWORD]". Lighthouse mobile ≥ 92 obligatorio.
```

### B2. Dashboard admin
```
Quiero un admin panel para gestionar [DOMAIN].
Aplicá admin-pro-architecture + admin-pro-security baselines.
Roles: [ADMIN, MANAGER, VIEWER] con CASL.
Tablas críticas: [TABLA1, TABLA2] con RLS multi-tenant.
Audit log en TODAS las mutaciones.
Cmd+K palette, dark mode, i18n es/en, virtualización en listas >100.
```

### B3. App móvil
```
Quiero clonar la UX de [URL] como app nativa.
Aplicá clone-master-mobile + mobile-pro-baseline.
Expo SDK más reciente, New Architecture ON.
Auth con Clerk + biometric. Push notifications. Deep links.
EAS Update canal canary → prod 10% → 100%.
Test E2E con Maestro.
```

### B4. Integración Mercado Pago
```
Integrar Checkout Pro de Mercado Pago en mi Next.js 16.
Aplicá payments-latam-mp-checkout + payments-latam-security.
Países: AR + MX. Soportar también Pix (Brasil) vía Stripe en paralelo.
Webhook con HMAC. Idempotency keys. Refunds audit-logged.
Test con tarjetas de testing antes de pasar a prod.
```

### B5. Auditoría de seguridad
```
Audita la rama actual usando trail-of-bits-security + owasp-security
+ mythos-sec-llm-hardening si toca LLM.
Reporta findings por severidad. NO arregles aún, sólo reportá.
Foco: auth, payments, RLS, XSS, SSRF, secret leak, prompt injection.
```

### B6. Clonar sitio
```
Cloná la estética y arquitectura de [URL] como Next.js 16 + shadcn.
Aplicá clone-master-website.
NO copies copy/logos/marca. Reemplazá media con stock libre.
Diff visual con Playwright. Performance target Lighthouse ≥ 92.
```

---

## 🏁 Checklist final Mythos

- [ ] Las 25 skills del pack núcleo instaladas
- [ ] Superpowers funcionando (probado con un proyecto pequeño)
- [ ] MCPs vivos: engram + context7 + sequential-thinking + serena + playwright + semgrep + shadcn + firecrawl + github
- [ ] AGENTS.md en raíz de cada repo
- [ ] Husky + pre-commit + `mythos-sec-pre-commit`
- [ ] Cron healthcheck cada 30 min
- [ ] Skills inventory automatizado (AST09)
- [ ] Routing multi-modelo configurado
- [ ] `cross-verify` activo en rutas críticas
- [ ] Backups Engram + repos diarios
- [ ] Healthcheck dashboard local

> **Cuando todo esto esté ON**, cualquier modelo gratuito de OpenRouter
> producirá output al nivel (o superior) de Claude Sonnet 4.5 pago.
> El secreto no es el modelo: es la **composición de contexto**.

---

## 📚 Referencias clave (todas verificadas y vigentes a junio 2026)

- [anthropics/skills (oficial)](https://github.com/anthropics/skills)
- [obra/superpowers](https://github.com/obra/superpowers)
- [vercel-labs/skills CLI universal](https://github.com/vercel-labs/skills)
- [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)
- [expo/skills](https://github.com/expo/skills) y [docs.expo.dev/skills](https://docs.expo.dev/skills/)
- [alirezarezvani/claude-skills (338 skills)](https://github.com/alirezarezvani/claude-skills)
- [agamm/claude-code-owasp](https://github.com/agamm/claude-code-owasp)
- [OWASP Top 10 2025](https://owasp.org/Top10/) · [ASVS 5.0](https://owasp.org/www-project-application-security-verification-standard/) · [LLM Top 10 2025](https://genai.owasp.org/llm-top-10/) · [Agentic 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) · [AST10](https://owasp.org/www-project-agentic-skills-top-10/)
- [shadcn skills docs](https://ui.shadcn.com/docs/skills) · [shadcn MCP](https://ui.shadcn.com/docs/mcp)
- [Firecrawl best Claude Code skills 2026](https://www.firecrawl.dev/blog/best-claude-code-skills)
- [Open Lovable (Firecrawl)](https://github.com/firecrawl/open-lovable)
- [Engram MCP](https://github.com/edg-l/engram-mcp) · [Awesome MCP servers](https://github.com/wong2/awesome-mcp-servers) · [Top MCPs 2026 (Toloka)](https://toloka.ai/blog/best-mcp-servers-for-ai-agents/)
- [Payment Gateways LATAM 2026](https://dev.to/cristiantalasanchez/payment-gateways-in-latam-2026-the-guide-you-need-before-collecting-your-first-dollar-1i1h)
- [Mercado Pago Checkout Pro](https://www.mercadopago.com.ar/developers/en/docs/checkout-pro/overview) · [dLocal Docs](https://docs.dlocal.com/)
- [Callstack RN best practices](https://www.callstack.com/blog/announcing-react-native-best-practices-for-ai-agents)
- [Agensi: mobile dev skills](https://www.agensi.io/learn/best-skills-mobile-development-ai-agents)
- [AGENTS.md study by ETH Zürich (vía Medium)](https://medium.com/@alexefimenko/your-ai-coding-agent-is-only-as-good-as-its-rules-heres-how-to-write-ones-that-actually-work-f6bceb564871)
- [Stack Overflow: coding guidelines for AI agents](https://stackoverflow.blog/2026/03/26/coding-guidelines-for-ai-agents-and-people-too/)
- [LangChain continual learning](https://www.langchain.com/blog/continual-learning-for-ai-agents)

---

**Versión:** Mythos 1.0 · **Fecha:** 2026-06-10 · **Autor:** Construido sobre el ecosistema OSS 2026.
