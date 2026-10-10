import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ValidationTag, MarketValidationItem } from '../types';
import {
  CheckCircle2,
  Plus,
  Trash2,
  Tag,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Info,
  Calendar,
} from 'lucide-react';

export const MarketValidationPage: React.FC = () => {
  const {
    activeStartup,
    validationItems,
    addValidationItem,
    updateValidationItem,
    deleteValidationItem,
    addToast,
  } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    tag: 'ASSUMPTION' as ValidationTag,
    category: 'Problem' as MarketValidationItem['category'],
    statement: '',
    supportingEvidence: '',
    validationStatus: 'UNVALIDATED' as MarketValidationItem['validationStatus'],
  });

  const [activeFilter, setActiveFilter] = useState<'ALL' | ValidationTag>('ALL');

  const tagStyles: Record<ValidationTag, { bg: string; text: string; border: string }> = {
    FACT: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
    'USER INPUT': { bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/30' },
    ASSUMPTION: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
    'AI ESTIMATE': { bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30' },
    RECOMMENDATION: { bg: 'bg-indigo-500/15', text: 'text-indigo-300', border: 'border-indigo-500/30' },
  };

  const statusStyles: Record<string, string> = {
    VALIDATED: 'text-emerald-400 font-mono text-[10px]',
    IN_PROGRESS: 'text-amber-400 font-mono text-[10px]',
    UNVALIDATED: 'text-slate-400 font-mono text-[10px]',
    INVALIDATED: 'text-rose-400 font-mono text-[10px]',
  };

  const filteredItems = validationItems.filter((item) => {
    if (activeFilter === 'ALL') return true;
    return item.tag === activeFilter;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.statement.trim()) {
      addToast({ type: 'warning', title: 'Claim Statement Required' });
      return;
    }

    addValidationItem(formData);
    setFormData({
      tag: 'ASSUMPTION',
      category: 'Problem',
      statement: '',
      supportingEvidence: '',
      validationStatus: 'UNVALIDATED',
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-850">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>EVIDENCE CLASSIFIER</span>
            <span>·</span>
            <span>CUSTOMER INTERVIEWS</span>
            <span>·</span>
            <span className="text-indigo-400">ANTI-FABRICATION DISCIPLINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <CheckCircle2 className="w-7 h-7 text-indigo-400" />
            <span>Market Validation & Evidence Matrix</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Every market claim is tagged as FACT, USER INPUT, ASSUMPTION, AI ESTIMATE, or RECOMMENDATION to prevent false confidence.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel' : 'Add Validation Finding'}</span>
        </button>
      </div>

      {/* Add Finding Card Form */}
      {isAdding && (
        <form onSubmit={handleCreate} className="p-5 rounded-2xl glass-card border-indigo-500/30 space-y-4">
          <div className="font-semibold text-xs text-white">Add New Hypothesis or Validated Finding</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Evidence Tag</label>
              <select
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value as ValidationTag })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono"
              >
                <option value="FACT">FACT (Empirical proof)</option>
                <option value="USER INPUT">USER INPUT (Interview quote)</option>
                <option value="ASSUMPTION">ASSUMPTION (Unverified thesis)</option>
                <option value="AI ESTIMATE">AI ESTIMATE (Model calculation)</option>
                <option value="RECOMMENDATION">RECOMMENDATION (Suggested action)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              >
                <option value="Problem">Problem</option>
                <option value="Customer">Customer</option>
                <option value="Alternative">Alternative</option>
                <option value="Demand">Demand</option>
                <option value="Pricing">Pricing</option>
                <option value="Trend">Trend</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Validation State</label>
              <select
                value={formData.validationStatus}
                onChange={(e) => setFormData({ ...formData, validationStatus: e.target.value as any })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono"
              >
                <option value="UNVALIDATED">UNVALIDATED</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="VALIDATED">VALIDATED</option>
                <option value="INVALIDATED">INVALIDATED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Statement / Hypothesis / Finding Claim
            </label>
            <input
              type="text"
              value={formData.statement}
              onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
              placeholder="e.g. 80% of interviewed leads spend 4+ hours/week manually updating Linear boards."
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Supporting Evidence / Source Documentation
            </label>
            <textarea
              rows={2}
              value={formData.supportingEvidence}
              onChange={(e) => setFormData({ ...formData, supportingEvidence: e.target.value })}
              placeholder="Link to customer call notes, quote source, or survey result."
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white resize-none"
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
              Save Evidence Finding
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-xl overflow-x-auto text-xs">
        {(['ALL', 'FACT', 'USER INPUT', 'ASSUMPTION', 'AI ESTIMATE', 'RECOMMENDATION'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-colors shrink-0 ${
              activeFilter === filter
                ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {filter} {filter !== 'ALL' && `(${validationItems.filter((i) => i.tag === filter).length})`}
          </button>
        ))}
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const style = tagStyles[item.tag];
          return (
            <div
              key={item.id}
              className="p-4 rounded-xl glass-card flex flex-col sm:flex-row sm:items-start justify-between gap-3"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded border ${style.bg} ${style.text} ${style.border}`}
                  >
                    {item.tag}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-xs text-slate-400 font-mono">{item.category}</span>
                  <span className="text-slate-500">·</span>
                  <span className={statusStyles[item.validationStatus]}>
                    {item.validationStatus}
                  </span>
                </div>

                <div className="text-xs sm:text-sm font-semibold text-white">
                  {item.statement}
                </div>

                {item.supportingEvidence && (
                  <p className="text-xs text-slate-400 italic">
                    Evidence: {item.supportingEvidence}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <select
                  value={item.validationStatus}
                  onChange={(e) => updateValidationItem(item.id, { validationStatus: e.target.value as any })}
                  className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300"
                >
                  <option value="UNVALIDATED">UNVALIDATED</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="VALIDATED">VALIDATED</option>
                  <option value="INVALIDATED">INVALIDATED</option>
                </select>

                <button
                  onClick={() => deleteValidationItem(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
