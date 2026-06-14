# 🏛️ Guía Maestra INFRA: Bases de Datos, Hosting, Dominios, Hermes Agent y Bots Profesionales para Clínicas + PyMEs

> **Documento complementario a `flujo_trabajo_ia_fiable5.md` y `flujo_trabajo_ia_fiable6_PRO.md`.**
>
> **Objetivo:** Convertir el workflow "Mythos" en un **producto comercializable de nivel empresarial**: agentes IA conectados a **Supabase** (BD, Auth, Storage, Realtime, Edge Functions), corriendo en **infraestructura propia** (Hetzner/Coolify), con **Hermes Agent** como cerebro auto-mejorable y bots especializados para **turnos de clínicas** y **sistemas administrativos de PyMEs**.
>
> **Filosofía añadida:** _"El código no es el producto. El producto es el **sistema** — datos + flujos + agentes + UX — que sobrevive a fallos, escala con clientes y cumple con regulaciones (HIPAA, GDPR, LOPDGDD)."_

---

## 📑 Tabla de Contenidos

1. [Mapa Mental del Stack "INFRA"](#1-mapa-mental-del-stack-infra)
2. [FASE 12 — Decisión de Infraestructura: BD, Hosting, Dominio](#2-fase-12--decisión-de-infraestructura-bd-hosting-dominio)
3. [FASE 13 — Supabase Master Class: BD, Auth, RLS, Edge, Realtime, Storage](#3-fase-13--supabase-master-class)
4. [FASE 14 — Supabase + IA: pgvector, RAG, Memoria de Agentes](#4-fase-14--supabase--ia-pgvector-rag-memoria-de-agentes)
5. [FASE 15 — HIPAA / GDPR / LOPDGDD para Clínicas](#5-fase-15--hipaa--gdpr--lopdgdd-para-clínicas)
6. [FASE 16 — Hermes Agent: Instalación, Skills, MCP, Despliegue](#6-fase-16--hermes-agent-completo)
7. [FASE 17 — Arquitectura de Bots para Turnos de Clínica](#7-fase-17--arquitectura-de-bots-para-turnos-de-clínica)
8. [FASE 18 — Sistemas Administrativos para PyMEs](#8-fase-18--sistemas-administrativos-para-pymes)
9. [FASE 19 — Canales: WhatsApp, Voz, Email, SMS](#9-fase-19--canales-whatsapp-voz-email-sms)
10. [FASE 20 — Observabilidad, Pagos, Compliance](#10-fase-20--observabilidad-pagos-compliance)
11. [FASE 21 — Tecnologías 2026 que DEBES Conocer](#11-fase-21--tecnologías-2026-que-debes-conocer)
12. [FASE 22 — Blueprint: Clínica SaaS Multi-Tenant Completo](#12-fase-22--blueprint-clínica-saas-multi-tenant-completo)
13. [FASE 23 — Comandos, Snippets y Plantillas Listas](#13-fase-23--comandos-snippets-y-plantillas-listas)
14. [FASE 24 — Roadmap de Implantación 90 Días](#14-fase-24--roadmap-de-implantación-90-días)
15. [Anexos: Checklists, Recursos, Bibliografía](#15-anexos)

---

## 1. Mapa Mental del Stack "INFRA"

```
                         ┌─────────────────────────────────────────┐
                         │       USUARIO FINAL (Paciente / PyME)   │
                         │   WhatsApp · Voz · Web · Email · SMS    │
                         └────────────────┬────────────────────────┘
                                          │
                ┌─────────────────────────┼─────────────────────────┐
                │                         │                         │
        ┌───────▼────────┐        ┌───────▼────────┐        ┌───────▼────────┐
        │  Evolution API │        │  Vapi / Retell │        │  Resend / SES  │
        │   (WhatsApp)   │        │     (Voz)      │        │    (Email)     │
        └───────┬────────┘        └───────┬────────┘        └───────┬────────┘
                │                         │                         │
                └─────────────────────────┼─────────────────────────┘
                                          │
                              ┌───────────▼────────────┐
                              │   ORQUESTADOR AGÉNTICO │
                              │   Hermes Agent / n8n   │
                              │   (Skills + MCP)       │
                              └───────────┬────────────┘
                                          │
        ┌─────────────────┬──────────────┼──────────────┬─────────────────┐
        │                 │              │              │                 │
   ┌────▼─────┐    ┌──────▼─────┐  ┌─────▼─────┐ ┌─────▼─────┐    ┌──────▼──────┐
   │ Supabase │    │  Cal.com   │  │  Stripe / │ │ Inngest / │    │   PostHog   │
   │  (BD,    │    │ (Bookings) │  │   Polar   │ │ Trigger   │    │  + Sentry   │
   │  Auth,   │    └────────────┘  │ (Billing) │ │   (Jobs)  │    │ (Observab.) │
   │  Edge,   │                    └───────────┘ └───────────┘    └─────────────┘
   │  RLS,    │
   │ pgvector)│
   └────┬─────┘
        │
   ┌────▼─────────────────────────────────────────────────┐
   │ INFRA: Hetzner CX22 + Coolify + Caddy + Cloudflare    │
   │  (€4/mes VPS · TLS automático · DNS · CDN · DDoS)     │
   └───────────────────────────────────────────────────────┘
```

**Las 4 capas clave:**

| Capa | Componente | Coste |
|------|-----------|-------|
| **L1 — Datos** | Supabase (Free → Pro $25/mes con HIPAA add-on) | $0 → $625 (HIPAA) |
| **L2 — Cómputo** | Hetzner CX22 + Coolify (self-hosted) | €4/mes (~$5) |
| **L3 — Agentes** | Hermes Agent + OpenRouter Free | $0 |
| **L4 — Canales** | Evolution API (WhatsApp self-host), Cal.com self-host | $0 |

> **Total de arranque para una clínica:** ~€5–10 / mes. **Para SaaS multi-tenant comercial:** ~€50–100/mes a 50 clientes.

---

## 2. FASE 12 — Decisión de Infraestructura: BD, Hosting, Dominio

### 2.1. Base de Datos: ¿Por qué Supabase gana en 2026?

**Comparativa rápida (resultado de benchmarks 2026):**

| Plataforma | Tipo | Free Tier | Pricing | Mejor Para |
|------------|------|-----------|---------|-----------|
| **Supabase** | Postgres + BaaS | 500MB DB, 1GB Storage | $25/mes Pro | **Stack completo: BD+Auth+Storage+Realtime+Edge+pgvector** |
| **Neon** | Postgres serverless | 0.5GB, 190h compute | $19/mes | DB-only, scale-to-zero, branching instantáneo |
| **PlanetScale** | MySQL/Postgres Vitess | Sin free tier permanente | $39/mes | Apps muy grandes (escalado horizontal MySQL) |
| **Turso** | SQLite distribuido | 9GB total | $29/mes | Edge-first, lectura ultra-rápida global |
| **Convex** | DB reactiva + funciones | 1GB, 1M calls | $25/mes | Apps reactivas tipo Firebase moderno |

**Decisión recomendada:** **Supabase Pro** para 95% de los casos (clínicas, PyMEs, agentes IA). Razones:

1. **Postgres real** (no un fork). Migras a cualquier Postgres si te quieres ir.
2. **BaaS completo:** Auth + Storage + Realtime + Edge Functions + Vector + Cron en un solo dashboard.
3. **HIPAA + SOC2 Type 2** desde 2024 (add-on $599/mes para clínicas USA).
4. **pgvector** nativo → memoria de agentes + RAG en la misma BD.
5. **RLS (Row-Level Security)** = multi-tenant seguro sin un microservicio extra.
6. **CLI + Branching:** `supabase db diff`, `supabase branches create` → entornos preview por PR.

[Más detalles oficiales sobre HIPAA en Supabase](https://supabase.com/docs/guides/security/hipaa-compliance).

### 2.2. Hosting: ¿Vercel, Hetzner, Cloudflare o Railway?

**Comparativa de hosting 2026:**

| Plataforma | Modelo | Cuándo usarla |
|------------|--------|---------------|
| **Vercel** | Serverless Next.js | MVP rápido + landing pages. ⚠️ Subió precios 4 veces desde 2024. |
| **Cloudflare Workers** | Edge serverless | APIs ultra-rápidas globales, sin estado |
| **Fly.io** | Contenedores globales | Apps con sockets, voz, real-time. ⚠️ Eliminó free tier en 2024. |
| **Railway** | PaaS contenedores | Backends con BD propia, simpler que K8s |
| **Hetzner + Coolify** | VPS + self-host PaaS | **Mejor relación €/rendimiento. Recomendado para producción.** |

**Recomendación 2026 definitiva:**

- **Frontend (Next.js/SvelteKit):** Vercel Free o Cloudflare Pages
- **Backend + Agentes + WhatsApp + n8n:** **Hetzner CX22 (€4/mes, 2 vCPU, 4GB RAM) + Coolify**
- **Funciones serverless:** Supabase Edge Functions (Deno, global, gratis hasta 500K ejec/mes)
- **CDN + DNS + WAF + DDoS:** **Cloudflare** (gratis)

**Por qué Hetzner > DigitalOcean en 2026:**

| | Hetzner CX22 | DigitalOcean Basic |
|---|---|---|
| Precio | €4.51/mes | $6/mes |
| RAM/vCPU | 4GB / 2 vCPU | 1GB / 1 vCPU |
| Tráfico | 20TB | 1TB |
| Performance | ~2x mejor | Base |

Hetzner gana en **3.6× mejor precio/rendimiento**. La única razón para DO es si necesitas data-centers en US-East específicamente.

### 2.3. Self-Hosted PaaS: Coolify vs Dokploy vs CapRover

**Si te gusta el modelo "Vercel pero en tu VPS", instala uno de estos sobre Hetzner:**

| Plataforma | Stars GH | Pros | Contras |
|------------|----------|------|---------|
| **Coolify** | 30k+ | Más maduro, multi-server, soporta Docker Compose, fácil DB y Redis | Algo más pesado |
| **Dokploy** | 15k+ | Construido sobre Docker Swarm, UI moderna, simple | Más joven |
| **CapRover** | 14k+ | Estable, antiguo, una sola app por servicio | UI desactualizada |
| **Easypanel** | 8k+ | UI bonita, plantillas (n8n, Evolution API, etc.) | Modelo más cerrado |

**Decisión:** **Coolify** para producción seria (multi-server, alta disponibilidad). **Easypanel** si quieres "plug & play" con plantillas listas (n8n, Evolution API, Supabase self-host).

### 2.4. Dominios: ¿Dónde comprar en 2026?

**Ranking definitivo (mejor → peor para nuestro stack):**

| Registrar | Precio .com | Pros | Contras |
|-----------|-------------|------|---------|
| **Cloudflare Registrar** | $9.15/año | **Precio de coste real, WHOIS privado gratis, sin upsells** | Solo si usas Cloudflare DNS |
| **Porkbun** | $9.73/año | Privacidad gratis, soporte excelente, mejor UI | TLDs exóticos algo caros |
| **Namecheap** | $10.98/año | Variedad enorme de TLDs, soporte 24/7 | UI con upsells |
| **GoDaddy** | $19.99/año | Mainstream | **EVITAR**: upsells agresivos, precios caros en renovación |

**Setup recomendado:**
1. Compra el dominio en **Cloudflare** (o Porkbun si Cloudflare no soporta el TLD)
2. Activa **Cloudflare Proxy** (naranja) → DDoS + CDN + WAF gratis
3. DNS: A record → IP de Hetzner; o CNAME → Vercel/Pages
4. Configura DMARC/SPF/DKIM si vas a enviar emails (clave para no caer en spam)

---

## 3. FASE 13 — Supabase Master Class

> "El 95% de los problemas en Supabase vienen de no entender RLS, no de Supabase." — Maestría obligatoria.

### 3.1. Estructura del Proyecto

```
supabase/
├── config.toml              # Configuración local
├── migrations/              # Migraciones SQL (¡versionadas en Git!)
│   ├── 20260101000000_init.sql
│   ├── 20260102000000_rls_policies.sql
│   └── 20260103000000_pgvector.sql
├── functions/               # Edge Functions (Deno + TS)
│   ├── _shared/cors.ts
│   ├── booking-create/index.ts
│   └── ai-agent-router/index.ts
├── seed.sql                 # Datos iniciales para dev
└── tests/                   # Tests pgTAP (SQL nativo)
```

### 3.2. RLS (Row-Level Security) — La Base del Multi-Tenancy

**Regla de oro 2026:** *Si no puedes explicar tus políticas RLS sin abrir el dashboard, no están listas para producción.*

#### Patrón 1: Multi-tenant por `organization_id`

```sql
-- Tabla con tenancy
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  patient_id uuid not null,
  scheduled_at timestamptz not null,
  created_at timestamptz default now()
);

-- Índice CRÍTICO para performance RLS
create index appointments_org_idx on public.appointments(organization_id);

-- Activa RLS
alter table public.appointments enable row level security;

-- Política: el usuario solo ve citas de su organización
create policy "tenant_isolation_select"
  on public.appointments for select
  using (organization_id = (auth.jwt() ->> 'organization_id')::uuid);

create policy "tenant_isolation_insert"
  on public.appointments for insert
  with check (organization_id = (auth.jwt() ->> 'organization_id')::uuid);
```

#### Patrón 2: Roles (admin/médico/recepcionista)

```sql
-- En el JWT custom claim guardas role
create policy "doctors_see_own_patients"
  on public.appointments for select
  using (
    (auth.jwt() ->> 'role') = 'admin'
    OR (
      (auth.jwt() ->> 'role') = 'doctor'
      AND doctor_id = auth.uid()
    )
  );
```

#### 🚀 Optimización RLS (cuello de botella #1 en producción)

Según [Supabase Performance Guide](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv):

1. **Indexa SIEMPRE las columnas usadas en políticas RLS**
   ```sql
   create index on appointments(organization_id);
   create index on appointments(doctor_id);
   ```

2. **Usa `(select auth.uid())` en lugar de `auth.uid()`** (10-100× más rápido en queries grandes):
   ```sql
   -- ❌ Lento: ejecuta auth.uid() por cada row
   using (user_id = auth.uid())

   -- ✅ Rápido: el planner cachea el valor
   using (user_id = (select auth.uid()))
   ```

3. **Especifica el rol (`to authenticated`)** para evitar ejecutar la política en anon:
   ```sql
   create policy "..."
     on appointments for select
     to authenticated  -- ← clave
     using (...);
   ```

4. **Usa `security definer functions`** para lógica compleja:
   ```sql
   create function private.is_member_of(org uuid)
   returns boolean
   language sql security definer set search_path = ''
   as $$
     select exists(
       select 1 from public.memberships
       where user_id = auth.uid() and organization_id = org
     );
   $$;

   create policy "members_only"
     on appointments for select
     using (private.is_member_of(organization_id));
   ```

### 3.3. Edge Functions: cuándo SÍ y cuándo NO

**Las Edge Functions son útiles para:**

✅ Webhooks (Stripe, Twilio, WhatsApp)
✅ Llamadas a APIs externas con secretos (OpenAI, Anthropic) sin exponer keys
✅ Operaciones cross-row complejas (importar CSV, batch jobs ligeros)
✅ Auth flows custom (login pasivo, magic links custom)
✅ Procesar imágenes/PDFs antes de guardar en Storage

**NO uses Edge Functions para:**

❌ Reemplazar RLS (RLS es 100× más rápido que cualquier capa de aplicación)
❌ Long-running jobs (>150s) → usa Inngest/Trigger.dev
❌ Lógica que ya puede vivir en una `database function` (más rápida)

**Plantilla profesional de Edge Function (con manejo de errores, tipos, CORS):**

```typescript
// supabase/functions/booking-create/index.ts
import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface BookingRequest {
  patient_phone: string
  doctor_id: string
  scheduled_at: string  // ISO 8601
}

serve(async (req) => {
  // 1. CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Cliente con auth del usuario (respeta RLS)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // 3. Validación de input
    const body: BookingRequest = await req.json()
    if (!body.patient_phone || !body.doctor_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 4. Lógica de negocio: verificar disponibilidad
    const { data: conflict } = await supabase
      .from('appointments')
      .select('id')
      .eq('doctor_id', body.doctor_id)
      .eq('scheduled_at', body.scheduled_at)
      .maybeSingle()

    if (conflict) {
      return new Response(
        JSON.stringify({ error: 'Slot already taken' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 5. Insertar (RLS valida tenant)
    const { data, error } = await supabase
      .from('appointments')
      .insert(body)
      .select()
      .single()

    if (error) throw error

    // 6. Side effect: enviar notificación WhatsApp (no bloqueante)
    fetch(Deno.env.get('EVOLUTION_API_URL')!, {
      method: 'POST',
      body: JSON.stringify({
        phone: body.patient_phone,
        message: `Tu cita está confirmada para ${body.scheduled_at}`
      })
    }).catch(console.error)

    return new Response(
      JSON.stringify({ booking: data }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('booking-create error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal error' }),
      { status: 500, headers: corsHeaders }
    )
  }
})
```

### 3.4. Realtime: para qué SÍ usar y para qué NO

**Casos perfectos:**
- Dashboard que muestra citas entrando en vivo (recepción)
- Chat médico-paciente
- Estados de tickets (en cola, en proceso, completado)
- Presencia de usuarios online

**Evita:**
- Como "queue" de jobs → usa Inngest
- Para más de 200 mensajes/seg por canal → escala horizontalmente con múltiples canales

```typescript
// Suscripción reactiva a nuevas citas (frontend)
const channel = supabase
  .channel(`org:${orgId}:appointments`)
  .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'appointments',
        filter: `organization_id=eq.${orgId}` },
      (payload) => {
        toast.success(`Nueva cita: ${payload.new.patient_name}`)
      }
  )
  .subscribe()
```

### 3.5. Storage: archivos, imágenes, documentos médicos

```sql
-- Bucket para documentos médicos (privado, con RLS)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'medical-records',
  'medical-records',
  false,
  52428800,  -- 50MB
  array['application/pdf','image/jpeg','image/png','application/dicom']
);

-- Política: los pacientes solo ven sus propios archivos
create policy "patients_own_files"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'medical-records'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
```

**CDN automático:** todos los archivos públicos se sirven desde la CDN de Supabase (CloudFront por debajo). Para gran escala, usa `image_transform` para resize automático:

```typescript
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('user.jpg', {
    transform: { width: 200, height: 200, resize: 'cover', quality: 80 }
  })
```

### 3.6. Branching + CLI: el workflow Git-style

```bash
# Local dev (Docker)
supabase init
supabase start                          # Levanta Postgres + Studio + Auth + Realtime locales
supabase db diff -f new_feature         # Genera migración desde cambios
supabase db push                        # Aplica migraciones a producción
supabase functions deploy booking-create

# Branches (Pro plan)
supabase branches create feature/booking-v2
# Cada PR de GitHub crea automáticamente una branch con datos clonados
```

> **Pattern Mythos:** Cada PR de GitHub → Supabase Branch → Vercel Preview → tests de Playwright contra esa branch → merge a main = deploy a prod. Cero downtime.

---

## 4. FASE 14 — Supabase + IA: pgvector, RAG, Memoria de Agentes

### 4.1. Activar pgvector

```sql
-- Una sola línea en migración inicial
create extension if not exists vector with schema extensions;

-- Tabla de embeddings para RAG
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  content text not null,
  metadata jsonb default '{}',
  embedding vector(1536),  -- OpenAI text-embedding-3-small
  created_at timestamptz default now()
);

-- Índice HNSW (más rápido para producción que IVFFlat)
create index on documents using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);
```

### 4.2. Función de búsqueda semántica con RLS

```sql
create or replace function match_documents(
  query_embedding vector(1536),
  match_threshold float default 0.7,
  match_count int default 10,
  filter_org uuid default null
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    d.id, d.content, d.metadata,
    1 - (d.embedding <=> query_embedding) as similarity
  from documents d
  where
    d.organization_id = coalesce(filter_org, (auth.jwt() ->> 'organization_id')::uuid)
    and 1 - (d.embedding <=> query_embedding) > match_threshold
  order by d.embedding <=> query_embedding
  limit match_count;
$$;
```

### 4.3. Memoria de Agentes — Patrón Dual-Layer

Patrón validado por la comunidad para **memoria persistente de agentes** (chats que recuerdan al usuario para siempre):

**Capa 1 — Mensajes recientes (Redis/Upstash):** últimos 20 turnos, latencia <10ms
**Capa 2 — Memoria semántica (pgvector):** resúmenes embedebidos, búsqueda por similitud
**Capa 3 — Hechos estructurados (JSONB):** preferencias, alergias, datos clínicos (esquema)
**Capa 4 — Honcho (opcional):** modelado dialéctico del usuario (qué sabe, qué cree)

```sql
create table public.agent_memory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  memory_type text check (memory_type in ('fact','preference','event','summary')),
  content text not null,
  embedding vector(1536),
  importance int check (importance between 1 and 10),
  last_accessed_at timestamptz default now(),
  created_at timestamptz default now()
);
```

**Política de "olvido inteligente":** un `pg_cron` job que elimina memorias con `importance < 3` y `last_accessed_at < now() - interval '90 days'`.

### 4.4. Extensiones Postgres que necesitas SÍ o SÍ

```sql
-- Crons dentro de Postgres
create extension if not exists pg_cron;

-- HTTP requests desde Postgres (webhooks, llamadas a OpenAI desde triggers)
create extension if not exists pg_net;

-- Búsqueda full-text avanzada
create extension if not exists pg_trgm;

-- Auditoría automática
create extension if not exists pgaudit;

-- Ejemplo: cada noche a las 3AM, generar embeddings de mensajes nuevos
select cron.schedule(
  'embed-new-messages',
  '0 3 * * *',
  $$
    select net.http_post(
      url := 'https://proyecto.supabase.co/functions/v1/embed-batch',
      headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.service_role_key'))
    );
  $$
);
```

---

## 5. FASE 15 — HIPAA / GDPR / LOPDGDD para Clínicas

### 5.1. Marco Regulatorio según geografía

| Región | Regulación | Aplica a |
|--------|-----------|----------|
| 🇺🇸 USA | HIPAA + HITECH | Clínicas, hospitales, BAA obligatorio |
| 🇪🇺 EU + España | GDPR + LOPDGDD (Ley Orgánica 3/2018) | Cualquier dato de UE, DPO obligatorio en clínicas |
| 🇦🇷 Argentina | Ley 25.326 + Resol. AAIP 2/2022 | Datos de salud = sensibles |
| 🇲🇽 México | LFPDPPP + Aviso de Privacidad | Datos sensibles requieren consentimiento expreso |
| 🇨🇴 Colombia | Ley 1581/2012 + circular SIC | Datos de salud = sensibles |
| 🇨🇱 Chile | Ley 19.628 (nueva ley 2024) | Sensibles requieren autorización |

### 5.2. Configuración HIPAA en Supabase (USA)

```yaml
Pasos obligatorios:
  1. Plan Pro o Team
  2. Habilitar HIPAA add-on ($599/mes en 2026)
  3. Firmar el BAA (Business Associate Agreement) desde el dashboard
  4. Marcar el proyecto como "HIPAA project" en Settings
  5. Cumplir las recomendaciones del Security Advisor:
     - MFA en toda la org
     - SSL enforcement
     - Network restrictions (IP allowlist)
     - Disable anonymous sign-ins
     - Habilitar PITR (Point-in-Time Recovery)
     - Habilitar audit logs (pgaudit)
```

[Documentación oficial HIPAA Supabase](https://supabase.com/docs/guides/security/hipaa-compliance).

### 5.3. Checklist GDPR/LOPDGDD para clínicas en España/UE

- [ ] **Base legal documentada** para cada flujo de datos (Art. 6 GDPR — normalmente consentimiento expreso + interés vital + obligación legal)
- [ ] **DPIA (Data Protection Impact Assessment)** completado para procesamiento automatizado con IA
- [ ] **Registro de Actividades de Tratamiento (RAT)** publicado
- [ ] **DPO designado** y registrado en AEPD (España)
- [ ] **Política de privacidad** que explique uso de IA (Art. 22 GDPR)
- [ ] **Derecho de oposición** a decisiones automatizadas — botón visible
- [ ] **Cifrado en reposo y en tránsito** (Supabase ya lo cumple)
- [ ] **Pseudonimización** de datos para entrenamiento de modelos
- [ ] **Borrado verificable** (no solo soft-delete) cuando se solicite
- [ ] **Brechas notificadas en 72h** al regulador
- [ ] **Contratos con sub-encargados** (Anthropic, OpenAI, Twilio…) firmados

### 5.4. Patrón técnico: separar PHI/PII del resto

```sql
-- Datos no sensibles en schema 'public'
create table public.appointments (
  id uuid primary key,
  patient_ref uuid,  -- pseudónimo
  doctor_id uuid,
  scheduled_at timestamptz,
  status text
);

-- PHI en schema 'phi' con RLS más estricto
create schema phi;
revoke all on schema phi from public;

create table phi.patients (
  id uuid primary key,
  full_name text,
  birth_date date,
  ssn_encrypted bytea,  -- cifrado con pgsodium
  medical_history_encrypted bytea
);

-- Sólo el rol 'medical_staff' lee de phi
create policy "medical_only"
  on phi.patients for select
  to authenticated
  using ((auth.jwt() ->> 'role') in ('doctor','nurse','admin'));
```

> **Mythos rule:** Si un agente IA no necesita el nombre real, dale el pseudónimo. Cuando el médico humano lo necesite, hace `join` con `phi.patients` desde su sesión autenticada.

---

## 6. FASE 16 — Hermes Agent Completo

### 6.1. Qué es Hermes Agent (resumen ejecutivo)

[Hermes Agent](https://github.com/nousresearch/hermes-agent) es **el primer agente IA con loop de aprendizaje cerrado**, creado por [Nous Research](https://nousresearch.com/). Diferencias clave vs Claude Code / Cursor / OpenCode:

1. **Vive donde sea:** VPS $5, GPU cluster, Daytona, Modal (serverless, hiberna cuando no se usa).
2. **Habla desde 20+ plataformas:** Telegram, Discord, Slack, WhatsApp, Signal, Email, SMS, Home Assistant…
3. **Aprende solo:** después de tareas complejas, **crea Skills propias automáticamente**.
4. **Memoria 4-capas:** mensajes + memoria FTS5 + skills + modelo dialéctico (Honcho).
5. **MCP nativo:** conecta cualquier MCP server existente.
6. **Open source y portable:** corre con OpenRouter free, Nous Portal, OpenAI, Z.ai GLM, Kimi…

### 6.2. Instalación profesional

#### En tu Windows (cliente de desarrollo)

```powershell
# PowerShell como admin
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
# El instalador trae: uv, Python 3.11, Node.js, ripgrep, ffmpeg, Git Bash portable
```

#### En tu VPS Hetzner (producción)

```bash
# SSH al VPS
ssh root@tu-vps

# Instalación 1-línea
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash

# Reload shell
source ~/.bashrc

# Setup inicial con Nous Portal (1 OAuth, 300+ modelos + tools)
hermes setup --portal

# Arranca como servicio (systemd)
sudo tee /etc/systemd/system/hermes.service <<EOF
[Unit]
Description=Hermes Agent
After=network.target

[Service]
Type=simple
User=hermes
WorkingDirectory=/home/hermes
ExecStart=/home/hermes/.local/bin/hermes serve --port 7000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable --now hermes
```

### 6.3. Configuración para tu workflow

`~/.config/hermes/config.yaml`:

```yaml
# Modelos en orden de preferencia
model:
  primary: openrouter/zhipu/glm-4.6           # Free, 200K context
  fallback:
    - openrouter/qwen/qwen3-coder-32b         # Free, código
    - openrouter/deepseek/deepseek-v3.2       # Free, razonamiento
    - openrouter/moonshot/kimi-k2             # Free, 2M context

# Backend de terminal
terminal:
  backend: docker        # 'docker' para aislamiento; 'local' para dev rápido
  container: ubuntu:24.04

# Memoria persistente
memory:
  enabled: true
  backend: sqlite        # 'postgres' en producción → apunta a Supabase
  fts5: true
  nudge_interval_messages: 25

# Skills
skills:
  enabled: true
  auto_create: true
  hub_url: https://hub.agentskills.io

# MCP servers conectados
mcp_servers:
  - name: supabase
    command: npx
    args: ['-y', '@supabase/mcp-server']
    env:
      SUPABASE_URL: ${SUPABASE_URL}
      SUPABASE_SERVICE_KEY: ${SUPABASE_SERVICE_KEY}
  - name: filesystem
    command: npx
    args: ['-y', '@modelcontextprotocol/server-filesystem', '/data']
  - name: github
    command: npx
    args: ['-y', '@modelcontextprotocol/server-github']
    env:
      GITHUB_TOKEN: ${GITHUB_TOKEN}
  - name: postgres-clinic
    command: npx
    args: ['-y', '@modelcontextprotocol/server-postgres', '${DATABASE_URL}']

# Gateway de mensajería: Telegram + WhatsApp
messaging:
  telegram:
    enabled: true
    token: ${TELEGRAM_BOT_TOKEN}
    allowed_users: [123456789]  # tu user_id

  whatsapp:
    enabled: true
    provider: evolution_api
    url: http://evolution:8080
    instance: hermes-clinic

# Voz (real-time)
voice:
  enabled: true
  provider: nous_portal      # o 'openai-realtime', 'elevenlabs'

# Personalidad global
soul_file: ~/.config/hermes/SOUL.md
```

### 6.4. SOUL.md — Tu personalidad de agente

```markdown
# SOUL.md — Hermes para Clínica Hermes (instancia personal)

## Identidad
Soy el asistente operativo de la clínica. Hablo en español rioplatense formal,
sin emojis, conciso. Nunca doy diagnósticos. Cuando una consulta es médica,
derivo siempre al profesional humano.

## Reglas duras (nunca rompo)
1. Nunca acceso a datos PHI sin que el usuario esté autenticado con MFA.
2. Nunca confirmo turnos sin validar disponibilidad real en Cal.com.
3. Si detecto urgencia médica (palabras como "dolor en el pecho", "sangrado"),
   escalo INMEDIATAMENTE al teléfono de guardia y aviso por Slack al admin.
4. Toda acción que modifica datos requiere registro en `audit_log`.

## Skills predilectas
- `agendar_turno`
- `enviar_recordatorio_whatsapp`
- `buscar_paciente_seguro`
- `generar_informe_diario`
```

### 6.5. Crear tu primera Skill manualmente

```bash
mkdir -p ~/.config/hermes/skills/agendar_turno
cat > ~/.config/hermes/skills/agendar_turno/SKILL.md <<'EOF'
---
name: agendar_turno
description: Agenda un turno médico en Cal.com + Supabase + envía confirmación por WhatsApp
inputs:
  patient_phone: { type: string, required: true }
  doctor_id: { type: string, required: true }
  preferred_date: { type: string, format: date }
triggers:
  - "agenda(r)? un turno"
  - "quiero pedir cita"
  - "book(ear)? appointment"
---

# Skill: agendar_turno

## Pasos

1. Consulta disponibilidad en Cal.com via MCP `cal-com`:
   ```
   tools.cal_com.list_availabilities(doctor_id={{doctor_id}}, date={{preferred_date}})
   ```

2. Si hay slots, pregunta al usuario cuál prefiere.

3. Crea el booking:
   ```
   tools.cal_com.create_booking(...)
   ```

4. Inserta el record en Supabase:
   ```sql
   insert into appointments (patient_phone, doctor_id, scheduled_at)
   values ('{{patient_phone}}', '{{doctor_id}}', '{{selected_slot}}')
   ```

5. Envía confirmación por WhatsApp via Evolution API:
   ```
   tools.evolution_api.send_message(phone={{patient_phone}}, text="...")
   ```

6. Registra acción en `audit_log`.

## Errores comunes
- Si no hay slots → ofrece próximas 3 fechas disponibles.
- Si el teléfono ya tiene un turno futuro → confirma si quiere reprogramar.
EOF

# Hermes ya la descubre y la ofrece como /agendar_turno
hermes
> /skills
> /agendar_turno
```

### 6.6. Skills Hub: lo que tienes que instalar YA

Desde el repo [awesome-hermes-agent](https://github.com/0xNyk/awesome-hermes-agent):

| Skill | Para qué sirve |
|-------|---------------|
| `superpowers` | Meta-skill que orquesta otras skills |
| `pdf-extractor` | Extrae texto + imágenes de PDFs médicos |
| `email-triage` | Categoriza emails (urgente/normal/spam) |
| `whatsapp-handler` | Plantilla para responder WhatsApp con context |
| `cron-monitor` | Programa tareas y monitorea su ejecución |
| `web-research` | Multi-step research con citaciones |
| `code-review` | Revisa PRs con checklist profesional |

### 6.7. Hermes como servicio 24/7 + Telegram

```bash
# En tu VPS
hermes setup telegram
# Pega el token de @BotFather

# Activa el "messaging gateway"
hermes messaging start --platform telegram --background

# Ya puedes mandar mensajes a tu bot desde el celular
# "Hermes, agendame un turno con la Dra. García para el martes a las 10"
# → Hermes ejecuta la skill agendar_turno
# → Te confirma por Telegram
```

---

## 7. FASE 17 — Arquitectura de Bots para Turnos de Clínica

### 7.1. Flujo de un Bot de Turnos Profesional (E2E)

```
Paciente envía WhatsApp ──► Evolution API ──► n8n webhook
                                                  │
                                                  ▼
                                          Hermes Agent / LLM
                                                  │
                                  ┌───────────────┼───────────────┐
                                  ▼               ▼               ▼
                            Verifica       Consulta             Procesa
                            paciente     disponibilidad         pago
                          (Supabase)     (Cal.com API)        (Stripe)
                                  │               │               │
                                  └───────┬───────┴───────┬───────┘
                                          ▼               ▼
                                    Crea cita       Envía calendar
                                   (Supabase +       invite + WA
                                    Cal.com)        confirmación
                                          │
                                          ▼
                                  pg_cron: reminder
                                  24h y 2h antes
                                          │
                                          ▼
                                  Evolution API send
                                  (recordatorio)
```

### 7.2. Modelo de Datos Mínimo

```sql
-- Organizaciones (clínicas)
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  plan text default 'free',
  hipaa_enabled boolean default false,
  timezone text default 'America/Argentina/Buenos_Aires',
  created_at timestamptz default now()
);

-- Doctores
create table doctors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  user_id uuid references auth.users(id),
  full_name text not null,
  specialty text,
  cal_com_username text,           -- integra con Cal.com
  consultation_duration_min int default 30,
  active boolean default true
);

-- Pacientes
create table patients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  full_name text not null,
  phone text not null,
  email text,
  birth_date date,
  preferred_language text default 'es',
  metadata jsonb default '{}',     -- alergias, notas no clínicas
  created_at timestamptz default now(),
  unique (organization_id, phone)
);

-- Citas
create table appointments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  doctor_id uuid references doctors(id),
  patient_id uuid references patients(id),
  scheduled_at timestamptz not null,
  duration_min int default 30,
  status text check (status in ('scheduled','confirmed','arrived','in_progress','completed','cancelled','no_show')) default 'scheduled',
  channel text check (channel in ('whatsapp','voice','web','manual')),
  cal_com_booking_id text,
  notes text,
  created_at timestamptz default now()
);

create index appointments_org_doctor_date_idx
  on appointments(organization_id, doctor_id, scheduled_at);

-- Mensajes (conversaciones con el bot)
create table messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  patient_id uuid references patients(id),
  channel text,
  direction text check (direction in ('inbound','outbound')),
  content text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Recordatorios programados
create table reminders (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid references appointments(id) on delete cascade,
  send_at timestamptz not null,
  channel text,
  status text default 'pending',
  sent_at timestamptz
);

-- Auditoría
create table audit_log (
  id bigserial primary key,
  organization_id uuid,
  user_id uuid,
  action text not null,
  entity_type text,
  entity_id uuid,
  diff jsonb,
  ip_address inet,
  created_at timestamptz default now()
);
```

### 7.3. Cron Jobs para Recordatorios Automáticos

```sql
-- Función que crea reminders al insertarse una cita
create or replace function schedule_appointment_reminders()
returns trigger as $$
begin
  insert into reminders (appointment_id, send_at, channel)
  values
    (NEW.id, NEW.scheduled_at - interval '24 hours', 'whatsapp'),
    (NEW.id, NEW.scheduled_at - interval '2 hours', 'whatsapp');
  return NEW;
end;
$$ language plpgsql;

create trigger trg_schedule_reminders
  after insert on appointments
  for each row execute function schedule_appointment_reminders();

-- Cron que envía los reminders vencidos cada minuto
select cron.schedule('send-due-reminders', '* * * * *', $$
  select net.http_post(
    url := current_setting('app.functions_url') || '/send-reminders',
    headers := '{"Content-Type":"application/json"}'::jsonb
  );
$$);
```

### 7.4. Prompt-Template Profesional para el Agente de Turnos

```text
ROL: Eres "Lina", asistente virtual de la Clínica San Lucas.

OBJETIVO PRINCIPAL: Agendar, reprogramar o cancelar turnos médicos
respetando ESTRICTAMENTE las reglas de negocio.

REGLAS DURAS:
1. NUNCA diagnostiques ni recomiendes medicamentos.
2. Si el paciente describe síntomas de urgencia (dolor torácico,
   dificultad respiratoria, hemorragia, pérdida de conocimiento),
   responde EXACTAMENTE: "Esto suena urgente. Llamá al 107 (SAME) o
   andá a la guardia más cercana. Aviso al equipo médico ahora."
   Y ejecuta la herramienta `notify_emergency`.
3. Confirma SIEMPRE: nombre completo, DNI/teléfono, motivo (no clínico),
   preferencia de fecha/horario.
4. Si no encuentras al paciente en la BD, ofrece registro guiado.
5. No prometas horarios sin verificar disponibilidad real con
   la herramienta `check_availability`.

HERRAMIENTAS DISPONIBLES:
- find_patient(phone) → Patient | null
- create_patient(name, phone, email, birth_date) → Patient
- list_doctors(specialty?) → Doctor[]
- check_availability(doctor_id, from_date, to_date) → Slot[]
- create_appointment(patient_id, doctor_id, slot) → Appointment
- cancel_appointment(appointment_id, reason) → void
- send_message(phone, text) → void
- notify_emergency(patient_phone, summary) → void

TONO: cálido, profesional, oraciones cortas. Argentino formal.

LÍMITES DE ESCALADO:
- Si después de 3 intentos no entiendes lo que pide → derivá a humano
  con `escalate_to_human(reason)`.
- Si el paciente menciona problemas administrativos (facturación, obras
  sociales) → derivá a humano.
```

### 7.5. Métricas KPI para tu Bot de Turnos

Dashboards mínimos (en Metabase o Supabase Studio):

| Métrica | Cómo se mide | Meta |
|---------|--------------|------|
| **Booking Success Rate** | citas creadas / conversaciones iniciadas | >70% |
| **No-show Rate** | citas marcadas no_show / total agendadas | <8% (vs 25% sin reminders) |
| **Average Conversation Length** | mensajes por booking exitoso | <8 mensajes |
| **Escalation Rate** | conversaciones derivadas a humano | <15% |
| **First Response Time** | promedio desde mensaje del paciente hasta respuesta | <3 segundos |
| **CSAT Bot** | encuesta post-cita (1-5 estrellas) | >4.2 |

---

## 8. FASE 18 — Sistemas Administrativos para PyMEs

### 8.1. Casos de Uso "Killer App" para PyMEs

Top 10 procesos donde un agente IA + Supabase paga su coste en <1 mes:

| # | Proceso | Tiempo ahorrado/semana |
|---|---------|------------------------|
| 1 | **Gestión de turnos / agendamiento** | 15-20h (recepción) |
| 2 | **Onboarding de clientes** (KYC, formularios, contratos) | 8h |
| 3 | **Facturación recurrente + cobros** | 10h |
| 4 | **Soporte L1** (preguntas frecuentes, status pedidos) | 25h |
| 5 | **Recordatorios y followups** comerciales | 12h |
| 6 | **Reportes operativos diarios** (ventas, stock, agenda) | 5h |
| 7 | **Gestión documental** (subir, clasificar, OCR facturas) | 8h |
| 8 | **Conciliación bancaria** (match pagos ↔ facturas) | 6h |
| 9 | **RRHH operativo** (vacaciones, licencias, recibos) | 4h |
| 10 | **Compliance / auditoría** (registros automáticos) | 3h |

### 8.2. Arquitectura "ERP Modular Ligero" sobre Supabase

```
┌──────────────────────────────────────────────────────┐
│            FRONT-END: Next.js + shadcn/ui            │
│      Dashboard · Clientes · Facturas · Reportes      │
└──────────────┬───────────────────────────────────────┘
               │
        ┌──────▼──────┐
        │  Supabase   │
        │  Auth + DB  │
        └──────┬──────┘
               │
   ┌───────────┼────────────┬─────────────┬──────────────┐
   ▼           ▼            ▼             ▼              ▼
Clientes    Productos    Facturación   Inventario     RRHH
(CRM)       (Catálogo)   (Stripe)      (Stock + alerts)(Empleados)
   │           │            │             │              │
   └───────────┴────────────┴─────────────┴──────────────┘
                          │
                          ▼
                  ┌────────────────┐
                  │  Hermes Agent  │
                  │  Skills:       │
                  │  - cobrar      │
                  │  - facturar    │
                  │  - reportar    │
                  │  - recordar    │
                  └───────┬────────┘
                          │
                  ┌───────┼──────┬──────┐
                  ▼       ▼      ▼      ▼
              WhatsApp  Email  Voz  Dashboard
```

### 8.3. Tablas Base del "ERP Ligero"

```sql
-- Clientes (CRM)
create table customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  type text check (type in ('person','company')),
  legal_name text not null,
  tax_id text,                          -- CUIT/RFC/NIF
  contact_name text,
  email text,
  phone text,
  address jsonb,
  payment_terms_days int default 30,
  credit_limit numeric(12,2),
  status text default 'active',
  tags text[],
  custom_fields jsonb default '{}',
  created_at timestamptz default now()
);

-- Productos / Servicios
create table products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  sku text,
  name text not null,
  type text check (type in ('product','service','digital','subscription')),
  unit_price numeric(12,2),
  tax_rate numeric(5,2) default 21.00,
  current_stock int,
  min_stock int,
  active boolean default true
);

-- Facturas
create table invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  customer_id uuid references customers(id),
  invoice_number text,
  issue_date date default current_date,
  due_date date,
  subtotal numeric(12,2),
  tax_amount numeric(12,2),
  total numeric(12,2),
  status text check (status in ('draft','sent','paid','overdue','cancelled')) default 'draft',
  payment_method text,
  stripe_invoice_id text,
  pdf_url text,
  created_at timestamptz default now()
);

-- Líneas de factura
create table invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references invoices(id) on delete cascade,
  product_id uuid references products(id),
  description text,
  quantity numeric(12,3),
  unit_price numeric(12,2),
  tax_rate numeric(5,2),
  line_total numeric(12,2)
);

-- Pagos
create table payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  invoice_id uuid references invoices(id),
  amount numeric(12,2),
  method text,
  reference text,
  stripe_payment_intent_id text,
  paid_at timestamptz default now()
);
```

### 8.4. Skills de Hermes para PyMEs

| Skill | Trigger | Acción |
|-------|---------|--------|
| `cobrar` | "cobrá a Empresa X" | Genera link Stripe + envía por email/WA |
| `facturar` | "facturá venta a..." | Crea factura, asigna número, genera PDF |
| `reporte_diario` | cron 8AM | Ventas, citas, cobros, alertas → Slack/Email |
| `reconciliar` | webhook Stripe | Match pagos ↔ facturas auto |
| `recordar_pago` | cron diario | Detecta vencidos, envía recordatorio escalonado |
| `onboarding_cliente` | mensaje "soy nuevo cliente" | Captura datos, KYC, contrato e-firma |
| `stock_alerta` | cron / trigger | Si stock < mínimo → notifica + sugiere compra |

---

## 9. FASE 19 — Canales: WhatsApp, Voz, Email, SMS

### 9.1. WhatsApp: Twilio vs Evolution API

| | Twilio WA Business | Evolution API (self-host) |
|---|---|---|
| Costo | $0.005-0.10 / mensaje + suscripción | **Gratis** (solo VPS) |
| Setup | Cuenta Business Meta + verificación 2-3 sem | 10 minutos en Coolify/Easypanel |
| Confianza | Oficial Meta | No oficial (usa WhatsApp Web) |
| Volumen | Ilimitado | Limitado por estabilidad del número |
| Plantillas HSM | Obligatorias fuera 24h | No las necesita |
| Cuándo usar | **Producción seria, >1000 conv/día, marcas grandes** | **MVP, PyMEs, clínicas pequeñas, sandboxing** |

**Setup de Evolution API en Coolify (5 minutos):**

```yaml
# docker-compose.yml en Coolify
services:
  evolution-api:
    image: atendai/evolution-api:latest
    environment:
      - AUTHENTICATION_API_KEY=tu_clave_secreta
      - DATABASE_ENABLED=true
      - DATABASE_PROVIDER=postgresql
      - DATABASE_CONNECTION_URI=postgresql://...
      - REDIS_ENABLED=true
      - REDIS_URI=redis://redis:6379
      - WEBHOOK_GLOBAL_URL=https://tu-n8n.com/webhook/whatsapp
    ports:
      - "8080:8080"
    volumes:
      - evolution_instances:/evolution/instances
```

### 9.2. Voz: Vapi vs Retell vs Bland vs ElevenLabs

**Comparativa 2026 para AI Voice Agents:**

| Plataforma | Costo/min | Latencia | Voces ES | Mejor para |
|------------|-----------|----------|----------|-----------|
| **Vapi** | $0.05-0.09 | ~800ms | ✅ Excelente (ElevenLabs) | DevX, flexibilidad |
| **Retell AI** | $0.07-0.13 | ~700ms | ✅ | Producción robusta |
| **Bland AI** | $0.09 | ~800ms | ✅ | Outbound masivo |
| **ElevenLabs Conversational** | $0.08 | ~900ms | ✅✅ La mejor voz | Branding premium |
| **Synthflow** | $0.13 | ~1s | ✅ | No-code |

**Recomendación 2026:**
- MVP / Startup → **Vapi** (mejor DX, integra con OpenAI/Anthropic directo)
- Producción clínica grande → **Retell AI** (más HIPAA-ready)
- Branding premium → **ElevenLabs**

### 9.3. Email Transaccional: Resend vs Postmark vs Loops

| | Resend | Postmark | Loops |
|---|---|---|---|
| Free | 3K/mes | 100/mes | 1K/mes |
| DX | ⭐⭐⭐⭐⭐ React Email built-in | ⭐⭐⭐⭐ SDK clásico | ⭐⭐⭐⭐⭐ No-code editor |
| Deliverability | Excelente | El mejor (16 años) | Bueno |
| Retention | 30 días | 45 días | 60 días |
| Marketing emails | ✅ Broadcasts | ❌ Solo transactional | ✅✅ Su fuerte |
| Precio escala | $20/50K | $15/10K | $49/15K |

**Decisión:**
- **Resend** para apps modernas Next.js (React Email components son geniales)
- **Postmark** si la deliverability es crítica (médico, legal, financial)
- **Loops** si necesitas marketing + transaccional en uno solo

---

## 10. FASE 20 — Observabilidad, Pagos, Compliance

### 10.1. Observabilidad: el stack mínimo

| Layer | Herramienta | Para qué |
|-------|-------------|----------|
| **Frontend errors** | Sentry | Errores JS, performance, replays |
| **Backend errors** | Sentry (mismo dashboard) | Errores Edge/Node |
| **Product analytics** | PostHog (self-host opcional) | Eventos, funnels, A/B |
| **LLM observability** | Langfuse (self-host gratis) | Traces de prompts, evals, costos |
| **Uptime** | Better Stack (Uptime Kuma self-host) | Pings, status page |
| **Logs** | Supabase logs + Logflare | Queries, RLS denials |

### 10.2. Langfuse self-hosted (1 comando)

```bash
# En Coolify, agregar template Langfuse
# Variables:
NEXTAUTH_SECRET=$(openssl rand -hex 32)
SALT=$(openssl rand -hex 32)
DATABASE_URL=postgresql://...  # Supabase
NEXTAUTH_URL=https://langfuse.tudominio.com

# En tu agente, instrumenta:
from langfuse import Langfuse
lf = Langfuse(host="https://langfuse.tudominio.com", public_key="pk-...", secret_key="sk-...")
# Cada llamada al LLM ahora aparece en el dashboard con costo, latencia, tokens
```

### 10.3. Pagos: Stripe vs Polar vs Lemon Squeezy

| | Stripe Direct | Polar.sh | Lemon Squeezy |
|---|---|---|---|
| Modelo | Procesador (tú = merchant) | Merchant of Record (MoR) | MoR |
| Tax handling | ❌ Tú lo manejas | ✅ Auto | ✅ Auto |
| Fees | 2.9% + $0.30 | 4% + $0.40 | 5% + $0.50 |
| Setup | Empresa registrada necesaria en algunos países | Solo cuenta | Solo cuenta |
| Ideal para | B2B SaaS, USA, EU establecidos | OSS, indie, LATAM sin entidad | Indie hackers |

**Stack recomendado para clínica PyME en LATAM:**
- **MercadoPago** (Argentina, México, Colombia, Chile) → métodos locales
- **Stripe** para tarjetas internacionales
- **Polar** si vendes el SaaS internacionalmente

### 10.4. Background Jobs: Inngest vs Trigger.dev vs Supabase Queues

| | Inngest | Trigger.dev | Supabase Queues |
|---|---|---|---|
| Modelo | Event-driven, durable | Long-running tasks | pg_message_queue |
| Free | 50K runs/mes | 5K runs/mes | Ilimitado en tu DB |
| Curva | Media | Baja | Alta (SQL) |
| Step funcs | ✅ Excelente | ✅ Excelente | ❌ Manual |
| Mejor para | Workflows con muchos pasos + retries | Long jobs (>5min) AI | Stack ya en Supabase |

**Recomendación:** **Inngest** para 90% de casos (mejor DX, retries automáticos, queue por usuario para evitar abusers).

---

## 11. FASE 21 — Tecnologías 2026 que DEBES Conocer

Estas son las apuestas técnicas que **no estaban en tus docs anteriores** y que cambiarán cómo construyes en 2026:

### 11.1. Mastra — El framework agéntico que está reemplazando LangChain

[Mastra](https://mastra.ai) es a LangChain lo que Next.js fue a Express: la versión **opinionada, TypeScript-first, batteries-included**.

```typescript
import { Agent } from '@mastra/core/agent'
import { openai } from '@ai-sdk/openai'

const clinicAgent = new Agent({
  name: 'lina',
  instructions: 'Asistente de la clínica...',
  model: openai('gpt-4o-mini'),
  tools: { checkAvailability, createAppointment, sendWhatsApp },
  memory: new PostgresStore({ connectionString: process.env.DATABASE_URL })
})
```

**Por qué Mastra está ganando:**
- Workflows con grafos visuales nativos
- Memoria persistente integrada
- Evals + observability built-in
- Funciona perfecto con Supabase + Vercel

### 11.2. AI SDK 5 de Vercel — el "Express.js" de la IA en TypeScript

```typescript
import { generateText, streamText, tool } from 'ai'
import { openai } from '@ai-sdk/openai'

const { text } = await generateText({
  model: openai('gpt-4o'),
  tools: { /* tus tools */ },
  messages: [...]
})
```

### 11.3. Drizzle ORM — el reemplazo serio de Prisma

Si vienes de Prisma, considera **Drizzle** para todo lo nuevo:
- 10× más rápido en queries
- Schema en TypeScript puro (no DSL aparte)
- Soporte oficial Supabase
- Migraciones SQL transparentes

```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import { appointments } from './schema'

const result = await db
  .select()
  .from(appointments)
  .where(eq(appointments.organizationId, orgId))
```

### 11.4. Better-Auth — la nueva referencia open-source

Si te cansaste de Clerk ($25/mes mínimo) y Supabase Auth te queda corto:
- **100% open-source y self-hostable**
- Sessions, MFA, OAuth, magic links
- Plugins: organizations, RBAC, passkeys, SSO, billing
- Funciona con tu Postgres directamente

### 11.5. Cloudflare Durable Objects + Workers AI

Para apps que necesitan **estado consistente global** (chats, salas, lobby): Durable Objects + Workers AI = el stack "edge state + edge inference" más barato del planeta.

### 11.6. MCP Marketplace explotando

[Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers) ya tiene 500+ servers. Para clínica:
- `supabase-mcp` — acceso a tu BD con permisos
- `cal-com-mcp` — agendamiento
- `stripe-mcp` — facturación
- `gmail-mcp` — email
- `playwright-mcp` — automatización web
- `chrome-devtools-mcp` — depurar tu app desde el agente

### 11.7. Anthropic Skills + Files API

Si pagas Claude → usa **Skills** (carpetas con SKILL.md + scripts ejecutables) y la **Files API** para que Claude vea/escriba archivos reales.

### 11.8. OpenAI Agent Builder + Apps SDK

OpenAI lanzó Agent Builder no-code y Apps SDK. Si tu cliente vive en ChatGPT, vale la pena tener una "ChatGPT App" además del WhatsApp.

### 11.9. ScreenPipe / Rewind — captura todo en local

Si quieres que tu agente "vea lo que ves" en tu Windows para automatizar tareas administrativas: **ScreenPipe** (open source) graba pantalla 24/7 + indexa con LLM local.

### 11.10. Daytona / Modal — sandboxes serverless para agentes

Hermes ya integra Daytona y Modal: tu agente **vive en un workspace que hiberna** cuando nadie lo usa (cuesta ~$0/mes) y se despierta al recibir un mensaje.

---

## 12. FASE 22 — Blueprint: Clínica SaaS Multi-Tenant Completo

### 12.1. Stack Definitivo

```yaml
Frontend:
  framework: Next.js 15 (App Router, RSC)
  ui: shadcn/ui + Tailwind CSS v4
  state: TanStack Query + Zustand
  forms: React Hook Form + Zod
  deploy: Vercel (free) o Cloudflare Pages

Backend:
  primary_db: Supabase Pro ($25/mes, HIPAA add-on si USA)
  orm: Drizzle ORM
  auth: Supabase Auth (con custom claims org_id, role)
  storage: Supabase Storage (CDN incluida)
  realtime: Supabase Realtime
  edge: Supabase Edge Functions (Deno)
  cache: Upstash Redis ($0.20/100K commands)

Agentes:
  orchestrator: Hermes Agent (self-host VPS)
  workflow: n8n self-host
  llm_routing: OpenRouter (free tiers)
  observability: Langfuse self-host

Canales:
  whatsapp: Evolution API self-host
  voz: Vapi
  email: Resend
  sms: Twilio (fallback)
  bookings: Cal.com self-host

Pagos:
  primary: Stripe + MercadoPago
  subscriptions: Polar.sh

Infra:
  vps: Hetzner CX22 (€4/mes)
  paas: Coolify
  reverse_proxy: Caddy (TLS auto)
  cdn_dns_waf: Cloudflare
  domain: Cloudflare Registrar

Observabilidad:
  errors: Sentry
  analytics: PostHog self-host
  llm_traces: Langfuse self-host
  uptime: Uptime Kuma self-host

Background:
  jobs: Inngest (50K runs free)
  cron: pg_cron (gratis en Supabase)
```

### 12.2. Estructura del Monorepo

```
clinic-saas/
├── apps/
│   ├── web/                  # Next.js frontend
│   ├── admin/                # Dashboard admin
│   └── docs/                 # Marketing + docs
├── packages/
│   ├── db/                   # Drizzle schema + migrations
│   ├── ui/                   # Componentes shadcn compartidos
│   ├── ai/                   # Skills, prompts, agent config
│   ├── integrations/         # WA, Cal.com, Stripe, etc.
│   └── shared/               # Tipos, utils, validators
├── supabase/
│   ├── migrations/
│   ├── functions/
│   └── seed.sql
├── infra/
│   ├── coolify/              # docker-compose files
│   └── terraform/            # IaC para Cloudflare DNS
├── hermes/
│   ├── skills/               # Skills custom
│   ├── SOUL.md
│   └── config.yaml
└── docs/
    ├── architecture.md
    ├── runbook.md
    └── compliance.md
```

### 12.3. Pricing del SaaS sugerido

| Plan | Precio | Para quién | Incluye |
|------|--------|-----------|---------|
| **Free** | $0 | Médico individual | 1 doctor, 50 citas/mes, WhatsApp básico |
| **Pro** | $49/mes | Clínica pequeña | 5 doctores, citas ilimitadas, voz IA, email + WhatsApp |
| **Business** | $149/mes | Clínica multi-sede | 25 doctores, multi-sede, API, SLA, integraciones custom |
| **Enterprise** | Custom | Hospitales | HIPAA, dedicated DB, SSO, white-label |

**Costo de servir un cliente Pro:**
- Supabase: ~$0.50 (queries/storage)
- LLM (OpenRouter free + GPT-4o-mini para hard tasks): ~$3
- Evolution API en tu VPS: ~$0.20
- Vapi (50 minutos de voz): ~$2.50
- **Total marginal: ~$6.20**
- **Margen Pro:** $49 - $6.20 = **$42.80 (87%)**

---

## 13. FASE 23 — Comandos, Snippets y Plantillas Listas

### 13.1. Setup completo en 30 minutos

```bash
# 1. VPS Hetzner CX22 (€4/mes) - 5 min para que provisione
# 2. SSH al VPS
ssh root@tu-vps

# 3. Instala Coolify (PaaS self-hosted)
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# 4. Accede a https://tu-vps:8000 → wizard de Coolify
# 5. En Coolify, instala plantillas:
#    - Evolution API (WhatsApp)
#    - n8n
#    - Langfuse
#    - PostHog (opcional)
#    - Uptime Kuma

# 6. Configura Cloudflare:
#    - Compra dominio
#    - Apunta A record a IP del VPS
#    - Activa proxy (naranja)
#    - DNS records para subdominios:
#      app.tudominio.com    → Vercel
#      api.tudominio.com    → VPS (Supabase Edge URL via CNAME)
#      wa.tudominio.com     → VPS:8080 (Evolution)
#      n8n.tudominio.com    → VPS (n8n)
#      cal.tudominio.com    → VPS (Cal.com)

# 7. Supabase project
npx supabase init
npx supabase login
npx supabase link --project-ref xxx
npx supabase db push

# 8. Hermes Agent en el VPS
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
hermes setup --portal
# Configura ~/.config/hermes/config.yaml (ver 6.3)

# 9. Deploy frontend a Vercel
vercel link
vercel env pull
vercel --prod
```

### 13.2. Plantilla `package.json` para monorepo

```json
{
  "name": "clinic-saas",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "db:push": "supabase db push",
    "db:diff": "supabase db diff -f",
    "db:seed": "tsx packages/db/seed.ts",
    "functions:deploy": "supabase functions deploy",
    "hermes:reload": "ssh vps 'systemctl restart hermes'"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.5.0",
    "@types/node": "^22.0.0"
  }
}
```

### 13.3. Snippet: Webhook de WhatsApp → Hermes → Supabase

```typescript
// supabase/functions/whatsapp-webhook/index.ts
import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

serve(async (req) => {
  const payload = await req.json()

  // 1. Validar firma de Evolution API
  if (req.headers.get('x-api-key') !== Deno.env.get('EVOLUTION_KEY')) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { from, body: messageText, instance } = payload.data.message

  // 2. Identificar tenant por instancia
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_KEY')!
  )

  const { data: org } = await supabase
    .from('organizations')
    .select('id')
    .eq('whatsapp_instance', instance)
    .single()

  if (!org) return new Response('Org not found', { status: 404 })

  // 3. Guardar mensaje inbound
  await supabase.from('messages').insert({
    organization_id: org.id,
    channel: 'whatsapp',
    direction: 'inbound',
    content: messageText,
    metadata: { from }
  })

  // 4. Mandar a Hermes (HTTP RPC al daemon en el VPS)
  const hermesResponse = await fetch(`${Deno.env.get('HERMES_URL')}/agent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('HERMES_KEY')}`
    },
    body: JSON.stringify({
      organization_id: org.id,
      user_phone: from,
      message: messageText
    })
  })

  const { reply } = await hermesResponse.json()

  // 5. Responder por WhatsApp
  await fetch(`${Deno.env.get('EVOLUTION_API_URL')}/message/sendText/${instance}`, {
    method: 'POST',
    headers: {
      'apikey': Deno.env.get('EVOLUTION_KEY')!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ number: from, text: reply })
  })

  // 6. Guardar respuesta outbound
  await supabase.from('messages').insert({
    organization_id: org.id,
    channel: 'whatsapp',
    direction: 'outbound',
    content: reply,
    metadata: { to: from }
  })

  return new Response('ok')
})
```

---

## 14. FASE 24 — Roadmap de Implantación 90 Días

### Semanas 1-2 — Cimientos
- [ ] Compra dominio en Cloudflare
- [ ] Provisiona VPS Hetzner CX22
- [ ] Instala Coolify + Evolution API + n8n + Langfuse
- [ ] Crea proyecto Supabase Pro
- [ ] Configura Auth con MFA y custom claims
- [ ] Migración inicial: organizations, doctors, patients, appointments
- [ ] RLS policies + tests pgTAP

### Semanas 3-4 — MVP del Bot de Turnos
- [ ] Workflow n8n: WhatsApp → LLM → Supabase
- [ ] Cal.com self-host integrado
- [ ] pg_cron de recordatorios
- [ ] Dashboard básico en Next.js
- [ ] Sentry + PostHog instrumentados

### Semanas 5-6 — Hermes Agent
- [ ] Instala Hermes en VPS
- [ ] Conecta MCP Supabase + Cal.com + Stripe
- [ ] Escribe 5 skills core: agendar, reprogramar, cancelar, recordar, reportar
- [ ] SOUL.md para personalidad
- [ ] Conecta Telegram para admin

### Semanas 7-8 — Voz + Compliance
- [ ] Vapi para llamadas entrantes
- [ ] Skills de voz integradas
- [ ] Audit log completo
- [ ] DPIA + política de privacidad
- [ ] Cifrado adicional para PHI (pgsodium)
- [ ] Backups automatizados (PITR + S3 propio)

### Semanas 9-10 — Multi-tenancy
- [ ] Schema con organization_id en todo
- [ ] Onboarding self-service de nuevas clínicas
- [ ] Pricing + Stripe Billing
- [ ] White-label opcional (logo, dominio custom)

### Semanas 11-12 — Productización
- [ ] Landing page (Tailwind UI / shadcn)
- [ ] Documentación pública + status page
- [ ] Sales deck + 3 demos grabadas
- [ ] Primera venta a clínica beta (descuento 50%)
- [ ] Feedback loop → mejoras

### Hito final
> En el día 90 debes tener: 1 clínica usando producción + sistema de auto-onboarding + 0 caídas en últimas 2 semanas + costo de infra <$100/mes para servir 5 clínicas.

---

## 15. Anexos

### A. Checklist diaria del operador (clínica)

- [ ] ¿Hay errores nuevos en Sentry en últimas 24h?
- [ ] ¿Uptime de Evolution API y Hermes >99%?
- [ ] ¿Citas creadas hoy vs ayer (PostHog)?
- [ ] ¿No-shows ayer? → revisar reminders
- [ ] ¿Backup automático ejecutado (Supabase PITR)?
- [ ] ¿Logs de RLS denials? (intentos de acceso indebido)

### B. Recursos esenciales

**Documentación oficial:**
- [Supabase Docs](https://supabase.com/docs)
- [Hermes Agent Docs](https://hermes-agent.nousresearch.com/docs/)
- [Evolution API GitHub](https://github.com/evolution-foundation/evolution-api)
- [Cal.com self-host](https://cal.com/docs/self-hosting)
- [Coolify Docs](https://coolify.io/docs)

**Comunidades activas:**
- r/Supabase
- r/n8n
- r/selfhosted
- Discord de Nous Research (Hermes Agent)
- Discord de Mastra
- Discord de Cal.com

**Cursos/Videos recomendados:**
- "Supabase Full Course" — Code With Antonio (YouTube)
- "Hermes Agent Tutorial" — AI Foundations (YouTube)
- "Build a SaaS with Next.js + Supabase" — MakerKit blog
- "n8n masterclass" — Leon van Zyl

**Repos para clonar:**
- `supabase/supabase` (referencia)
- `nousresearch/hermes-agent`
- `evolution-foundation/evolution-api`
- `coollabsio/coolify`
- `mastra-ai/mastra`
- `better-auth/better-auth`
- `0xNyk/awesome-hermes-agent`

### C. Glosario rápido

| Término | Significado |
|---------|-------------|
| **RLS** | Row-Level Security (políticas SQL a nivel de fila) |
| **PHI** | Protected Health Information (HIPAA) |
| **PII** | Personally Identifiable Information |
| **BAA** | Business Associate Agreement (HIPAA) |
| **MoR** | Merchant of Record (asume responsabilidad fiscal) |
| **MCP** | Model Context Protocol (Anthropic) |
| **HSM** | Highly Structured Message (WhatsApp Business) |
| **PITR** | Point-In-Time Recovery |
| **DPIA** | Data Protection Impact Assessment (GDPR) |
| **HSM** | Hardware Security Module |
| **HNSW** | Hierarchical Navigable Small World (índice vector) |

### D. Errores comunes (anti-patrones)

| ❌ Anti-pattern | ✅ Forma correcta |
|----------------|-------------------|
| Confiar en filtros `where` del cliente sin RLS | RLS por defecto en TODA tabla con datos sensibles |
| Usar `service_role_key` en Edge Functions | Solo en cron jobs internos. En user-facing usar anon + JWT |
| Almacenar la API key de OpenAI en frontend | SIEMPRE Edge Function intermedia |
| Llamar al LLM síncrono en webhook de WhatsApp | Cola con Inngest, responde "procesando..." en <1s |
| Un solo proyecto Supabase para dev+prod | 2 proyectos separados + branches preview |
| Migraciones manuales en Studio | SIEMPRE versionadas en Git con `supabase db diff` |
| No instrumentar el agente | Langfuse desde el día 1 |
| Empezar con Vercel Pro + Clerk + Pinecone ($150/mes) | Empezar con free tier de todo + Hetzner ($5/mes) |

### E. Comparativa final: stack que recomiendo vs alternativas

| Necesidad | Stack Mythos | Alternativa cara |
|-----------|--------------|------------------|
| BD + Auth + Storage | Supabase Pro ($25) | Firebase + Auth0 ($150) |
| Hosting backend | Hetzner + Coolify ($5) | Vercel Pro ($20) + Heroku ($25) |
| WhatsApp | Evolution API self-host ($0) | Twilio ($50-200/mes) |
| Voz IA | Vapi ($0.05/min) | Custom build ($XXXX) |
| LLM | OpenRouter free + Hermes ($0) | Claude Pro ($20) + GPT-4 API ($50) |
| Agent framework | Hermes + Mastra ($0) | LangSmith Cloud ($39) |
| Observability | Langfuse self-host ($0) | DataDog ($31+) |
| **TOTAL/mes** | **~$30** | **~$300+** |

---

## 🎯 Cierre

Con este documento + `flujo_trabajo_ia_fiable5.md` + `flujo_trabajo_ia_fiable6_PRO.md`, tienes todo el conocimiento técnico necesario para:

1. **Construir un SaaS de turnos de clínica nivel enterprise** sobre infraestructura que cuesta menos de €30/mes.
2. **Replicar el modelo para PyMEs** de cualquier rubro (estudios contables, abogados, peluquerías, talleres, gimnasios).
3. **Vender el sistema** con márgenes >85% gracias a la estrategia self-host + LLMs gratuitos.
4. **Dormir tranquilo** sabiendo que cumples HIPAA/GDPR/LOPDGDD desde la arquitectura.

> **Recordatorio Mythos final:** _"El modelo no necesita ser inteligente si el contexto lo es. El producto no necesita ser caro si la arquitectura lo es. La empresa no necesita ser grande si los sistemas lo son."_

**Siguiente paso sugerido:** ejecuta el roadmap de 90 días. Documenta cada decisión en `docs/decisions/ADR-XXX.md`. Cada vez que Hermes cree una skill nueva, súbela al repo. En 12 meses, tendrás una librería de Skills + un stack productivo + clientes pagando — y todo el conocimiento queda en código auditable.

**Fin del documento.** 🏛️
