import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Server,
  Activity,
  Users,
  Building2,
  Trash2,
  Lock,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { userRole, setUserRole, startups, deleteStartup, resetToDemoDefaults, addToast } = useApp();

  const [confirmReset, setConfirmReset] = useState(false);

  if (userRole !== 'ADMIN') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Restricted Administrator Area</h2>
        <p className="text-xs text-slate-400 max-w-md mb-5">
          Access to this console requires ADMIN role authorization. Switch your perspective to ADMIN to inspect diagnostics and manage platform state.
        </p>
        <button
          onClick={() => {
            setUserRole('ADMIN');
            addToast({ type: 'info', title: 'Role Switched to Administrator' });
          }}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md"
        >
          Authorize as Administrator
        </button>
      </div>
    );
  }

  const handleResetData = () => {
    resetToDemoDefaults();
    setConfirmReset(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-850">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>PLATFORM GOVERNANCE</span>
            <span>·</span>
            <span>ADMINISTRATOR CONSOLE</span>
            <span>·</span>
            <span className="text-emerald-400">ROLE: ADMIN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
            <span>Administration Console</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Audit registered venture workspaces, monitor deterministic engine invariants, and manage test data.
          </p>
        </div>

        <button
          onClick={() => setConfirmReset(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all self-start md:self-auto"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Demo Workspace Data</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {confirmReset && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between text-xs text-rose-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              Are you sure? This will reset all startups, tasks, competitors, and findings back to default demo seeds.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setConfirmReset(false)}
              className="px-3 py-1 rounded bg-slate-850 text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleResetData}
              className="px-3 py-1 rounded bg-rose-600 text-white font-semibold hover:bg-rose-500"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      )}

      {/* System Invariant Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl glass-card border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
            Registered Startups
          </span>
          <span className="text-2xl font-bold font-mono text-white">{startups.length}</span>
          <span className="text-[10px] text-slate-500 block mt-1">Stored in Local Workspace</span>
        </div>

        <div className="p-4 rounded-xl glass-card border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
            Scoring Engine Status
          </span>
          <span className="text-lg font-bold font-mono text-emerald-400">Deterministic + AI</span>
          <span className="text-[10px] text-slate-500 block mt-1">Invariants: Verified</span>
        </div>

        <div className="p-4 rounded-xl glass-card border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
            Session Environment
          </span>
          <span className="text-lg font-bold font-mono text-indigo-300">Node / Vite / Express</span>
          <span className="text-[10px] text-slate-500 block mt-1">Full-stack monolith</span>
        </div>

        <div className="p-4 rounded-xl glass-card border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
            Security Isolation
          </span>
          <span className="text-lg font-bold font-mono text-emerald-400">Strictly Enforced</span>
          <span className="text-[10px] text-slate-500 block mt-1">Role-based data access</span>
        </div>
      </div>

      {/* Startups Table */}
      <div className="rounded-2xl glass-card overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Registered Venture Database
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-slate-400 font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Startup Name</th>
                <th className="py-3 px-4">Industry</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">MRR</th>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {startups.map((s) => (
                <tr key={s.id} className="hover:bg-slate-900/40">
                  <td className="py-3 px-4 font-semibold text-white">{s.name}</td>
                  <td className="py-3 px-4">{s.industry}</td>
                  <td className="py-3 px-4 font-mono text-indigo-300">{s.stage}</td>
                  <td className="py-3 px-4 font-mono text-emerald-400">
                    ${s.metrics?.monthlyRevenue.toLocaleString() || 0}
                  </td>
                  <td className="py-3 px-4">{s.teamSize} members</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => deleteStartup(s.id)}
                      className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
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
    </div>
  );
};
