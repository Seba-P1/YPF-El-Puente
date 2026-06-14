---
name: clone-master-api-shadow
description: Si la web objetivo expone una API pública (REST/GraphQL), generá un "shadow client" tipado en TS y mockea para clonar funcionalidad.
---

# Pasos
1. Detectar API: DevTools → Network → filtrar XHR/fetch.
2. Si es REST: usar `openapi-typescript` o `orval` para tipos.
3. Si es GraphQL: `graphql-codegen`.
4. Reemplazar dominio por tu backend stub (Next API routes / Hono).
5. Implementar tus endpoints uno a uno.