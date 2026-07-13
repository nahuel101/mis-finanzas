-- ============================================================
-- Esquema de "Mis Finanzas" para Neon Postgres
-- Corré esto una sola vez desde Vercel:
-- Dashboard del proyecto → Storage → tu base → pestaña "Query"
-- → pegar todo → Run.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- Usuarios (cuentas de la app) ----------------------
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

-- ---------- Transacciones (ingresos y gastos) ------------------
create table if not exists transacciones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  tipo text not null check (tipo in ('ingreso', 'gasto')),
  monto numeric(14, 2) not null check (monto > 0),
  moneda text not null check (moneda in ('ARS', 'USD')),
  categoria text not null,
  descripcion text,
  fecha date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists transacciones_user_fecha_idx
  on transacciones (user_id, fecha desc);

-- ---------- Inversiones (acciones, CEDEARs, cripto, bonos) ------
create table if not exists inversiones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  tipo text not null check (tipo in ('cedear', 'accion', 'cripto', 'bono', 'otro')),
  ticker text not null,
  nombre text,
  cantidad numeric(18, 8) not null check (cantidad > 0),
  precio_compra numeric(14, 4) not null check (precio_compra >= 0),
  moneda_compra text not null check (moneda_compra in ('ARS', 'USD')),
  coingecko_id text,
  fecha_compra date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists inversiones_user_idx
  on inversiones (user_id);

-- ---------- Categorías (personalizables por usuario) -------------
create table if not exists categorias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  tipo text not null check (tipo in ('ingreso', 'gasto')),
  nombre text not null,
  orden int not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, tipo, nombre)
);

create index if not exists categorias_user_tipo_idx
  on categorias (user_id, tipo, orden);

-- Nota de seguridad: esta base no usa Row Level Security (eso es
-- una característica propia de Supabase). En su lugar, TODA consulta
-- de la app pasa por Server Actions que agregan "where user_id = ..."
-- usando el id del usuario logueado (ver lib/actions/*.ts). Ningún
-- dato llega al navegador sin pasar antes por ese filtro.
