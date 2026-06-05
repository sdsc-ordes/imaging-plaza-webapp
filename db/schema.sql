-- Destination schema for the Firebase → Supabase migration.
-- Apply against the public schema of a fresh Supabase project; the
-- `auth.*` schema is owned and populated by GoTrue.
--
-- See docs/migrations/firebase-to-supabase.md for context.

------------------------------------------------------------------
-- Extensions
------------------------------------------------------------------

create extension if not exists pgcrypto;

------------------------------------------------------------------
-- Enums
------------------------------------------------------------------

do $$ begin
  create type public.user_role as enum ('user', 'admin');
exception when duplicate_object then null;
end $$;

------------------------------------------------------------------
-- profiles  (replaces Firestore `users`)
------------------------------------------------------------------

create table if not exists public.profiles (
  id                    uuid primary key references auth.users(id) on delete cascade,
  email                 text not null,
  first_name            text,
  last_name             text,
  role                  public.user_role not null default 'user',
  bookmarked_software   text[] not null default '{}',
  own_softwares         text[] not null default '{}',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles (email);

-- Auto-create a profile when a new auth user signs up so the rest of the
-- app can assume `profiles.id = auth.users.id` is always populated.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

------------------------------------------------------------------
-- faqs  (replaces Firestore `faqData`)
------------------------------------------------------------------

create table if not exists public.faqs (
  id           uuid primary key default gen_random_uuid(),
  question     text not null,
  answer       text not null,
  order_index  integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists faqs_order_idx on public.faqs (order_index);

------------------------------------------------------------------
-- team_members  (replaces Firestore `teamMember`)
------------------------------------------------------------------

create table if not exists public.team_members (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  role_title   text,
  photo_url    text,
  bio          text,
  order_index  integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists team_members_order_idx on public.team_members (order_index);

------------------------------------------------------------------
-- contact_submissions  (replaces Firestore `contactForm`)
------------------------------------------------------------------

create table if not exists public.contact_submissions (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  subject      text,
  body         text not null,
  status       text not null default 'new',
  created_at   timestamptz not null default now()
);

create index if not exists contact_submissions_created_idx on public.contact_submissions (created_at desc);

------------------------------------------------------------------
-- updated_at maintenance
------------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists faqs_touch on public.faqs;
create trigger faqs_touch before update on public.faqs
  for each row execute function public.touch_updated_at();

drop trigger if exists team_members_touch on public.team_members;
create trigger team_members_touch before update on public.team_members
  for each row execute function public.touch_updated_at();

------------------------------------------------------------------
-- Row Level Security
------------------------------------------------------------------

alter table public.profiles            enable row level security;
alter table public.faqs                enable row level security;
alter table public.team_members        enable row level security;
alter table public.contact_submissions enable row level security;

-- Helper: is the calling user an admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles: a user can read and update their own row; admins can do everything.
drop policy if exists profiles_select_self on public.profiles;
create policy profiles_select_self on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

drop policy if exists profiles_admin_write on public.profiles;
create policy profiles_admin_write on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- faqs / team_members: public read, admin write.
drop policy if exists faqs_public_read on public.faqs;
create policy faqs_public_read on public.faqs for select using (true);

drop policy if exists faqs_admin_write on public.faqs;
create policy faqs_admin_write on public.faqs
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists team_members_public_read on public.team_members;
create policy team_members_public_read on public.team_members for select using (true);

drop policy if exists team_members_admin_write on public.team_members;
create policy team_members_admin_write on public.team_members
  for all using (public.is_admin()) with check (public.is_admin());

-- contact_submissions: anyone (including anon) can insert; only admins read.
drop policy if exists contact_submissions_anon_insert on public.contact_submissions;
create policy contact_submissions_anon_insert on public.contact_submissions
  for insert with check (true);

drop policy if exists contact_submissions_admin_read on public.contact_submissions;
create policy contact_submissions_admin_read on public.contact_submissions
  for select using (public.is_admin());
