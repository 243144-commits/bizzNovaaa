import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import {
  supabase,
  isSupabaseConfigured,
  fetchUserProfile,
  upsertUserProfile,
} from '../services/supabase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isConfigured: boolean;
  isRecoveryMode: boolean;
  setIsRecoveryMode: (val: boolean) => void;
  signUp: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string; message?: string; requiresEmailConfirmation?: boolean }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (
    email: string
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
  updatePassword: (
    newPassword: string
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRecoveryMode, setIsRecoveryMode] = useState<boolean>(false);

  const configured = isSupabaseConfigured();

  // Load and cache user profile
  const loadProfile = useCallback(async (activeUser: User) => {
    if (!configured) return;
    try {
      const existing = await fetchUserProfile(activeUser.id);
      if (existing) {
        setProfile(existing);
      } else {
        // Fallback: create initial profile if trigger did not execute
        const metaName = activeUser.user_metadata?.full_name || activeUser.user_metadata?.name || '';
        const { data } = await upsertUserProfile({
          id: activeUser.id,
          email: activeUser.email,
          full_name: metaName,
          role: 'FOUNDER',
        });
        if (data) setProfile(data);
      }
    } catch (err) {
      console.warn('[AuthContext] Failed to load profile:', err);
    }
  }, [configured]);

  // Initial session restoration and auth state listener
  useEffect(() => {
    // Check if URL hash indicates a password recovery callback
    if (window.location.hash.includes('type=recovery')) {
      setIsRecoveryMode(true);
    }

    if (!configured) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session: initSession }, error }) => {
      if (!mounted) return;
      if (error) {
        console.warn('[AuthContext] getSession error:', error.message);
      }
      setSession(initSession);
      setUser(initSession?.user ?? null);
      if (initSession?.user) {
        loadProfile(initSession.user);
      }
      setIsLoading(false);
    }).catch(() => {
      if (mounted) setIsLoading(false);
    });

    // 2. Subscribe to auth state updates
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;
      console.log(`[Supabase Auth] Event: ${event}`);

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryMode(true);
      }

      if (currentSession?.user) {
        await loadProfile(currentSession.user);
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
      }

      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [configured, loadProfile]);

  // Sign Up method
  const signUp = async (fullName: string, email: string, password: string) => {
    if (!configured) {
      return {
        success: false,
        error: 'Supabase is not configured. Please add your VITE_SUPABASE_ANON_KEY to .env',
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: `${window.location.origin}`,
        },
      });

      if (error) {
        let friendly = error.message;
        if (error.message.toLowerCase().includes('already registered')) {
          friendly = 'This email is already registered. Please sign in or use a different email.';
        } else if (error.message.toLowerCase().includes('password')) {
          friendly = 'Password is too weak. Please use at least 8 characters with numbers and letters.';
        }
        return { success: false, error: friendly };
      }

      const requiresEmailConfirmation = Boolean(data.user && !data.session);

      // Attempt safe client-side profile upsert in case the SQL trigger is pending
      if (data.user) {
        await upsertUserProfile({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName.trim(),
          role: 'FOUNDER',
        });
      }

      return {
        success: true,
        requiresEmailConfirmation,
        message: requiresEmailConfirmation
          ? 'Confirmation email sent! Please check your inbox and verify your email address to log in.'
          : 'Account created and signed in successfully.',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'A network error occurred while connecting to Supabase Auth.',
      };
    }
  };

  // Sign In method
  const signIn = async (email: string, password: string) => {
    if (!configured) {
      return {
        success: false,
        error: 'Supabase is not configured. Please add your VITE_SUPABASE_ANON_KEY to .env',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        let friendly = error.message;
        if (error.message.toLowerCase().includes('invalid login credentials')) {
          friendly = 'Incorrect email or password. Please verify your credentials.';
        } else if (error.message.toLowerCase().includes('email not confirmed')) {
          friendly = 'Please confirm your email address before signing in. Check your inbox for the link.';
        }
        return { success: false, error: friendly };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        await loadProfile(data.user);
      }

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'A network error occurred while signing in.',
      };
    }
  };

  // Sign Out method
  const signOut = async () => {
    if (configured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('[AuthContext] signOut error:', err);
      }
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  // Request Password Reset email
  const requestPasswordReset = async (email: string) => {
    if (!configured) {
      return {
        success: false,
        error: 'Supabase is not configured. Please add your VITE_SUPABASE_ANON_KEY to .env',
      };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/#type=recovery`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        message: 'Password reset link sent! Check your inbox for the recovery email.',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Unable to send password reset email.',
      };
    }
  };

  // Update Password (used after clicking recovery link)
  const updatePassword = async (newPassword: string) => {
    if (!configured) {
      return {
        success: false,
        error: 'Supabase is not configured. Please add your VITE_SUPABASE_ANON_KEY to .env',
      };
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        return { success: false, error: error.message };
      }
      setIsRecoveryMode(false);
      return {
        success: true,
        message: 'Password updated successfully! You can now access your dashboard.',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Failed to update password.',
      };
    }
  };

  // Refresh user profile
  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isConfigured: configured,
        isRecoveryMode,
        setIsRecoveryMode,
        signUp,
        signIn,
        signOut,
        requestPasswordReset,
        updatePassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
