import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { calculateStartupHealth, calculateMarketOpportunityScore } from '../services/scoring';
import {
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Coins,
  Hammer,
  ListTodo,
  Users,
  ArrowUpRight,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  Zap,
  Radio,
  Flame,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const {
    activeStartup,
    setActiveTab,
    tasks,
    milestones,
    competitors,
    validationItems,
    openStartupModal,
  } = useApp();

  const health = useMemo(() => calculateStartupHealth(activeStartup), [activeStartup]);
  const opportunity = useMemo(() => calculateMarketOpportunityScore(activeStartup), [activeStartup]);

  const openTasks = tasks.filter((t) => t.status !== 'COMPLETED');
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED');
  const completedMilestones = milestones.filter((m) => m.achieved);

  const revenueData = activeStartup.metrics.historicalRevenue || [];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Futuristic System Banner */}
      <div className="relative rounded-2xl futuristic-card p-6 border-cyan-500/25 overflow-hidden">
        {/* Subtle background energy glow */}
        <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-bl from-cyan-500/10 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono mb-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shadow-[0_0_8px_#38bdf8]" />
              <span>COMMAND CORE ONLINE</span>
              <span>·</span>
              <span className="text-purple-300">{activeStartup.stage} STAGE</span>
              <span>·</span>
              <span className="text-slate-400">NEURAL TELEMETRY SYNCHRONIZED</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Welcome back, Founder</span>
              <span className="text-cyan-400 text-lg font-mono">· {activeStartup.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 line-clamp-1">
              {activeStartup.tagline}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => openStartupModal(activeStartup)}
              className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-cyan-500/40 text-slate-200 text-xs font-medium transition-all cursor-pointer"
            >
              Edit Venture Specs
            </button>
            <button
              onClick={() => setActiveTab('idea-analyzer')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(56,189,248,0.35)] transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Run Deep Analysis</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout with Floating 3D Depth */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        {/* A. VENTURE IDENTITY CARD (Span 4) */}
        <div className="lg:col-span-4 rounded-2xl futuristic-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>A. Venture Identity</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {activeStartup.productStatus}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[11px] text-slate-400">One-Line Thesis</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-100 mt-0.5 leading-snug">
                  {activeStartup.oneLineIdea}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-mono">INDUSTRY</span>
                  <span className="font-semibold text-white truncate block">
                    {activeStartup.industry}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-mono">TEAM CORE</span>
                  <span className="font-semibold text-white block">
                    {activeStartup.teamSize} member{activeStartup.teamSize > 1 ? 's' : ''}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-mono">TARGET MARKET</span>
                  <span className="font-semibold text-white truncate block">
                    {activeStartup.location || 'Global'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-mono">CAPITAL RAISED</span>
                  <span className="font-semibold text-emerald-400 font-mono block">
                    ${activeStartup.currentFunding.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3.5 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="truncate">Model: {activeStartup.businessModel}</span>
            <button
              onClick={() => setActiveTab('my-startup')}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium shrink-0 ml-2 cursor-pointer"
            >
              <span>Inspect</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* B. STARTUP HEALTH ENGINE (Span 4) */}
        <div className="lg:col-span-4 rounded-2xl futuristic-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-purple-400" />
                <span>B. Health Engine</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">6 Pillars Weighted</span>
            </div>

            <div className="flex items-baseline gap-3 mb-3">
              <div className="text-4xl font-extrabold text-white font-mono drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                {health.overallHealth}
              </div>
              <div className="text-xs text-slate-400">
                / 100 <span className="text-emerald-400 font-medium">Composite Index</span>
              </div>
            </div>

            {/* Health Factor Mini Bars */}
            <div className="space-y-2 mb-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Strongest Area</span>
                <span className="text-emerald-400 font-semibold">{health.strongestArea}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Weakest Area</span>
                <span className="text-amber-400 font-semibold">{health.weakestArea}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
              <div className="text-[10px] font-mono text-purple-300 uppercase mb-0.5">
                Prescribed Turnaround
              </div>
              <p className="line-clamp-2 text-[11px] leading-relaxed">{health.recommendedActions[0]}</p>
            </div>
          </div>

          <div className="pt-3.5 mt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Validation (20%) · Traction (20%)</span>
            <button
              onClick={() => setActiveTab('startup-health')}
              className="text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>Diagnostic</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* C. OPPORTUNITY & VALIDATION RADAR (Span 4) */}
        <div className="lg:col-span-4 rounded-2xl futuristic-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>C & D. Opportunity Radar</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Live Radar
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">Opportunity Index</div>
                <div className="text-2xl font-bold text-white font-mono mt-1">
                  {opportunity.overallScore}
                  <span className="text-xs text-slate-500 font-normal">/100</span>
                </div>
                <div className="text-[10px] text-cyan-300 mt-0.5 truncate">
                  {opportunity.isProvisional ? 'Provisional' : 'Verified'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">Competitors Mapped</div>
                <div className="text-2xl font-bold text-white font-mono mt-1">
                  {competitors.length}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Benchmark items</div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Leading Assumption</div>
              <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed">
                {validationItems[0]?.statement || 'Initial customer discovery and alternative workarounds recorded.'}
              </p>
            </div>
          </div>

          <div className="pt-3.5 mt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">{validationItems.length} findings logged</span>
            <button
              onClick={() => setActiveTab('market-validation')}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>Evidence Log</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* E & I. GROWTH & REVENUE TRAJECTORY WITH GLOWING CHARTS (Span 8) */}
        <div className="lg:col-span-8 rounded-2xl futuristic-card p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>I. Growth & Revenue Trajectory</span>
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
                  {revenueData.length > 0 ? 'DEMO DATA' : 'EMPTY STATE'}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Monthly recurring revenue and customer cohort trajectory
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <div>
                <span className="text-slate-400">MRR: </span>
                <span className="font-bold text-emerald-400">
                  ${activeStartup.metrics.monthlyRevenue.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Paying: </span>
                <span className="font-bold text-white">
                  {activeStartup.metrics.payingCustomers}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Runway: </span>
                <span className="font-bold text-cyan-300">
                  {activeStartup.metrics.cashRunwayMonths} mo
                </span>
              </div>
            </div>
          </div>

          {revenueData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="neonRevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="neonExpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#c084fc" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#070b1a',
                      borderColor: 'rgba(56,189,248,0.3)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      boxShadow: '0 0 20px rgba(56,189,248,0.2)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#38bdf8"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#neonRevGrad)"
                    name="Revenue ($)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#c084fc"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#neonExpGrad)"
                    name="Expenses ($)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl text-center p-6">
              <Activity className="w-8 h-8 text-slate-600 mb-2" />
              <div className="text-sm font-semibold text-slate-300">No Growth Metrics Logged</div>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Enter metrics in Growth Analytics to generate live revenue curves and runway charts.
              </p>
              <button
                onClick={() => setActiveTab('growth-analytics')}
                className="mt-3 px-3 py-1.5 rounded-lg bg-cyan-600/30 text-cyan-300 text-xs hover:bg-cyan-600/40 cursor-pointer"
              >
                Enter Metrics
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-2 border-t border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] font-mono block">CONVERSION RATE</span>
              <span className="font-semibold text-white font-mono">
                {activeStartup.metrics.conversionRate}%
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-mono block">MONTHLY CHURN</span>
              <span className="font-semibold text-white font-mono">
                {activeStartup.metrics.churnRate}%
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-mono block">MONTHLY BURN</span>
              <span className="font-semibold text-rose-400 font-mono">
                ${activeStartup.metrics.monthlyBurn.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-mono block">TOTAL USERS</span>
              <span className="font-semibold text-white font-mono">
                {activeStartup.metrics.totalUsers} users
              </span>
            </div>
          </div>
        </div>

        {/* F & G. EXECUTION & TASKS (Span 4) */}
        <div className="lg:col-span-4 rounded-2xl futuristic-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <ListTodo className="w-3.5 h-3.5 text-cyan-400" />
                <span>G. Sprint Execution</span>
              </span>
              <span className="text-xs text-cyan-300 font-mono">
                {completedTasks.length}/{tasks.length} Completed
              </span>
            </div>

            <div className="space-y-2.5 mb-4">
              {openTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span
                      className={`font-mono text-[9px] px-1.5 py-0.2 rounded ${
                        task.priority === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : task.priority === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span>Due {task.deadline}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-100 line-clamp-1">{task.title}</div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 mb-1">Key Milestones Gate</div>
              <div className="text-xs text-slate-200">
                {completedMilestones.length} of {milestones.length} venture milestones unlocked.
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">{openTasks.length} open tickets</span>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>Manage Sprint</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* H. AI INSIGHTS & RECOMMENDED ACTIONS (Span 12) */}
        <div className="lg:col-span-12 rounded-2xl futuristic-card p-5 border-cyan-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-[0_0_8px_rgba(56,189,248,0.4)]">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                H. AI Next-Action Engine & Immediate Strategic Priorities
              </h3>
            </div>
            <span className="text-[11px] text-cyan-300 font-mono">
              Calculated for {activeStartup.stage} Stage
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-cyan-500/30 transition-colors">
              <div>
                <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
                  <span className="text-cyan-400 font-bold">PRIORITY 1</span>
                  <span className="text-slate-400">Within 48h</span>
                </div>
                <div className="text-xs font-bold text-white mb-1.5">
                  Conduct 5 Problem-Validation Discovery Interviews
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Target CTOs and technical founders to verify whether manual spec synthesis ranks in their top 3 weekly problems.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('market-validation')}
                className="mt-4 text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Record Interviews</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-purple-500/30 transition-colors">
              <div>
                <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
                  <span className="text-purple-400 font-bold">PRIORITY 2</span>
                  <span className="text-slate-400">Within 5 days</span>
                </div>
                <div className="text-xs font-bold text-white mb-1.5">
                  Benchmark Linear & Productboard Pricing Gaps
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Compare seat-tier thresholds to ensure your proposed $49/mo pricing offers 10x value capture before locking paywalls.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('competitors')}
                className="mt-4 text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
              >
                <span>View Gap Matrix</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-emerald-500/30 transition-colors">
              <div>
                <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
                  <span className="text-emerald-400 font-bold">PRIORITY 3</span>
                  <span className="text-slate-400">Within 2 weeks</span>
                </div>
                <div className="text-xs font-bold text-white mb-1.5">
                  Audit Pre-Seed Pitch Deck & Financial Modeling
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Refine the 12-slide investor narrative with verified retention cohorts and break-even runway calculations.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('pitch-deck')}
                className="mt-4 text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Open Pitch Deck</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
