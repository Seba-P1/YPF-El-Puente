---
name: mythos-sec-llm-hardening
description: Endurece apps que usan LLMs internamente o exponen agentes.
---

# Checks obligatorios
- [ ] LLM01 Prompt Injection: input sanitizer + system prompt sealed (no user-injected).
- [ ] LLM02 Insecure Output: parsear JSON con Zod, nunca `eval` ni innerHTML.
- [ ] LLM03 Training Data Poisoning: pin modelos por hash/version.
- [ ] LLM04 Model DoS: rate limit por user + token budget per request.
- [ ] LLM05 Supply Chain: pin versions de modelos (OpenRouter exact tag).
- [ ] LLM06 Sensitive Info Disclosure: redact PII antes de mandar al LLM (usar Microsoft Presidio).
- [ ] LLM07 Insecure Plugin/Tool: whitelist de tools por agente.
- [ ] LLM08 Excessive Agency: human-in-the-loop para acciones destructivas.
- [ ] LLM09 Overreliance: marca outputs como "AI-generated, verify".
- [ ] LLM10 Model Theft: rate limit + watermark de outputs.
- [ ] ASI03 Over-privileged skills: manifest de permisos mínimos.
- [ ] ASI06 Weak Isolation: subagentes en sandbox / containers.