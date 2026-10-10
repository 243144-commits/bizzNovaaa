import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { matchMentorWithStartup, matchTeamCandidateWithStartup } from '../services/scoring';
import {
  Compass,
  UserCheck,
  Trophy,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const NetworkCommunityPage: React.FC = () => {
  const {
    activeStartup,
    mentors,
    sendMentorRequest,
    teamCandidates,
    connectTeamCandidate,
    competitions,
    submitToCompetition,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'MENTORS' | 'TEAM' | 'COMPETITIONS'>('MENTORS');

  // Compute deterministic match scores for mentors
  const scoredMentors = useMemo(() => {
    return mentors.map((m) => {
      const match = matchMentorWithStartup(m, activeStartup);
      return {
        ...m,
        matchScore: match.score,
        matchExplanation: match.explanations,
      };
    }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }, [mentors, activeStartup]);

  // Compute deterministic match scores for team candidates
  const scoredCandidates = useMemo(() => {
    return teamCandidates.map((c) => {
      const match = matchTeamCandidateWithStartup(c, activeStartup);
      return {
        ...c,
        matchScore: match.score,
        matchExplanation: match.explanations,
      };
    }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }, [teamCandidates, activeStartup]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-850">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>VENTURE ECOSYSTEM</span>
            <span>·</span>
            <span>DETERMINISTIC MATCHING</span>
            <span>·</span>
            <span className="text-indigo-400">MENTORS & TALENT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-indigo-400" />
            <span>Mentors, Team Matching & Competitions</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Deterministic weighted matching (Skills 30%, Experience 20%, Industry 20%, Role 15%, Availability 10%, Goals 5%).
          </p>
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono">
          <button
            onClick={() => setActiveSubTab('MENTORS')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'MENTORS' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mentors ({mentors.length})
          </button>
          <button
            onClick={() => setActiveSubTab('TEAM')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'TEAM' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Team Matching ({teamCandidates.length})
          </button>
          <button
            onClick={() => setActiveSubTab('COMPETITIONS')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'COMPETITIONS' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Competitions ({competitions.length})
          </button>
        </div>
      </div>

      {/* SUBTAB 1: MENTORS */}
      {activeSubTab === 'MENTORS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {scoredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="rounded-2xl glass-card p-5 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-slate-800/80">
                  <div>
                    <h3 className="font-bold text-sm text-white">{mentor.name}</h3>
                    <div className="text-xs text-indigo-400">{mentor.title}</div>
                    <div className="text-[11px] text-slate-400">{mentor.company}</div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-lg font-extrabold text-emerald-400">
                      {mentor.matchScore}%
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 block">MATCH SCORE</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <p className="text-slate-300 text-[11px] leading-relaxed">{mentor.bio}</p>

                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                      Advisory Expertise
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {mentor.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase block">
                      Deterministic Match Basis
                    </span>
                    {mentor.matchExplanation?.map((exp, i) => (
                      <div key={i} className="text-[10px] text-slate-400">
                        · {exp}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                    <span>{mentor.location}</span>
                    <span className="font-mono text-indigo-300">{mentor.availability}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80">
                {mentor.requestStatus === 'PENDING' ? (
                  <button
                    disabled
                    className="w-full py-2 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-xs font-semibold cursor-default"
                  >
                    Request Pending Advisory Review
                  </button>
                ) : (
                  <button
                    onClick={() => sendMentorRequest(mentor.id)}
                    className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors"
                  >
                    Request Advisory Consultation
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 2: TEAM MATCHING */}
      {activeSubTab === 'TEAM' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {scoredCandidates.map((cand) => (
            <div
              key={cand.id}
              className="rounded-2xl glass-card p-5 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-slate-800/80">
                  <div>
                    <h3 className="font-bold text-sm text-white">{cand.name}</h3>
                    <div className="text-xs text-indigo-400 font-medium">{cand.roleTitle}</div>
                    <div className="text-[11px] text-slate-400">{cand.location}</div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-lg font-extrabold text-emerald-400">
                      {cand.matchScore}%
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 block">SYNERGY SCORE</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                      Technical & Growth Skills
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {cand.skills.map((s, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase block">
                      Why Recommended for {activeStartup.name}?
                    </span>
                    {cand.matchExplanation?.map((exp, i) => (
                      <div key={i} className="text-[10px] text-slate-400">
                        · {exp}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                    <span>{cand.experienceYears}+ years experience</span>
                    <span className="font-mono text-indigo-300">{cand.availability}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80">
                {cand.status === 'CONNECTED' ? (
                  <button
                    disabled
                    className="w-full py-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold cursor-default"
                  >
                    Introduction Request Sent
                  </button>
                ) : (
                  <button
                    onClick={() => connectTeamCandidate(cand.id)}
                    className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors"
                  >
                    Send Co-Founder / Team Connection
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 3: COMPETITIONS */}
      {activeSubTab === 'COMPETITIONS' && (
        <div className="space-y-5">
          {competitions.map((comp) => (
            <div key={comp.id} className="rounded-2xl glass-card p-6 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">{comp.name}</span>
                    {comp.hasSubmitted && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        SUBMISSION RECEIVED
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-indigo-400 font-medium">{comp.organizer}</div>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">{comp.description}</p>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400">{comp.prizeInformation}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">Deadline: {comp.deadline}</div>
                </div>
              </div>

              {/* Scoring Weights */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  Innovation: {comp.scoringCriteria.innovation}%
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  Problem: {comp.scoringCriteria.problem}%
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  Market: {comp.scoringCriteria.market}%
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  Execution: {comp.scoringCriteria.execution}%
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  Business Model: {comp.scoringCriteria.businessModel}%
                </div>
              </div>

              {/* Leaderboard Table */}
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-2">
                  Judging Leaderboard
                </span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/60 text-slate-400 font-mono text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-3">Rank</th>
                        <th className="py-2 px-3">Venture Name</th>
                        <th className="py-2 px-3">Stage</th>
                        <th className="py-2 px-3 text-right">Composite Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {comp.leaderboard.map((item) => (
                        <tr
                          key={item.rank}
                          className={item.startupName === activeStartup.name ? 'bg-indigo-950/30 text-white font-bold' : 'text-slate-300'}
                        >
                          <td className="py-2 px-3 font-mono">#{item.rank}</td>
                          <td className="py-2 px-3">{item.startupName}</td>
                          <td className="py-2 px-3 font-mono text-[10px] text-slate-400">{item.stage}</td>
                          <td className="py-2 px-3 text-right font-mono text-emerald-400 font-bold">{item.score}/100</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {!comp.hasSubmitted && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => submitToCompetition(comp.id)}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors"
                  >
                    Submit {activeStartup.name} to Judging Board
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
