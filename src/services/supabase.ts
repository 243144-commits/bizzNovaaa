import { createClient } from '@supabase/supabase-js';
import { UserProfile } from '../types';

// Default Supabase project URL provided by the project configuration
const DEFAULT_SUPABASE_URL = 'https://txbxrppepxyfqmtgxkfd.supabase.co';

export const SUPABASE_URL = 
  (import.meta.env.VITE_SUPABASE_URL as string)?.trim() || DEFAULT_SUPABASE_URL;

export const SUPABASE_ANON_KEY = 
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string)?.trim() || '';

/**
 * Returns true if the Supabase Anon Key is present and not a dummy placeholder.
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    SUPABASE_ANON_KEY &&
    SUPABASE_ANON_KEY.length > 20 &&
    !SUPABASE_ANON_KEY.includes('your_') &&
    !SUPABASE_ANON_KEY.includes('placeholder')
  );
};

export const getSupabaseConfigStatus = () => ({
  configured: isSupabaseConfigured(),
  url: SUPABASE_URL,
  hasAnonKey: Boolean(SUPABASE_ANON_KEY),
});

// Fallback key used only so createClient does not crash on module load if anon key is not yet provided
const activeAnonKey = isSupabaseConfigured() ? SUPABASE_ANON_KEY : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy';

/**
 * Official Supabase Client with Session Persistence enabled.
 */
export const supabase = createClient(SUPABASE_URL, activeAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});

/**
 * Fetches the user profile from public.profiles
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[Supabase] fetchUserProfile error:', error.message);
      return null;
    }

    return data as UserProfile | null;
  } catch (err) {
    console.warn('[Supabase] Exception fetching profile:', err);
    return null;
  }
}

/**
 * Safely creates or updates a user profile without privilege escalation.
 */
export async function upsertUserProfile(profile: {
  id: string;
  email?: string;
  full_name?: string;
  role?: string;
  avatar_url?: string;
}): Promise<{ data: UserProfile | null; error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: new Error('Supabase is not configured') };
  }

  try {
    // Enforce role safety: standard signups can never insert or self-promote to ADMIN
    const safeRole = profile.role === 'ADMIN' ? 'FOUNDER' : (profile.role || 'FOUNDER');

    const payload = {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name || '',
      role: safeRole,
      avatar_url: profile.avatar_url || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .maybeSingle();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as UserProfile, error: null };
  } catch (err: any) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}
