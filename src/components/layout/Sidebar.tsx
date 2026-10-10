import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Building2,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  Users2,
  Radar,
  Calculator,
  Hammer,
  ListTodo,
  TrendingUp,
  Activity,
  AlertTriangle,
  Coins,
  Presentation,
  Compass,
  UserCheck,
  Trophy,
  Scale,
  ShieldCheck,
  ChevronRight,
  Globe,
  Zap,
} from 'lucide-react';

interface NavSection {
  title: string;
  items: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    adminOnly?: boolean;
  }>;
}

export const Sidebar: React.FC<{ isOpenMobile: boolean; onCloseMobile: () => void }> = ({
  isOpenMobile,
  onCloseMobile,
}) => {
  const { activeTab, setActiveTab, userRole, activeStartup } = useApp();

  const navSections: NavSection[] = [
    {
      title: 'COMMAND OVERVIEW',
      items: [
        { id: 'landing', label: 'Cinematic Landing', icon: Globe, badge: 'New' },
        { id: 'dashboard', label: 'Founder Dashboard', icon: LayoutDashboard },
        { id: 'my-startup', label: 'Venture Profile', icon: Building2 },
        { id: 'ai-insights', label: 'AI Intelligence Feed', icon: Sparkles, badge: 'Live' },
      ],
    },
    {
      title: 'VALIDATE & RESEARCH',
      items: [
        { id: 'idea-analyzer', label: 'Idea Analyzer', icon: Lightbulb, badge: 'Core' },
        { id: 'market-validation', label: 'Market Validation', icon: CheckCircle2 },
        { id: 'competitors', label: 'Competitor Intelligence', icon: Users2 },
        { id: 'customer-personas', label: 'Customer Personas', icon: Users2 },
        { id: 'opportunity-radar', label: 'Opportunity & Risk Radar', icon: Radar },
      ],
    },
    {
      title: 'BUILD & EXECUTE',
      items: [
        { id: 'business-model', label: 'Revenue Simulator', icon: Calculator },
        { id: 'mvp-builder', label: 'MVP Builder & Roadmap', icon: Hammer },
        { id: 'tasks', label: 'Sprint Tasks & Milestones', icon: ListTodo },
      ],
    },
    {
      title: 'GROW & DIAGNOSE',
      items: [
        { id: 'growth-analytics', label: 'Growth Analytics', icon: TrendingUp },
        { id: 'startup-health', label: 'Startup Health Engine', icon: Activity },
        { id: 'failure-diagnosis', label: 'Failure Diagnosis', icon: AlertTriangle },
      ],
    },
    {
      title: 'CAPITAL & FUNDING',
      items: [
        { id: 'funding-readiness', label: 'Funding Readiness', icon: Coins },
        { id: 'pitch-deck', label: 'Pitch Deck Assistant', icon: Presentation, badge: '12 Slides' },
      ],
    },
    {
      title: 'NETWORK & TALENT',
      items: [
        { id: 'find-mentors', label: 'Find Mentors', icon: Compass },
        { id: 'team-matching', label: 'Team Matching', icon: UserCheck },
        { id: 'competitions', label: 'Competitions & Grants', icon: Trophy },
      ],
    },
    {
      title: 'GOVERNANCE',
      items: [
        { id: 'legal-guidance', label: 'Legal Guidance', icon: Scale },
      ],
    },
    {
      title: 'SYSTEM ADMIN',
      items: [
        { id: 'admin', label: 'Administration Console', icon: ShieldCheck, adminOnly: true },
      ],
    },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Persistent Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 flex flex-col bg-[#040714] border-r border-cyan-500/15 transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-0 max-lg:-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-cyan-500/15 bg-[#05091c]/80">
          <div
            onClick={() => handleSelectTab('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Glowing Logo Icon */}
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.5)] text-white font-bold text-sm tracking-wider">
              <span className="relative z-10">BN</span>
              <div className="absolute inset-0 rounded-xl bg-cyan-400 opacity-0 group-hover:opacity-40 blur-[4px] transition-opacity" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block leading-none">
                BizNova
              </span>
              <span className="text-[10px] text-cyan-400 tracking-widest uppercase block font-mono mt-0.5">
                AI Founder OS
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Nav Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section) => {
            const visibleItems = section.items.filter((item) => {
              if (item.adminOnly && userRole !== 'ADMIN') return false;
              return true;
            });

            if (visibleItems.length === 0) return null;

            return (
              <div key={section.title} className="space-y-1">
                <div className="px-3 pb-1 text-[10px] font-semibold text-cyan-400/80 tracking-wider font-mono uppercase">
                  {section.title}
                </div>
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                        isActive
                          ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/35 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/60 hover:border-slate-800 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive
                              ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]'
                              : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
                            {item.badge}
                          </span>
                        )}
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Bottom Workspace Status */}
        <div className="p-3 border-t border-cyan-500/15 bg-[#05091c]/80 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 shadow-sm">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-400">System Core</span>
              <span className="text-cyan-300 font-semibold font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>ONLINE</span>
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate font-mono">
              Role: <span className="text-purple-300 font-bold">{userRole}</span> · {activeStartup.name}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
