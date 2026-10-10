import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { simulateRevenue } from '../services/scoring';
import { RevenueSimulatorInputs } from '../types';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Layers,
  HelpCircle,
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
  Legend,
} from 'recharts';

export const BusinessModelPage: React.FC = () => {
  const { activeStartup, updateStartup, addToast } = useApp();

  const [activeModel, setActiveModel] = useState<string>(activeStartup.businessModel || 'B2B Subscription (SaaS)');
  const [modelType, setModelType] = useState<'B2B' | 'B2C' | 'B2B2C'>('B2B');

  // Revenue Simulator Inputs
  const [inputs, setInputs] = useState<RevenueSimulatorInputs>({
    initialCustomers: activeStartup.metrics?.payingCustomers || 15,
    pricePerCustomer: 49,
    monthlyGrowthRate: 15, // 15%
    monthlyChurnRate: 3.5, // 3.5%
    operatingCostMonthly: activeStartup.metrics?.monthlyBurn || 3000,
    marketingCostMonthly: 1200,
    cacPerCustomer: 85,
    projectionMonths: 12,
  });

  const simulation = useMemo(() => simulateRevenue(inputs), [inputs]);

  const businessModelOptions = [
    { id: 'B2B Subscription (SaaS)', label: 'B2B SaaS Subscription', desc: 'Predictable recurring revenue per seat or tier. High retention.' },
    { id: 'Freemium with Pro Tier', label: 'Freemium Product-Led', desc: 'Free self-serve entry point with conversion triggers to Pro.' },
    { id: 'Marketplace Commission', label: 'Marketplace Take-Rate', desc: 'Percentage fee (8%–20%) on gross transaction volume between buyers and sellers.' },
    { id: 'Transaction Fee (Take Rate)', label: 'Fintech Transaction Fee', desc: 'Interchange or payment processing percentage plus fixed micro-fee.' },
    { id: 'Usage-based / Metered API', label: 'Usage / Metered Consumption', desc: 'Pay per token, query, or data volume shipped.' },
    { id: 'Enterprise Annual License', label: 'Enterprise Annual Contract', desc: 'Annual upfront commitments with procurement and SLA support.' },
  ];

  const handleApplyModelToStartup = () => {
    updateStartup(activeStartup.id, {
      businessModel: activeModel,
      expectedPricing: `$${inputs.pricePerCustomer} / unit / month`,
    });
    addToast({
      type: 'success',
      title: 'Business Model Updated',
      message: `Saved ${activeModel} to ${activeStartup.name} profile.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-850">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>FINANCIAL ARCHITECTURE</span>
            <span>·</span>
            <span>DETERMINISTIC SIMULATION</span>
            <span>·</span>
            <span className="text-indigo-400">UNIT ECONOMICS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Calculator className="w-7 h-7 text-indigo-400" />
            <span>Business Model & Revenue Simulator</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Mathematical financial model with division-by-zero safeguards. Projections are modeled scenarios, not speculative guarantees.
          </p>
        </div>

        <button
          onClick={handleApplyModelToStartup}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all self-start md:self-auto"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Save to Startup Profile</span>
        </button>
      </div>

      {/* Model Selector Card */}
      <div className="rounded-2xl glass-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Select Revenue Model Framework
          </span>
          {/* Segmented Control for Target Archetype */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
            {(['B2B', 'B2C', 'B2B2C'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setModelType(type)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  modelType === type ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {businessModelOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setActiveModel(opt.id)}
              className={`p-3.5 rounded-xl text-left border transition-all ${
                activeModel === opt.id
                  ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-lg shadow-indigo-600/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/90'
              }`}
            >
              <div className="font-semibold text-xs text-white mb-1">{opt.label}</div>
              <p className="text-[11px] text-slate-400 leading-snug">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Inputs & Key KPI Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Inputs Panel (Span 5) */}
        <div className="lg:col-span-5 rounded-2xl glass-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Interactive Model Inputs</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Real-time Recalculation</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Initial Paying Customers:</span>
                <span className="font-mono font-bold text-white">{inputs.initialCustomers}</span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="5"
                value={inputs.initialCustomers}
                onChange={(e) => setInputs({ ...inputs, initialCustomers: Number(e.target.value) })}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Monthly Price Per Customer ($):</span>
                <span className="font-mono font-bold text-emerald-400">${inputs.pricePerCustomer}</span>
              </div>
              <input
                type="range"
                min="5"
                max="500"
                step="5"
                value={inputs.pricePerCustomer}
                onChange={(e) => setInputs({ ...inputs, pricePerCustomer: Number(e.target.value) })}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Monthly Customer Growth Rate (%):</span>
                <span className="font-mono font-bold text-indigo-300">{inputs.monthlyGrowthRate}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={inputs.monthlyGrowthRate}
                onChange={(e) => setInputs({ ...inputs, monthlyGrowthRate: Number(e.target.value) })}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Monthly Customer Churn (%):</span>
                <span className="font-mono font-bold text-rose-400">{inputs.monthlyChurnRate}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="0.5"
                value={inputs.monthlyChurnRate}
                onChange={(e) => setInputs({ ...inputs, monthlyChurnRate: Number(e.target.value) })}
                className="w-full accent-indigo-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Monthly Fixed Operating Burn ($):</span>
                <span className="font-mono font-bold text-rose-300">${inputs.operatingCostMonthly}</span>
              </div>
              <input
                type="range"
                min="500"
                max="25000"
                step="500"
                value={inputs.operatingCostMonthly}
                onChange={(e) => setInputs({ ...inputs, operatingCostMonthly: Number(e.target.value) })}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Estimated CAC per Acquired Customer ($):</span>
                <span className="font-mono font-bold text-white">${inputs.cacPerCustomer}</span>
              </div>
              <input
                type="range"
                min="10"
                max="800"
                step="10"
                value={inputs.cacPerCustomer}
                onChange={(e) => setInputs({ ...inputs, cacPerCustomer: Number(e.target.value) })}
                className="w-full accent-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Right Output Dashboard & Key KPIs (Span 7) */}
        <div className="lg:col-span-7 rounded-2xl glass-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-4 border-b border-slate-800">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                12-Month Calculated Unit Economics
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                {simulation.breakEvenMonth ? `Break-Even Month M${simulation.breakEvenMonth}` : 'No Break-Even in Y1'}
              </span>
            </div>

            {/* 4 Big Numbers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">Ending MRR</span>
                <span className="text-xl font-bold font-mono text-emerald-400 block mt-1">
                  ${simulation.endingMRR.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500">Gross monthly</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">Ending ARR</span>
                <span className="text-xl font-bold font-mono text-white block mt-1">
                  ${simulation.endingARR.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500">Annual run rate</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">Modeled LTV</span>
                <span className="text-xl font-bold font-mono text-indigo-300 block mt-1">
                  ${simulation.averageLTV.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500">ARPU / Churn</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">LTV / CAC</span>
                <span
                  className={`text-xl font-bold font-mono block mt-1 ${
                    simulation.ltvCacRatio >= 3 ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {simulation.ltvCacRatio}x
                </span>
                <span className="text-[10px] text-slate-500">Target &gt; 3.0x</span>
              </div>
            </div>

            {/* Projection Chart */}
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={simulation.projections} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="simRevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="simCostGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="monthName" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} tickFormatter={(v) => `$${v}`} />
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
                    dataKey="grossRevenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#simRevGrad)"
                    name="Revenue ($)"
                  />
                  <Area
                    type="monotone"
                    dataKey="totalExpenses"
                    stroke="#6366f1"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#simCostGrad)"
                    name="Total Costs ($)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Arithmetic Transparency Notes */}
          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            {simulation.assumptionsNotes.map((note, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="text-indigo-400 font-mono">·</span>
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
