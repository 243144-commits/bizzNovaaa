import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { StartupModal } from './components/layout/StartupModal';
import { ToastContainer } from './components/common/ToastContainer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { MyStartupPage } from './pages/MyStartupPage';
import { AiInsightsPage } from './pages/AiInsightsPage';
import { IdeaAnalyzerPage } from './pages/IdeaAnalyzerPage';
import { MarketValidationPage } from './pages/MarketValidationPage';
import { CompetitorIntelligencePage } from './pages/CompetitorIntelligencePage';
import { CustomerPersonasPage } from './pages/CustomerPersonasPage';
import { OpportunityRiskRadarPage } from './pages/OpportunityRiskRadarPage';
import { BusinessModelPage } from './pages/BusinessModelPage';
import { MvpRoadmapPage } from './pages/MvpRoadmapPage';
import { TasksMilestonesPage } from './pages/TasksMilestonesPage';
import { GrowthAnalyticsPage } from './pages/GrowthAnalyticsPage';
import { StartupHealthPage } from './pages/StartupHealthPage';
import { FundingReadinessPage } from './pages/FundingReadinessPage';
import { NetworkCommunityPage } from './pages/NetworkCommunityPage';
import { LegalGuidancePage } from './pages/LegalGuidancePage';
import { AdminPage } from './pages/AdminPage';
import { AccountSettingsPage } from './pages/AccountSettingsPage';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, userRole, setUserRole } = useApp();
  const { user, profile, isLoading, isRecoveryMode } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync role from Supabase profile whenever profile is loaded / changes
  useEffect(() => {
    if (profile?.role && profile.role !== userRole) {
      setUserRole(profile.role);
    }
  }, [profile?.role, userRole, setUserRole]);

  // Authentication Route Guards
  useEffect(() => {
    if (isLoading) return;

    // 1. If password recovery mode is detected, navigate to reset password
    if (isRecoveryMode && activeTab !== 'reset-password') {
      setActiveTab('reset-password');
      return;
    }

    // 2. If authenticated user tries to open login or signup, redirect to dashboard
    if (user && ['login', 'signup'].includes(activeTab)) {
      setActiveTab('dashboard');
      return;
    }

    // 3. Admin Route Protection: Never let non-admins access admin panel
    const effectiveRole = profile?.role || userRole;
    if (activeTab === 'admin' && effectiveRole !== 'ADMIN') {
      setActiveTab('dashboard');
      return;
    }

    // 4. Account Settings Route Protection: If not logged in, redirect to login
    if (!user && activeTab === 'account-settings') {
      setActiveTab('login');
      return;
    }
  }, [user, profile, userRole, isLoading, isRecoveryMode, activeTab, setActiveTab]);

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#03050e] flex items-center justify-center cyber-grid text-slate-100">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.6)]">
            <span className="text-white font-bold text-lg">BN</span>
            <div className="absolute inset-0 rounded-2xl bg-cyan-400 opacity-40 blur-[6px] animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-bold text-white tracking-wide">BizzNova</div>
            <div className="flex items-center justify-center gap-2 text-cyan-400 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Initializing Founder OS...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standalone Fullscreen Public Views
  if (isRecoveryMode || activeTab === 'reset-password') {
    return (
      <>
        <ResetPasswordPage />
        <ToastContainer />
      </>
    );
  }

  if (['landing', 'login', 'signup'].includes(activeTab)) {
    return (
      <>
        {activeTab === 'landing' && <LandingPage />}
        {activeTab === 'login' && <LoginPage />}
        {activeTab === 'signup' && <SignupPage />}
        <StartupModal />
        <ToastContainer />
      </>
    );
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'my-startup':
        return <MyStartupPage />;
      case 'ai-insights':
        return <AiInsightsPage />;
      case 'idea-analyzer':
        return <IdeaAnalyzerPage />;
      case 'market-validation':
        return <MarketValidationPage />;
      case 'competitors':
        return <CompetitorIntelligencePage />;
      case 'customer-personas':
        return <CustomerPersonasPage />;
      case 'opportunity-radar':
        return <OpportunityRiskRadarPage />;
      case 'business-model':
      case 'revenue-simulator':
        return <BusinessModelPage />;
      case 'mvp-builder':
      case 'product-roadmap':
        return <MvpRoadmapPage />;
      case 'tasks':
        return <TasksMilestonesPage />;
      case 'growth-analytics':
      case 'failure-diagnosis':
        return <GrowthAnalyticsPage />;
      case 'startup-health':
        return <StartupHealthPage />;
      case 'funding-readiness':
      case 'pitch-deck':
        return <FundingReadinessPage />;
      case 'find-mentors':
      case 'team-matching':
      case 'competitions':
        return <NetworkCommunityPage />;
      case 'legal-guidance':
        return <LegalGuidancePage />;
      case 'admin':
        return <AdminPage />;
      case 'account-settings':
        return <AccountSettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#03050e] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden cyber-grid">
      {/* Cinematic Ambient Glow Lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[160px] animate-pulse-energy" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[180px]" />
        <div className="absolute -bottom-40 left-10 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[150px]" />
      </div>

      <Sidebar
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="lg:pl-72 flex flex-col min-h-screen relative z-10">
        <Header onToggleMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>

        <footer className="border-t border-cyan-500/15 px-6 py-4 text-center text-xs text-slate-400 font-mono bg-[#030612]/60 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-cyan-400 font-bold">BizzNova</span>
            <span>·</span>
            <span>AI Founder Operating System</span>
            <span>·</span>
            <span>Deterministic Intelligence Engine</span>
            <span>·</span>
            <span className="text-slate-400">© 2026</span>
          </div>
        </footer>
      </div>

      {/* Global Modals & Toast */}
      <StartupModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
