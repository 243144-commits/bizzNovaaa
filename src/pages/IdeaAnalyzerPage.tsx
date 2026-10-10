import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { analyzeIdeaViaBackend } from '../services/api';
import { IdeaAnalysis } from '../types';
import {
  Lightbulb,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FlaskConical,
  ArrowRight,
  Bookmark,
  RefreshCw,
  Info,
  ShieldCheck,
} from 'lucide-react';

export const IdeaAnalyzerPage: React.FC = () => {
  const { activeStartup, addToast } = useApp();

  const [inputData, setInputData] = useState({
    idea: activeStartup.oneLineIdea || activeStartup.name,
    problem: activeStartup.problem || '',
    solution: activeStartup.solution || '',
    targetCustomer: activeStartup.targetCustomers || '',
    industry: activeStartup.industry || 'SaaS / Developer Tools',
    geography: activeStartup.location || 'Global',
    businessModel: activeStartup.businessModel || 'B2B Subscription (SaaS)',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<IdeaAnalysis | null>(null);
  const [savedAnalyses, setSavedAnalyses] = useState<IdeaAnalysis[]>(() => {
    try {
      const s = localStorage.getItem('bizznova_saved_analyses');
      if (s) return JSON.parse(s);
    } catch {}
    return [];
  });

  const handleRunAnalysis = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputData.idea || !inputData.problem) {
      addToast({
        type: 'warning',
        title: 'Missing Required Inputs',
        message: 'Please provide both the idea thesis and the problem description.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await analyzeIdeaViaBackend(inputData);
      setAnalysis(result);
      addToast({
        type: 'success',
        title: result.isAiGenerated ? 'Gemini 3.8 Flash Analysis Ready' : 'Deterministic Engine Analysis Ready',
        message: `Overall Idea Score: ${result.overallScore}/100 with 9-factor evaluation.`,
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Analysis Error',
        message: 'Could not complete analysis request.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAnalysis = () => {
    if (!analysis) return;
    const updated = [analysis, ...savedAnalyses.filter((a) => a.id !== analysis.id)];
    setSavedAnalyses(updated);
    try {
      localStorage.setItem('bizznova_saved_analyses', JSON.stringify(updated));
    } catch {}
    addToast({
      type: 'success',
      title: 'Analysis Saved',
      message: 'You can review this snapshot at any time.',
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 65) return 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20';
    if (score >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      EXCELLENT: 'bg-emerald-500/20 text-emerald-300',
      SOLID: 'bg-indigo-500/20 text-indigo-300',
      MODERATE: 'bg-amber-500/20 text-amber-300',
      NEEDS_WORK: 'bg-rose-500/20 text-rose-300',
      CRITICAL_RISK: 'bg-rose-600/30 text-rose-200',
    };
    return map[status] || 'bg-slate-800 text-slate-300';
  };

  return (
    <div className="space-y-6">
      {/* Title & Disclosures */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-850">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>CORE EVALUATION</span>
            <span>·</span>
            <span>9-FACTOR ALGORITHM</span>
            <span>·</span>
            <span className="text-indigo-400">TRANSPARENT SCORING</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Lightbulb className="w-7 h-7 text-indigo-400" />
            <span>Idea Analyzer</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Evaluate problem clarity, defensibility, and market feasibility. Transparent algorithmic basis—no ungrounded scores.
          </p>
        </div>

        {analysis && (
          <button
            onClick={handleSaveAnalysis}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-200 text-xs font-medium transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
            <span>Save Analysis Snapshot</span>
          </button>
        )}
      </div>

      {/* Input Form Card */}
      <div className="rounded-2xl glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Startup Idea Inputs
          </span>
          <button
            type="button"
            onClick={() => {
              setInputData({
                idea: activeStartup.oneLineIdea,
                problem: activeStartup.problem,
                solution: activeStartup.solution,
                targetCustomer: activeStartup.targetCustomers,
                industry: activeStartup.industry,
                geography: activeStartup.location,
                businessModel: activeStartup.businessModel,
              });
            }}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Sync with {activeStartup.name}</span>
          </button>
        </div>

        <form onSubmit={handleRunAnalysis} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                One-Line Idea Thesis <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={inputData.idea}
                onChange={(e) => setInputData({ ...inputData, idea: e.target.value })}
                placeholder="What is the concept in a single sentence?"
                className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Target Customer Segment <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={inputData.targetCustomer}
                onChange={(e) => setInputData({ ...inputData, targetCustomer: e.target.value })}
                placeholder="Who suffers from this problem the most?"
                className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Problem Definition & Friction <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                value={inputData.problem}
                onChange={(e) => setInputData({ ...inputData, problem: e.target.value })}
                placeholder="What specific time, capital, or workflow pain do they experience?"
                className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Proposed Solution & Mechanism
              </label>
              <textarea
                rows={3}
                value={inputData.solution}
                onChange={(e) => setInputData({ ...inputData, solution: e.target.value })}
                placeholder="What is your unique product angle and why can't users just use a spreadsheet?"
                className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Industry</label>
              <input
                type="text"
                value={inputData.industry}
                onChange={(e) => setInputData({ ...inputData, industry: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Geography</label>
              <input
                type="text"
                value={inputData.geography}
                onChange={(e) => setInputData({ ...inputData, geography: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Business Model</label>
              <input
                type="text"
                value={inputData.businessModel}
                onChange={(e) => setInputData({ ...inputData, businessModel: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-850">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              <span>Uses server-side Gemini 3.8 Flash or deterministic calculation model</span>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Factors...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run Structured Analysis</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Analysis Results Display */}
      {analysis && (
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="rounded-2xl futuristic-card p-6 border-cyan-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-40 bg-gradient-to-bl from-cyan-500/15 via-blue-600/10 to-transparent blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 relative z-10">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono mb-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shadow-[0_0_8px_#38bdf8]" />
                  <span className="text-slate-400 uppercase tracking-wider">OVERALL IDEA VALIDATION INDEX</span>
                  <span>·</span>
                  <span className="text-cyan-300 font-bold">
                    {analysis.isAiGenerated ? 'Gemini 3.8 Flash Core' : 'Deterministic Engine'}
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-extrabold text-white font-mono drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                    {analysis.overallScore}
                  </span>
                  <span className="text-sm text-slate-400 font-mono">/ 100</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/35">
                    {analysis.confidence} CONFIDENCE
                  </span>
                </div>
              </div>

              <div className="max-w-md text-xs text-slate-400 bg-slate-900/80 p-3.5 rounded-xl border border-cyan-500/20 shadow-sm">
                <div className="font-semibold text-slate-200 mb-0.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Transparent Assessment Invariant</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  {analysis.disclaimer}
                </p>
              </div>
            </div>

            {/* 9 Factor Breakdown Cards */}
            <div className="mt-5 relative z-10">
              <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>9-Factor Algorithmic Evaluation (Weighted 100%)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {analysis.factorScores.map((factor) => (
                  <div
                    key={factor.factor}
                    className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-bold text-slate-100 line-clamp-1">
                          {factor.factor}
                        </span>
                        <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full border ${getStatusBadge(factor.status)}`}>
                          {factor.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-slate-400">Weight: {factor.weight}%</span>
                        <span className="text-base font-bold font-mono text-white">
                          {factor.score}
                          <span className="text-[11px] font-normal text-slate-500">/100</span>
                        </span>
                      </div>

                      <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden mb-2 p-0.5 border border-slate-700/50">
                        <div
                          className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                          style={{ width: `${factor.score}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-slate-300 leading-snug mb-1">
                        {factor.explanation}
                      </p>
                    </div>

                    <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                      Basis: {factor.basis}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl glass-card p-5">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>Identified Strengths</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {analysis.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-mono text-[11px] mt-0.5">0{idx + 1}.</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl glass-card p-5">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-3">
                <AlertTriangle className="w-4 h-4" />
                <span>Critical Weaknesses & Fragility</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {analysis.weaknesses.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-mono text-[11px] mt-0.5">0{idx + 1}.</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Unanswered Questions & Key Assumptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl glass-card p-5">
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 uppercase tracking-wider mb-3">
                <HelpCircle className="w-4 h-4" />
                <span>Unanswered Strategic Questions</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {analysis.unansweredQuestions.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-indigo-400 font-mono text-[11px] mt-0.5">?</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl glass-card p-5">
              <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-wider mb-3">
                <ShieldCheck className="w-4 h-4" />
                <span>Key Assumptions to Validate</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {analysis.keyAssumptions.map((a, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-blue-400 font-mono text-[11px] mt-0.5">·</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Validation Experiments */}
          <div className="rounded-2xl glass-card p-5">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 uppercase tracking-wider mb-3">
              <FlaskConical className="w-4 h-4" />
              <span>Recommended Validation Experiments</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysis.validationExperiments.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="font-semibold text-xs text-white">{exp.experiment}</div>
                  <div className="text-[11px] text-slate-300">
                    <span className="text-slate-400 block text-[10px] font-mono">HYPOTHESIS</span>
                    {exp.hypothesis}
                  </div>
                  <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Metric: {exp.metric}</span>
                    <span className="text-indigo-300">{exp.timeframe}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Three Prioritized Next Actions */}
          <div className="rounded-2xl glass-card p-5 border-indigo-500/20">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
              Three Prioritized Next Actions
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysis.nextActions.map((action, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                      <span className="text-indigo-400">ACTION 0{idx + 1}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] ${
                          action.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {action.priority}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white mb-1.5">{action.action}</div>
                    <p className="text-[11px] text-slate-400 mb-2">{action.reason}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-emerald-400">
                    Outcome: {action.expectedOutcome}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Saved Analyses Snapshot History */}
      {savedAnalyses.length > 0 && (
        <div className="rounded-2xl glass-card p-5">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
            Saved Analysis Snapshots ({savedAnalyses.length})
          </h3>
          <div className="space-y-2">
            {savedAnalyses.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs"
              >
                <div>
                  <div className="font-semibold text-white">Score: {s.overallScore}/100</div>
                  <div className="text-[11px] text-slate-400">
                    {new Date(s.analyzedAt).toLocaleDateString()} · {s.isAiGenerated ? 'Gemini 3.8 Flash' : 'Deterministic'}
                  </div>
                </div>
                <button
                  onClick={() => setAnalysis(s)}
                  className="px-2.5 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-medium text-xs transition-colors"
                >
                  Load Snapshot
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
