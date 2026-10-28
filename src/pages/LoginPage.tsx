import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Info,
  KeyRound,
  CheckCircle2,
  X,
  ShieldCheck,
  Briefcase,
  DollarSign,
  Users,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';

// Demo credentials for each role
const DEMO_ACCOUNTS: {
  role: UserRole;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeColor: string;
}[] = [
  {
    role: 'FOUNDER',
    label: 'Founder',
    description: 'Full startup OS — dashboard, idea analyzer, analytics, growth tools',
    icon: Zap,
    color: 'text-cyan-300',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    badgeColor: 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40',
  },
  {
    role: 'TEAM_MEMBER',
    label: 'Team Member',
    description: 'Tasks, milestones, MVP builder & startup profile view only',
    icon: Users,
    color: 'text-blue-300',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    badgeColor: 'bg-blue-500/20 text-blue-200 border-blue-500/40',
  },
  {
    role: 'MENTOR',
    label: 'Mentor',
    description: 'Network & talent, analytics, idea reviews, community tools',
    icon: Briefcase,
    color: 'text-purple-300',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    badgeColor: 'bg-purple-500/20 text-purple-200 border-purple-500/40',
  },
  {
    role: 'INVESTOR',
    label: 'Investor',
    description: 'Funding readiness, pitch deck, health scores, growth metrics',
    icon: DollarSign,
    color: 'text-emerald-300',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    badgeColor: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
  },
  {
    role: 'ADMIN',
    label: 'Administrator',
    description: 'All features + admin console, workspace management, full control',
    icon: ShieldCheck,
    color: 'text-rose-300',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    badgeColor: 'bg-rose-500/20 text-rose-200 border-rose-500/40',
  },
];

