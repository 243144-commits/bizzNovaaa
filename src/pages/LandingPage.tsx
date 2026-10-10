import React from 'react';
import { useApp } from '../context/AppContext';
import { GlowingIntelligenceCore } from '../components/3d/GlowingIntelligenceCore';
import {
  Lightbulb,
  Target,
  Calculator,
  Hammer,
  TrendingUp,
  Coins,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Activity,
  Layers,
  ChevronRight,
  Play,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveTab, openStartupModal, activeStartup } = useApp();

  const handleStartBuilding = () => {
    setActiveTab('dashboard');
  };

  const handleExplore = () => {
    setActiveTab('idea-analyzer');
  };

  const capabilityHighlights = [
    {
      icon: Lightbulb,
      title: 'AI Idea Validation Engine',
      desc: '9-factor algorithmic analysis testing problem urgency, competitive intensity, and defensibility.',
      color: 'text-cyan-400',
      border: 'border-cyan-500/20',
      tab: 'idea-analyzer',
    },
    {
      icon: Target,
      title: 'Competitor Intelligence Matrix',
      desc: 'Benchmark pricing whitespace, feature vulnerabilities, and unserved niches in real time.',
      color: 'text-purple-400',
      border: 'border-purple-500/20',
      tab: 'competitors',
    },
    {
      icon: Calculator,
      title: 'Deterministic Revenue Simulator',
      desc: 'Mathematical financial projections with zero-division safeguards, CAC/LTV, and break-even calculations.',
      color: 'text-emerald-400',
      border: 'border-emerald-500/20',
      tab: 'business-model',
    },
    {
      icon: Hammer,
      title: 'MVP & 5-Phase Product Roadmap',
      desc: 'Disciplined MoSCoW scoping with explicit Avoid Initially guards to prevent premature capital burn.',
      color: 'text-blue-400',
      border: 'border-blue-500/20',
      tab: 'mvp-builder',
    },
    {
      icon: TrendingUp,
      title: 'Turnaround Failure Diagnosis',
      desc: 'Root-cause diagnosis for stalled acquisition or retention with concrete corrective experiments.',
      color: 'text-amber-400',
      border: 'border-amber-500/20',
      tab: 'growth-analytics',
    },
    {
      icon: Coins,
      title: 'Investor Audit & 12-Slide Pitch Deck',
      desc: 'Institutional due diligence scoring, capital use budgeting, and one-click exportable pitch decks.',
      color: 'text-rose-400',
      border: 'border-rose-500/20',
      tab: 'funding-readiness',
    },
  ];

  return (
    <div className="space-y-16 py-4">
      {/* HERO SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left Hero Narrative */}
        <div className="lg:w-1/2 space-y-6 z-10 text-center lg:text-left">
          {/* Futuristic Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>BIZNOVA AI FOUNDER OPERATING SYSTEM</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            From Idea to{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(56,189,248,0.4)]">
              Impact.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
            Your AI-powered co-founder to validate ideas, build products, find opportunities, and scale your startup with mathematical discipline and transparent intelligence.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={handleStartBuilding}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-sm font-semibold shadow-[0_0_25px_rgba(56,189,248,0.4)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Start Building</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleExplore}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl futuristic-card hover:bg-slate-900/90 text-slate-200 text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer border-cyan-500/20"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Explore BizNova</span>
            </button>
          </div>

          {/* Live System Signal Ticker */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Gemini 3.8 Flash Core</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>Deterministic Invariants</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Bento Glass Architecture</span>
            </div>
          </div>
        </div>

        {/* Right 3D Futuristic Glowing Intelligence Core */}
        <div className="lg:w-1/2 flex items-center justify-center z-10 w-full">
          <GlowingIntelligenceCore
            onExploreClick={handleExplore}
            onStartClick={handleStartBuilding}
          />
        </div>
      </section>

      {/* PLATFORM CAPABILITIES SECTION */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            ENTERPRISE STARTUP SUITE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            An Operating System Built for Founders Who Ship
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Replace fragmented spreadsheets, chat threads, and guessing with a unified command center.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilityHighlights.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                onClick={() => setActiveTab(cap.tab)}
                className="futuristic-card p-5 rounded-2xl cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                    <Icon className={`w-5 h-5 ${cap.color}`} />
                  </div>
                  <h3 className="font-bold text-sm text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{cap.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-cyan-300">
                  <span>Launch Module</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="rounded-3xl p-8 sm:p-10 futuristic-card-glow-violet relative overflow-hidden border border-purple-500/30 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-purple-300">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span>INSTANT VENTURE INITIALIZATION</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Ready to Validate and Launch Your Startup?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Initialize your startup specification, run 9-factor idea analysis, and model your financial path to break-even today.
          </p>
        </div>

        <button
          onClick={() => openStartupModal()}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-[0_0_25px_rgba(168,85,247,0.4)] shrink-0 transition-all cursor-pointer"
        >
          Create New Startup Profile
        </button>
      </section>
    </div>
  );
};
