-- Bloom Lab Pro: schema for Supabase (Postgres), EU region (Frankfurt).
-- Run in the Supabase SQL editor. Auth uses Supabase Auth (email magic link).

-- 1. Profile + plan (one row per user, created on sign-up)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free','pro')),
  plan_until timestamptz,                -- end of paid period (from Paddle)
  photo_credits integer not null default 0 check (photo_credits >= 0), -- extra read packs
  paddle_customer_id text,
  paddle_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Photo reads log (quota + cost tracking; no images, no AI output stored)
create table if not exists public.photo_reads (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  ok boolean not null,
  model text,
  input_tokens integer,
  output_tokens integer,
  image_hash text                        -- sha-256 of the image, to serve repeats from cache
);
create index if not exists photo_reads_user_month on public.photo_reads (user_id, created_at);

-- 3. Synced user data (journal, bags, recipes, experiments, grinder settings) as JSON documents
create table if not exists public.user_docs (
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('brews','recipes','exps','beans','settings')),
  id text not null,
  data jsonb not null,
  deleted boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, kind, id)
);

-- Row level security: each user sees only their own rows
alter table public.profiles enable row level security;
alter table public.photo_reads enable row level security;
alter table public.user_docs enable row level security;

create policy "own profile read" on public.profiles for select using (auth.uid() = id);
create policy "own reads read" on public.photo_reads for select using (auth.uid() = user_id);
create policy "own docs all" on public.user_docs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- profiles and photo_reads are written only by the backend (service role), never by the client.

-- Create profile automatically on sign-up
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Monthly usage helper (used by the worker)
create or replace function public.reads_this_month(uid uuid) returns integer
language sql stable as $$
  select count(*)::int from public.photo_reads
  where user_id = uid and ok and created_at >= date_trunc('month', now());
$$;

-- GDPR: account deletion cascades to every table above (on delete cascade).
