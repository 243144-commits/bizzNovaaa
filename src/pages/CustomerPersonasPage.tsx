import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CustomerPersona } from '../types';
import {
  Users2,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
} from 'lucide-react';

export const CustomerPersonasPage: React.FC = () => {
  const { activeStartup, personas, addPersona, updatePersona, deletePersona, addToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<CustomerPersona, 'id' | 'startupId'>>({
    name: '',
    title: '',
    ageRange: '25–35',
    occupation: '',
    isHypothesis: true,
    customerNeeds: [''],
    problems: [''],
    currentAlternatives: [''],
    painPoints: [''],
    buyingMotivation: '',
    budgetSensitivity: 'MEDIUM',
    adoptionBarriers: [''],
  });

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: 'Taylor Reed',
      title: 'DevOps / Lead Engineer',
      ageRange: '28–38',
      occupation: 'Engineering Lead at Growth Startup',
      isHypothesis: true,
      customerNeeds: ['Zero-config continuous integration metrics', 'Automated PR summaries'],
      problems: ['Manual sprint triage steals 12+ engineering hours every sprint cycle'],
      currentAlternatives: ['Google Sheets & Slack notifications'],
      painPoints: ['Context switching between IDE and Jira management tickets'],
      buyingMotivation: 'Directly saves 4 engineer days per month',
      budgetSensitivity: 'LOW',
      adoptionBarriers: ['Needs security team review for third-party API keys'],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: CustomerPersona) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      title: p.title,
      ageRange: p.ageRange,
      occupation: p.occupation,
      isHypothesis: p.isHypothesis,
      customerNeeds: [...p.customerNeeds],
      problems: [...p.problems],
      currentAlternatives: [...p.currentAlternatives],
      painPoints: [...p.painPoints],
      buyingMotivation: p.buyingMotivation,
      budgetSensitivity: p.budgetSensitivity,
      adoptionBarriers: [...p.adoptionBarriers],
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.occupation.trim()) {
      addToast({ type: 'warning', title: 'Persona Name and Occupation Required' });
      return;
    }

    if (editingId) {
      updatePersona(editingId, formData);
    } else {
      addPersona(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-850">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>TARGET AUDIENCE</span>
            <span>·</span>
            <span>PERSONA DISCOVERY</span>
            <span>·</span>
            <span className="text-indigo-400">HYPOTHESIS VS VERIFIED</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users2 className="w-7 h-7 text-indigo-400" />
            <span>Customer Personas</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Customer archetypes built from target audience data. AI-generated hypotheses are clearly flagged until verified through discovery interviews.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Persona</span>
        </button>
      </div>

      {/* Persona Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {personas.map((persona) => (
          <div
            key={persona.id}
            className="rounded-2xl glass-card p-5 border border-slate-800 flex flex-col justify-between"
          >
            <div>
              {/* Card Header & Verification Status */}
              <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-bold text-white">{persona.name}</span>
                    <span className="text-xs text-slate-400">({persona.ageRange})</span>
                  </div>
                  <div className="text-xs font-medium text-indigo-400">{persona.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{persona.occupation}</div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      persona.isHypothesis
                        ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                    }`}
                  >
                    {persona.isHypothesis ? 'AI HYPOTHESIS' : 'VERIFIED IN INTERVIEWS'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Budget: {persona.budgetSensitivity} sensitivity
                  </span>
                </div>
              </div>

              {/* Persona Body Details */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">PRIMARY PAIN POINTS</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {persona.painPoints.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">CORE NEEDS & DESIRED OUTCOMES</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {persona.customerNeeds.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">Current Workarounds</span>
                    <span className="text-slate-300 text-[11px] block truncate">
                      {persona.currentAlternatives.join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">Adoption Barriers</span>
                    <span className="text-slate-300 text-[11px] block truncate">
                      {persona.adoptionBarriers.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase block mb-0.5">
                    Buying Motivation
                  </span>
                  <p className="text-[11px] text-slate-300">{persona.buyingMotivation}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => updatePersona(persona.id, { isHypothesis: !persona.isHypothesis })}
                className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
              >
                <span>Mark as {persona.isHypothesis ? 'Verified' : 'Hypothesis'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(persona)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deletePersona(persona.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Persona Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8 rounded-2xl bg-[#0c1022] border border-slate-800 p-6 text-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingId ? 'Edit Customer Persona' : 'Create Customer Persona'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Name / Archetype</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Occupation & Company Context</label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Hypothesis or Verified?</label>
                  <select
                    value={formData.isHypothesis ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, isHypothesis: e.target.value === 'true' })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono"
                  >
                    <option value="true">AI Hypothesis (Awaiting interviews)</option>
                    <option value="false">Verified (Derived from real calls)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Budget Sensitivity</label>
                  <select
                    value={formData.budgetSensitivity}
                    onChange={(e) => setFormData({ ...formData, budgetSensitivity: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono"
                  >
                    <option value="LOW">LOW (Fast credit card approval)</option>
                    <option value="MEDIUM">MEDIUM (Needs department ROI justification)</option>
                    <option value="HIGH">HIGH (Very cost-sensitive)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Buying Motivation</label>
                <input
                  type="text"
                  value={formData.buyingMotivation}
                  onChange={(e) => setFormData({ ...formData, buyingMotivation: e.target.value })}
                  placeholder="e.g. Save 10 hours/week to focus on shipping code"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Save Persona
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
