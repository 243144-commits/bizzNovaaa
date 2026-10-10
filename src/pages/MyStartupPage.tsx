import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Edit2,
  Trash2,
  Sparkles,
  Calendar,
  DollarSign,
  Users,
  MapPin,
  TrendingUp,
  Tag,
  ShieldAlert,
} from 'lucide-react';

export const MyStartupPage: React.FC = () => {
  const { activeStartup, openStartupModal, deleteStartup, setActiveTab } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-850">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>VENTURE PROFILE</span>
            <span>·</span>
            <span>14 SPECIFICATION FIELDS</span>
            <span>·</span>
            <span className="text-indigo-400">{activeStartup.stage} STAGE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-indigo-400" />
            <span>{activeStartup.name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">{activeStartup.tagline}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openStartupModal(activeStartup)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Full Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('idea-analyzer')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-850 text-indigo-300 text-xs font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Run Analysis</span>
          </button>
        </div>
      </div>

      {/* 14 Fields Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Core Elevator Pitch */}
        <div className="lg:col-span-3 rounded-2xl glass-card p-5">
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
            01. One-Line Idea Pitch
          </span>
          <p className="text-sm font-semibold text-white">{activeStartup.oneLineIdea}</p>
        </div>

        {/* Problem */}
        <div className="rounded-2xl glass-card p-5">
          <span className="text-[10px] font-mono text-rose-400 uppercase block mb-1.5">
            02. Problem Definition
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">{activeStartup.problem}</p>
        </div>

        {/* Solution */}
        <div className="rounded-2xl glass-card p-5">
          <span className="text-[10px] font-mono text-emerald-400 uppercase block mb-1.5">
            03. Proposed Solution & Mechanism
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">{activeStartup.solution}</p>
        </div>

        {/* Target Customers */}
        <div className="rounded-2xl glass-card p-5">
          <span className="text-[10px] font-mono text-blue-400 uppercase block mb-1.5">
            04. Target Customer Segment
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">{activeStartup.targetCustomers}</p>
        </div>

        {/* Industry & Location */}
        <div className="rounded-2xl glass-card p-5 space-y-3">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">
              05. Industry Vertical
            </span>
            <span className="text-xs font-semibold text-white">{activeStartup.industry}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">
              06. Target Geography / Location
            </span>
            <span className="text-xs font-semibold text-white">{activeStartup.location || 'Global'}</span>
          </div>
        </div>

        {/* Business Model & Pricing */}
        <div className="rounded-2xl glass-card p-5 space-y-3">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">
              07. Business Model Framework
            </span>
            <span className="text-xs font-semibold text-white">{activeStartup.businessModel}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">
              08. Expected Pricing
            </span>
            <span className="text-xs font-mono font-semibold text-emerald-400">
              {activeStartup.expectedPricing || 'To be validated'}
            </span>
          </div>
        </div>

        {/* Operational Metrics */}
        <div className="rounded-2xl glass-card p-5 space-y-2 text-xs">
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
            09–14. Stage, Team & Capital Status
          </span>
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
            <div>
              <span className="text-slate-400 text-[10px] block">Current Stage</span>
              <span className="font-mono font-bold text-indigo-300">{activeStartup.stage}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Product Status</span>
              <span className="font-mono text-white">{activeStartup.productStatus}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Team Size</span>
              <span className="font-bold text-white">{activeStartup.teamSize} members</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Capital Raised</span>
              <span className="font-mono text-emerald-400">
                ${activeStartup.currentFunding.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
