-- =============================================================================
-- BizzNova — Complete Supabase Database Setup
-- Run this ONCE in: Supabase Dashboard → SQL Editor → New Query → Run
-- Project: https://txbxrppepxyfqmtgxkfd.supabase.co
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 1: Create the profiles table
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL,
  full_name   TEXT        NOT NULL DEFAULT '',
  role        TEXT        NOT NULL DEFAULT 'FOUNDER'
                          CHECK (role IN ('FOUNDER','TEAM_MEMBER','MENTOR','INVESTOR','ADMIN')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 2: Enable Row Level Security (RLS) & Prevent Infinite Recursion
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper function with SECURITY DEFINER to check admin role without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'ADMIN'
  );
$$;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Users can view own profile"     ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles"   ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- User can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- User can update their own profile (cannot self-promote to ADMIN)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role != 'ADMIN');

-- User can insert their own profile row on signup
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id AND role != 'ADMIN');

-- Admins can view all profiles (uses is_admin() - no recursion)
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Admins can update any profile (including role changes)
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 3: Auto-create profile row on new user signup
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'FOUNDER'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 4: Auto-update updated_at timestamp
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 5: Role assignment helper function
-- Usage after creating accounts: SELECT set_user_role('admin@bizznova.demo', 'ADMIN');
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_user_role(target_email TEXT, target_role TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_id UUID;
BEGIN
  SELECT id INTO target_id FROM auth.users WHERE email = target_email LIMIT 1;

  IF target_id IS NULL THEN
    RETURN 'ERROR: User ' || target_email || ' not found. Sign up first via the app.';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role)
  SELECT target_id, target_email, COALESCE(raw_user_meta_data->>'full_name', ''), target_role
  FROM auth.users WHERE id = target_id
  ON CONFLICT (id) DO UPDATE SET role = target_role, updated_at = NOW();

  RETURN 'SUCCESS: ' || target_email || ' → ' || target_role;
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 6: After running app Signup for each demo user, run these to set roles:
-- ─────────────────────────────────────────────────────────────────────────────
-- SELECT set_user_role('founder@bizznova.demo',  'FOUNDER');
-- SELECT set_user_role('team@bizznova.demo',      'TEAM_MEMBER');
-- SELECT set_user_role('mentor@bizznova.demo',    'MENTOR');
-- SELECT set_user_role('investor@bizznova.demo',  'INVESTOR');
-- SELECT set_user_role('admin@bizznova.demo',     'ADMIN');

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 7: Verify setup
-- ─────────────────────────────────────────────────────────────────────────────
SELECT 'profiles table' AS check_item, COUNT(*)::TEXT AS value FROM public.profiles
UNION ALL
SELECT 'auth users', COUNT(*)::TEXT FROM auth.users;

SELECT policyname, cmd FROM pg_policies WHERE tablename = 'profiles' ORDER BY policyname;
