import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Info,
  Check,
} from 'lucide-react';
import { motion } from 'motion/react';

export const SignupPage: React.FC = () => {
  const { signUp, isConfigured } = useAuth();
  const { setActiveTab, addToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ message: string; requiresEmailConfirmation: boolean } | null>(null);

  // Validation rules
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  // Password Strength Score: 0 to 4
  const strengthScore = [hasMinLength, hasNumber, hasUpper, hasSpecial].filter(Boolean).length;
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-rose-500', 'bg-amber-500', 'bg-cyan-500', 'bg-emerald-500'];

  const isFormValid =
    name.trim().length >= 2 &&
    email.includes('@') &&
    hasMinLength &&
    hasNumber &&
    hasUpper &&
    hasSpecial &&
    passwordsMatch &&
    acceptTerms;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isConfigured) {
      setError('Supabase credentials are not fully configured. Please add your VITE_SUPABASE_ANON_KEY to biznova/.env');
      return;
    }

    if (!isFormValid) {
      if (!passwordsMatch) {
        setError('Passwords do not match.');
      } else if (!acceptTerms) {
        setError('Please accept the Terms of Service and Privacy Policy.');
      } else {
        setError('Please fulfill all password security requirements.');
      }
      return;
    }

    setLoading(true);
    const result = await signUp(name, email, password);
    setLoading(false);

    if (result.success) {
      addToast({
        type: 'success',
        title: 'Founder Account Registered',
        message: result.requiresEmailConfirmation
          ? 'Confirmation email dispatched. Please verify your address.'
          : 'Welcome to BizzNova Command OS!',
      });

      if (result.requiresEmailConfirmation) {
        setSuccessInfo({
          message: result.message || 'Please check your email inbox to confirm your account before logging in.',
          requiresEmailConfirmation: true,
        });
      } else {
        // Direct session created; transition into the Founder Dashboard
        setTimeout(() => {
          setActiveTab('dashboard');
        }, 600);
      }
    } else {
      setError(result.error || 'Failed to create account.');
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
          Create your account
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400 font-mono">
          Deploy your venture workspace with real-time AI startup intelligence.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="futuristic-card py-7 px-5 sm:px-8 rounded-2xl border border-cyan-500/20 shadow-2xl backdrop-blur-xl">
          {/* Missing Supabase Anon Key Banner if not yet configured */}
          {!isConfigured && (
            <div className="mb-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <div className="font-semibold text-amber-300">Supabase Setup Required</div>
                <div className="text-[11px] text-amber-200/90 mt-0.5">
                  Add your <code className="font-mono bg-amber-950/60 px-1 py-0.5 rounded text-amber-300">VITE_SUPABASE_ANON_KEY</code> to{' '}
                  <code className="font-mono bg-amber-950/60 px-1 py-0.5 rounded text-amber-300">.env</code> in your project root to activate live authentication.
                </div>
              </div>
            </div>
          )}

          {successInfo ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <Mail className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Check Your Inbox</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                {successInfo.message}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold font-mono text-cyan-300 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 transition-colors"
                >
                  Proceed to Sign In
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSignup}>
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label htmlFor="signup-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4 text-cyan-400/80" />
                  </div>
                  <input
                    id="signup-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ada Lovelace"
                    autoComplete="name"
                    className="glass-input block w-full pl-9 pr-3 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="signup-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4 text-cyan-400/80" />
                  </div>
                  <input
                    id="signup-email"
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
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="signup-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
                    Password
                  </label>
                  {password && (
                    <span className="text-[10px] font-mono text-cyan-400">
                      Strength: {strengthLabels[Math.max(0, strengthScore - 1)] || 'Weak'}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4 text-cyan-400/80" />
                  </div>
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="new-password"
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

                {/* Password Strength Meter */}
                {password && (
                  <div className="mt-2 space-y-1.5">
                    <div className="grid grid-cols-4 gap-1.5 h-1">
                      {[0, 1, 2, 3].map((step) => (
                        <div
                          key={step}
                          className={`rounded-full h-full transition-all duration-300 ${
                            strengthScore > step ? strengthColors[strengthScore - 1] : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-slate-400 pt-1">
                      <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-400' : ''}`}>
                        <Check className="w-2.5 h-2.5" /> 8+ chars
                      </span>
                      <span className={`flex items-center gap-1 ${hasUpper ? 'text-emerald-400' : ''}`}>
                        <Check className="w-2.5 h-2.5" /> Uppercase
                      </span>
                      <span className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-400' : ''}`}>
                        <Check className="w-2.5 h-2.5" /> Number
                      </span>
                      <span className={`flex items-center gap-1 ${hasSpecial ? 'text-emerald-400' : ''}`}>
                        <Check className="w-2.5 h-2.5" /> Symbol
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="signup-confirm-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-1.5">
                  Confirm password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4 text-cyan-400/80" />
                  </div>
                  <input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="new-password"
                    className="glass-input block w-full pl-9 pr-10 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="mt-1 text-[11px] text-rose-400 font-mono">Passwords do not match.</p>
                )}
              </div>

              {/* Terms Acceptance */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="accept-terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/40 focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="accept-terms" className="text-[11px] text-slate-400 leading-snug cursor-pointer">
                  I agree to the Terms of Service and acknowledge the Privacy Policy.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider font-mono mt-3"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Sign up</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Divider and Link to Sign In */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="text-center text-xs text-slate-400 font-mono">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="w-full mt-3 flex justify-center py-2.5 px-4 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-semibold font-mono text-slate-300 bg-slate-900/60 hover:bg-slate-850 focus:outline-none transition-colors cursor-pointer"
              >
                Sign in instead
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
