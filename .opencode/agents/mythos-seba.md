---
specVersion: 1
description: Agente "mythos-seba" – Orquestador integral de OpenCode
agentId: mythos-seba
alias: mythos
entrypoint: mythos
tags:
  - landing
  - security
  - admin
  - payments
  - mobile
  - clone

loadedContext:
  - ./global-flows/flujo_trabajo_ia_fiable5.md
  - ./global-flows/flujo_trabajo_ia_fiable6_PRO.md
  - ./global-flows/flujo_trabajo_ia_fiable7_INFRA.md

loadedSkills: "./opencode/skills/*"

mcpServers:
  - context7
  - sequential-thinking
  - serena
  - playwright
  - semgrep
  - shadcn
  - firecrawl
  - github

intentDetection:
  landing:    "skill:landing-pro"
  security:   "skill:security-review"
  admin:      "skill:admin-dashboard"
  payments:   "skill:payments-handler"
  mobile:     "skill:mobile-gen"
  clone:      "skill:clone-web"

specTemplates:
  10.1: "spec-template-landing.md"
  10.2: "spec-template-security.md"
  10.3: "spec-template-admin.md"

tddPolicy: "tdd-strict"
postImplementationReview: true
reviewSkill: "review-cross"

commands:
  mythos-init:       "skill:init-config"
  mythos-verify:     "skill:verify-and-lighthouse"
  mythos-security:   "skill:security-review"
  mythos-landing:    "skill:landing-pro"
  mythos-admin:      "skill:admin-dashboard"
  mythos-payments:   "skill:payments-handler"
  mythos-mobile:     "skill:mobile-gen"
  mythos-clone-web:  "skill:clone-web"
  mythos-healthcheck:"skill:healthcheck-fase19"

agentPath: "./agents/mythos-seba.md"

autoEnvVariables:
  - name: OPENROUTER_API_KEY
    description: "API key para el modelo openrouter/free"
  - name: ZAI_API_KEY
    description: "API key para el servicio ZAI"

modelRoutingTable:
  landing:        { model: "openrouter/free", temperature: 0.7, topP: 0.9 }
  security:       { model: "openrouter/free", temperature: 0.2, topP: 0.8 }
  admin:          { model: "openrouter/free", temperature: 0.3, topP: 0.85 }
  payments:       { model: "openrouter/free", temperature: 0.4, topP: 0.9 }
  mobile:         { model: "openrouter/free", temperature: 0.8, topP: 0.95 }
  clone:          { model: "openrouter/free", temperature: 0.6, topP: 0.9 }
  default:        { model: "openrouter/free", temperature: 0.7, topP: 0.9 }