import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Compass,
} from 'lucide-react';

export const AiInsightsPage: React.FC = () => {
  const { activeStartup, setActiveTab } = useApp();

  const insights = [
    {
      id: 'ins-1',
      type: 'ACQUISITION_OPPORTUNITY',
      title: 'High Organic Wedge in Developer Tooling Ecosystem',
      description: `Given ${activeStartup.name}'s focus on ${activeStartup.industry}, open-source markdown export tools generate 3.2x higher organic trial velocity than paid outbound campaigns.`,
      urgency: 'HIGH',
      actionTab: 'opportunity-radar',
      actionText: 'Review Opportunity Matrix',
    },
    {
      id: 'ins-2',
      type: 'PRICING_ALIGNMENT',
      title: 'Price Point Sensitivity vs Incumbent Workarounds',
      description: `Your pricing assumption of ${activeStartup.expectedPricing || '$49/mo'} falls in the sweet spot between free spreadsheets and enterprise $80/user suites. Validate willingness to pay via customer discovery calls.`,
      urgency: 'MEDIUM',
      actionTab: 'business-model',
      actionText: 'Simulate Unit Economics',
    },
    {
      id: 'ins-3',
      type: 'RETENTION_DEFENSE',
      title: 'Time-to-Value Benchmark (< 3 Minutes)',
      description: 'Founding developers abandon sprint tools if initial webhook setup requires more than 3 steps. Prioritize 1-click read-only ingestion before building advanced dashboards.',
      urgency: 'CRITICAL',
      actionTab: 'mvp-builder',
      actionText: 'Inspect MVP Must-Haves',
    },
    {
      id: 'ins-4',
      type: 'COMPETITIVE_MOAT',
      title: 'Linear & GitHub Co-Existence Strategy',
      description: 'Do not position as a full task tracker. Position strictly as "Automated Spec Writer" that augments existing boards to reduce customer migration anxiety.',
      urgency: 'HIGH',
      actionTab: 'competitors',
      actionText: 'Examine Competitor Gaps',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-850">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>STARTUP INTELLIGENCE</span>
            <span>·</span>
            <span>SYNTHESIZED INSIGHTS</span>
            <span>·</span>
            <span className="text-indigo-400">GEMINI & DETERMINISTIC ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-indigo-400" />
            <span>AI Intelligence Feed</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Live strategic observations calculated for {activeStartup.name} based on stage, competitor whitespace, and recorded validation items.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('idea-analyzer')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all self-start md:self-auto"
        >
          <Lightbulb className="w-4 h-4" />
          <span>Run Fresh Analysis</span>
        </button>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {insights.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                <span className="text-indigo-400">{item.type}</span>
                <span
                  className={`px-2 py-0.5 rounded ${
                    item.urgency === 'CRITICAL'
                      ? 'bg-rose-500/15 text-rose-300 border border-rose-500/20'
                      : item.urgency === 'HIGH'
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.urgency} URGENCY
                </span>
              </div>

              <h3 className="font-bold text-sm text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{item.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">Prescribed Action:</span>
              <button
                onClick={() => setActiveTab(item.actionTab)}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                <span>{item.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
