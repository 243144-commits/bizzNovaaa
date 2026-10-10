import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { calculateStartupHealth } from '../services/scoring';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const StartupHealthPage: React.FC = () => {
  const { activeStartup, setActiveTab } = useApp();

  const health = useMemo(() => calculateStartupHealth(activeStartup), [activeStartup]);

  const factorList = [
    { name: 'Customer Validation', score: health.factors.validation, weight: 20, desc: 'Problem definition, solution validation & qualitative customer interviews' },
    { name: 'Target Market Depth', score: health.factors.market, weight: 20, desc: 'Market addressability, vertical clarity, and segment accessibility' },
    { name: 'Product Readiness', score: health.factors.product, weight: 15, desc: 'Prototyping velocity, beta launch state & tech feasibility' },
    { name: 'Traction Velocity', score: health.factors.traction, weight: 20, desc: 'Paying customers, active users & measured conversion rates' },
    { name: 'Financial Runway', score: health.factors.financial, weight: 15, desc: 'Cash runway months, recurring revenue & net burn sustainability' },
    { name: 'Execution Discipline', score: health.factors.execution, weight: 10, desc: 'Team composition, task completion velocity & milestone cadence' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-850">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>DIAGNOSTIC HEALTH ENGINE</span>
            <span>·</span>
            <span>6-WEIGHT FORMULA</span>
            <span>·</span>
            <span className="text-indigo-400">TRANSPARENT INVARIANTS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-indigo-400" />
            <span>Startup Health Engine</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Calculated health across 6 core venture pillars: Validation (20%), Market (20%), Product (15%), Traction (20%), Financial (15%), Execution (10%).
          </p>
        </div>

        <button
          onClick={() => setActiveTab('growth-analytics')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all self-start md:self-auto"
        >
          <TrendingUp className="w-4 h-4" />
          <span>Update Raw Metrics</span>
        </button>
      </div>

      {/* Health Overview Card */}
      <div className="rounded-2xl glass-card p-6 border-indigo-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Overall Venture Health Index
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-extrabold font-mono text-white">
                {health.overallHealth}
              </span>
              <span className="text-sm text-slate-400">/ 100</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                {health.overallHealth >= 70 ? 'STABLE VELOCITY' : 'VULNERABLE VECTORS'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block">Strongest Pillar</span>
              <span className="font-bold text-emerald-400 text-sm mt-0.5 block">{health.strongestArea}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block">Weakest Pillar</span>
              <span className="font-bold text-amber-400 text-sm mt-0.5 block">{health.weakestArea}</span>
            </div>
          </div>
        </div>

        {health.provisionalNotice && (
          <div className="mt-4 p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-300">
            {health.provisionalNotice}
          </div>
        )}

        {/* 6 Factor Bars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {factorList.map((factor) => (
            <div
              key={factor.name}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-white">{factor.name}</span>
                  <span className="font-mono text-emerald-400 font-bold">{factor.score}/100</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 mb-2">Weight: {factor.weight}%</div>

                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${factor.score}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 leading-snug">{factor.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rationale & Prescribed Turnaround Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl glass-card p-5">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3">
            Algorithmic Scoring Rationale
          </span>
          <ul className="space-y-2 text-xs text-slate-300">
            {health.reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl glass-card p-5">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3">
            Recommended Improvement Actions
          </span>
          <ul className="space-y-2 text-xs text-slate-300">
            {health.recommendedActions.map((a, i) => (
              <li key={i} className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
