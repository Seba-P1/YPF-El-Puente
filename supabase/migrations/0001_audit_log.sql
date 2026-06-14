-- ============================================
-- MIGRACIÓN 0001: AUDIT LOG SYSTEM
-- ============================================

-- 1. Tabla audit_log
create table if not exists public.audit_log (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete set null,
  user_email   text,
  action       text not null check (action in ('INSERT','UPDATE','DELETE','LOGIN','UPLOAD','BULK')),
  entity_type  text not null,
  entity_id    text,
  before_data  jsonb,
  after_data   jsonb,
  changed_fields text[],
  ip_address   inet,
  user_agent   text,
  created_at   timestamptz not null default now()
);

create index if not exists idx_audit_user_date on public.audit_log (user_id, created_at desc);
create index if not exists idx_audit_entity on public.audit_log (entity_type, entity_id);
create index if not exists idx_audit_created on public.audit_log (created_at desc);

-- 2. RLS
alter table public.audit_log enable row level security;

-- Solo admins ven el audit log
create policy "admin_select_audit"
on public.audit_log
for select
to authenticated
using (
  exists (
    select 1 from auth.users
    where id = (select auth.uid())
      and (raw_app_meta_data ->> 'role') = 'admin'
  )
);

-- Nadie inserta directo (solo triggers vía SECURITY DEFINER)
create policy "no_direct_insert_audit"
on public.audit_log
for insert
to authenticated
with check (false);

-- 3. Función trigger genérica
create or replace function public.audit_trigger_func()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id   uuid := (select auth.uid());
  v_email     text;
  v_changed   text[];
  v_action    text;
begin
  select email into v_email from auth.users where id = v_user_id;

  if TG_OP = 'INSERT' then
    v_action := 'INSERT';
    insert into public.audit_log (user_id, user_email, action, entity_type, entity_id, after_data)
    values (v_user_id, v_email, v_action, TG_TABLE_NAME, NEW.id::text, to_jsonb(NEW));
    return NEW;

  elsif TG_OP = 'UPDATE' then
    v_action := 'UPDATE';
    -- detectar columnas cambiadas
    select array_agg(key)
      into v_changed
      from jsonb_each(to_jsonb(NEW))
      where to_jsonb(NEW) -> key is distinct from to_jsonb(OLD) -> key;

    if v_changed is not null and array_length(v_changed,1) > 0 then
      insert into public.audit_log (user_id, user_email, action, entity_type, entity_id, before_data, after_data, changed_fields)
      values (v_user_id, v_email, v_action, TG_TABLE_NAME, NEW.id::text, to_jsonb(OLD), to_jsonb(NEW), v_changed);
    end if;
    return NEW;

  elsif TG_OP = 'DELETE' then
    v_action := 'DELETE';
    insert into public.audit_log (user_id, user_email, action, entity_type, entity_id, before_data)
    values (v_user_id, v_email, v_action, TG_TABLE_NAME, OLD.id::text, to_jsonb(OLD));
    return OLD;
  end if;
  return null;
end;
$$;

-- 4. Triggers en productos
drop trigger if exists trg_audit_productos on public.productos;
create trigger trg_audit_productos
after insert or update or delete on public.productos
for each row execute function public.audit_trigger_func();

-- 5. Triggers en combustibles
drop trigger if exists trg_audit_combustibles on public.combustibles;
create trigger trg_audit_combustibles
after insert or update or delete on public.combustibles
for each row execute function public.audit_trigger_func();

-- 6. Triggers en configuracion_tienda
drop trigger if exists trg_audit_config on public.configuracion_tienda;
create trigger trg_audit_config
after insert or update or delete on public.configuracion_tienda
for each row execute function public.audit_trigger_func();

-- 7. Comentarios para docs
comment on table public.audit_log is 'Registro inmutable de cambios sensibles. Solo lectura por admin. INSERT solo vía triggers.';
