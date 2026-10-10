import React, { useState, useEffect } from 'react';
import { Sparkles, Activity, ShieldCheck, Zap, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const GlowingIntelligenceCore: React.FC<{
  onExploreClick?: () => void;
  onStartClick?: () => void;
}> = ({ onExploreClick, onStartClick }) => {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulse((p) => (p + 1) % 100);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-[580px] h-[520px] flex items-center justify-center select-none">
      {/* Background radial energy flare */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-purple-600/20 blur-[90px] animate-pulse-energy" />
        <div className="w-[280px] h-[280px] rounded-full bg-cyan-400/20 blur-[60px]" />
      </div>

      {/* SVG Connecting Energy Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="lineGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Orbit paths */}
        <circle cx="50%" cy="50%" r="200" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="50%" cy="50%" r="145" fill="none" stroke="rgba(168, 85, 247, 0.15)" strokeWidth="1.2" strokeDasharray="8 8" />
        <circle cx="50%" cy="50%" r="90" fill="none" stroke="rgba(34, 211, 238, 0.25)" strokeWidth="1.5" />

        {/* Connected energy beams */}
        <line x1="50%" y1="50%" x2="15%" y2="20%" stroke="url(#lineGrad1)" strokeWidth="1.5" strokeDasharray="6 4" />
        <line x1="50%" y1="50%" x2="85%" y2="22%" stroke="url(#lineGrad2)" strokeWidth="1.5" strokeDasharray="6 4" />
        <line x1="50%" y1="50%" x2="20%" y2="82%" stroke="url(#lineGrad2)" strokeWidth="1.5" strokeDasharray="6 4" />
        <line x1="50%" y1="50%" x2="82%" y2="80%" stroke="url(#lineGrad1)" strokeWidth="1.5" strokeDasharray="6 4" />
      </svg>

      {/* Orbital Ring 1 - Outer (Slow clockwise spin) */}
      <div className="absolute w-[410px] h-[410px] rounded-full border border-cyan-500/20 animate-spin-slow pointer-events-none flex items-center justify-center">
        {/* Ring nodes */}
        <div className="absolute top-0 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#38bdf8]" />
        <div className="absolute bottom-0 w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_10px_#c084fc]" />
        <div className="absolute left-8 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
        <div className="absolute right-8 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
      </div>

      {/* Orbital Ring 2 - Middle (Reverse spin) */}
      <div className="absolute w-[295px] h-[295px] rounded-full border border-purple-500/30 animate-spin-reverse pointer-events-none flex items-center justify-center">
        <div className="absolute -top-1 w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_12px_#a855f7]" />
        <div className="absolute -bottom-1 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#67e8f9]" />
        <div className="absolute -left-1 w-2 h-2 rounded-full bg-blue-400" />
      </div>

      {/* Orbital Ring 3 - Inner Glowing Core Bounds */}
      <div className="absolute w-[185px] h-[185px] rounded-full border-2 border-cyan-400/40 shadow-[0_0_25px_rgba(34,211,238,0.25)] flex items-center justify-center pointer-events-none">
        {/* Radial energy ticks */}
        <div className="absolute inset-0 rounded-full border border-dashed border-indigo-400/30 animate-spin-slow" />
      </div>

      {/* Central Volumetric Glowing AI Core */}
      <div className="relative z-10 w-32 h-32 rounded-full flex items-center justify-center cursor-pointer group">
        {/* Deep glowing sphere */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-400 shadow-[0_0_50px_rgba(56,189,248,0.65),inset_0_0_25px_rgba(255,255,255,0.7)] group-hover:scale-105 transition-transform duration-500" />
        
        {/* Core highlight reflection */}
        <div className="absolute -top-1 left-4 w-12 h-6 rounded-full bg-white/40 blur-[2px] -rotate-12" />

        {/* Inner Core Symbol */}
        <div className="relative z-10 text-center flex flex-col items-center justify-center">
          <Zap className="w-8 h-8 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-200 mt-1 uppercase">
            AI CORE
          </span>
          <span className="text-[8px] font-mono text-cyan-300/80">LIVE 3.8F</span>
        </div>
      </div>

      {/* FLOATING GLASS PANELS (Surrounding the core with depth) */}
      
      {/* Panel 1: Top Left - Validation Score */}
      <div className="absolute -top-2 left-0 sm:left-2 z-20 futuristic-card p-3 rounded-xl max-w-[200px] animate-float shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>IDEA VALIDATION</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-white">92/100</span>
        </div>
        <div className="text-xs font-bold text-slate-100 truncate">High Market Demand</div>
        <div className="text-[10px] text-slate-400 mt-0.5">Problem clarity verified</div>
      </div>

      {/* Panel 2: Top Right - Market Radar */}
      <div className="absolute top-4 right-0 sm:right-2 z-20 futuristic-card p-3 rounded-xl max-w-[210px] animate-float shadow-xl" style={{ animationDelay: '1.5s' }}>
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1 text-[10px] font-mono text-purple-400">
            <Activity className="w-3 h-3" />
            <span>MARKET OPPORTUNITY</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">$18.4B</span>
        </div>
        <div className="text-xs font-bold text-slate-100 truncate">SaaS Developer Tools</div>
        <div className="text-[10px] text-slate-400 mt-0.5">Whitespace in automated specs</div>
      </div>

      {/* Panel 3: Bottom Left - AI Prescribed Action */}
      <div className="absolute bottom-6 left-2 sm:left-4 z-20 futuristic-card p-3 rounded-xl max-w-[215px] animate-float shadow-xl" style={{ animationDelay: '3s' }}>
        <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 mb-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>AI RECOMMENDATION</span>
        </div>
        <div className="text-xs font-bold text-slate-100 line-clamp-1">Ship Linear Ingestion</div>
        <div className="text-[10px] text-slate-400 mt-0.5">Expected +28% pilot conversion</div>
      </div>

      {/* Panel 4: Bottom Right - Real-time Growth Cohort */}
      <div className="absolute bottom-4 right-2 sm:right-4 z-20 futuristic-card p-3 rounded-xl max-w-[205px] animate-float shadow-xl" style={{ animationDelay: '2.2s' }}>
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-300">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>TRACTION COHORT</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400">+126%</span>
        </div>
        <div className="text-xs font-bold text-slate-100 truncate">$2,450 / mo MRR</div>
        <div className="text-[10px] text-slate-400 mt-0.5">15.6 mo runway remaining</div>
      </div>
    </div>
  );
};
