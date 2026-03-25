-- ═══════════════════════════════════════════════════════
-- Scholar Dashboard — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── PROFILES ──────────────────────────────────────────
-- Auto-created when a user signs up
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── ATTENDANCE ────────────────────────────────────────
create table if not exists public.attendance (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  subject_id  text not null,           -- e.g. 'ds', 'dbms', 'os'
  attended    integer default 0,
  total       integer default 0,
  updated_at  timestamptz default now(),
  unique(user_id, subject_id)
);

-- ── CHECKINS ─────────────────────────────────────────
-- One row per user per calendar date per task
create table if not exists public.checkins (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  date        date not null,           -- e.g. '2026-03-22'
  task_id     text not null,           -- e.g. 'gym', 'leet', 'gf'
  done        boolean default false,
  updated_at  timestamptz default now(),
  unique(user_id, date, task_id)
);

-- ── CUSTOM SCHEDULE BLOCKS ────────────────────────────
create table if not exists public.schedule_blocks (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  day         integer not null,        -- 0=Mon, 6=Sun
  cat         text not null,
  start_time  text not null,           -- '19:00'
  end_time    text not null,           -- '20:00'
  title       text not null,
  note        text default '',
  created_at  timestamptz default now()
);

-- ── THEME PREFERENCE ──────────────────────────────────
create table if not exists public.preferences (
  user_id     uuid references public.profiles(id) on delete cascade primary key,
  theme       text default 'dark',
  updated_at  timestamptz default now()
);

-- ── ROW LEVEL SECURITY ───────────────────────────────
-- Users can only read/write their own data

alter table public.profiles        enable row level security;
alter table public.attendance       enable row level security;
alter table public.checkins         enable row level security;
alter table public.schedule_blocks  enable row level security;
alter table public.preferences      enable row level security;

-- Profiles
create policy "Users can view own profile"    on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"  on public.profiles for update using (auth.uid() = id);

-- Attendance
create policy "Users can manage own attendance" on public.attendance
  for all using (auth.uid() = user_id);

-- Checkins
create policy "Users can manage own checkins" on public.checkins
  for all using (auth.uid() = user_id);

-- Schedule blocks
create policy "Users can manage own blocks" on public.schedule_blocks
  for all using (auth.uid() = user_id);

-- Preferences
create policy "Users can manage own preferences" on public.preferences
  for all using (auth.uid() = user_id);
