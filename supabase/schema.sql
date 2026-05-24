-- Avot — Supabase schema.
--
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- It creates: profiles, highlights, bookmarks, kids_progress, plus a role
-- enum and row-level security so every user can only read/write their own
-- rows. Editor / admin rows are exposed via profile.role.
--
-- Phase 1 ships the schema and RLS. The client sync layer comes in Phase 2.

-- =========================================================================
-- Roles
-- =========================================================================
do $$ begin
  create type app_role as enum ('user', 'editor', 'admin');
exception when duplicate_object then null; end $$;

-- =========================================================================
-- Profiles (one row per auth.users row)
-- =========================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role app_role not null default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles
  for select using (auth.uid() = id);

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row on signup.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================================
-- Highlights & notes
-- =========================================================================
create table if not exists public.highlights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  perek int not null,
  mishnah int not null,
  text text not null,            -- the highlighted phrase
  start_offset int,
  end_offset int,
  color text default 'yellow',   -- yellow|rose|sky|mint
  note text,
  tags text[] default '{}',
  lang text default 'he',        -- 'he' or 'en'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists highlights_user_idx on public.highlights(user_id, perek, mishnah);

alter table public.highlights enable row level security;
drop policy if exists highlights_owner on public.highlights;
create policy highlights_owner on public.highlights
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================================
-- Bookmarks + last position
-- =========================================================================
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  perek int not null,
  mishnah int not null,
  note text,
  created_at timestamptz default now(),
  unique (user_id, perek, mishnah)
);
create index if not exists bookmarks_user_idx on public.bookmarks(user_id);

alter table public.bookmarks enable row level security;
drop policy if exists bookmarks_owner on public.bookmarks;
create policy bookmarks_owner on public.bookmarks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- One last-position row per user.
create table if not exists public.last_position (
  user_id uuid primary key references auth.users(id) on delete cascade,
  perek int not null default 1,
  mishnah int not null default 1,
  view text,
  mode text default 'adult',
  updated_at timestamptz default now()
);
alter table public.last_position enable row level security;
drop policy if exists last_position_owner on public.last_position;
create policy last_position_owner on public.last_position
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================================
-- Kids progress (per-mishnah stops, stars)
-- =========================================================================
create table if not exists public.kids_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  perek int not null,
  mishnah int not null,
  completed boolean default false,
  stars int default 0,            -- 0..3
  read_aloud_count int default 0,
  story_read boolean default false,
  quiz_passed boolean default false,
  updated_at timestamptz default now(),
  unique (user_id, perek, mishnah)
);
create index if not exists kids_user_idx on public.kids_progress(user_id);

alter table public.kids_progress enable row level security;
drop policy if exists kids_owner on public.kids_progress;
create policy kids_owner on public.kids_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================================
-- Convenience: who-am-I view (lets the client fetch role + profile in one go)
-- =========================================================================
create or replace view public.me as
  select id, email, display_name, role
  from public.profiles
  where id = auth.uid();
