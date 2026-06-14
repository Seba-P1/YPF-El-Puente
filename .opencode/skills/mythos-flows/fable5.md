# 🚀 Guía Maestra: Flujo de Trabajo IA Nivel "Fable 5" con Modelos Gratuitos en Windows

> **Objetivo:** Configurar un ecosistema local de desarrollo asistido por IA que reduzca al mínimo los errores y alucinaciones de modelos gratuitos (OpenRouter, Z.ai GLM, Zen), elevando la calidad al nivel de un workflow profesional con Claude/Anthropic — **sin pagar suscripciones**.
>
> **Stack base:** Windows 11 + PowerShell + Terminal + Gentle AI Stack + Engram + SDD (Spec-Kit) + OpenCode + Claude Free (web) + Skills personalizadas.
>
> **Filosofía:** "La IA nunca decide sola. El humano especifica, la IA implementa, otro agente verifica." Este es exactamente el patrón que Anthropic usa internamente con sus Skills y que tú puedes replicar gratis.

---

## 📑 Tabla de Contenidos

1. [Diagnóstico: Por qué los modelos gratuitos alucinan](#1-diagnóstico-por-qué-los-modelos-gratuitos-alucinan)
2. [Arquitectura del Ecosistema](#2-arquitectura-del-ecosistema)
3. [FASE 0 — Pre-requisitos en Windows](#3-fase-0--pre-requisitos-en-windows)
4. [FASE 1 — Instalar Gentle AI Stack](#4-fase-1--instalar-gentle-ai-stack)
5. [FASE 2 — Configurar OpenCode + modelos gratuitos](#5-fase-2--configurar-opencode--modelos-gratuitos)
6. [FASE 3 — Instalar Engram (memoria persistente)](#6-fase-3--instalar-engram-memoria-persistente)
7. [FASE 4 — Instalar Spec-Kit (SDD)](#7-fase-4--instalar-spec-kit-sdd)
8. [FASE 5 — Crear tu librería de Skills (estilo Anthropic)](#8-fase-5--crear-tu-librería-de-skills-estilo-anthropic)
9. [FASE 6 — Flujo de trabajo anti-alucinaciones](#9-fase-6--flujo-de-trabajo-anti-alucinaciones)
10. [FASE 7 — Plantillas de prompts maestros](#10-fase-7--plantillas-de-prompts-maestros)
11. [FASE 8 — Routing inteligente de modelos por fase](#11-fase-8--routing-inteligente-de-modelos-por-fase)
12. [FASE 9 — Verificación, debug y mantenimiento](#12-fase-9--verificación-debug-y-mantenimiento)
13. [Cheatsheet diario](#13-cheatsheet-diario)
14. [Recursos y referencias](#14-recursos-y-referencias)

---

## 1. Diagnóstico: Por qué los modelos gratuitos alucinan

Antes de instalar nada, hay que entender **por qué** un modelo como GLM 4.6 free, DeepSeek free o Qwen3 Coder free comete errores que Claude Sonnet no comete:

| Causa raíz | Síntoma típico | Mitigación en esta guía |
|---|---|---|
| **Contexto pobre** | Inventa funciones inexistentes, mezcla APIs | Engram + SDD + RAG local |
| **Razonamiento limitado** | Salta pasos, asume cosas | Skills + chain-of-thought forzado |
| **Sin memoria entre sesiones** | Repite errores ya corregidos | Engram MCP server |
| **Prompts ambiguos** | Genera código genérico | Spec-Kit + plantillas maestras |
| **Sin herramientas** | "Adivina" en lugar de verificar | MCP servers (filesystem, git, fetch) |
| **Quantización agresiva (free tier)** | Errores de sintaxis sutiles | Doble paso: implementación + revisión |

> 💡 **Insight clave:** Anthropic logra que Claude "no alucine" no por un mejor modelo, sino por **Skills + System Prompts + Tool Use estructurado**. Tú puedes replicar esto al 80% con herramientas gratis.

---

## 2. Arquitectura del Ecosistema

```
┌──────────────────────────────────────────────────────────────┐
│                  TU FLUJO DE TRABAJO COMPLETO                 │
└──────────────────────────────────────────────────────────────┘

   ┌───────────────┐      [1] PLANIFICACIÓN
   │ Claude Free   │  ───► Spec en lenguaje natural
   │ (navegador)   │       (usar plantillas maestras)
   └───────┬───────┘
           │  pega spec
           ▼
   ┌───────────────┐      [2] ESPECIFICACIÓN FORMAL
   │  Spec-Kit     │  ───► /specify → /plan → /tasks
   │  (SDD)        │       Genera contratos verificables
   └───────┬───────┘
           │  tareas atómicas
           ▼
   ┌───────────────────────────────────────────┐
   │              OpenCode (terminal)           │
   │  ┌─────────────────────────────────────┐  │
   │  │  Modelo gratuito (GLM/DeepSeek/Qwen)│  │
   │  └─────────────────────────────────────┘  │
   │           ▲          ▲          ▲          │
   │           │          │          │          │
   │       ┌───┴───┐  ┌──┴───┐  ┌──┴────┐     │
   │       │Engram │  │Skills│  │  MCP   │     │
   │       │ (mem) │  │ (.md)│  │servers │     │
   │       └───────┘  └──────┘  └────────┘     │
   └───────────────┬───────────────────────────┘
                   │  código generado
                   ▼
   ┌───────────────┐      [3] VERIFICACIÓN
   │  Segundo      │  ───► Otro modelo gratis revisa
   │  agente       │       (Qwen revisa lo de GLM)
   └───────────────┘
```

**Capas del stack:**

- **Capa 1 — Configurador:** Gentle AI Stack (instala y configura todo)
- **Capa 2 — Agente:** OpenCode (CLI de codificación)
- **Capa 3 — Memoria:** Engram (MCP server con SQLite + FTS5)
- **Capa 4 — Especificación:** Spec-Kit de GitHub (SDD)
- **Capa 5 — Skills:** Carpeta `.claude/skills/` o `.opencode/skills/`
- **Capa 6 — Modelos:** OpenRouter free + Z.ai GLM + Ollama local (opcional)

---

## 3. FASE 0 — Pre-requisitos en Windows

### 3.1 Habilitar PowerShell con permisos

Abre **PowerShell como Administrador** y ejecuta:

```powershell
# Permitir ejecución de scripts firmados
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Verificar versión de PowerShell (necesitas 5.1+)
$PSVersionTable.PSVersion
```

### 3.2 Instalar Scoop (gestor de paquetes para Windows)

Scoop es **obligatorio** porque Gentle AI lo usa como vía oficial de instalación en Windows:

```powershell
# Instalar Scoop
irm get.scoop.sh | iex

# Verificar
scoop --version
```

### 3.3 Instalar dependencias base

```powershell
# Git, Node.js LTS, Python, ripgrep, fzf, bat (mejora terminal)
scoop install git nodejs-lts python ripgrep fzf bat curl jq

# Verificar instalaciones
git --version
node --version
python --version
```

### 3.4 (Opcional pero recomendado) Windows Terminal + Oh My Posh

```powershell
# Windows Terminal desde Microsoft Store o:
winget install --id Microsoft.WindowsTerminal -e

# Oh My Posh para prompt elegante
winget install JanDeDobbeleer.OhMyPosh -s winget
```

### 3.5 Crear estructura de carpetas de trabajo

```powershell
# Crea tu directorio raíz de proyectos IA
New-Item -ItemType Directory -Path "$HOME\ai-workspace" -Force
New-Item -ItemType Directory -Path "$HOME\ai-workspace\projects" -Force
New-Item -ItemType Directory -Path "$HOME\ai-workspace\skills" -Force
New-Item -ItemType Directory -Path "$HOME\ai-workspace\specs" -Force
New-Item -ItemType Directory -Path "$HOME\ai-workspace\engram-data" -Force

cd $HOME\ai-workspace
```

---

## 4. FASE 1 — Instalar Gentle AI Stack

Gentle AI **no es un agente** — es un **configurador de ecosistema** creado por Gentleman Programming. Instala y conecta Claude Code, OpenCode, Gemini CLI, Cursor y VS Code de forma consistente.

### 4.1 Instalación en Windows (one-liner oficial)

```powershell
# Instala gentle-ai vía Scoop (la vía soportada en Windows)
irm https://raw.githubusercontent.com/Gentleman-Programming/gentle-ai/main/install.ps1 | iex
```

> ⚠️ Si el comando falla, usa la alternativa manual:
> ```powershell
> scoop bucket add gentleman https://github.com/Gentleman-Programming/scoop-bucket
> scoop install gentle-ai
> ```

### 4.2 Verificar instalación

```powershell
gga --version    # GGA = Gentle Global Agent
gga --help
```

### 4.3 Inicializar configuración global

```powershell
# Configura los agentes que quieres usar (selecciona opencode)
gga init

# Selecciona cuando te pregunte:
#  ✔ OpenCode
#  ✔ Claude Code (opcional)
#  ✔ Gemini CLI (opcional)
```

Esto crea automáticamente:
- `~/.config/opencode/opencode.json`
- `~/.claude/` (si seleccionaste Claude Code)
- Plantillas base de Skills, Agents y Commands

### 4.4 Estructura que genera Gentle AI

```
%USERPROFILE%\.config\opencode\
├── opencode.json          # Configuración principal
├── agents\                # Sub-agentes personalizados
├── commands\              # Slash commands
└── skills\                # Skills modulares
```

---

## 5. FASE 2 — Configurar OpenCode + modelos gratuitos

### 5.1 Instalar OpenCode (si Gentle AI no lo instaló)

```powershell
# Vía npm (multiplataforma)
npm install -g opencode-ai

# Verificar
opencode --version
```

### 5.2 Obtener API keys gratuitas

#### A) OpenRouter (acceso a 28+ modelos free)

1. Registrate en https://openrouter.ai
2. Ve a https://openrouter.ai/keys → "Create Key"
3. Copia la key (formato `sk-or-v1-...`)

**Modelos free recomendados para coding (2026):**

| Modelo | Slug en OpenRouter | Mejor para |
|---|---|---|
| Qwen3 Coder | `qwen/qwen3-coder:free` | Coding general (1M context) |
| DeepSeek V3.2 | `deepseek/deepseek-chat-v3.2:free` | Razonamiento + código |
| GLM 4.6 | `z-ai/glm-4.6:free` | Tareas largas, agentic |
| Llama 3.3 70B | `meta-llama/llama-3.3-70b-instruct:free` | General, sólido |
| Nemotron 3 Super | `nvidia/nemotron-3-super:free` | Razonamiento estructurado |

#### B) Z.ai (GLM directo — más rápido que vía OpenRouter)

1. Registrate en https://z.ai
2. Ve a https://docs.z.ai → API Keys
3. Crea key gratuita (cuota limitada pero generosa)

### 5.3 Configurar API keys como variables de entorno

```powershell
# Setear permanente en Windows (usuario actual)
[System.Environment]::SetEnvironmentVariable('OPENROUTER_API_KEY', 'sk-or-v1-TU_KEY_AQUI', 'User')
[System.Environment]::SetEnvironmentVariable('ZAI_API_KEY', 'TU_KEY_ZAI_AQUI', 'User')

# Recargar sesión
refreshenv
# O simplemente cierra y reabre PowerShell

# Verificar
echo $env:OPENROUTER_API_KEY
```

### 5.4 Crear `opencode.json` óptimo

Crea el archivo en `%USERPROFILE%\.config\opencode\opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "theme": "tokyonight",
  "model": "openrouter/qwen/qwen3-coder:free",
  "autoshare": false,
  "autoupdate": true,
  "provider": {
    "openrouter": {
      "npm": "@openrouter/ai-sdk-provider",
      "name": "OpenRouter",
      "options": {
        "apiKey": "{env:OPENROUTER_API_KEY}",
        "baseURL": "https://openrouter.ai/api/v1"
      },
      "models": {
        "qwen/qwen3-coder:free": { "name": "Qwen3 Coder (free)" },
        "deepseek/deepseek-chat-v3.2:free": { "name": "DeepSeek V3.2 (free)" },
        "z-ai/glm-4.6:free": { "name": "GLM 4.6 (free)" },
        "meta-llama/llama-3.3-70b-instruct:free": { "name": "Llama 3.3 70B (free)" }
      }
    },
    "zai": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Z.ai Direct",
      "options": {
        "apiKey": "{env:ZAI_API_KEY}",
        "baseURL": "https://api.z.ai/api/paas/v4"
      },
      "models": {
        "glm-4.6": { "name": "GLM 4.6 Direct" },
        "glm-4-flash": { "name": "GLM 4 Flash (rápido)" }
      }
    }
  },
  "mcp": {},
  "instructions": [
    "AGENTS.md",
    ".github/copilot-instructions.md"
  ]
}
```

### 5.5 Probar OpenCode

```powershell
cd $HOME\ai-workspace\projects
mkdir test-project && cd test-project
opencode
```

En la TUI prueba:
- `Ctrl+M` → cambiar de modelo
- `/help` → ver comandos
- Escribir: *"Crea un archivo hello.py que imprima 'hola mundo'"*

---

## 6. FASE 3 — Instalar Engram (memoria persistente)

Engram es un **MCP server** escrito en Go que da memoria persistente a **cualquier agente compatible con MCP** (OpenCode, Claude Code, Gemini CLI). Usa SQLite + FTS5 para búsqueda full-text local.

### 6.1 Instalar Engram en Windows

```powershell
# Opción A — vía Scoop (recomendado, instalado por Gentle AI)
scoop install engram

# Opción B — vía Go (si tenés Go instalado)
go install github.com/Gentleman-Programming/engram/cmd/engram@latest

# Verificar
engram --version
```

### 6.2 Inicializar la base de memoria

```powershell
# Crear directorio de datos
$env:ENGRAM_DATA_DIR = "$HOME\ai-workspace\engram-data"
[System.Environment]::SetEnvironmentVariable('ENGRAM_DATA_DIR', "$HOME\ai-workspace\engram-data", 'User')

# Inicializar DB
engram init
```

### 6.3 Registrar Engram en OpenCode automáticamente

```powershell
# Comando de Engram que registra el MCP en opencode.json
engram setup --agent opencode
```

Esto agrega automáticamente a tu `opencode.json`:

```json
{
  "mcp": {
    "engram": {
      "type": "local",
      "command": ["engram", "mcp"],
      "enabled": true
    }
  }
}
```

### 6.4 Verificar que OpenCode lee Engram

```powershell
opencode
# Dentro de OpenCode:
/mcp
# Debería listar "engram" como conectado
```

### 6.5 Comandos de uso diario de Engram

| Comando dentro de OpenCode | Función |
|---|---|
| "Recuerda que en este proyecto usamos React Query, no SWR" | Guarda fact persistente |
| "¿Qué decisiones arquitectónicas tomamos en este proyecto?" | Recupera contexto |
| "Busca en memoria todas las veces que tuvimos errores con CORS" | FTS5 search |

### 6.6 CLI de Engram (fuera de OpenCode)

```powershell
# Ver toda la memoria
engram list

# Buscar
engram search "react query"

# Agregar manualmente
engram add "Patrón: siempre usar Zod para validar inputs de API"

# Exportar para backup
engram export > backup-$(Get-Date -Format yyyyMMdd).json
```

---

## 7. FASE 4 — Instalar Spec-Kit (SDD)

Spec-Driven Development es el método donde **especificas antes de codificar**. GitHub lanzó `spec-kit` como toolkit oficial. Esta es la clave para que modelos gratuitos no alucinen.

### 7.1 Instalar Spec-Kit

```powershell
# Spec-Kit es Python-based
pip install specify-cli

# Verificar
specify --version
```

### 7.2 Inicializar Spec-Kit en un proyecto

```powershell
cd $HOME\ai-workspace\projects\test-project

# Inicializa SDD con OpenCode como agente
specify init --ai opencode

# Esto crea:
#   .specify/
#   ├── memory/
#   │   └── constitution.md      # Reglas del proyecto
#   ├── scripts/
#   ├── templates/
#   │   ├── spec-template.md
#   │   ├── plan-template.md
#   │   └── tasks-template.md
#   └── config.json
```

### 7.3 Los 4 comandos sagrados de SDD

Estos comandos quedan disponibles **como slash commands dentro de OpenCode**:

| Comando | Qué hace | Salida |
|---|---|---|
| `/constitution` | Define principios inmutables del proyecto | `.specify/memory/constitution.md` |
| `/specify` | Convierte idea → spec detallado (qué y por qué) | `specs/NNN-feature/spec.md` |
| `/plan` | Convierte spec → plan técnico (cómo) | `plan.md`, `research.md`, `data-model.md` |
| `/tasks` | Descompone plan → tareas atómicas verificables | `tasks.md` con checkboxes |
| `/implement` | Ejecuta tareas una por una con verificación | Código + commits |

### 7.4 Ejemplo de flujo SDD completo

```powershell
opencode
# Dentro de OpenCode:

/constitution
# Define: "Siempre TypeScript estricto. Tests con Vitest. Sin any."

/specify "Una app CLI que liste mis tareas pendientes desde un .json local 
y permita marcarlas como completadas con un comando"

# OpenCode genera spec.md con: contexto, requisitos funcionales, 
# casos de uso, edge cases, criterios de aceptación

/plan "Usar Node.js + Commander.js. Sin DB, solo archivo JSON. Tests con Vitest."

# OpenCode genera plan técnico con: arquitectura, stack, contratos de datos

/tasks
# Genera lista de 15-20 tareas atómicas, cada una verificable

/implement
# Ejecuta tarea por tarea, commiteando cada una
```

> 🎯 **Resultado:** Con SDD, un modelo gratuito como Qwen3 Coder produce código **3-5x más confiable** porque trabaja con instrucciones quirúrgicas en lugar de prompts vagos.

---

## 8. FASE 5 — Crear tu librería de Skills (estilo Anthropic)

Las **Skills** son la "salsa secreta" de Anthropic. Son carpetas con un `SKILL.md` + scripts/recursos que el agente carga **bajo demanda** cuando detecta que las necesita.

### 8.1 Anatomía de una Skill

```
mi-skill/
├── SKILL.md          # Front-matter + instrucciones (OBLIGATORIO)
├── scripts/          # Scripts ejecutables (opcional)
│   └── helper.py
├── references/       # Docs de referencia (opcional)
│   └── api-spec.md
└── examples/         # Ejemplos (opcional)
    └── example1.ts
```

### 8.2 Formato obligatorio de `SKILL.md`

```markdown
---
name: nombre-skill
description: Descripción de UNA línea de cuándo aplicar esta skill. 
  El modelo decide cargarla solo si la descripción matchea la tarea.
---

# Título de la Skill

## Cuándo usar
Lista de triggers específicos.

## Cómo proceder
Paso 1...
Paso 2...

## Ejemplos
...

## Reglas inviolables
- NUNCA hacer X
- SIEMPRE verificar Y
```

### 8.3 Ubicación de Skills

```powershell
# Skills globales (todos los proyectos)
$HOME\.config\opencode\skills\

# Skills de proyecto (solo este proyecto)
.\.opencode\skills\
```

### 8.4 Skills imprescindibles que debes crear (templates listos)

#### 🛡️ Skill 1: `verificacion-anti-alucinacion`

Crea `$HOME\.config\opencode\skills\verificacion-anti-alucinacion\SKILL.md`:

```markdown
---
name: verificacion-anti-alucinacion
description: Aplicar SIEMPRE antes de afirmar que una librería, función, 
  API o método existe. Especialmente con modelos gratuitos.
---

# Anti-Alucinación: Verificación de Existencia

## Cuándo usar
- Siempre que vayas a usar una librería externa
- Siempre que llames a una API de terceros
- Siempre que uses un método "que recuerdes"

## Cómo proceder
1. **NO escribas el import todavía**.
2. Ejecuta primero una de estas verificaciones:
   - `npm view <package> versions --json` para verificar que existe el paquete
   - `cat package.json` para ver versión instalada
   - `rg "from ['\"]<package>['\"]" -t ts` para ver cómo se usa ya en el proyecto
3. Lee la documentación oficial vía fetch si está disponible.
4. **Solo entonces** escribe el código.

## Reglas inviolables
- NUNCA inventar nombres de funciones "que probablemente existan"
- NUNCA asumir versiones de APIs
- Si no podés verificar, DECILE AL USUARIO "no puedo verificar X, ¿confirmás?"

## Frase mágica antes de cada bloque de código
"He verificado que [librería/método] existe en la versión [X] revisando [fuente]."
```

#### 🧪 Skill 2: `tdd-strict`

```markdown
---
name: tdd-strict
description: Aplicar cuando el usuario pida implementar una feature nueva 
  con lógica de negocio. Fuerza ciclo Red-Green-Refactor.
---

# Test-Driven Development Estricto

## Cuándo usar
- Nueva función con lógica no-trivial
- Bug fix (test que reproduzca el bug primero)
- Refactor que cambie comportamiento

## Cómo proceder
1. Escribir test que FALLE (Red). Mostrá el output del fail.
2. Escribir el MÍNIMO código que haga pasar el test (Green).
3. Refactorizar SIN romper tests (Refactor).
4. Solo entonces, pasar a la siguiente tarea.

## Reglas inviolables
- NUNCA escribir implementación antes que el test
- NUNCA borrar tests para "que pase"
- NUNCA mockear lo que estás testeando
```

#### 📚 Skill 3: `lectura-codigo-existente`

```markdown
---
name: lectura-codigo-existente
description: Aplicar SIEMPRE como primer paso al entrar a un proyecto nuevo 
  o tocar un archivo desconocido. Evita romper convenciones.
---

# Lectura de Código Existente

## Cuándo usar
- Primera tarea en un proyecto
- Antes de modificar un archivo > 50 líneas
- Antes de agregar una dependencia

## Cómo proceder
1. `cat package.json` o equivalente → entender stack
2. `cat README.md` → entender propósito
3. `tree -L 2` o `ls -R` → entender estructura
4. Leer 2-3 archivos representativos COMPLETOS
5. Identificar:
   - Convenciones de nombres (camelCase, kebab-case)
   - Patrón de manejo de errores
   - Estilo de imports (barrel exports? path aliases?)
   - Framework de tests usado
6. Documentar mentalmente: "Este proyecto usa X, Y, Z. Convenciones: ..."

## Reglas inviolables
- NUNCA introducir un patrón nuevo si ya hay uno establecido
- NUNCA mezclar estilos en el mismo archivo
```

#### 🔍 Skill 4: `revision-cruzada`

```markdown
---
name: revision-cruzada
description: Aplicar al terminar de implementar una feature. Genera prompt 
  estructurado para que OTRO modelo revise el código.
---

# Revisión Cruzada Multi-Modelo

## Cuándo usar
- Al cerrar una tarea de /implement
- Antes de hacer commit

## Cómo proceder
1. Generá este bloque para que el usuario lo pase a otro modelo:

\`\`\`
Sos un revisor de código senior. Te paso el código que generó otro agente.
Tu trabajo NO es alabarlo. Tu trabajo es encontrar:
- Bugs sutiles
- Casos edge no manejados
- Violaciones de las convenciones del proyecto (ver AGENTS.md)
- Performance issues
- Vulnerabilidades de seguridad
- Tests faltantes

Spec original: [pegar spec.md]
Código generado: [pegar diff]
Convenciones: [pegar AGENTS.md]

Devuelve una lista numerada de problemas, ordenada por severidad.
Si no hay problemas, decilo explícitamente.
\`\`\`

2. Llevá ese prompt a OTRO modelo (si usaste Qwen, pasalo a DeepSeek; 
   o pegalo en Claude Free).
3. Aplicá las correcciones que sean válidas.

## Reglas inviolables
- NUNCA confiar en una sola opinión del modelo que escribió el código
```

#### 📋 Skill 5: `commit-conventional`

```markdown
---
name: commit-conventional
description: Aplicar al hacer git commit. Genera mensajes siguiendo 
  Conventional Commits.
---

# Conventional Commits

## Formato
\`\`\`
<tipo>(<scope>): <descripción corta en imperativo>

<cuerpo opcional explicando el qué y el por qué>

<footer opcional con BREAKING CHANGE o refs a issues>
\`\`\`

## Tipos válidos
- `feat`: nueva feature
- `fix`: bug fix
- `docs`: cambios en docs
- `style`: formato (no cambia lógica)
- `refactor`: cambio que no agrega feature ni fix
- `test`: agregar/modificar tests
- `chore`: tareas de mantenimiento
- `perf`: mejora de performance

## Reglas
- Imperativo: "agrega" no "agregado"
- Sin punto final
- Máximo 72 caracteres en línea 1
```

### 8.5 Cómo el modelo "descubre" las Skills

Al iniciar sesión, OpenCode lee los front-matter (solo `name` + `description`) de todos los `SKILL.md`. Cuando recibe un prompt, evalúa si alguna `description` matchea la tarea y, **solo si matchea, carga el contenido completo**. Esto ahorra tokens y mejora foco.

### 8.6 Skills extra recomendadas (para crear con el tiempo)

- `documentacion-jsdoc` — Estándar de docstrings
- `seguridad-owasp` — Checklist OWASP top 10
- `performance-react` — Checklist React anti-rerenders
- `migracion-segura-db` — Patrón de migraciones reversibles
- `debugging-sistematico` — Método científico para bugs
- `refactor-incremental` — Estrategia Mikado method

---

## 9. FASE 6 — Flujo de trabajo anti-alucinaciones

Este es **el flujo diario** que debes seguir religiosamente:

### 9.1 El Ciclo Maestro (Plan → Spec → Build → Verify)

```
┌──────────────────────────────────────────────────────────┐
│                                                            │
│   1. PLAN (Claude Free en navegador)                      │
│      └─► Convierte idea cruda en spec en lenguaje natural │
│                                                            │
│   2. SPEC (Spec-Kit en OpenCode)                          │
│      ├─► /specify → spec.md                                │
│      ├─► /plan    → plan.md                                │
│      └─► /tasks   → tasks.md                               │
│                                                            │
│   3. BUILD (OpenCode + modelo free + Engram + Skills)     │
│      └─► /implement → ejecuta tarea por tarea              │
│                                                            │
│   4. VERIFY (otro modelo + skill revision-cruzada)        │
│      └─► Pasar diff a Claude Free o DeepSeek               │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

### 9.2 Tres reglas de oro

**Regla #1 — Un commit, una tarea atómica**
Si la tarea genera más de ~150 líneas o toca >3 archivos, está mal descompuesta. Volvé a `/tasks` y partila.

**Regla #2 — Cada paso debe ser verificable**
Después de cada cambio, debe haber un comando que devuelva ✅ o ❌:
- `npm test`
- `npm run build`
- `npm run lint`
- `npm run typecheck`

**Regla #3 — La duda se resuelve antes de codear**
Si el modelo escribe "asumo que..." → STOP. Volvé a Claude Free y pedile que aclare en el spec.

### 9.3 `AGENTS.md` — El archivo que TODO proyecto debe tener

Creá `AGENTS.md` en la raíz del proyecto. OpenCode lo lee automáticamente como contexto inicial:

```markdown
# Instrucciones para agentes IA

## Sobre este proyecto
[1-2 líneas explicando qué es]

## Stack obligatorio
- Lenguaje: TypeScript 5.x estricto (sin `any`)
- Runtime: Node.js 20 LTS
- Testing: Vitest
- Linter: Biome
- Package manager: pnpm

## Convenciones inviolables
- Nombres de archivos: kebab-case
- Componentes React: PascalCase
- Hooks: useNombre, en archivo `use-nombre.ts`
- Imports: orden → externos, internos, tipos, relativos
- Sin default exports excepto en páginas Next

## Anti-patrones prohibidos
- ❌ Usar `any`
- ❌ Usar `// @ts-ignore`
- ❌ Mutar arrays/objetos (usar spread)
- ❌ console.log en código de producción

## Comandos del proyecto
- Tests: `pnpm test`
- Build: `pnpm build`
- Dev: `pnpm dev`
- Type check: `pnpm typecheck`

## Antes de cada commit
1. `pnpm typecheck` debe pasar
2. `pnpm test` debe pasar
3. `pnpm lint` debe pasar
```

---

## 10. FASE 7 — Plantillas de prompts maestros

Estas plantillas las usas en **Claude Free** (web) para generar specs que después llevás a `/specify`.

### 10.1 Plantilla: Idea cruda → Spec estructurado

```
Sos un Product Manager senior + Tech Lead. Te voy a dar una idea cruda 
y necesito que la conviertas en un spec listo para SDD.

Idea: [DESCRIBÍ TU IDEA EN 2-3 LÍNEAS]

Contexto del proyecto:
- Stack: [stack]
- Estado actual: [qué ya existe]
- Restricciones: [tiempo, perf, etc]

Generá un documento con esta estructura EXACTA:

# Feature: [nombre]

## Problema que resuelve
[1 párrafo]

## Usuarios afectados
[Quiénes y cómo]

## Requisitos funcionales (RF)
RF-01: [verificable]
RF-02: [verificable]
...

## Requisitos no funcionales (RNF)
RNF-01: [performance, security, etc]
...

## Casos de uso principales
CU-01: [escenario completo con pasos]
...

## Casos edge a contemplar
- [edge case 1]
- [edge case 2]

## Criterios de aceptación
- [ ] [test verificable]
- [ ] [test verificable]

## Fuera de scope
[Qué NO se va a hacer]

## Preguntas abiertas
[Cosas que necesito que el usuario aclare ANTES de implementar]

NO inventes nada. Si falta info, ponela en "Preguntas abiertas".
```

### 10.2 Plantilla: Debug sistemático

```
Tengo este bug:

**Comportamiento esperado:** [qué debería pasar]
**Comportamiento real:** [qué pasa]
**Pasos para reproducir:**
1. ...
2. ...

**Stack trace / error:**
\`\`\`
[pegar]
\`\`\`

**Código relevante:**
\`\`\`
[pegar archivos involucrados]
\`\`\`

**Lo que ya probé:**
- [intento 1]
- [intento 2]

Aplicá el método científico:
1. Listame las 5 hipótesis más probables, ordenadas por probabilidad.
2. Para cada hipótesis, decime qué experimento la confirmaría/descartaría.
3. NO me des la solución todavía. Primero validemos hipótesis.
```

### 10.3 Plantilla: Refactor seguro

```
Necesito refactorizar este código:

\`\`\`
[código actual]
\`\`\`

**Objetivo del refactor:** [legibilidad / perf / testeable / etc]
**Restricciones:** El comportamiento externo NO debe cambiar.

Aplicá Mikado Method:
1. Identificá el objetivo final (refactor completo).
2. Listame los pre-requisitos en orden inverso (qué necesito hacer ANTES).
3. Generá el primer micro-cambio que sea seguro y testeable.
4. NO escribas el refactor completo. Solo el primer paso.

Adicional: generame los tests de caracterización que capturen el 
comportamiento actual ANTES de refactorizar.
```

---

## 11. FASE 8 — Routing inteligente de modelos por fase

No uses el mismo modelo para todo. Cada fase tiene un modelo óptimo gratis:

| Fase | Modelo recomendado (free) | Por qué |
|---|---|---|
| **Brainstorm / Spec** | Claude (navegador) | Mejor razonamiento natural |
| **Planificación técnica** | DeepSeek V3.2 free | Excelente razonamiento estructurado |
| **Implementación código** | Qwen3 Coder free | 1M context, optimizado para código |
| **Tareas agentic largas** | GLM 4.6 (Z.ai direct) | Diseñado para uso prolongado |
| **Revisión de código** | Otro distinto al implementador | Diversidad de criterios |
| **Refactor / docs** | Llama 3.3 70B free | Sólido y consistente |
| **Tareas rápidas / triviales** | GLM 4 Flash | Velocidad |

### 11.1 Cambio rápido de modelo en OpenCode

Dentro de la TUI: `Ctrl+M` → seleccionar.

### 11.2 Configurar perfiles por proyecto

En el `opencode.json` de cada proyecto podés sobrescribir el modelo default:

```json
{
  "model": "openrouter/deepseek/deepseek-chat-v3.2:free"
}
```

---

## 12. FASE 9 — Verificación, debug y mantenimiento

### 12.1 Healthcheck semanal

```powershell
# Crear script de healthcheck
@'
Write-Host "=== AI Stack Healthcheck ===" -ForegroundColor Cyan
Write-Host ""

# Versiones
Write-Host "OpenCode:" -NoNewline; opencode --version
Write-Host "Engram:" -NoNewline; engram --version
Write-Host "Specify:" -NoNewline; specify --version
Write-Host "Gentle AI (gga):" -NoNewline; gga --version

# API keys configuradas
Write-Host ""
Write-Host "API Keys:" -ForegroundColor Yellow
if ($env:OPENROUTER_API_KEY) { Write-Host "  ✅ OPENROUTER_API_KEY" } else { Write-Host "  ❌ OPENROUTER_API_KEY" }
if ($env:ZAI_API_KEY) { Write-Host "  ✅ ZAI_API_KEY" } else { Write-Host "  ❌ ZAI_API_KEY" }

# Engram data
Write-Host ""
Write-Host "Engram memory entries:" -NoNewline
(engram list | Measure-Object -Line).Lines

# Skills count
Write-Host "Skills globales:" -NoNewline
(Get-ChildItem "$HOME\.config\opencode\skills" -Directory).Count
'@ | Out-File "$HOME\ai-workspace\healthcheck.ps1"

# Ejecutar
.\$HOME\ai-workspace\healthcheck.ps1
```

### 12.2 Backups críticos

```powershell
# Script de backup semanal
$backupDir = "$HOME\ai-workspace\backups\$(Get-Date -Format yyyy-MM-dd)"
New-Item -ItemType Directory -Path $backupDir -Force

# Backup memoria Engram
engram export | Out-File "$backupDir\engram.json"

# Backup configs
Copy-Item "$HOME\.config\opencode\opencode.json" "$backupDir\"
Copy-Item "$HOME\.config\opencode\skills" "$backupDir\skills" -Recurse

# Backup skills de proyectos
Get-ChildItem "$HOME\ai-workspace\projects" -Directory | ForEach-Object {
    $proj = $_.Name
    if (Test-Path "$($_.FullName)\.opencode\skills") {
        Copy-Item "$($_.FullName)\.opencode\skills" "$backupDir\projects-$proj-skills" -Recurse
    }
}

Write-Host "✅ Backup en $backupDir"
```

### 12.3 Métricas para medir mejora

Llevá un archivo `metrics.md` por proyecto donde anotes:

```markdown
# Métricas IA

## Semana 1 (baseline sin stack)
- Bugs introducidos por feature: 4-5
- Tiempo por feature pequeña: 2h
- Veces que tuve que rehacer: 60%

## Semana 4 (con stack completo)
- Bugs introducidos: 0-1
- Tiempo por feature: 45min
- Veces que tuve que rehacer: 10%
```

---

## 13. Cheatsheet diario

```
╔══════════════════════════════════════════════════════════╗
║              FLUJO DIARIO — IMPRIMIBLE                    ║
╠══════════════════════════════════════════════════════════╣
║                                                            ║
║  🌅 MAÑANA                                                ║
║  1. cd $HOME\ai-workspace\projects\mi-proyecto            ║
║  2. opencode                                              ║
║  3. /mcp (verificar engram conectado)                     ║
║                                                            ║
║  🎯 ANTES DE CODEAR                                        ║
║  4. Abrir Claude Free en navegador                        ║
║  5. Usar Plantilla 10.1 → pegarle la idea                 ║
║  6. Copiar spec generado                                  ║
║                                                            ║
║  ⚙️  IMPLEMENTAR                                          ║
║  7. En OpenCode: /specify [pegar spec]                    ║
║  8. /plan                                                 ║
║  9. /tasks                                                ║
║  10. /implement                                           ║
║                                                            ║
║  ✅ VERIFICAR                                             ║
║  11. npm test && npm run typecheck && npm run lint        ║
║  12. Aplicar skill `revision-cruzada`                     ║
║  13. Pegar resultado en otro modelo                       ║
║  14. Aplicar correcciones                                 ║
║                                                            ║
║  📦 CIERRE                                                ║
║  15. git add . && git commit (skill commit-conventional)  ║
║  16. "Engram, recuerda: [lección aprendida hoy]"          ║
║                                                            ║
╚══════════════════════════════════════════════════════════╝
```

### Shortcuts esenciales en OpenCode

| Atajo | Función |
|---|---|
| `Ctrl+M` | Cambiar modelo |
| `Ctrl+L` | Limpiar contexto |
| `Ctrl+R` | Repetir último prompt |
| `/help` | Ver todos los comandos |
| `/mcp` | Estado de MCP servers |
| `/agents` | Listar sub-agentes |
| `/skills` | Listar skills cargadas |
| `Esc` | Cancelar acción del agente |

---

## 14. Recursos y referencias

### Repositorios oficiales
- **Gentle AI Stack:** https://github.com/Gentleman-Programming/gentle-ai
- **Engram:** https://github.com/Gentleman-Programming/engram
- **Spec-Kit:** https://github.com/github/spec-kit
- **OpenCode:** https://opencode.ai
- **Anthropic Skills (públicas):** https://github.com/anthropics/skills

### Docs imprescindibles
- Anthropic — Complete Guide to Building Skills: https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf
- Anthropic — Equipping Agents with Skills: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- OpenRouter — Modelos free: https://openrouter.ai/collections/free-models
- Z.ai — Setup OpenCode con GLM: https://docs.z.ai/scenario-example/develop-tools/opencode
- GitHub Spec-Kit docs: https://github.github.com/spec-kit/

### Videos recomendados
- "El ecosistema IA que tu agente está perdiendo" (Gentleman Programming): https://www.youtube.com/watch?v=UoS_LP-PCG8
- "GLM 4.6: Free Setup & Test": https://www.youtube.com/watch?v=P6QIHoF06L8

### Comunidades
- Reddit r/opencode — Workflows reales
- Reddit r/LocalLLaMA — Modelos locales
- Discord de Gentleman Programming
- Discord de OpenCode

---

## 🎯 Resumen final: Tu pirámide de confiabilidad

```
                        ┌──────────────┐
                        │  REVISIÓN    │   ← Segundo modelo verifica
                        │   CRUZADA    │
                        └──────┬───────┘
                               │
                  ┌────────────┴────────────┐
                  │     SDD (Spec-Kit)       │   ← Especificar antes
                  │  /specify /plan /tasks   │      de implementar
                  └────────────┬─────────────┘
                               │
              ┌────────────────┴────────────────┐
              │     SKILLS PERSONALIZADAS        │   ← Conocimiento
              │   (verificación, TDD, etc)       │      reutilizable
              └─────────────────┬────────────────┘
                                │
        ┌───────────────────────┴───────────────────────┐
        │              ENGRAM (memoria)                  │   ← Contexto
        │   Lecciones, decisiones, patrones del proyecto │      persistente
        └───────────────────────┬────────────────────────┘
                                │
   ┌────────────────────────────┴────────────────────────────┐
   │                  AGENTS.md + opencode.json                │   ← Base
   │           Convenciones + configuración del agente          │
   └───────────────────────────────────────────────────────────┘
```

**Cada capa elimina un tipo de error.** Cuanto más subas la pirámide, más cerca estarás de la calidad de Anthropic — con modelos gratuitos.

---

## 📝 Notas finales

- Esta guía es **viva**: agregá Skills nuevas cada vez que detectes un patrón repetitivo de error.
- Engram aprende contigo: alimentalo con cada lección.
- Los modelos free mejoran cada mes. Revisá OpenRouter mensualmente.
- Si en algún punto el modelo gratuito te falla recurrentemente, considerá el plan de Z.ai GLM (~$3-$18/mes) como upgrade asequible.

**Última actualización:** 2026-06  
**Versión:** 1.0  
**Autor del flujo base:** Gentleman Programming (Alan Buscaglia) + adaptación personal

> 💪 *"La diferencia entre un junior con IA y un senior con IA no es el modelo. Es la disciplina del flujo."*
