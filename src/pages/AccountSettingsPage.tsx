import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { supabase } from '../services/supabase';
import {
  User,
  Mail,
  Shield,
  BadgeCheck,
  Save,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Loader2,
  LogOut,
  Camera,
} from 'lucide-react';

const ROLE_COLORS: Record<string, string> = {
  FOUNDER:     'text-cyan-300 bg-cyan-500/15 border-cyan-500/40',
  TEAM_MEMBER: 'text-blue-300 bg-blue-500/15 border-blue-500/40',
  MENTOR:      'text-purple-300 bg-purple-500/15 border-purple-500/40',
  INVESTOR:    'text-emerald-300 bg-emerald-500/15 border-emerald-500/40',
  ADMIN:       'text-rose-300 bg-rose-500/15 border-rose-500/40',
};

export const AccountSettingsPage: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const { addToast, setActiveTab, userRole } = useApp();

  const displayRole = (profile?.role || userRole) as string;
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Founder';
  const displayEmail = user?.email || profile?.email || `${displayRole.toLowerCase()}@bizznova.demo`;
  const initials = displayName.slice(0, 2).toUpperCase();

  // Profile form state
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setProfileSuccess('Profile display name updated (demo session).');
      addToast({ type: 'success', title: 'Profile Updated', message: 'Demo profile updated.' });
      return;
    }

    setProfileSaving(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      // Update Supabase Auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });
      if (authError) throw authError;

      // Update profiles table
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ full_name: fullName, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      if (dbError) throw dbError;

      setProfileSuccess('Profile updated successfully!');
      addToast({ type: 'success', title: 'Profile Updated', message: 'Your display name has been saved.' });
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setPasswordSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      addToast({ type: 'success', title: 'Password Changed', message: 'Your password has been updated.' });
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    addToast({ type: 'info', title: 'Signed Out', message: 'Your session has been terminated.' });
    setActiveTab('login');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center">
          <User className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Account Settings</h1>
          <p className="text-xs text-slate-400 font-mono">Manage your profile, security & session</p>
        </div>
      </div>

      {/* ── Profile Card ─────────────────────────────────────────────── */}
      <div className="futuristic-card rounded-2xl border border-slate-800/80 overflow-hidden">
        {/* Avatar Header */}
        <div className="p-6 bg-gradient-to-r from-cyan-500/5 to-blue-600/5 border-b border-slate-800/60">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/20">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full rounded-2xl object-cover" />
                ) : initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#070b1a] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">{displayName}</div>
              <div className="text-xs text-slate-400 font-mono mb-2">{displayEmail}</div>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono font-semibold ${ROLE_COLORS[displayRole]}`}>
                <BadgeCheck className="w-3.5 h-3.5" />
                {displayRole.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            Personal Information
          </h2>

          {profileError && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {profileError}
            </div>
          )}
          {profileSuccess && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              {profileSuccess}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="glass-input block w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={displayEmail}
                disabled
                className="glass-input block w-full pl-9 pr-3 py-2.5 rounded-xl text-xs text-slate-400 placeholder-slate-500 cursor-not-allowed opacity-60"
              />
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-1">Email cannot be changed here. Contact support if needed.</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              {user?.email_confirmed_at ? (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Email verified
                </span>
              ) : user ? (
                <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-mono">
                  <AlertCircle className="w-3.5 h-3.5" /> Email not verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] text-cyan-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Demo Account Active
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={profileSaving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {profileSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {profileSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* ── Role Info Card ──────────────────────────────────────────────── */}
      <div className="futuristic-card rounded-2xl border border-slate-800/80 p-6">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-purple-400" />
          Role & Permissions
        </h2>
        <div className={`flex items-center gap-3 p-3 rounded-xl border ${ROLE_COLORS[displayRole]}`}>
          <BadgeCheck className="w-5 h-5 shrink-0" />
          <div>
            <div className="font-semibold text-sm">{displayRole.replace('_', ' ')}</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {displayRole === 'ADMIN' && 'Full platform access including administration console'}
              {displayRole === 'FOUNDER' && 'Complete startup workspace & intelligence tools'}
              {displayRole === 'TEAM_MEMBER' && 'Sprint tasks, MVP builder & collaboration tools'}
              {displayRole === 'MENTOR' && 'Advisory tools, analytics & mentorship features'}
              {displayRole === 'INVESTOR' && 'Funding readiness, pitch deck & health metrics'}
            </div>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 font-mono mt-3">
          Roles are assigned by an administrator. Contact your admin to change your role assignment.
        </p>
      </div>

      {/* ── Security Card ──────────────────────────────────────────────── */}
      <div className="futuristic-card rounded-2xl border border-slate-800/80 p-6">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
          <KeyRound className="w-4 h-4 text-amber-400" />
          Change Password
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-3">
          {passwordError && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> {passwordSuccess}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="glass-input block w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className="glass-input block w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={passwordSaving || !newPassword || !confirmPassword}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-40 cursor-pointer"
            >
              {passwordSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
              {passwordSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* ── Danger Zone ─────────────────────────────────────────────────── */}
      <div className="futuristic-card rounded-2xl border border-rose-500/20 p-6">
        <h2 className="text-sm font-semibold text-rose-400 flex items-center gap-2 mb-4">
          <LogOut className="w-4 h-4" />
          Session
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-300 font-semibold">Sign out of BizzNova</div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">Terminate your current Supabase session</div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-semibold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
