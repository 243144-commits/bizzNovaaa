import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RiskRadarItem, OpportunityItem } from '../types';
import {
  Radar,
  AlertTriangle,
  Lightbulb,
  Plus,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const OpportunityRiskRadarPage: React.FC = () => {
  const { activeStartup, risks, addRisk, updateRisk } = useApp();

  const [activeTab, setActiveTab] = useState<'RISKS' | 'OPPORTUNITIES'>('RISKS');
  const [isAddingRisk, setIsAddingRisk] = useState(false);

  const [newRisk, setNewRisk] = useState({
    category: 'Market' as RiskRadarItem['category'],
    description: '',
    severity: 'MEDIUM' as RiskRadarItem['severity'],
    likelihood: 'MEDIUM' as RiskRadarItem['likelihood'],
    evidenceOrInput: '',
    potentialImpact: '',
    recommendedMitigation: '',
    status: 'OPEN' as RiskRadarItem['status'],
  });

  const opportunities: OpportunityItem[] = [
    {
      id: 'opp-1',
      title: 'Zendesk & Intercom Bug Harvester Hook',
      category: 'Product Expansion',
      opportunityDescription: 'Direct customer support sync clustering repeat complaints into Linear tickets.',
      reasonItMatters: 'Competitors only triage issues after engineers file them; capturing customer pain at support level closes the loop.',
      supportingInput: '7 out of 8 interviewed founders reported customer support tickets are isolated from developer boards.',
      uncertaintyLevel: 'LOW',
      recommendedNextStep: 'Build a read-only webhook prototype and test with 3 early design partners.',
    },
    {
      id: 'opp-2',
      title: 'Executive Weekly Sprint ROI Digest',
      category: 'Monetization Tier',
      opportunityDescription: 'Automated 1-page PDF showing value shipped vs engineering burn for non-technical CEOs.',
      reasonItMatters: 'Unlocks $199/month team tier paid directly by executive credit card.',
      supportingInput: 'Product manager persona cited CEO approval as primary adoption gatekeeper.',
      uncertaintyLevel: 'MEDIUM',
      recommendedNextStep: 'Draft a mock PDF report and gauge willingness to pay during next 5 discovery calls.',
    },
    {
      id: 'opp-3',
      title: 'Open-Source Sprint Markdown CLI Tool',
      category: 'Organic Distribution',
      opportunityDescription: 'Command-line utility for engineers to generate quick release notes in terminal.',
      reasonItMatters: 'Acts as top-of-funnel viral wedge among developer communities without paid ad spend.',
      supportingInput: 'Developer-first SaaS products gain 60% of initial organic trials via GitHub open-source wedges.',
      uncertaintyLevel: 'LOW',
      recommendedNextStep: 'Publish open-source npm/brew CLI tool with link to cloud dashboard.',
    },
  ];

  const severityBadges: Record<RiskRadarItem['severity'], string> = {
    LOW: 'bg-slate-800 text-slate-300 border-slate-700',
    MEDIUM: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    HIGH: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    CRITICAL: 'bg-rose-600/25 text-rose-200 border-rose-500/50',
  };

  const handleAddRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRisk.description.trim()) return;

    addRisk(newRisk);
    setNewRisk({
      category: 'Market',
      description: '',
      severity: 'MEDIUM',
      likelihood: 'MEDIUM',
      evidenceOrInput: '',
      potentialImpact: '',
      recommendedMitigation: '',
      status: 'OPEN',
    });
    setIsAddingRisk(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-850">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>RADAR MATRIX</span>
            <span>·</span>
            <span>SYSTEMIC RISKS</span>
            <span>·</span>
            <span className="text-indigo-400">EXPANSION VECTORS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Radar className="w-7 h-7 text-indigo-400" />
            <span>Opportunity & Risk Radar</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Track categorized vulnerabilities (Market, Financial, Product, Team, Legal, Execution) and actionable expansion vectors.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono">
          <button
            onClick={() => setActiveTab('RISKS')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'RISKS' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Risk Radar ({risks.length})
          </button>
          <button
            onClick={() => setActiveTab('OPPORTUNITIES')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'OPPORTUNITIES' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Opportunity Radar ({opportunities.length})
          </button>
        </div>
      </div>

      {/* TAB 1: RISK RADAR */}
      {activeTab === 'RISKS' && (
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Assessed Risk Factors Across 7 Categories
            </span>
            <button
              onClick={() => setIsAddingRisk(!isAddingRisk)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingRisk ? 'Cancel' : 'Log New Risk'}</span>
            </button>
          </div>

          {isAddingRisk && (
            <form onSubmit={handleAddRisk} className="p-5 rounded-2xl glass-card border-indigo-500/30 space-y-3">
              <div className="font-semibold text-xs text-white">Log Risk Hypothesis</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Category</label>
                  <select
                    value={newRisk.category}
                    onChange={(e) => setNewRisk({ ...newRisk, category: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  >
                    <option value="Market">Market</option>
                    <option value="Financial">Financial</option>
                    <option value="Product">Product</option>
                    <option value="Competition">Competition</option>
                    <option value="Team">Team</option>
                    <option value="Legal">Legal</option>
                    <option value="Execution">Execution</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Severity</label>
                  <select
                    value={newRisk.severity}
                    onChange={(e) => setNewRisk({ ...newRisk, severity: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Likelihood</label>
                  <select
                    value={newRisk.likelihood}
                    onChange={(e) => setNewRisk({ ...newRisk, likelihood: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Risk Description *</label>
                <input
                  type="text"
                  value={newRisk.description}
                  onChange={(e) => setNewRisk({ ...newRisk, description: e.target.value })}
                  placeholder="e.g. Incumbent vendor launches identical feature natively."
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Potential Impact</label>
                  <input
                    type="text"
                    value={newRisk.potentialImpact}
                    onChange={(e) => setNewRisk({ ...newRisk, potentialImpact: e.target.value })}
                    placeholder="e.g. 50% drop in trial conversion"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Recommended Mitigation</label>
                  <input
                    type="text"
                    value={newRisk.recommendedMitigation}
                    onChange={(e) => setNewRisk({ ...newRisk, recommendedMitigation: e.target.value })}
                    placeholder="e.g. Expand cross-platform integrations"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingRisk(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Save Risk Item
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {risks.map((risk) => (
              <div
                key={risk.id}
                className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-indigo-400">{risk.category.toUpperCase()}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`font-mono text-[9px] px-2 py-0.5 rounded border ${severityBadges[risk.severity]}`}>
                        {risk.severity} SEVERITY
                      </span>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">
                        {risk.likelihood} LIKELIHOOD
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-white mb-2">{risk.description}</h3>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-850">
                      <span className="text-[10px] font-mono text-slate-400 block mb-0.5">Potential Impact:</span>
                      <span className="text-slate-300 text-[11px]">{risk.potentialImpact}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-500/20">
                      <span className="text-[10px] font-mono text-indigo-300 block mb-0.5">Recommended Mitigation:</span>
                      <span className="text-slate-200 text-[11px]">{risk.recommendedMitigation}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-mono">Status: {risk.status}</span>
                  <select
                    value={risk.status}
                    onChange={(e) => updateRisk(risk.id, { status: e.target.value as any })}
                    className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="MONITORING">MONITORING</option>
                    <option value="MITIGATED">MITIGATED</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: OPPORTUNITY RADAR */}
      {activeTab === 'OPPORTUNITIES' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                  <span className="text-indigo-400">{opp.category}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    {opp.uncertaintyLevel} UNCERTAINTY
                  </span>
                </div>

                <h3 className="font-bold text-xs text-white mb-2">{opp.title}</h3>
                <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                  {opp.opportunityDescription}
                </p>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-850">
                    <span className="text-[10px] font-mono text-emerald-400 block mb-0.5">Why it matters:</span>
                    <span className="text-slate-300 text-[11px]">{opp.reasonItMatters}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-850">
                    <span className="text-[10px] font-mono text-slate-400 block mb-0.5">Supporting Evidence:</span>
                    <span className="text-slate-400 text-[11px]">{opp.supportingInput}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/80 text-[11px] text-indigo-300 font-mono">
                Next Step: {opp.recommendedNextStep}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
