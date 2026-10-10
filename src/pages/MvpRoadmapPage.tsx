import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MVPFeature, RoadmapPhase } from '../types';
import {
  Hammer,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Plus,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const MvpRoadmapPage: React.FC = () => {
  const { activeStartup, addToast } = useApp();

  // Features categorized per MoSCoW + Avoid initially
  const [features, setFeatures] = useState<MVPFeature[]>([
    {
      id: 'f-1',
      startupId: activeStartup.id,
      title: 'Customer Feedback Ingestion Webhook (Slack / Zendesk)',
      description: 'Ingests raw customer complaint messages and support threads into unified queue.',
      category: 'MUST HAVE',
      rationale: 'Core value depends on having raw customer complaints to synthesize; without data input, the product cannot function.',
      phase: 'Phase 1: Validation & Alpha',
      estimatedEffortDays: 4,
      isCompleted: true,
    },
    {
      id: 'f-2',
      startupId: activeStartup.id,
      title: 'Deterministic Reach-Impact-Confidence Priority Scoring',
      description: 'Calculates numeric feature score based on customer frequency and contract value.',
      category: 'MUST HAVE',
      rationale: 'Eliminates guesswork in sprint planning. Must be transparent and explainable to gain technical founder trust.',
      phase: 'Phase 2: MVP',
      estimatedEffortDays: 5,
      isCompleted: true,
    },
    {
      id: 'f-3',
      startupId: activeStartup.id,
      title: 'Automated PR Spec Generator with Acceptance Test Criteria',
      description: 'Drafts markdown specifications with edge cases and test criteria ready for developers.',
      category: 'MUST HAVE',
      rationale: 'Delivers the primary time-saving outcome (saves 4 hours per sprint for tech leads).',
      phase: 'Phase 2: MVP',
      estimatedEffortDays: 6,
      isCompleted: false,
    },
    {
      id: 'f-4',
      startupId: activeStartup.id,
      title: 'Bi-directional Linear Sync & Webhook Status Updates',
      description: 'Synchronizes issues directly into Linear without switching tabs.',
      category: 'SHOULD HAVE',
      rationale: 'Improves adoption by fitting into existing workflows, but users could initially copy-paste markdown specs.',
      phase: 'Phase 3: Early Users',
      estimatedEffortDays: 5,
      isCompleted: false,
    },
    {
      id: 'f-5',
      startupId: activeStartup.id,
      title: 'Executive Weekly Sprint ROI Digest (PDF & Email)',
      description: 'One-page summary showing value shipped vs engineer payroll burn for non-technical leadership.',
      category: 'NICE TO HAVE',
      rationale: 'High value for team upgrades, but unnecessary for early individual tech lead validation.',
      phase: 'Phase 4: PMF',
      estimatedEffortDays: 3,
      isCompleted: false,
    },
    {
      id: 'f-6',
      startupId: activeStartup.id,
      title: 'Multi-Tenant Enterprise Custom SAML / SSO Integration',
      description: 'Okta and Azure AD enterprise single sign-on.',
      category: 'AVOID INITIALLY',
      rationale: 'Target customer is seed/early startups using Google Workspace or email login. Building enterprise SAML now burns capital prematurely.',
      phase: 'Phase 5: Growth',
      estimatedEffortDays: 14,
      isCompleted: false,
    },
    {
      id: 'f-7',
      startupId: activeStartup.id,
      title: 'Native Mobile iOS & Android Companion Apps',
      description: 'Mobile applications for viewing sprint tickets on the go.',
      category: 'AVOID INITIALLY',
      rationale: 'Developers and product leads manage specifications on desktop keyboards, not mobile devices.',
      phase: 'Phase 5: Growth',
      estimatedEffortDays: 20,
      isCompleted: false,
    },
  ]);

  // 5 Phase Roadmap
  const [phases, setPhases] = useState<RoadmapPhase[]>([
    {
      phaseNumber: 1,
      name: 'Phase 1: Problem & Idea Validation',
      goals: ['Confirm 10 design partners experience 10+ hrs/week ticket grooming friction', 'Smoke test landing page waitlist'],
      suggestedTimeline: 'Weeks 1–4',
      successMetrics: ['10 recorded interviews', '15% landing page signup conversion', '3 signed letters of intent'],
      dependencies: ['Customer discovery target list'],
      risks: ['Prospects claim problem is severe but refuse to share workflow screen'],
      tasks: [
        { id: 't1', title: 'Conduct 10 qualitative user discovery calls', completed: true },
        { id: 't2', title: 'Publish value-proposition smoke test page', completed: true },
        { id: 't3', title: 'Collect 3 design partner LOIs', completed: true },
      ],
    },
    {
      phaseNumber: 2,
      name: 'Phase 2: MVP Core Engine Build',
      goals: ['Ship single core loop: Customer complaints in → Formatted markdown spec out', 'Deploy to 3 beta teams'],
      suggestedTimeline: 'Weeks 5–8',
      successMetrics: ['First 5 real sprint specs generated', 'Under 3-minute time-to-value for new user'],
      dependencies: ['Webhook ingestion pipeline', 'Scoring logic'],
      risks: ['AI hallucinations in technical spec edge cases (mitigated with deterministic validation)'],
      tasks: [
        { id: 't4', title: 'Build webhook parser for Zendesk/Slack messages', completed: true },
        { id: 't5', title: 'Develop Reach-Impact-Confidence scoring engine', completed: true },
        { id: 't6', title: 'Deploy private staging instance to 3 beta teams', completed: false },
      ],
    },
    {
      phaseNumber: 3,
      name: 'Phase 3: Early Users & First Revenue',
      goals: ['Land first 10 paying customers at $49/month', 'Achieve 70%+ Day-30 retention'],
      suggestedTimeline: 'Weeks 9–14',
      successMetrics: ['$500+ MRR', 'Logo churn under 5%/month'],
      dependencies: ['Stripe billing integration', 'Linear bi-directional sync'],
      risks: ['Lack of self-serve onboarding causes high founder support overhead'],
      tasks: [
        { id: 't7', title: 'Integrate Stripe billing & subscription tier gates', completed: false },
        { id: 't8', title: 'Launch Linear marketplace listing', completed: false },
        { id: 't9', title: 'Onboard 10 paying customers with concierge setup', completed: false },
      ],
    },
    {
      phaseNumber: 4,
      name: 'Phase 4: Product-Market Fit Iteration',
      goals: ['Scale to 50 paying teams', 'Reach operational break-even ($3,200/mo)'],
      suggestedTimeline: 'Months 4–7',
      successMetrics: ['$2,500+ MRR', 'Organic referral rate > 25%'],
      dependencies: ['Proven cohort retention', 'Self-serve onboarding'],
      risks: ['Incumbent copycats launching similar basic feature summaries'],
      tasks: [
        { id: 't10', title: 'Ship automated executive weekly ROI digest', completed: false },
        { id: 't11', title: 'Implement developer referral invite loop', completed: false },
        { id: 't12', title: 'Conduct price increase experiment to $79/mo tier', completed: false },
      ],
    },
    {
      phaseNumber: 5,
      name: 'Phase 5: Growth & Scale',
      goals: ['Expand to team plans ($199/mo)', 'Prepare $250k–$500k seed funding round'],
      suggestedTimeline: 'Months 8–12',
      successMetrics: ['$10,000+ MRR', 'LTV/CAC > 3.5x'],
      dependencies: ['Enterprise team permissions', 'Audit logs'],
      risks: ['Long sales cycles if enterprise security becomes mandatory too early'],
      tasks: [
        { id: 't13', title: 'Ship team workspace role-based permissions', completed: false },
        { id: 't14', title: 'Finalize institutional seed pitch deck with traction metrics', completed: false },
      ],
    },
  ]);

  const [expandedPhase, setExpandedPhase] = useState<number>(2);

  const toggleTask = (phaseNumber: number, taskId: string) => {
    setPhases((prev) =>
      prev.map((p) => {
        if (p.phaseNumber === phaseNumber) {
          return {
            ...p,
            tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
          };
        }
        return p;
      })
    );
  };

  const categoryBadges: Record<string, { bg: string; text: string; border: string }> = {
    'MUST HAVE': { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
    'SHOULD HAVE': { bg: 'bg-indigo-500/15', text: 'text-indigo-300', border: 'border-indigo-500/30' },
    'NICE TO HAVE': { bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/30' },
    'AVOID INITIALLY': { bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/30' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-850">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>PRODUCT ARCHITECTURE</span>
            <span>·</span>
            <span>SCOPE DISCIPLINE</span>
            <span>·</span>
            <span className="text-indigo-400">5-PHASE ROADMAP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Hammer className="w-7 h-7 text-indigo-400" />
            <span>MVP Builder & Product Roadmap</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Prioritize only essential customer problem-solving features. Explicitly flags distraction traps to avoid premature scope creep.
          </p>
        </div>
      </div>

      {/* Feature MoSCoW Prioritization Cards */}
      <div className="rounded-2xl glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            MVP Feature Scope & Rationale Breakdown
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {features.filter((f) => f.category === 'MUST HAVE').length} Core Must-Haves
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => {
            const style = categoryBadges[feature.category];
            return (
              <div
                key={feature.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded border ${style.bg} ${style.text} ${style.border}`}
                    >
                      {feature.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Est. {feature.estimatedEffortDays} days
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-white mb-1">{feature.title}</h3>
                  <p className="text-[11px] text-slate-300 mb-2.5">{feature.description}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-850 text-[11px]">
                  <span className="text-indigo-400 font-mono block text-[10px] uppercase mb-0.5">
                    Why in this category?
                  </span>
                  <span className="text-slate-400 leading-snug">{feature.rationale}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5-Phase Product Roadmap */}
      <div className="rounded-2xl glass-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            5-Phase Progressive Execution Roadmap
          </span>
          <span className="text-[11px] text-slate-500 font-mono">Validation → Scale</span>
        </div>

        <div className="space-y-3">
          {phases.map((phase) => {
            const isExpanded = expandedPhase === phase.phaseNumber;
            const completedCount = phase.tasks.filter((t) => t.completed).length;

            return (
              <div
                key={phase.phaseNumber}
                className={`rounded-xl border transition-all ${
                  isExpanded ? 'bg-slate-900/80 border-indigo-500/30' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Collapsible Header */}
                <button
                  onClick={() => setExpandedPhase(isExpanded ? 0 : phase.phaseNumber)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center shrink-0 ${
                        completedCount === phase.tasks.length
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {phase.phaseNumber}
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-white">{phase.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {phase.suggestedTimeline} · {completedCount}/{phase.tasks.length} tasks ready
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-slate-800/80 space-y-4 text-xs mt-2">
                    {/* Goals & Success Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                      <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-850">
                        <span className="text-[10px] font-mono text-indigo-400 uppercase block mb-1">
                          Phase Goals
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                          {phase.goals.map((g, i) => (
                            <li key={i}>{g}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-850">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase block mb-1">
                          Success Metrics
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                          {phase.successMetrics.map((m, i) => (
                            <li key={i}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Interactive Tasks Checklist */}
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block mb-2">
                        Deliverable Checklist (Click to Toggle Status)
                      </span>
                      <div className="space-y-1.5">
                        {phase.tasks.map((task) => (
                          <button
                            key={task.id}
                            onClick={() => toggleTask(phase.phaseNumber, task.id)}
                            className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-colors ${
                              task.completed
                                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                                  task.completed ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold' : 'border-slate-700'
                                }`}
                              >
                                {task.completed && '✓'}
                              </div>
                              <span className={`text-xs ${task.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                                {task.title}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500">
                              {task.completed ? 'COMPLETED' : 'PENDING'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
