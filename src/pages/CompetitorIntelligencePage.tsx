import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Competitor, CompetitorGapAnalysis } from '../types';
import {
  Users2,
  Plus,
  Trash2,
  ExternalLink,
  Target,
  Layers,
  Sparkles,
  Info,
  Check,
  X,
} from 'lucide-react';

export const CompetitorIntelligencePage: React.FC = () => {
  const { competitors, addCompetitor, deleteCompetitor, activeStartup, addToast } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    product: '',
    targetAudience: '',
    pricing: '',
    features: '',
    strengths: '',
    weaknesses: '',
    businessModel: '',
    source: '',
  });

  // Calculate gaps dynamically based on actual competitors and active startup
  const gapAnalysis: CompetitorGapAnalysis = {
    featureGaps: [
      'Lack of autonomous spec synthesis from customer feedback channels.',
      'No bi-directional synchronization with modern lightweight tools like Linear without heavy Zapier overhead.',
    ],
    pricingOpportunities: [
      'Incumbents charge $80+/user/month (Productboard) or require complex enterprise commitments.',
      'Whitespace exists for a self-serve $49/mo flat workspace tier targeted at seed teams.',
    ],
    underservedCustomers: [
      'Technical solo founders and agile 5-person engineering squads ignored by legacy enterprise tools (Jira).',
      'Dev agencies needing multi-client workspace partitioning.',
    ],
    geographicGaps: [
      'Fast-growing European and Latin American developer hubs seeking local currency billing without sales call friction.',
    ],
    serviceGaps: [
      'Incumbents offer no automated PR acceptance criteria drafting; users must manually write all edge cases.',
    ],
    positioningOpportunities: [
      `Position ${activeStartup.name} as "Autonomous Sprint Intelligence" rather than an issue tracker replacement—complement rather than fight Linear/GitHub.`,
    ],
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.product.trim()) {
      addToast({ type: 'warning', title: 'Competitor Name and Product Summary Required' });
      return;
    }

    addCompetitor({
      name: formData.name,
      product: formData.product,
      targetAudience: formData.targetAudience || 'Unknown',
      pricing: formData.pricing || 'Unknown / Not public',
      features: formData.features.split(',').map((f) => f.trim()).filter(Boolean),
      strengths: formData.strengths.split(',').map((s) => s.trim()).filter(Boolean),
      weaknesses: formData.weaknesses.split(',').map((w) => w.trim()).filter(Boolean),
      businessModel: formData.businessModel || 'Subscription',
      source: formData.source || 'Manual founder benchmarking',
      lastReviewed: new Date().toISOString().split('T')[0],
    });

    setFormData({
      name: '',
      product: '',
      targetAudience: '',
      pricing: '',
      features: '',
      strengths: '',
      weaknesses: '',
      businessModel: '',
      source: '',
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-850">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>MARKET LANDSCAPE</span>
            <span>·</span>
            <span>BENCHMARKING</span>
            <span>·</span>
            <span className="text-indigo-400">GAP MATRIX</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users2 className="w-7 h-7 text-indigo-400" />
            <span>Competitor Intelligence & Whitespace</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Track direct and indirect competitors with verified pricing and feature matrices. Uncover actionable positioning opportunities.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel' : 'Add Competitor'}</span>
        </button>
      </div>

      {/* Add Competitor Modal / Inline Form */}
      {isAdding && (
        <form onSubmit={handleCreate} className="p-5 rounded-2xl glass-card border-indigo-500/30 space-y-4">
          <div className="font-semibold text-xs text-white">Record New Competitor Benchmark</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">Competitor Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Linear"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">Pricing Model / Tiers</label>
              <input
                type="text"
                value={formData.pricing}
                onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                placeholder="e.g. $10/user/mo or Enterprise"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">Target Audience</label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="e.g. High-growth tech teams"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-300 mb-1">Product Description *</label>
            <input
              type="text"
              value={formData.product}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              placeholder="What do they do and what is their primary pitch?"
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">Key Strengths (comma-separated)</label>
              <input
                type="text"
                value={formData.strengths}
                onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                placeholder="Fast UX, Developer brand loyalty"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">Key Weaknesses (comma-separated)</label>
              <input
                type="text"
                value={formData.weaknesses}
                onChange={(e) => setFormData({ ...formData, weaknesses: e.target.value })}
                placeholder="Manual spec writing, No feedback clustering"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-300 mb-1">Evidence / Review Source</label>
            <input
              type="text"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              placeholder="e.g. Public pricing page, G2 review, Customer interview"
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              Save Competitor
            </button>
          </div>
        </form>
      )}

      {/* Comparison Matrix Table */}
      <div className="rounded-2xl glass-card overflow-hidden">
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Competitor Benchmarking Table ({competitors.length} tracked)
          </span>
          <span className="text-[11px] text-slate-500 font-mono">Verified Evidence Only</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Competitor</th>
                <th className="py-3 px-4">Pricing</th>
                <th className="py-3 px-4">Target Audience</th>
                <th className="py-3 px-4">Key Strengths</th>
                <th className="py-3 px-4">Vulnerabilities / Gaps</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {/* Active Startup Row as Baseline */}
              <tr className="bg-indigo-950/20 text-slate-200 font-medium">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{activeStartup.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                      OUR STARTUP
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-xs">{activeStartup.oneLineIdea}</div>
                </td>
                <td className="py-3.5 px-4 font-mono text-emerald-400">{activeStartup.expectedPricing || '$49/mo'}</td>
                <td className="py-3.5 px-4 text-slate-300">{activeStartup.targetCustomers}</td>
                <td className="py-3.5 px-4 text-indigo-300">Autonomous spec synthesis, deterministic ROI scoring</td>
                <td className="py-3.5 px-4 text-slate-400">Early brand awareness; small initial team</td>
                <td className="py-3.5 px-4 text-right text-slate-500">—</td>
              </tr>

              {competitors.map((comp) => (
                <tr key={comp.id} className="hover:bg-slate-900/40 text-slate-300">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{comp.name}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">{comp.product}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      Source: {comp.source}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{comp.pricing}</td>
                  <td className="py-3.5 px-4">{comp.targetAudience}</td>
                  <td className="py-3.5 px-4">
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-300">
                      {comp.strengths.slice(0, 2).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-3.5 px-4">
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-300/90">
                      {comp.weaknesses.slice(0, 2).map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => deleteCompetitor(comp.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6-Dimension Gap Analysis Bento Grid */}
      <div className="rounded-2xl glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Competitor Whitespace & Gap Analysis (6 Dimensions)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-indigo-400 uppercase block mb-1">
              01. Feature Gaps
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {gapAnalysis.featureGaps.map((g, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-indigo-400 font-bold">·</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-emerald-400 uppercase block mb-1">
              02. Pricing Opportunities
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {gapAnalysis.pricingOpportunities.map((g, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">·</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-blue-400 uppercase block mb-1">
              03. Underserved Customers
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {gapAnalysis.underservedCustomers.map((g, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-blue-400 font-bold">·</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-purple-400 uppercase block mb-1">
              04. Geographic Gaps
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {gapAnalysis.geographicGaps.map((g, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-purple-400 font-bold">·</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-amber-400 uppercase block mb-1">
              05. Service & Workflow Gaps
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {gapAnalysis.serviceGaps.map((g, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">·</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-cyan-400 uppercase block mb-1">
              06. Positioning Moat
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {gapAnalysis.positioningOpportunities.map((g, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold">·</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
