import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StartupStage, ProductStatus, Startup } from '../../types';
import { X, Sparkles, Building2 } from 'lucide-react';

export const StartupModal: React.FC = () => {
  const { isStartupModalOpen, closeStartupModal, addStartup, updateStartup, editingStartup } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    oneLineIdea: '',
    problem: '',
    solution: '',
    targetCustomers: '',
    industry: 'SaaS / Developer Tools',
    location: '',
    businessModel: 'B2B Subscription (SaaS)',
    expectedPricing: '',
    stage: 'IDEA' as StartupStage,
    teamSize: 1,
    estimatedBudget: 5000,
    currentFunding: 0,
    productStatus: 'CONCEPT' as ProductStatus,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingStartup) {
      setFormData({
        name: editingStartup.name,
        tagline: editingStartup.tagline || '',
        oneLineIdea: editingStartup.oneLineIdea,
        problem: editingStartup.problem,
        solution: editingStartup.solution,
        targetCustomers: editingStartup.targetCustomers,
        industry: editingStartup.industry,
        location: editingStartup.location,
        businessModel: editingStartup.businessModel,
        expectedPricing: editingStartup.expectedPricing,
        stage: editingStartup.stage,
        teamSize: editingStartup.teamSize,
        estimatedBudget: editingStartup.estimatedBudget,
        currentFunding: editingStartup.currentFunding,
        productStatus: editingStartup.productStatus,
      });
    } else {
      setFormData({
        name: '',
        tagline: '',
        oneLineIdea: '',
        problem: '',
        solution: '',
        targetCustomers: '',
        industry: 'SaaS / Developer Tools',
        location: 'San Francisco, CA & Remote',
        businessModel: 'B2B Subscription (SaaS)',
        expectedPricing: '$29 / user / month',
        stage: 'IDEA',
        teamSize: 1,
        estimatedBudget: 5000,
        currentFunding: 0,
        productStatus: 'CONCEPT',
      });
    }
    setErrors({});
  }, [editingStartup, isStartupModalOpen]);

  if (!isStartupModalOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Startup name is required';
    if (!formData.oneLineIdea.trim()) newErrors.oneLineIdea = 'One-line idea summary is required';
    if (!formData.problem.trim() || formData.problem.trim().length < 15) {
      newErrors.problem = 'Describe the problem clearly (minimum 15 characters)';
    }
    if (!formData.solution.trim() || formData.solution.trim().length < 15) {
      newErrors.solution = 'Describe your proposed solution (minimum 15 characters)';
    }
    if (!formData.targetCustomers.trim()) newErrors.targetCustomers = 'Specify target customer persona';
    if (!formData.industry.trim()) newErrors.industry = 'Industry vertical is required';
    if (!formData.businessModel.trim()) newErrors.businessModel = 'Business model is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingStartup) {
      updateStartup(editingStartup.id, {
        ...formData,
      });
    } else {
      addStartup({
        ...formData,
        tagline: formData.tagline || formData.oneLineIdea,
        metrics: {
          totalUsers: 0,
          monthlyActiveUsers: 0,
          monthlyRevenue: 0,
          payingCustomers: 0,
          conversionRate: 0,
          retentionRate: 0,
          churnRate: 0,
          monthlyBurn: Math.round(formData.estimatedBudget / 12) || 500,
          cashRunwayMonths: 12,
          historicalRevenue: [],
        },
      });
    }

    closeStartupModal();
  };

  const fillTemplate = () => {
    setFormData({
      name: 'OmniDesk AI',
      tagline: 'Autonomous AI Copilot for Tier-1 Customer Support Teams',
      oneLineIdea: 'AI agent that resolves 60% of repetitive customer inquiries with human-in-the-loop safeguards.',
      problem: 'Mid-market eCommerce and SaaS companies spend $45k/month on customer support teams that answer the same 20 return and login questions.',
      solution: 'A fine-tuned support copilot that integrates with Zendesk/Gorgias to draft instant responses and execute safe account actions with human approval.',
      targetCustomers: 'eCommerce brands doing $5M–$50M GMV and high-volume B2B SaaS startups.',
      industry: 'AI & Customer Experience',
      location: 'New York, NY',
      businessModel: 'Usage-based SaaS ($0.40 per resolved ticket)',
      expectedPricing: '$299 base + $0.35/ticket',
      stage: 'VALIDATION',
      teamSize: 2,
      estimatedBudget: 35000,
      currentFunding: 100000,
      productStatus: 'PROTOTYPE_IN_PROGRESS',
    });
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 rounded-3xl bg-[#070b1a]/95 border border-cyan-500/35 shadow-[0_0_50px_rgba(56,189,248,0.25)] p-6 text-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.4)]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{editingStartup ? 'Edit Startup Profile' : 'Initialize New Venture Profile'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  14 FIELDS
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Foundational specification for algorithmic validation, financial modeling & MVP execution.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!editingStartup && (
              <button
                type="button"
                onClick={fillTemplate}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-medium transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Fill Example</span>
              </button>
            )}
            <button
              onClick={closeStartupModal}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Core Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Startup Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. NovaFlow"
                className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              {errors.name && <p className="text-rose-400 text-[11px] mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="e.g. Autonomous Sprint Intelligence"
                className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              One-Line Elevator Pitch <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={formData.oneLineIdea}
              onChange={(e) => setFormData({ ...formData, oneLineIdea: e.target.value })}
              placeholder="What do you build, for whom, and what is the primary benefit?"
              className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {errors.oneLineIdea && <p className="text-rose-400 text-[11px] mt-1">{errors.oneLineIdea}</p>}
          </div>

          {/* Section 2: Problem & Solution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Problem Definition <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                placeholder="What specific pain, financial loss, or time sink do customers face today?"
                className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
              {errors.problem && <p className="text-rose-400 text-[11px] mt-1">{errors.problem}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Proposed Solution <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                placeholder="How does your product solve this uniquely and 10x better than existing workarounds?"
                className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
              {errors.solution && <p className="text-rose-400 text-[11px] mt-1">{errors.solution}</p>}
            </div>
          </div>

          {/* Section 3: Market & Industry */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Target Customers <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.targetCustomers}
                onChange={(e) => setFormData({ ...formData, targetCustomers: e.target.value })}
                placeholder="e.g. Seed tech founders"
                className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              {errors.targetCustomers && <p className="text-rose-400 text-[11px] mt-1">{errors.targetCustomers}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Industry Vertical <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="SaaS / Developer Tools">SaaS / Developer Tools</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="ClimateTech / Clean Energy">ClimateTech / Clean Energy</option>
                <option value="Fintech & Payments">Fintech & Payments</option>
                <option value="HealthTech & Bio">HealthTech & Bio</option>
                <option value="EdTech">EdTech</option>
                <option value="eCommerce & Retail">eCommerce & Retail</option>
                <option value="Consumer Tech">Consumer Tech</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Location / Market</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. San Francisco & Global"
                className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Section 4: Monetization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Business Model <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.businessModel}
                onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="B2B Subscription (SaaS)">B2B Subscription (SaaS)</option>
                <option value="Freemium with Pro Tier">Freemium with Pro Tier</option>
                <option value="Marketplace Commission">Marketplace Commission</option>
                <option value="Usage-based / Metered API">Usage-based / Metered API</option>
                <option value="Transaction Fee (Take Rate)">Transaction Fee (Take Rate)</option>
                <option value="Enterprise Annual License">Enterprise Annual License</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Expected Pricing</label>
              <input
                type="text"
                value={formData.expectedPricing}
                onChange={(e) => setFormData({ ...formData, expectedPricing: e.target.value })}
                placeholder="e.g. $49/seat/month"
                className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Section 5: Stage, Team, Capital & Status */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-slate-850">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value as StartupStage })}
                className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              >
                <option value="IDEA">IDEA</option>
                <option value="VALIDATION">VALIDATION</option>
                <option value="MVP">MVP</option>
                <option value="EARLY_TRACTION">EARLY_TRACTION</option>
                <option value="GROWTH">GROWTH</option>
                <option value="SCALE">SCALE</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Team Size</label>
              <input
                type="number"
                min="1"
                max="250"
                value={formData.teamSize}
                onChange={(e) => setFormData({ ...formData, teamSize: Number(e.target.value) || 1 })}
                className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Est. Budget ($)</label>
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.estimatedBudget}
                onChange={(e) => setFormData({ ...formData, estimatedBudget: Number(e.target.value) || 0 })}
                className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Funding Raised ($)</label>
              <input
                type="number"
                min="0"
                step="5000"
                value={formData.currentFunding}
                onChange={(e) => setFormData({ ...formData, currentFunding: Number(e.target.value) || 0 })}
                className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Product Status</label>
              <select
                value={formData.productStatus}
                onChange={(e) => setFormData({ ...formData, productStatus: e.target.value as ProductStatus })}
                className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              >
                <option value="CONCEPT">CONCEPT</option>
                <option value="PROTOTYPE_IN_PROGRESS">PROTOTYPE</option>
                <option value="BETA_LIVE">BETA LIVE</option>
                <option value="IN_PRODUCTION">PRODUCTION</option>
                <option value="SUNSET">SUNSET</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={closeStartupModal}
              className="px-4 py-2 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              {editingStartup ? 'Update Startup Profile' : 'Save & Initialize OS'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
