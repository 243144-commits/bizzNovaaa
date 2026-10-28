-- ==============================================================================
-- BizzNova Supabase Database Migration
-- Table: public.profiles & Auth Integration
-- Safe, idempotent, preserves existing tables, enforces RLS & Privilege Protection
-- ==============================================================================

-- 1. Create profiles table linked to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  role text not null default 'FOUNDER' check (role in ('FOUNDER', 'TEAM_MEMBER', 'MENTOR', 'INVESTOR', 'ADMIN')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Idempotent Policy Creation
-- View own profile
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Insert own profile (prevents user from self-assigning ADMIN)
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id and role in ('FOUNDER', 'TEAM_MEMBER', 'MENTOR', 'INVESTOR'));

-- Update own profile (prevents user from self-escalating role)
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id 
    and role = (select p.role from public.profiles p where p.id = auth.uid())
  );

-- 4. Automatically create user profile upon auth.users signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.email,
    'FOUNDER'
  )
  on conflict (id) do update set
    full_name = coalesce(excluded.full_name, profiles.full_name),
    email = coalesce(excluded.email, profiles.email),
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- 5. Attach trigger to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. Helper index for performance
create index if not exists idx_profiles_email on public.profiles(email);