export const LoginPage: React.FC = () => {
  const { signIn, requestPasswordReset, isConfigured } = useAuth();
  const { setActiveTab, addToast, setUserRole } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoadingRole, setDemoLoadingRole] = useState<UserRole | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDemoPanel, setShowDemoPanel] = useState(false);

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  // Demo preview: set role locally and navigate to the dashboard
  const handleDemoLogin = (demo: typeof DEMO_ACCOUNTS[0]) => {
    setError(null);
    setDemoLoadingRole(demo.role);
    setUserRole(demo.role);

    addToast({
      type: 'info',
      title: `${demo.label} Demo Mode`,
      message: `Exploring BizzNova as ${demo.label}. Features filtered for your role.`,
    });
    setActiveTab('dashboard');
    setDemoLoadingRole(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isConfigured) {
      const result = await signIn(email, password);
      if (result.success) {
        addToast({
          type: 'success',
          title: 'Authentication Successful',
          message: 'Welcome back to BizzNova Command OS.',
        });
        setActiveTab('dashboard');
        setLoading(false);
        return;
      }
      setError(result.error || 'Invalid login credentials. Please check your email and password.');
    } else {
      // Offline / unconfigured fallback
      if (email.trim().length > 0 && password.length >= 6) {
        setActiveTab('dashboard');
      } else {
        setError('Supabase is not configured. Please add your VITE_SUPABASE_ANON_KEY to .env');
      }
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);

    if (!forgotEmail || !forgotEmail.includes('@')) {
      setForgotError('Please enter a valid email address.');
      return;
    }

    setForgotLoading(true);
    const result = await requestPasswordReset(forgotEmail);
    setForgotLoading(false);

    if (result.success) {
      setForgotSuccess(result.message || 'Password reset link dispatched.');
      addToast({
        type: 'info',
        title: 'Recovery Email Sent',
        message: `Instructions sent to ${forgotEmail}`,
      });
    } else {
      setForgotError(result.error || 'Failed to send reset link.');
    }
  };

  return (
    <div className="min-h-screen bg-[#03050e] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden cyber-grid">
      {/* Cinematic Ambient Glow Lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/4 w-[650px] h-[650px] bg-cyan-600/10 rounded-full blur-[170px] animate-pulse-energy" />
        <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[180px]" />
        <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[160px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        {/* Brand header */}
        <div className="flex flex-col items-center justify-center mb-2">
          <div
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group mb-1"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_22px_rgba(56,189,248,0.5)] text-white font-bold text-base tracking-wider">
              <span className="relative z-10">BN</span>
              <div className="absolute inset-0 rounded-2xl bg-cyan-400 opacity-0 group-hover:opacity-40 blur-[4px] transition-opacity" />
            </div>
            <div>
              <h2 className="font-extrabold text-2xl tracking-tight text-white block leading-none">
                BizzNova
              </h2>
              <span className="text-[10px] text-cyan-400 tracking-widest uppercase block font-mono mt-0.5">
                AI Founder Operating System
              </span>
            </div>
          </div>
        </div>

        <h2 className="mt-3 text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Sign in to your account
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400 font-mono">
          Authenticate to access your active venture workspaces & analytics.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="futuristic-card py-7 px-5 sm:px-8 rounded-2xl border border-cyan-500/20 shadow-2xl backdrop-blur-xl">
          {/* Missing Supabase Anon Key Banner */}
          {!isConfigured && (
            <div className="mb-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <div className="font-semibold text-amber-300">Demo Mode — Use Role Demo Buttons Below</div>
                <div className="text-[11px] text-amber-200/90 mt-0.5">
                  To enable live auth, add{' '}<code className="font-mono bg-amber-950/60 px-1 py-0.5 rounded text-amber-300">VITE_SUPABASE_ANON_KEY</code>{' '}to{' '}
                  <code className="font-mono bg-amber-950/60 px-1 py-0.5 rounded text-amber-300">.env</code>.
                </div>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-1.5">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4 text-cyan-400/80" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@venture.com"
                  autoComplete="email"
                  className="glass-input block w-full pl-9 pr-3 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4 text-cyan-400/80" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="glass-input block w-full pl-9 pr-10 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-2">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/40 focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="remember-me" className="text-slate-300 cursor-pointer font-mono text-[11px]">
                  Remember me
                </label>
              </div>

              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setForgotError(null);
                  setForgotSuccess(null);
                  setIsForgotModalOpen(true);
                }}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                Forgot your password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider font-mono mt-3"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Divider and Link to Sign Up */}
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <div className="text-center text-xs text-slate-400 font-mono">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className="w-full mt-3 flex justify-center py-2.5 px-4 border border-cyan-500/30 rounded-xl text-xs font-semibold font-mono text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20 focus:outline-none transition-colors cursor-pointer"
              >
                Create new account
              </button>
            </div>
          </div>
        </div>

        {/* ── Role-Based Demo Login Panel ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mt-5"
        >
          <button
            type="button"
            onClick={() => setShowDemoPanel((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-700/60 bg-slate-900/70 hover:bg-slate-800/80 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold">Try Role-Based Demo Logins</span>
              <span className="text-[10px] text-slate-500">— explore without signing up</span>
            </div>
            <span className="text-slate-500">{showDemoPanel ? '▲' : '▼'}</span>
          </button>

          <AnimatePresence>
            {showDemoPanel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-2.5">
                  <p className="text-[10px] text-slate-500 font-mono text-center pb-1">
                    Each role unlocks different features — Admin sees everything
                  </p>

                  {DEMO_ACCOUNTS.map((demo) => {
                    const Icon = demo.icon;
                    const isLoading = demoLoadingRole === demo.role;
                    return (
                      <motion.button
                        key={demo.role}
                        type="button"
                        onClick={() => handleDemoLogin(demo)}
                        disabled={demoLoadingRole !== null}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border ${demo.borderColor} ${demo.bgColor} hover:brightness-110 transition-all text-left cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-lg ${demo.bgColor} border ${demo.borderColor} flex items-center justify-center shrink-0`}>
                            <Icon className={`w-4 h-4 ${demo.color}`} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-xs font-bold ${demo.color}`}>{demo.label}</span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-mono ${demo.badgeColor}`}>
                                {demo.role}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-snug mt-0.5 truncate">
                              {demo.description}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 ml-2">
                          {isLoading ? (
                            <span className="w-4 h-4 border-2 border-slate-500/30 border-t-slate-300 rounded-full animate-spin block" />
                          ) : (
                            <ArrowRight className={`w-4 h-4 ${demo.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {isForgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md futuristic-card p-6 rounded-2xl border border-cyan-500/30 shadow-2xl relative"
            >
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Reset Account Password</h3>
              </div>

              <p className="text-xs text-slate-400 mb-4 leading-relaxed font-mono">
                Enter your registered email address and Supabase Auth will send you a recovery link to update your credentials.
              </p>

              {forgotError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{forgotError}</span>
                </div>
              )}

              {forgotSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2 text-center">
                  <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-400" />
                  <div className="font-semibold">{forgotSuccess}</div>
                  <p className="text-[11px] text-slate-300">
                    Check your email and click the recovery link to set a new password.
                  </p>
                  <button
                    onClick={() => setIsForgotModalOpen(false)}
                    className="mt-3 w-full py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-xs font-mono font-semibold transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label htmlFor="forgot-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-1.5">
                      Email address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Mail className="w-4 h-4 text-cyan-400/80" />
                      </div>
                      <input
                        id="forgot-email"
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="founder@venture.com"
                        className="glass-input block w-full pl-9 pr-3 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="px-4 py-2 rounded-xl text-xs font-mono font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {forgotLoading ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending Link...</span>
                        </>
                      ) : (
                        <span>Send Recovery Link</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
