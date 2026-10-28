import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { checkSystemStatus } from '../../services/api';
import {
  Menu,
  Plus,
  ChevronDown,
  Building2,
  Shield,
  Globe,
  LayoutDashboard,
  LogOut,
  User,
  Settings,
  Mail,
  BadgeCheck,
  ChevronRight,
  Sparkles,
  Camera,
  Lock,
} from 'lucide-react';

// ── Account Dropdown ──────────────────────────────────────────────────────────
interface AccountDropdownProps {
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

const ROLE_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  FOUNDER:     { text: 'text-cyan-300',    bg: 'bg-cyan-500/15',    border: 'border-cyan-500/40' },
  TEAM_MEMBER: { text: 'text-blue-300',    bg: 'bg-blue-500/15',    border: 'border-blue-500/40' },
  MENTOR:      { text: 'text-purple-300',  bg: 'bg-purple-500/15',  border: 'border-purple-500/40' },
  INVESTOR:    { text: 'text-emerald-300', bg: 'bg-emerald-500/15', border: 'border-emerald-500/40' },
  ADMIN:       { text: 'text-rose-300',    bg: 'bg-rose-500/15',    border: 'border-rose-500/40' },
};

const AccountDropdown: React.FC<AccountDropdownProps> = ({ onClose, onNavigate }) => {
  const { user, profile, signOut } = useAuth();
  const { addToast, userRole } = useApp();

  const displayRole = (profile?.role || userRole) as string;
  const roleColor = ROLE_COLORS[displayRole] || ROLE_COLORS.FOUNDER;
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Founder';
  const displayEmail = user?.email || profile?.email || `${displayRole.toLowerCase()}@bizznova.demo`;
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    onClose();
    await signOut();
    addToast({ type: 'info', title: 'Signed Out', message: 'Session terminated successfully.' });
    onNavigate('login');
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-72 rounded-2xl bg-[#060a18]/98 border border-slate-700/60 shadow-2xl backdrop-blur-2xl z-50 overflow-hidden">
      {/* Profile Header */}
      <div className="p-4 bg-gradient-to-b from-slate-800/60 to-transparent border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-cyan-500/20">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full rounded-xl object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#060a18] shadow-sm" title="Online" />
          </div>

          {/* Name & Email */}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white text-sm truncate leading-snug">{displayName}</div>
            <div className="text-[11px] text-slate-400 font-mono truncate leading-snug">{displayEmail}</div>
          </div>
        </div>

        {/* Role badge */}
        <div className={`mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono font-semibold ${roleColor.text} ${roleColor.bg} ${roleColor.border}`}>
          <BadgeCheck className="w-3.5 h-3.5" />
          {displayRole.replace('_', ' ')}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-px bg-slate-800/40 border-b border-slate-800/60">
        <div className="bg-[#060a18]/80 px-4 py-2.5 text-center">
          <div className="text-white font-bold text-sm">Active</div>
          <div className="text-[10px] text-slate-400 font-mono">Session</div>
        </div>
        <div className="bg-[#060a18]/80 px-4 py-2.5 text-center">
          <div className={`font-bold text-sm ${roleColor.text}`}>{displayRole === 'ADMIN' ? 'All' : 'Role'}</div>
          <div className="text-[10px] text-slate-400 font-mono">Access</div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-2 space-y-0.5">
        <button
          onClick={() => { onNavigate('account-settings'); onClose(); }}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800/70 text-slate-300 hover:text-white transition-colors text-sm group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center group-hover:border-cyan-500/40 transition-colors">
              <User className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <span className="font-medium text-xs">My Account</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
        </button>

        <button
          onClick={() => { onNavigate('account-settings'); onClose(); }}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800/70 text-slate-300 hover:text-white transition-colors text-sm group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center group-hover:border-purple-500/40 transition-colors">
              <Settings className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <span className="font-medium text-xs">Settings</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
        </button>

        {displayRole === 'ADMIN' && (
          <button
            onClick={() => { onNavigate('admin'); onClose(); }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-rose-500/10 text-slate-300 hover:text-rose-200 transition-colors text-sm group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center group-hover:border-rose-500/40 transition-colors">
                <Lock className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <span className="font-medium text-xs">Admin Console</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-400" />
          </button>
        )}
      </div>

      {/* Email verified status */}
      <div className="mx-3 mb-2 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-center gap-2">
        <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span className="text-[10px] font-mono text-slate-400 truncate flex-1">{displayEmail}</span>
        {user ? (
          user.email_confirmed_at ? (
            <span className="text-[9px] text-emerald-400 font-mono font-semibold shrink-0">✓ Verified</span>
          ) : (
            <span className="text-[9px] text-amber-400 font-mono font-semibold shrink-0">Unverified</span>
          )
        ) : (
          <span className="text-[9px] text-cyan-400 font-mono font-semibold shrink-0">Demo Mode</span>
        )}
      </div>

      {/* Sign Out */}
      <div className="p-2 pt-0 border-t border-slate-800/60 mt-1">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-rose-500/8 hover:bg-rose-500/15 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 hover:text-rose-300 transition-all text-xs font-semibold cursor-pointer group"
        >
          <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

// ── Main Header ───────────────────────────────────────────────────────────────
export const Header: React.FC<{ onToggleMobileMenu: () => void }> = ({ onToggleMobileMenu }) => {
  const {
    startups,
    activeStartupId,
    setActiveStartupId,
    activeStartup,
    userRole,
    setUserRole,
    openStartupModal,
    addToast,
    activeTab,
    setActiveTab,
  } = useApp();

  const { user, profile, signOut } = useAuth();

  const [isStartupDropdownOpen, setIsStartupDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any>(null);

  const accountRef = useRef<HTMLDivElement>(null);
  const startupRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkSystemStatus().then(setSystemStatus);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
      if (startupRef.current && !startupRef.current.contains(e.target as Node)) {
        setIsStartupDropdownOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const roles: Array<{ id: UserRole; label: string; desc: string; color: string }> = [
    { id: 'FOUNDER',     label: 'Founder',       desc: 'Full venture workspace & intelligence', color: 'text-cyan-300' },
    { id: 'TEAM_MEMBER', label: 'Team Member',    desc: 'Sprint execution, tasks & roadmaps',    color: 'text-blue-300' },
    { id: 'MENTOR',      label: 'Mentor',         desc: 'Advisory review & strategic guidance',  color: 'text-purple-300' },
    { id: 'INVESTOR',    label: 'Investor',       desc: 'Readiness evaluation & pitch reviews',  color: 'text-emerald-300' },
    { id: 'ADMIN',       label: 'Administrator',  desc: 'Platform oversight & diagnostics',      color: 'text-rose-300' },
  ];

  const stageBadgeColors: Record<string, string> = {
    IDEA:          'text-amber-300 border-amber-500/40 bg-amber-500/10',
    VALIDATION:    'text-cyan-300 border-cyan-500/40 bg-cyan-500/10',
    MVP:           'text-blue-300 border-blue-500/40 bg-blue-500/10',
    EARLY_TRACTION:'text-emerald-300 border-emerald-500/40 bg-emerald-500/10',
    GROWTH:        'text-purple-300 border-purple-500/40 bg-purple-500/10',
    SCALE:         'text-rose-300 border-rose-500/40 bg-rose-500/10',
  };

  const displayRole = (profile?.role || userRole) as string;
  const roleColor = ROLE_COLORS[displayRole] || ROLE_COLORS.FOUNDER;
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Founder';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-16 futuristic-glass-header px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Active Startup Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5 text-cyan-400" />
        </button>

        {/* Startup Selector */}
        <div className="relative" ref={startupRef}>
          <button
            onClick={() => { setIsStartupDropdownOpen(!isStartupDropdownOpen); setIsRoleDropdownOpen(false); setIsAccountDropdownOpen(false); }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-cyan-500/25 text-left transition-all shadow-[0_0_15px_rgba(56,189,248,0.1)] cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-[0_0_8px_rgba(56,189,248,0.5)]">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <div className="max-w-[130px] sm:max-w-[190px]">
              <span className="text-xs font-semibold text-white block truncate leading-none mb-0.5">
                {activeStartup?.name || 'Select Startup'}
              </span>
              <span className="text-[10px] text-cyan-300/80 block truncate leading-none font-mono">
                {activeStartup?.industry || 'Startup Workspace'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          </button>

          {isStartupDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl bg-[#070b1a]/95 border border-cyan-500/30 shadow-2xl backdrop-blur-xl p-2.5 z-50">
              <div className="text-[10px] font-mono text-cyan-400 px-2 py-1 uppercase tracking-wider flex items-center justify-between">
                <span>Venture Workspaces</span>
                <span className="text-slate-500">{startups.length} active</span>
              </div>
              <div className="space-y-1 my-1 max-h-56 overflow-y-auto">
                {startups.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setActiveStartupId(s.id); setIsStartupDropdownOpen(false); addToast({ type: 'info', title: 'Switched Active Startup', message: `Now viewing ${s.name}` }); }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs text-left transition-colors cursor-pointer ${s.id === activeStartupId ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40' : 'text-slate-300 hover:bg-slate-800/60'}`}
                  >
                    <div className="truncate">
                      <div className="font-semibold text-white truncate">{s.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{s.tagline}</div>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 shrink-0 ml-2">{s.stage}</span>
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => { setIsStartupDropdownOpen(false); openStartupModal(); }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold transition-all shadow-[0_0_12px_rgba(56,189,248,0.3)] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Startup</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stage Badge */}
        {activeStartup && (
          <div className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono border ${stageBadgeColors[activeStartup.stage] || 'text-slate-300 border-slate-700 bg-slate-800'}`}>
            <span className="text-slate-400">Stage:</span>
            <span className="font-bold">{activeStartup.stage}</span>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Landing / Dashboard toggle */}
        <button
          onClick={() => setActiveTab(activeTab === 'landing' ? 'dashboard' : 'landing')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer border ${activeTab === 'landing' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'}`}
        >
          {activeTab === 'landing' ? (
            <><LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" /><span className="hidden sm:inline">Command OS</span></>
          ) : (
            <><Globe className="w-3.5 h-3.5 text-cyan-400" /><span className="hidden sm:inline">Cinematic</span></>
          )}
        </button>

        {/* AI Engine Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
          <span className="text-cyan-300 font-mono text-[10px]">
            {systemStatus?.hasApiKey ? 'Gemini Flash' : 'AI Online'}
          </span>
        </div>

        {/* Role Switcher */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => { setIsRoleDropdownOpen(!isRoleDropdownOpen); setIsStartupDropdownOpen(false); setIsAccountDropdownOpen(false); }}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-colors shadow-sm cursor-pointer ${roleColor.bg} ${roleColor.border} ${roleColor.text}`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">{displayRole.replace('_', ' ')}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 rounded-2xl bg-[#070b1a]/95 border border-slate-700/60 shadow-2xl backdrop-blur-xl p-2 z-50">
              <div className="text-[10px] font-mono text-slate-400 px-2 py-1 uppercase tracking-wider mb-1">
                Switch Perspective
              </div>
              <div className="space-y-0.5">
                {roles
                  .filter((r) => r.id !== 'ADMIN' || profile?.role === 'ADMIN' || userRole === 'ADMIN')
                  .map((r) => (
                    <button
                      key={r.id}
                      onClick={() => { setUserRole(r.id); setIsRoleDropdownOpen(false); addToast({ type: 'info', title: `Perspective: ${r.label}`, message: r.desc }); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-between group ${displayRole === r.id ? `${ROLE_COLORS[r.id]?.bg} ${ROLE_COLORS[r.id]?.border} border` : 'hover:bg-slate-800/60'}`}
                    >
                      <div>
                        <div className={`font-semibold ${r.color}`}>{r.label}</div>
                        <div className="text-[10px] text-slate-400">{r.desc}</div>
                      </div>
                      {displayRole === r.id && <Sparkles className={`w-3.5 h-3.5 ${r.color} shrink-0`} />}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Account Dropdown / Auth buttons */}
        {user ? (
          <div className="relative" ref={accountRef}>
            <button
              id="header-account-btn"
              onClick={() => { setIsAccountDropdownOpen(!isAccountDropdownOpen); setIsRoleDropdownOpen(false); setIsStartupDropdownOpen(false); }}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/60 hover:border-cyan-500/30 transition-all cursor-pointer group"
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-[11px] shadow-md">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full rounded-lg object-cover" />
                  ) : initials}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#070b1a]" />
              </div>
              {/* Name */}
              <div className="hidden sm:block text-left max-w-[90px]">
                <div className="text-xs font-semibold text-white truncate leading-none">{displayName}</div>
                <div className={`text-[9px] font-mono truncate leading-none mt-0.5 ${roleColor.text}`}>
                  {displayRole.replace('_', ' ')}
                </div>
              </div>
              <ChevronDown className={`w-3 h-3 text-slate-400 shrink-0 transition-transform ${isAccountDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isAccountDropdownOpen && (
              <AccountDropdown
                onClose={() => setIsAccountDropdownOpen(false)}
                onNavigate={setActiveTab}
              />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('login')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800 transition-colors cursor-pointer"
            >
              Log In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_12px_rgba(56,189,248,0.25)] transition-all cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Quick New Startup */}
        <button
          onClick={() => openStartupModal()}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Startup</span>
        </button>
      </div>
    </header>
  );
};
