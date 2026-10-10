import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { diagnoseStartupFailure } from '../services/api';
import { FailureDiagnosis } from '../types';
import {
  TrendingUp,
  AlertTriangle,
  Activity,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  HelpCircle,
  FlaskConical,
  Coins,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const GrowthAnalyticsPage: React.FC = () => {
  const { activeStartup, updateStartup, addToast } = useApp();

  const [metricsForm, setMetricsForm] = useState({
    totalUsers: activeStartup.metrics?.totalUsers || 0,
    monthlyActiveUsers: activeStartup.metrics?.monthlyActiveUsers || 0,
    monthlyRevenue: activeStartup.metrics?.monthlyRevenue || 0,
    payingCustomers: activeStartup.metrics?.payingCustomers || 0,
    conversionRate: activeStartup.metrics?.conversionRate || 0,
    retentionRate: activeStartup.metrics?.retentionRate || 0,
    churnRate: activeStartup.metrics?.churnRate || 0,
    monthlyBurn: activeStartup.metrics?.monthlyBurn || 0,
    cashRunwayMonths: activeStartup.metrics?.cashRunwayMonths || 12,
  });

  const [selectedFailureProblem, setSelectedFailureProblem] = useState('Low customer acquisition');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<FailureDiagnosis | null>(null);

  const problemOptions = [
    'Low customer acquisition',
    'Poor retention / High churn',
    'Weak revenue / Pricing friction',
    'Low user activation on Day 1',
    'Product issues / High support ticket burden',
    'Fierce incumbent competition',
    'Marketing spend without organic conversion',
  ];

  const handleSaveMetrics = (e: React.FormEvent) => {
    e.preventDefault();
    updateStartup(activeStartup.id, {
      metrics: {
        ...activeStartup.metrics,
        ...metricsForm,
      },
    });
    addToast({
      type: 'success',
      title: 'Metrics Persisted',
      message: 'Updated active metrics for health calculations and charts.',
    });
  };

  const handleRunDiagnosis = async () => {
    setIsDiagnosing(true);
    try {
      const res = await diagnoseStartupFailure({
        problemCategory: selectedFailureProblem,
        symptoms: [
          `Current Users: ${metricsForm.totalUsers}`,
          `Paying Customers: ${metricsForm.payingCustomers}`,
          `Monthly Churn: ${metricsForm.churnRate}%`,
          `Conversion: ${metricsForm.conversionRate}%`,
        ],
        startup: activeStartup,
      });
      setDiagnosis(res);
      addToast({
        type: 'success',
        title: 'Diagnostic Report Ready',
        message: `Synthesized root causes and experiments for "${selectedFailureProblem}".`,
      });
    } catch {
      addToast({ type: 'error', title: 'Diagnosis Failed' });
    } finally {
      setIsDiagnosing(false);
    }
  };

  const revenueData = activeStartup.metrics?.historicalRevenue || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-850">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>PERFORMANCE INTELLIGENCE</span>
            <span>·</span>
            <span>RETENTION & REVENUE</span>
            <span>·</span>
            <span className="text-indigo-400">ROOT-CAUSE DIAGNOSIS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <TrendingUp className="w-7 h-7 text-indigo-400" />
            <span>Growth Analytics & Failure Diagnosis</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Record verified founder metrics and isolate root causes when acquisition, retention, or monetization stalls.
          </p>
        </div>
      </div>

      {/* Metric Input & Live Stats Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Metric Form (Span 5) */}
        <form onSubmit={handleSaveMetrics} className="lg:col-span-5 rounded-2xl glass-card p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Founder-Entered Vital Metrics
            </span>
            <span className="text-[10px] font-mono text-indigo-300">Self-Reported</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Total Users</label>
              <input
                type="number"
                min="0"
                value={metricsForm.totalUsers}
                onChange={(e) => setMetricsForm({ ...metricsForm, totalUsers: Number(e.target.value) || 0 })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Monthly Active Users</label>
              <input
                type="number"
                min="0"
                value={metricsForm.monthlyActiveUsers}
                onChange={(e) => setMetricsForm({ ...metricsForm, monthlyActiveUsers: Number(e.target.value) || 0 })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Monthly Revenue ($)</label>
              <input
                type="number"
                min="0"
                value={metricsForm.monthlyRevenue}
                onChange={(e) => setMetricsForm({ ...metricsForm, monthlyRevenue: Number(e.target.value) || 0 })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Paying Customers</label>
              <input
                type="number"
                min="0"
                value={metricsForm.payingCustomers}
                onChange={(e) => setMetricsForm({ ...metricsForm, payingCustomers: Number(e.target.value) || 0 })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Conversion Rate (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={metricsForm.conversionRate}
                onChange={(e) => setMetricsForm({ ...metricsForm, conversionRate: Number(e.target.value) || 0 })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Monthly Churn (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={metricsForm.churnRate}
                onChange={(e) => setMetricsForm({ ...metricsForm, churnRate: Number(e.target.value) || 0 })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-rose-300 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Monthly Burn ($)</label>
              <input
                type="number"
                min="0"
                value={metricsForm.monthlyBurn}
                onChange={(e) => setMetricsForm({ ...metricsForm, monthlyBurn: Number(e.target.value) || 0 })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-rose-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Runway (Months)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={metricsForm.cashRunwayMonths}
                onChange={(e) => setMetricsForm({ ...metricsForm, cashRunwayMonths: Number(e.target.value) || 0 })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-indigo-300 font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm"
            >
              Update Recorded Metrics
            </button>
          </div>
        </form>

        {/* Chart View (Span 7) */}
        <div className="lg:col-span-7 rounded-2xl glass-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Revenue vs Expense Spread
              </span>
              <span className="text-[11px] font-mono text-slate-500">Historical Cohorts</span>
            </div>

            {revenueData.length > 0 ? (
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#1e293b',
                        borderRadius: '8px',
                        fontSize: '11px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#areaRev)"
                      name="Revenue ($)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-52 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl text-center p-6 text-xs text-slate-500">
                Save monthly metrics above to render historical trendlines.
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">Net Monthly Cash Flow</span>
              <span className={`font-mono font-bold ${metricsForm.monthlyRevenue >= metricsForm.monthlyBurn ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${(metricsForm.monthlyRevenue - metricsForm.monthlyBurn).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">ARPU / Customer</span>
              <span className="font-mono font-bold text-white">
                ${metricsForm.payingCustomers > 0 ? Math.round(metricsForm.monthlyRevenue / metricsForm.payingCustomers) : 0}/mo
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">Runway Status</span>
              <span className="font-mono font-bold text-indigo-400">
                {metricsForm.cashRunwayMonths >= 12 ? 'Healthy (>12 mo)' : 'Constrained (<12 mo)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* WHY IS MY STARTUP FAILING? DIAGNOSIS MODULE */}
      <div className="rounded-2xl glass-card p-6 border-rose-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                "Why Is My Startup Failing?" Diagnostic Engine
              </h2>
              <p className="text-xs text-slate-400">
                Root-cause bottleneck isolation based on customer friction and recorded unit metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedFailureProblem}
              onChange={(e) => setSelectedFailureProblem(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
            >
              {problemOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <button
              onClick={handleRunDiagnosis}
              disabled={isDiagnosing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50"
            >
              {isDiagnosing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Diagnosing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run Diagnosis</span>
                </>
              )}
            </button>
          </div>
        </div>

        {diagnosis && (
          <div className="space-y-5">
            {/* Diagnosis Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-rose-400 uppercase block mb-1.5">
                  Possible Root Causes
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {diagnosis.possibleRootCauses.map((rc, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">·</span>
                      <span>{rc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-amber-400 uppercase block mb-1.5">
                  Supporting Evidence & Signals
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {diagnosis.supportingEvidence.map((ev, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">·</span>
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-indigo-400 uppercase block mb-1.5">
                  Missing Information ({diagnosis.confidence} Confidence)
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {diagnosis.missingInformation.map((mi, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-indigo-400 font-bold">?</span>
                      <span>{mi}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Turnaround Experiments & Actions */}
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Three Prioritized Corrective Actions
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {diagnosis.threeNextActions.map((act, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-850 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                        <span className="text-rose-400">{act.priority}</span>
                        <span className="text-slate-400">{act.suggestedPeriod}</span>
                      </div>
                      <div className="text-xs font-bold text-white mb-1">{act.action}</div>
                      <p className="text-[11px] text-slate-400 mb-2">{act.reason}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-850 text-[10px] font-mono text-emerald-400">
                      Target: {act.expectedOutcome}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
