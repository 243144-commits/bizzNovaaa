import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PitchDeckSlide } from '../types';
import {
  Coins,
  Presentation,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Edit2,
  Check,
  Sparkles,
  PieChart as PieIcon,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const FundingReadinessPage: React.FC = () => {
  const {
    activeStartup,
    pitchDeckSlides,
    updatePitchDeckSlide,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'READINESS' | 'PLANNER' | 'PITCH_DECK'>('READINESS');

  // Funding Planner Allocations
  const [fundingTarget, setFundingTarget] = useState<number>(250000);
  const [allocations, setAllocations] = useState({
    productEngineering: 150000, // 60%
    growthMarketing: 62500, // 25%
    operationsLegal: 25000, // 10%
    reserveRunway: 12500, // 5%
  });

  const totalAllocated = useMemo(() => {
    return Object.values(allocations).reduce((a, b) => a + b, 0);
  }, [allocations]);

  const allocationDelta = fundingTarget - totalAllocated;

  // Investor Readiness Score Calculation (Deterministic)
  const readiness = useMemo(() => {
    const m = activeStartup.metrics;
    let score = 30; // baseline
    if (m.payingCustomers > 10) score += 20;
    else if (m.payingCustomers > 0) score += 10;

    if (m.monthlyRevenue > 2000) score += 15;
    else if (m.monthlyRevenue > 0) score += 8;

    if (m.cashRunwayMonths >= 12) score += 15;
    else if (m.cashRunwayMonths >= 6) score += 8;

    if (activeStartup.teamSize >= 2) score += 10;
    if (activeStartup.productStatus === 'BETA_LIVE' || activeStartup.productStatus === 'IN_PRODUCTION') score += 10;

    const finalScore = Math.min(95, score);

    return {
      score: finalScore,
      strengths: [
        m.payingCustomers > 0 ? `Valid commercial traction with ${m.payingCustomers} paying customers.` : 'Clean thesis and prototype.',
        `Clear unit pricing ($${activeStartup.metrics.monthlyRevenue}/mo recurring).`,
        `${activeStartup.metrics.cashRunwayMonths} months of measured capital runway remaining.`,
      ],
      weaknesses: [
        m.totalUsers < 500 ? 'Top-of-funnel organic acquisition volume is still nascent.' : 'High churn risk.',
        'Single geography focus before international validation.',
      ],
      missingInfo: [
        'Detailed cohort-based logo retention curves (Day 30 vs Day 90).',
        'Formal Cap Table structure and option pool reservations.',
      ],
      recommendedNextSteps: [
        'Secure 2 signed customer advisory letters to prove pipeline urgency.',
        'Finalize 12-slide seed deck with verified Stripe MRR screenshots.',
      ],
    };
  }, [activeStartup]);

  // Pitch Deck active slide selector
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [isEditingSlide, setIsEditingSlide] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const currentSlide = pitchDeckSlides[selectedSlideIndex];

  const handleCopySlide = (slide: PitchDeckSlide, idx: number) => {
    const text = `SLIDE ${slide.slideNumber}: ${slide.title}\nSubtitle: ${slide.subtitle}\n\nBullet Points:\n${slide.bulletPoints.map((b) => `- ${b}`).join('\n')}\n\nNotes:\n${slide.founderNotes}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
    addToast({ type: 'success', title: 'Slide Copied to Clipboard' });
  };

  const handleCopyAllDeck = () => {
    const text = pitchDeckSlides
      .map(
        (s) =>
          `==============================\nSLIDE ${s.slideNumber}: ${s.title.toUpperCase()}\nSubtitle: ${s.subtitle}\nCategory: ${s.category}\n\nBullet Points:\n${s.bulletPoints.map((b) => `• ${b}`).join('\n')}\n\nFounder Speaking Notes:\n${s.founderNotes}\n`
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    addToast({
      type: 'success',
      title: 'Full 12-Slide Pitch Deck Copied',
      message: 'Markdown format ready to paste into presentation software.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-850">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>CAPITAL RAISING</span>
            <span>·</span>
            <span>INVESTOR AUDIT</span>
            <span>·</span>
            <span className="text-indigo-400">12-SLIDE PITCH ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Coins className="w-7 h-7 text-indigo-400" />
            <span>Funding & Investor Readiness</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Evaluate readiness with transparent metrics, model capital allocation budgets, and edit your institutional pitch deck.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono">
          <button
            onClick={() => setActiveTab('READINESS')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'READINESS' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Readiness Audit
          </button>
          <button
            onClick={() => setActiveTab('PLANNER')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'PLANNER' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Use of Funds
          </button>
          <button
            onClick={() => setActiveTab('PITCH_DECK')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'PITCH_DECK' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            12-Slide Deck
          </button>
        </div>
      </div>

      {/* TAB 1: READINESS AUDIT */}
      {activeTab === 'READINESS' && (
        <div className="space-y-5">
          <div className="rounded-2xl glass-card p-6 border-indigo-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Institutional Investor Readiness Score
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-extrabold font-mono text-white">{readiness.score}</span>
                  <span className="text-sm text-slate-400">/ 100</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    {readiness.score >= 70 ? 'PRE-SEED READY' : 'REQUIRES TRACTION DERISKING'}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-400 max-w-sm bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-300 block mb-1">Grounding Note</span>
                <p className="text-[11px] leading-relaxed">
                  Calculated solely from founder-entered metrics (${activeStartup.metrics?.monthlyRevenue || 0}/mo revenue, {activeStartup.metrics?.payingCustomers || 0} paying customers, {activeStartup.metrics?.cashRunwayMonths || 0} mo runway). No fabricated metrics.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-emerald-400 uppercase block mb-2">
                  Fundraising Strengths
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {readiness.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-amber-400 uppercase block mb-2">
                  Investor Red Flags & Fragilities
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {readiness.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase block mb-0.5">
                  Missing Due Diligence Information
                </span>
                <p className="text-slate-300">{readiness.missingInfo.join(' · ')}</p>
              </div>
              <button
                onClick={() => setActiveTab('PITCH_DECK')}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shrink-0"
              >
                Assemble Deck
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FUNDING PLANNER & USE OF FUNDS */}
      {activeTab === 'PLANNER' && (
        <div className="rounded-2xl glass-card p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">Pre-Seed Capital Allocation Planner</h2>
              <p className="text-xs text-slate-400">
                Model budget allocation ensuring total line items equal your target capital raise.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Target Raise ($):</span>
              <input
                type="number"
                min="25000"
                step="25000"
                value={fundingTarget}
                onChange={(e) => setFundingTarget(Number(e.target.value) || 0)}
                className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-xs w-36 font-bold"
              />
            </div>
          </div>

          {/* Allocation Warning if Delta !== 0 */}
          {allocationDelta !== 0 && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center justify-between border ${
                allocationDelta > 0
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <span>
                {allocationDelta > 0
                  ? `Warning: $${allocationDelta.toLocaleString()} of your $${fundingTarget.toLocaleString()} target is currently unallocated.`
                  : `Warning: Allocations exceed total target by $${Math.abs(allocationDelta).toLocaleString()}!`}
              </span>
              <button
                onClick={() => {
                  setAllocations({
                    productEngineering: Math.round(fundingTarget * 0.6),
                    growthMarketing: Math.round(fundingTarget * 0.25),
                    operationsLegal: Math.round(fundingTarget * 0.1),
                    reserveRunway: Math.round(fundingTarget * 0.05),
                  });
                }}
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-white"
              >
                Auto-Balance 60/25/10/5
              </button>
            </div>
          )}

          {/* Allocation Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300 font-medium">Core Engineering & Technical Talent:</span>
                <span className="font-mono font-bold text-white">${allocations.productEngineering.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max={fundingTarget}
                step="5000"
                value={allocations.productEngineering}
                onChange={(e) => setAllocations({ ...allocations, productEngineering: Number(e.target.value) })}
                className="w-full accent-indigo-500"
              />
              <span className="text-[10px] text-slate-400 font-mono block">
                {Math.round((allocations.productEngineering / (fundingTarget || 1)) * 100)}% of round
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300 font-medium">Go-To-Market & Developer Acquisition:</span>
                <span className="font-mono font-bold text-white">${allocations.growthMarketing.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max={fundingTarget}
                step="5000"
                value={allocations.growthMarketing}
                onChange={(e) => setAllocations({ ...allocations, growthMarketing: Number(e.target.value) })}
                className="w-full accent-indigo-500"
              />
              <span className="text-[10px] text-slate-400 font-mono block">
                {Math.round((allocations.growthMarketing / (fundingTarget || 1)) * 100)}% of round
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300 font-medium">Operations, Cloud Hosting & Legal:</span>
                <span className="font-mono font-bold text-white">${allocations.operationsLegal.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max={fundingTarget}
                step="2500"
                value={allocations.operationsLegal}
                onChange={(e) => setAllocations({ ...allocations, operationsLegal: Number(e.target.value) })}
                className="w-full accent-indigo-500"
              />
              <span className="text-[10px] text-slate-400 font-mono block">
                {Math.round((allocations.operationsLegal / (fundingTarget || 1)) * 100)}% of round
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300 font-medium">Emergency Cash Buffer & Working Capital:</span>
                <span className="font-mono font-bold text-white">${allocations.reserveRunway.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max={fundingTarget}
                step="2500"
                value={allocations.reserveRunway}
                onChange={(e) => setAllocations({ ...allocations, reserveRunway: Number(e.target.value) })}
                className="w-full accent-indigo-500"
              />
              <span className="text-[10px] text-slate-400 font-mono block">
                {Math.round((allocations.reserveRunway / (fundingTarget || 1)) * 100)}% of round
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 12-SLIDE PITCH DECK ASSISTANT */}
      {activeTab === 'PITCH_DECK' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-850">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              12-Slide Institutional Seed Structure
            </span>
            <button
              onClick={handleCopyAllDeck}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Full 12-Slide Deck (Markdown)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Slide Navigation List (Span 4) */}
            <div className="lg:col-span-4 rounded-2xl glass-card p-3 space-y-1.5 max-h-[640px] overflow-y-auto">
              {pitchDeckSlides.map((slide, idx) => (
                <button
                  key={slide.slideNumber}
                  onClick={() => setSelectedSlideIndex(idx)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-colors ${
                    selectedSlideIndex === idx
                      ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                      : 'text-slate-300 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="font-mono text-[10px] text-indigo-400 shrink-0 w-5">
                      {String(slide.slideNumber).padStart(2, '0')}
                    </span>
                    <span className="font-medium truncate">{slide.title}</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 shrink-0">
                    {slide.category}
                  </span>
                </button>
              ))}
            </div>

            {/* Slide Presentation Card (Span 8) */}
            {currentSlide && (
              <div className="lg:col-span-8 rounded-2xl glass-card p-6 flex flex-col justify-between">
                <div>
                  {/* Top Slide Metadata */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-indigo-400">
                        SLIDE {currentSlide.slideNumber} OF 12
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs font-mono text-slate-400">{currentSlide.category}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopySlide(currentSlide, selectedSlideIndex)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-white"
                      >
                        {copiedIndex === selectedSlideIndex ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Slide</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Slide Visual Display */}
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight">{currentSlide.title}</h2>
                      <p className="text-xs text-indigo-300 font-medium mt-0.5">{currentSlide.subtitle}</p>
                    </div>

                    <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-850 space-y-3">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        On-Screen Content & Key Bullets
                      </span>
                      <ul className="space-y-2 text-xs text-slate-200">
                        {currentSlide.bulletPoints.map((bp, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="text-indigo-400 font-bold mt-0.5">·</span>
                            <span>{bp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {currentSlide.missingInformationAlert && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{currentSlide.missingInformationAlert}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Founder Speaking Notes */}
                <div className="pt-4 mt-4 border-t border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                    Founder Verbal Delivery & Speaking Notes
                  </span>
                  <p className="text-xs text-slate-300 italic">{currentSlide.founderNotes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
