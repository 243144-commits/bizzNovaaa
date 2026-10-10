import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { checkSystemStatus } from '../../services/api';
import {
  Menu,
  Plus,
  ChevronDown,
  Building2,
  Shield,
  Sparkles,
  Zap,
  Globe,
  LayoutDashboard,
} from 'lucide-react';

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

  const [isStartupDropdownOpen, setIsStartupDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any>(null);

  useEffect(() => {
    checkSystemStatus().then(setSystemStatus);
  }, []);

  const roles: Array<{ id: UserRole; label: string; desc: string }> = [
    { id: 'FOUNDER', label: 'Founder', desc: 'Full venture workspace & intelligence control' },
    { id: 'TEAM_MEMBER', label: 'Team Member', desc: 'Sprint execution, tasks & product roadmaps' },
    { id: 'MENTOR', label: 'Mentor', desc: 'Advisory review, feedback & strategic guidance' },
    { id: 'INVESTOR', label: 'Investor', desc: 'Readiness evaluation, metrics & pitch reviews' },
    { id: 'ADMIN', label: 'Administrator', desc: 'Platform oversight & workspace diagnostics' },
  ];

  const stageBadgeColors: Record<string, string> = {
    IDEA: 'text-amber-300 border-amber-500/40 bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.15)]',
    VALIDATION: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_10px_rgba(6,182,212,0.15)]',
    MVP: 'text-blue-300 border-blue-500/40 bg-blue-500/10 shadow-[0_0_10px_rgba(59,130,246,0.15)]',
    EARLY_TRACTION: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.15)]',
    GROWTH: 'text-purple-300 border-purple-500/40 bg-purple-500/10 shadow-[0_0_10px_rgba(168,85,247,0.15)]',
    SCALE: 'text-rose-300 border-rose-500/40 bg-rose-500/10 shadow-[0_0_10px_rgba(244,63,94,0.15)]',
  };

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

        {/* Startup Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsStartupDropdownOpen(!isStartupDropdownOpen);
              setIsRoleDropdownOpen(false);
            }}
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
                    onClick={() => {
                      setActiveStartupId(s.id);
                      setIsStartupDropdownOpen(false);
                      addToast({
                        type: 'info',
                        title: 'Switched Active Startup',
                        message: `Now viewing ${s.name}`,
                      });
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                      s.id === activeStartupId
                        ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-semibold text-white truncate">{s.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{s.tagline}</div>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 shrink-0 ml-2">
                      {s.stage}
                    </span>
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    setIsStartupDropdownOpen(false);
                    openStartupModal();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold transition-all shadow-[0_0_12px_rgba(56,189,248,0.3)] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Startup</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Current Stage Badge with Neon Glow */}
        {activeStartup && (
          <div
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono border ${
              stageBadgeColors[activeStartup.stage] || 'text-slate-300 border-slate-700 bg-slate-800'
            }`}
          >
            <span className="text-slate-400">Stage:</span>
            <span className="font-bold">{activeStartup.stage}</span>
          </div>
        )}
      </div>

      {/* Right: Landing View Toggle, Engine Status, Role Switcher, Create Button */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Toggle between Landing Experience & Dashboard */}
        <button
          onClick={() => setActiveTab(activeTab === 'landing' ? 'dashboard' : 'landing')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer border ${
            activeTab === 'landing'
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
              : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
          title="Toggle between Cinematic Landing View and Command OS"
        >
          {activeTab === 'landing' ? (
            <>
              <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Go to Command OS</span>
            </>
          ) : (
            <>
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Cinematic Landing</span>
            </>
          )}
        </button>

        {/* System Engine Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-[11px] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
          <span className="text-cyan-300 font-mono text-[10px]">
            {systemStatus?.hasApiKey ? 'Gemini 3.8 Flash' : 'AI Engine Online'}
          </span>
        </div>

        {/* Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsRoleDropdownOpen(!isRoleDropdownOpen);
              setIsStartupDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-purple-500/25 text-xs font-medium text-slate-300 transition-colors shadow-sm cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-mono text-[11px] text-purple-200">{userRole}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 rounded-2xl bg-[#070b1a]/95 border border-purple-500/30 shadow-2xl backdrop-blur-xl p-2 z-50">
              <div className="text-[10px] font-mono text-purple-400 px-2 py-1 uppercase tracking-wider">
                Switch Perspective
              </div>
              <div className="space-y-1 my-1">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setUserRole(r.id);
                      setIsRoleDropdownOpen(false);
                      addToast({
                        type: 'info',
                        title: `Role Switched to ${r.label}`,
                        message: r.desc,
                      });
                    }}
                    className={`w-full text-left p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                      userRole === r.id
                        ? 'bg-purple-600/20 text-purple-200 border border-purple-500/40'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="font-semibold text-white">{r.label}</div>
                    <div className="text-[10px] text-slate-400">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick New Startup Button */}
        <button
          onClick={() => openStartupModal()}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Startup</span>
        </button>
      </div>
    </header>
  );
};
