-- ============================================
-- MIGRACIÓN 0002: RLS HARDENING
-- ============================================

-- Función helper para verificar admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from auth.users
    where id = (select auth.uid())
      and (raw_app_meta_data ->> 'role') = 'admin'
  );
$$;

-- ============================================
-- PRODUCTOS
-- ============================================
alter table public.productos enable row level security;

-- Limpiar políticas viejas
drop policy if exists "productos_select_all" on public.productos;
drop policy if exists "productos_admin_write" on public.productos;
drop policy if exists "public_read_productos" on public.productos;

-- Lectura pública (storefront)
create policy "productos_public_select"
on public.productos
for select
to anon, authenticated
using (true);

-- Solo admin escribe
create policy "productos_admin_insert"
on public.productos
for insert
to authenticated
with check (public.is_admin());

create policy "productos_admin_update"
on public.productos
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "productos_admin_delete"
on public.productos
for delete
to authenticated
using (public.is_admin());

-- Índice crítico
create index if not exists idx_productos_codigo_plu on public.productos (codigo_plu);
create index if not exists idx_productos_categoria on public.productos (categoria_slug);
create index if not exists idx_productos_disponible on public.productos (disponible) where disponible = true;
create index if not exists idx_productos_destacado on public.productos (destacado) where destacado = true;

-- ============================================
-- CATEGORIAS
-- ============================================
alter table public.categorias enable row level security;
drop policy if exists "categorias_select" on public.categorias;
drop policy if exists "categorias_admin_write" on public.categorias;

create policy "categorias_public_select"
on public.categorias for select to anon, authenticated using (true);

create policy "categorias_admin_all"
on public.categorias for all to authenticated
using (public.is_admin()) with check (public.is_admin());

-- ============================================
-- COMBUSTIBLES
-- ============================================
alter table public.combustibles enable row level security;
drop policy if exists "combustibles_select" on public.combustibles;
drop policy if exists "combustibles_admin_write" on public.combustibles;

create policy "combustibles_public_select"
on public.combustibles for select to anon, authenticated using (true);

create policy "combustibles_admin_all"
on public.combustibles for all to authenticated
using (public.is_admin()) with check (public.is_admin());

-- ============================================
-- CONFIGURACION_TIENDA
-- ============================================
alter table public.configuracion_tienda enable row level security;
drop policy if exists "config_select" on public.configuracion_tienda;
drop policy if exists "config_admin_write" on public.configuracion_tienda;

create policy "config_public_select"
on public.configuracion_tienda for select to anon, authenticated using (true);

create policy "config_admin_all"
on public.configuracion_tienda for all to authenticated
using (public.is_admin()) with check (public.is_admin());

-- ============================================
-- UPLOADS_HISTORIAL
-- ============================================
alter table public.uploads_historial enable row level security;
drop policy if exists "uploads_admin_only" on public.uploads_historial;

create policy "uploads_admin_select"
on public.uploads_historial for select to authenticated
using (public.is_admin());

create policy "uploads_admin_insert"
on public.uploads_historial for insert to authenticated
with check (public.is_admin());

-- ============================================
-- STORAGE: bucket "productos"
-- (Comentado porque Storage Policies no se pueden crear directo
-- en una sola transacción SQL estándar sin usar funciones admin, 
-- pero se recomienda correrlo en el SQL Editor)
-- ============================================
/*
delete from storage.policies where bucket_id = 'productos';

insert into storage.policies (id, name, bucket_id, definition, check_definition, command, roles)
values
('productos_public_read', 'Public can read', 'productos',
 'true', null, 'SELECT', '{anon,authenticated}'::name[])
on conflict do nothing;

create policy "productos_admin_upload"
on storage.objects for insert to authenticated
with check (bucket_id = 'productos' and public.is_admin());

create policy "productos_admin_update"
on storage.objects for update to authenticated
using (bucket_id = 'productos' and public.is_admin());

create policy "productos_admin_delete"
on storage.objects for delete to authenticated
using (bucket_id = 'productos' and public.is_admin());
*/
