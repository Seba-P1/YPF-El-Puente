-- ============================================
-- MIGRACIÓN 0003: BOXES SERVICES
-- ============================================

-- 1. Tabla boxes_services
create table if not exists public.boxes_services (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  descripcion text,
  icono_slug  text not null,
  disponible  boolean not null default true,
  orden       integer not null
);

-- 2. Seed data: 6 servicios iniciales
insert into public.boxes_services (nombre, descripcion, icono_slug, disponible, orden) values
  ('Cambio de aceite',       'Mantenimiento esencial para tu motor con lubricantes YPF.',         'Droplets',    true, 1),
  ('Inflado de neumáticos',  'Presión óptima para mayor seguridad y menor consumo.',              'Gauge',       true, 2),
  ('Agua y refrigerante',    'Control y llenado del sistema de refrigeración.',                   'Thermometer', true, 3),
  ('Limpieza de parabrisas', 'Máxima visibilidad con limpieza profesional de cristales.',         'Eye',         true, 4),
  ('Control de presión',     'Verificación de presión de neumáticos y estado general.',           'Activity',    true, 5),
  ('Revisión general',       'Chequeo completo de los puntos críticos de tu vehículo.',           'CheckCircle2', true, 6);

-- 3. RLS
alter table public.boxes_services enable row level security;

-- Lectura pública (storefront)
create policy "boxes_services_public_select"
on public.boxes_services
for select
to anon, authenticated
using (true);

-- Admin full access
create policy "boxes_services_admin_all"
on public.boxes_services
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- 4. Índice para orden
create index if not exists idx_boxes_services_orden on public.boxes_services (orden);
create index if not exists idx_boxes_services_disponible on public.boxes_services (disponible) where disponible = true;
