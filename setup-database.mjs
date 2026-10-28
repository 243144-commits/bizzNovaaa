// =============================================================================
// BizzNova — Supabase Database Setup Script
// Run with: node setup-database.mjs
// Needs: SUPABASE_SERVICE_ROLE_KEY environment variable
// =============================================================================

const PROJECT_URL = 'https://txbxrppepxyfqmtgxkfd.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  console.error('\n❌ ERROR: SUPABASE_SERVICE_ROLE_KEY not set!');
  console.error('\nGet it from: Supabase Dashboard → Project Settings → API → service_role key');
  console.error('\nRun as: SUPABASE_SERVICE_ROLE_KEY=your_key node setup-database.mjs\n');
  process.exit(1);
}

const SQL = `
-- STEP 1: profiles table
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

-- STEP 2: RLS & Prevent Infinite Recursion
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE
AS \$\$ SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'); \$\$;

DROP POLICY IF EXISTS "Users can view own profile"     ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles"   ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id AND role != 'ADMIN');
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id AND role != 'ADMIN');
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.is_admin());

-- STEP 3: Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS \$\$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, COALESCE(NEW.email,''), COALESCE(NEW.raw_user_meta_data->>'full_name',''), 'FOUNDER')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
\$\$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- STEP 4: updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql
AS \$\$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; \$\$;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- STEP 5: Role helper
CREATE OR REPLACE FUNCTION public.set_user_role(target_email TEXT, target_role TEXT)
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS \$\$
DECLARE target_id UUID;
BEGIN
  SELECT id INTO target_id FROM auth.users WHERE email = target_email LIMIT 1;
  IF target_id IS NULL THEN RETURN 'ERROR: ' || target_email || ' not found'; END IF;
  INSERT INTO public.profiles (id, email, full_name, role)
  SELECT target_id, target_email, COALESCE(raw_user_meta_data->>'full_name',''), target_role
  FROM auth.users WHERE id = target_id
  ON CONFLICT (id) DO UPDATE SET role = target_role, updated_at = NOW();
  RETURN 'SUCCESS: ' || target_email || ' → ' || target_role;
END;
\$\$;

SELECT 'BizzNova database setup complete!' AS status;
`;

async function runSQL(sql, description) {
  console.log(`\n⏳ Running: ${description}...`);
  const res = await fetch(`${PROJECT_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'apikey': SERVICE_KEY,
    },
    body: JSON.stringify({ query: sql }),
  });

  // Use the Postgres endpoint directly
  const pgRes = await fetch(`${PROJECT_URL}/pg/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'apikey': SERVICE_KEY,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (pgRes.ok) {
    const data = await pgRes.json();
    console.log(`✅ ${description} — Done`, data?.rows?.[0] || '');
    return true;
  } else {
    const err = await pgRes.text();
    console.error(`❌ Error: ${err}`);
    return false;
  }
}

await runSQL(SQL, 'Full BizzNova database setup');
console.log('\n✅ Database setup complete! Now run the app and sign up.\n');
