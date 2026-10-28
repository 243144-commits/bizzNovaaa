# 🖥️ BizzNova — Frontend Architecture & Technical Documentation

> **Platform:** [BizzNova — AI Founder Operating System](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova)  
> **Classification:** Engineering & Architecture Documentation  
> **Frontend Stack:** React 19, TypeScript, Vite 6, Tailwind CSS v4, Lucide Icons, Framer Motion, GSAP, Recharts  
> **Last Updated:** October 2026  

---

## 📋 Table of Contents
1. [Architectural Overview](#1-architectural-overview)
2. [Technology Stack & Dependencies](#2-technology-stack--dependencies)
3. [Design System & Styling Philosophy](#3-design-system--styling-philosophy)
4. [Application Lifecycle & Routing Engine](#4-application-lifecycle--routing-engine)
5. [State Management & Context Providers](#5-state-management--context-providers)
6. [Component Architecture & Hierarchy](#6-component-architecture--hierarchy)
7. [Comprehensive Page-by-Page Directory (All 22 Pages)](#7-comprehensive-page-by-page-directory-all-22-pages)
8. [Services, Scoring Algorithms & API Client](#8-services-scoring-algorithms--api-client)
9. [TypeScript Data Contracts & Types](#9-typescript-data-contracts--types)
10. [Mock Data Fixtures & Demo Resilience](#10-mock-data-fixtures--demo-resilience)
11. [Build, Development & Verification Workflows](#11-build-development--verification-workflows)

---

## 1. Architectural Overview

The frontend of **BizzNova** is architected as a high-performance, single-page application (SPA) built on **React 19** and bundled with **Vite 6**. It functions as an **AI-driven Founder Operating System**, providing founders, team members, mentors, and investors with real-time diagnostic tools, deterministic calculators, and generative AI execution modules.

### High-Level Frontend Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        index.html (Entry Point)                        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                         src/main.tsx (Root Mount)
                                    │
                          src/App.tsx (Router)
                                    │
       ┌────────────────────────────┴───────────────────────────┐
       ▼                                                        ▼
AuthProvider (Supabase Auth)                  AppProvider (Global State)
       │                                                        │
       ├────────────────────────────────────────────────────────┤
       │                                                        │
       ▼                                                        ▼
Public Views:                              Protected Views (Console Layout):
├── LandingPage                            ├── Header (Sticky Bar, Role Switcher)
├── LoginPage                              ├── Sidebar (Role-Filtered Navigation)
├── SignupPage                             ├── Dynamic Page Renderer (22 Modules)
└── ResetPasswordPage                      ├── StartupModal (Create/Edit Startup)
                                           └── ToastContainer (Animated Alerts)
```

### Key Architectural Tenets
1. **Zero-Latency Client-Side Determinism**: Every core diagnostic score (Idea Analysis, Opportunity Score, Health Score, Financial Projections) is calculated deterministically on the client using mathematical models, ensuring instant feedback even when offline or when external AI APIs are unreachable.
2. **Dual-Mode AI Capability**: Seamlessly switches between Google Gemini generative AI (via backend endpoints) and transparent client-side mathematical scoring models without breaking user workflows.
3. **Strict Role-Based Access Control (RBAC)**: Dynamic UI filtering and navigation masking tailored for five distinct personas: `FOUNDER`, `TEAM_MEMBER`, `MENTOR`, `INVESTOR`, and `ADMIN`.
4. **Cinematic Cyberpunk/Space Aesthetic**: Rich dark palette (`#03050d` / `#03050e`), neon cyan (`#38bdf8`) and purple (`#a855f7`) accents, cybernetic grid overlays, and glassmorphism.

---

## 2. Technology Stack & Dependencies

| Layer | Package / Technology | Version | Purpose in BizzNova |
| :--- | :--- | :--- | :--- |
| **Framework** | `react` & `react-dom` | `^19.0.1` | Concurrent UI rendering, React hooks, Suspense-ready state lifecycle |
| **Language** | `typescript` | `^7.0.2` | Complete type-safety across all entities, metrics, forms, and contexts |
| **Bundler** | `vite` | `^8.3.0` | Ultra-fast Hot Module Replacement (HMR) and optimized rollup production bundles |
| **Styling** | `tailwindcss` & `@tailwindcss/vite` | `^4.3.3` | Tailwind CSS v4 CSS-first design system with CSS custom property tokens |
| **Icons** | `lucide-react` | `^0.546.0` | Modern, clean iconography across navigation, badges, buttons, and metrics |
| **Animations** | `motion` | `^12.23.24` | Smooth transitions, modal entry/exit, toast animations, accordion drops |
| **Physics/Canvas** | `gsap` | `^3.15.0` | Complex orbital tweens, keyframes, and futuristic radar animation effects |
| **Data Viz** | `recharts` | `^3.10.1` | Financial growth charts, radar risk plots, revenue projection curves |
| **Backend SDK** | `@supabase/supabase-js` | `^2.117.3` | Supabase Authentication, session persistence, and PostgreSQL profile synchronization |

---

## 3. Design System & Styling Philosophy

All global styling is defined in [`src/index.css`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/index.css).

### Color Palette & Tokens
- **Canvas / Root Background**: `#03050d` (Deep Space Dark)
- **Primary Cyber Accent**: `#38bdf8` (Cyan 400) / `#0284c7` (Cyan 600)
- **Intelligence Glow**: `#a855f7` (Purple 500) / `#7c3aed` (Violet 600)
- **Success / Validated**: `#10b981` (Emerald 500)
- **Warning / Assumption**: `#f59e0b` (Amber 500)
- **Danger / Critical Risk**: `#ef4444` (Rose 500)
- **Border Utility**: `border-cyan-500/15` and `border-slate-800`

### Custom CSS Classes & Effects
- `.cyber-grid`: A 40px × 40px grid pattern created using subtle linear gradients (`rgba(56, 189, 248, 0.04)`) to simulate a holographic terminal HUD.
- `.cyber-grid-dense`: A 20px × 20px purple grid pattern (`rgba(147, 51, 234, 0.05)`) used for specialized analytical modules.
- `@keyframes pulse-energy`: Alternates element scale and glow between cyan and purple drop-shadows.
- `@keyframes float-subtle`: Subtle vertical floating oscillation for floating 3D cards and badges.
- `@keyframes scanline`: Continuous vertical HUD scanline animation.
- Custom Scrollbars: Thin 5px cyan-tinted thumb (`rgba(56, 189, 248, 0.25)`) with hover brightness increase.

---

## 4. Application Lifecycle & Routing Engine

The routing engine resides in [`src/App.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/App.tsx). Rather than relying on browser URL routing which requires complex server fallback rules, BizzNova utilizes an **in-memory, state-driven router** governed by `activeTab` from `AppContext`.

### Route Classification

```
                    ┌────────────────────────────┐
                    │        Application         │
                    └─────────────┬──────────────┘
                                  │
          ┌───────────────────────┴───────────────────────┐
          ▼                                               ▼
   [Public Routes]                               [Protected Console Routes]
   - landing                                      - dashboard
   - login                                        - my-startup
   - signup                                       - ai-insights
   - reset-password                               - idea-analyzer
                                                  - market-validation
                                                  - competitors
                                                  - customer-personas
                                                  - opportunity-radar
                                                  - business-model
                                                  - revenue-simulator
                                                  - mvp-builder
                                                  - product-roadmap
                                                  - tasks
                                                  - growth-analytics
                                                  - failure-diagnosis
                                                  - startup-health
                                                  - funding-readiness
                                                  - pitch-deck
                                                  - find-mentors
                                                  - team-matching
                                                  - competitions
                                                  - legal-guidance
                                                  - admin (ADMIN role only)
                                                  - account-settings
```

### Route Guards Implemented in `AppContent`
1. **Password Recovery Guard**: If `window.location.hash` contains `type=recovery`, `isRecoveryMode` is set to `true`, forcing view transition to `ResetPasswordPage`.
2. **Authenticated Redirection**: If a user is authenticated (`user` exists) and navigates to `login` or `signup`, they are automatically redirected to `dashboard`.
3. **Role-Based Admin Protection**: If a user navigates to `admin` without the `ADMIN` role, they are redirected to `dashboard`.
4. **Account Settings Protection**: If an unauthenticated guest attempts to access `account-settings`, they are redirected to `login`.
5. **Loading Screen**: Renders a pulsing branded loader (`Initializing Founder OS...`) while Supabase session restoration is in flight.

---

## 5. State Management & Context Providers

BizzNova isolates concerns into two distinct React Context providers:

### 1. `AuthContext` ([`src/context/AuthContext.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/context/AuthContext.tsx))
Manages user authentication lifecycle, Supabase sessions, profile synchronization, and password recovery.

- **State Exposed:**
  - `user`: Supabase `User | null`
  - `session`: Supabase `Session | null`
  - `profile`: Extended `UserProfile | null` (stores `role`, `full_name`, `avatar_url`)
  - `isLoading`: Boolean indicating session restoration progress
  - `isConfigured`: Boolean flag checking if Supabase URL and Anon Key are valid
  - `isRecoveryMode`: Boolean flag for password reset workflow
- **Key Methods:**
  - `signIn(email, password)`: Authenticates user credentials via `supabase.auth.signInWithPassword`.
  - `signUp(fullName, email, password)`: Registers new user and attaches `full_name` metadata.
  - `signOut()`: Terminates session via Supabase Auth and clears local state.
  - `requestPasswordReset(email)`: Triggers password reset email via `supabase.auth.resetPasswordForEmail`.
  - `updatePassword(newPassword)`: Updates user password via `supabase.auth.updateUser`.
  - `refreshProfile()`: Manually re-fetches the latest profile data from `public.profiles`.

### 2. `AppContext` ([`src/context/AppContext.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/context/AppContext.tsx))
Manages global startup data, active role, current active tab, startup switcher, and module-level entities.

- **State Exposed:**
  - `userRole`: Current active role (`FOUNDER`, `TEAM_MEMBER`, `MENTOR`, `INVESTOR`, `ADMIN`).
  - `activeTab`: Current visible view string identifier.
  - `startups`: Array of `Startup` objects.
  - `activeStartupId` & `activeStartup`: Currently selected startup instance.
  - `validationItems`: Array of `MarketValidationItem` tags (Facts, Assumptions, Hypotheses).
  - `personas`: Array of `CustomerPersona` objects.
  - `competitors`: Array of `Competitor` items.
  - `tasks` & `milestones`: Execution trackers and stage roadmaps.
  - `mentors`, `teamCandidates`, `competitions`: Network and ecosystem directory data.
  - `risks`: Opportunity and risk radar entries.
  - `pitchDeckSlides`: 12-Slide deck state and contents.
  - `toasts`: Array of active alert notifications.
- **Key Methods:**
  - `addStartup`, `updateStartup`, `deleteStartup`: Full CRUD operations on startups.
  - `openStartupModal`, `closeStartupModal`: Triggers the global create/edit startup modal.
  - `addValidationItem`, `updateValidationItem`, `deleteValidationItem`: Market validation management.
  - `addTask`, `updateTask`, `deleteTask`, `toggleMilestone`: Task execution and milestone updates.
  - `addToast(type, title, message)`: Pushes notification to the screen with auto-dismiss timer.

---

## 6. Component Architecture & Hierarchy

All reusable UI elements reside in [`src/components/`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/components/).

### 1. Layout Components (`src/components/layout/`)
- [`Header.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/components/layout/Header.tsx):
  - **What it does**: Top horizontal navigation bar.
  - **Features**: Active startup switcher dropdown, "+ New Startup" trigger, live system status pill (`ONLINE` / `LOCAL_MODE`), Notification popover, 1-Click Role Switcher modal trigger (for instant testing across all 5 roles), and User Account Dropdown (displaying user email, role badge, navigation to Account Settings, Admin Console, and Sign Out).
- [`Sidebar.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/components/layout/Sidebar.tsx):
  - **What it does**: Left vertical navigation dock.
  - **Features**: Grouped navigation links (Strategy, Validation, Execution, Growth, Network, System), real-time RBAC filtering (only reveals tabs permitted for active role), active startup health gauge, stage progression badge, and mobile drawer slide-out support.
- [`StartupModal.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/components/layout/StartupModal.tsx):
  - **What it does**: Global modal for creating new startups or editing existing startup parameters.
  - **Features**: Multi-tab form configuring Startup Identity, Problem/Solution, Target Market, Stage (`IDEA` to `SCALE`), Product Status, Financial Metrics (Monthly Revenue, Burn, Runway, Users, Churn Rate), and Team Size.

### 2. Specialized & 3D Components (`src/components/3d/`)
- [`GlowingIntelligenceCore.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/components/3d/GlowingIntelligenceCore.tsx):
  - **What it does**: Interactive animated visual center representing the "AI Brain" / "Deterministic Intelligence Engine".
  - **Features**: Multi-ring concentric orbital spheres, dynamic particle clusters, pulsating gradient energy cores, and real-time hover interactivity used on landing and diagnostic overview pages.

### 3. Common Components (`src/components/common/`)
- [`ToastContainer.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/components/common/ToastContainer.tsx):
  - **What it does**: Floating toast notification manager positioned at bottom-right.
  - **Features**: Renders alert cards with color-coded iconography based on toast type (`success`, `error`, `warning`, `info`) with smooth Framer Motion entry and auto-exit animations.

---

## 7. Comprehensive Page-by-Page Directory (All 22 Pages)

Every page in [`src/pages/`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/pages/) has a specific purpose, state dependency, and role permission.

```
src/pages/
├── 1. LandingPage.tsx                  (Public Marketing & Hero)
├── 2. LoginPage.tsx                    (Auth & 1-Click Demo Logins)
├── 3. SignupPage.tsx                   (User Registration)
├── 4. ResetPasswordPage.tsx            (Password Recovery Callback)
├── 5. AccountSettingsPage.tsx          (User Profile & Password Management)
├── 6. DashboardPage.tsx                (Executive Central Cockpit)
├── 7. MyStartupPage.tsx                (Startup Detail & Metrics Editor)
├── 8. AiInsightsPage.tsx               (High-Level AI Strategic Briefing)
├── 9. IdeaAnalyzerPage.tsx             (9-Factor Startup Idea Stress-Test)
├── 10. MarketValidationPage.tsx        (Evidence Tracker & Customer Interviews)
├── 11. CompetitorIntelligencePage.tsx  (Competitor Matrix & Whitespace Map)
├── 12. CustomerPersonasPage.tsx        (ICP Profiles & Empathy Maps)
├── 13. OpportunityRiskRadarPage.tsx    (Opportunity Radar & Risk Mitigation)
├── 14. BusinessModelPage.tsx           (Business Model Canvas & Revenue Simulator)
├── 15. MvpRoadmapPage.tsx              (MVP Scope Builder & Release Roadmap)
├── 16. TasksMilestonesPage.tsx         (Kanban Task Board & Stage Milestones)
├── 17. GrowthAnalyticsPage.tsx         (Cohort Analytics & Turnaround Playbooks)
├── 18. StartupHealthPage.tsx           (6-Pillar Health Score Breakdown)
├── 19. FundingReadinessPage.tsx        (Investment Radar & 12-Slide Pitch Deck)
├── 20. NetworkCommunityPage.tsx        (Mentors, Co-founders & Pitch Competitions)
├── 21. LegalGuidancePage.tsx           (Incorporation, IP & Equity Checklists)
└── 22. AdminPage.tsx                   (System Telemetry & User Management)
```

### Detailed Breakdown of Every Page:

#### 1. [`LandingPage.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/pages/LandingPage.tsx)
- **Purpose**: Public-facing marketing portal introducing BizzNova's value proposition.
- **Key Features**: Interactive hero with `GlowingIntelligenceCore`, feature cards showcasing the 9-Factor Idea Stress-Test, Dual-Engine AI, RBAC matrix preview, testimonial tickers, and CTA buttons leading to Demo Login or Signup.
- **RBAC**: Public (Accessible to all guests).

#### 2. [`LoginPage.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/pages/LoginPage.tsx)
- **Purpose**: Secure user sign-in and quick demo evaluation portal.
- **Key Features**: Email/Password form authenticated via Supabase; Password recovery link; and **1-Click Quick Demo Login** buttons for local role previews (`FOUNDER`, `TEAM_MEMBER`, `MENTOR`, `INVESTOR`, `ADMIN`) without authenticating a Supabase user.
- **RBAC**: Public.

#### 3. [`SignupPage.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/pages/SignupPage.tsx)
- **Purpose**: New user onboarding and account creation.
- **Key Features**: Full Name, Email, Password, and Confirmation inputs. Automatically initializes user profile with `FOUNDER` role upon registration.
- **RBAC**: Public.

#### 4. [`ResetPasswordPage.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/pages/ResetPasswordPage.tsx)
- **Purpose**: Handles password reset link callbacks and updates credentials.
- **Key Features**: Automatically activated when URL hash contains `#type=recovery`. Validates password strength and executes `supabase.auth.updateUser` to store new password.
- **RBAC**: Public / Recovery token holders.

#### 5. [`AccountSettingsPage.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/pages/AccountSettingsPage.tsx)
- **Purpose**: Self-serve profile customization and credential management.
- **Key Features**: Display name updates, email verification status badge, current assigned RBAC role display, and secure in-app password change form.
- **RBAC**: All Authenticated Users.

#### 6. [`DashboardPage.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/pages/DashboardPage.tsx)
- **Purpose**: Executive cockpit summarizing total startup health, traction, and priority actions.
- **Key Features**: Startup Health Gauge (0-100), Runway and Burn summary cards, Monthly Revenue chart, Stage progress bar, urgent alert banner, and role-customized quick action widgets.
- **RBAC**: All Roles (Different card layouts rendered per role).

#### 7. [`MyStartupPage.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/pages/MyStartupPage.tsx)
- **Purpose**: Deep-dive profile of the currently active startup.
- **Key Features**: Visual overview of tagline, problem statement, solution, target customer, expected pricing, cash runway calculation, monthly burn, team headcount, and instant edit button to open `StartupModal`.
- **RBAC**: `FOUNDER`, `TEAM_MEMBER`, `ADMIN`.

#### 8. [`AiInsightsPage.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/pages/AiInsightsPage.tsx)
- **Purpose**: High-level strategic briefing synthesized from active startup metrics.
- **Key Features**: Strategic health summary, key growth levers identified by AI, top 3 risks, and suggested tactical moves for the current sprint.
- **RBAC**: `FOUNDER`, `MENTOR`, `INVESTOR`, `ADMIN`.

#### 9. [`IdeaAnalyzerPage.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/pages/IdeaAnalyzerPage.tsx)
- **Purpose**: Intellectual stress-testing engine for new or existing startup concepts.
- **Key Features**: Interactive evaluation form (Idea, Problem, Solution, Customer, Industry, Geography, Business Model). Generates an **Overall Score (0-100)** across **9 distinct weighted factors** (Problem Clarity, Pain Urgency, Market Attractiveness, Competition, Differentiation, Monetization, Scalability, Feasibility, Execution Difficulty), Strengths, Weaknesses, Unanswered Questions, Key Assumptions, and Validation Experiments.
- **RBAC**: `FOUNDER`, `MENTOR`, `ADMIN`.

#### 10. [`MarketValidationPage.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/pages/MarketValidationPage.tsx)
- **Purpose**: Eliminates confirmation bias through evidence-based validation tracking.
- **Key Features**: Validation Board categorizing claims into `FACT`, `USER INPUT`, `ASSUMPTION`, `AI ESTIMATE`, and `RECOMMENDATION`; Customer Discovery Interview logging tool with outcome tags (`SUPPORTS_HYPOTHESIS`, `NEUTRAL`, `CONTRADICTS_HYPOTHESIS`).
- **RBAC**: `FOUNDER`, `MENTOR`, `ADMIN`.

#### 11. [`CompetitorIntelligencePage.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/pages/CompetitorIntelligencePage.tsx)
- **Purpose**: Competitive landscape analysis and whitespace discovery.
- **Key Features**: Competitor list with pricing tiers, strengths, weaknesses, and defensibility scores; interactive 2x2 Positioning Matrix plotting competitors across custom axes (e.g., Price vs Feature Completeness).
- **RBAC**: `FOUNDER`, `INVESTOR`, `ADMIN`.

#### 12. [`CustomerPersonasPage.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/pages/CustomerPersonasPage.tsx)
- **Purpose**: Defines Ideal Customer Profiles (ICPs) and buyer empathy maps.
- **Key Features**: Persona profile cards detailing Job Title, Industry, Budget Authority, Primary Goals, Daily Frustrations, Buying Triggers, and Willingness to Pay thresholds.
- **RBAC**: `FOUNDER`, `ADMIN`.

#### 13. [`OpportunityRiskRadarPage.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/pages/OpportunityRiskRadarPage.tsx)
- **Purpose**: Proactive identification and mitigation of existential startup threats.
- **Key Features**: Radar threat matrix categorized across Market, Technical, Financial, and Regulatory domains; Severity vs Probability scores; and documented mitigation protocols.
- **RBAC**: `FOUNDER`, `INVESTOR`, `ADMIN`.

#### 14. [`BusinessModelPage.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/pages/BusinessModelPage.tsx)
- **Purpose**: Business Model Canvas and dynamic 12-month financial projections.
- **Key Features**: 9-Box Lean Canvas (Value Props, Channels, Revenue Streams, Cost Structure); and an **Interactive Revenue Simulator** allowing sliders for Monthly Traffic, Conversion Rate (%), Average Order Value / ARPU ($), Churn Rate (%), and Fixed Monthly Costs to project 12-month ARR, burn, and break-even month.
- **RBAC**: `FOUNDER`, `INVESTOR`, `ADMIN`.

#### 15. [`MvpRoadmapPage.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/pages/MvpRoadmapPage.tsx)
- **Purpose**: Scopes Minimum Viable Products using MoSCoW prioritization.
- **Key Features**: Interactive feature board organizing scope into Must Have, Should Have, Could Have, and Won't Have; Target release dates; Effort vs Impact estimations.
- **RBAC**: `FOUNDER`, `TEAM_MEMBER`, `ADMIN`.

#### 16. [`TasksMilestonesPage.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/pages/TasksMilestonesPage.tsx)
- **Purpose**: Tactical sprint execution tracking and macro milestone roadmap.
- **Key Features**: Kanban Task Board (`TODO`, `IN_PROGRESS`, `BLOCKED`, `COMPLETED`) with task priorities and assignees; and chronological Milestone Tracker linked to startup funding stages.
- **RBAC**: `FOUNDER`, `TEAM_MEMBER`, `ADMIN`.

#### 17. [`GrowthAnalyticsPage.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/pages/GrowthAnalyticsPage.tsx)
- **Purpose**: Traction diagnosis and automated turnaround playbooks.
- **Key Features**: Historical revenue, burn, and user growth trendlines; Churn and Retention metrics; and **Autonomous Turnaround Diagnostic Engine** analyzing failure categories (`Low customer acquisition`, `Poor retention / High churn`, `Weak revenue / Pricing friction`) to recommend concrete 72-hour turnaround experiments.
- **RBAC**: `FOUNDER`, `INVESTOR`, `ADMIN`.

#### 18. [`StartupHealthPage.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/pages/StartupHealthPage.tsx)
- **Purpose**: Comprehensive 6-Pillar health audit.
- **Key Features**: Composite Health Score (0-100) calculated from Market Opportunity, Product Validation, Financial Runway, Team Execution, Customer Traction, and Defensibility; with actionable flags highlighting critical vulnerabilities.
- **RBAC**: `FOUNDER`, `INVESTOR`, `ADMIN`.

#### 19. [`FundingReadinessPage.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/pages/FundingReadinessPage.tsx)
- **Purpose**: Venture capital fundraising preparation and presentation builder.
- **Key Features**: Investor Readiness Score (0-100); Valuation estimator; Dilution calculator; and **Interactive 12-Slide Pitch Deck Builder** (Cover, Problem, Solution, Market TAM, Product, Business Model, Traction, Competition, Team, Financials, Milestones, The Ask) with export capabilities.
- **RBAC**: `FOUNDER`, `INVESTOR`, `ADMIN`.

#### 20. [`NetworkCommunityPage.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/pages/NetworkCommunityPage.tsx)
- **Purpose**: Advisory matching, talent discovery, and grant/pitch competition directory.
- **Key Features**: Filterable Mentor Directory with booking requests; Co-founder and Team Member Talent Matching board; and Global Pitch Competition & Accelerator Application tracker.
- **RBAC**: `FOUNDER`, `MENTOR`, `ADMIN`.

#### 21. [`LegalGuidancePage.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/pages/LegalGuidancePage.tsx)
- **Purpose**: Startup compliance, incorporation, and intellectual property checklists.
- **Key Features**: Step-by-step guides for entity formation (Delaware C-Corp, LLC), Founder Stock Purchase Agreements, 83(b) tax elections, IP Assignment agreements, NDAs, and SAFE note templates.
- **RBAC**: `FOUNDER`, `ADMIN`.

#### 22. [`AdminPage.tsx`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/pages/AdminPage.tsx)
- **Purpose**: Master operational console for platform administrators.
- **Key Features**: Real-time system telemetry, active user counts, database synchronization health, AI engine connectivity status, user profile role management, and system logs.
- **RBAC**: `ADMIN` Only.

---

## 8. Services, Scoring Algorithms & API Client

All business logic, deterministic mathematics, and API communication are located in [`src/services/`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/services/).

### 1. `scoring.ts` ([`src/services/scoring.ts`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/services/scoring.ts))
Contains deterministic mathematical evaluation functions:
- **`calculateMarketOpportunityScore(startup)`**:
  - Problem Clarity: 20%
  - Market Scale: 20%
  - Competitive Differentiation: 15%
  - Monetization Viability: 15%
  - Growth Potential: 15%
  - Execution Feasibility: 15%
- **`calculateStartupHealthScore(startup)`**:
  - Evaluates runway months, burn rate, churn, stage alignment, and team capacity into a composite score (0-100).
- **`generateDeterministicIdeaAnalysis(data)`**:
  - Evaluates 9 factors deterministically when offline, generating structured strengths, weaknesses, assumptions, and validation tests.
- **`simulateRevenue(inputs)`**:
  - Projects 12-month compounding ARR, active customers, churn degradation, and net cash flow curves.

### 2. `api.ts` ([`src/services/api.ts`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/services/api.ts))
Acts as the client bridge to the backend server:
- `checkSystemStatus()`: Polls `GET /api/system/status`. Falls back to `LOCAL_MODE` if backend is unreachable.
- `analyzeIdeaViaBackend(data)`: Sends POST request to `/api/ai/analyze-idea`. If the network fails or endpoint returns an error, transparently calls `generateDeterministicIdeaAnalysis(data)`.
- `diagnoseStartupFailure(payload)`: Sends POST request to `/api/ai/diagnose-failure` with automatic client-side fallback.

### 3. `supabase.ts` ([`src/services/supabase.ts`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/services/supabase.ts))
- Instantiates the official Supabase Client with `localStorage` session persistence.
- Provides `isSupabaseConfigured()` to verify that keys are present and not placeholders.
- Provides `fetchUserProfile(userId)` and `upsertUserProfile(profile)` with built-in protection against client-side role privilege escalation.

---

## 9. TypeScript Data Contracts & Types

Defined in [`src/types/index.ts`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/types/index.ts).

### Primary Types Reference
- `UserRole`: `'FOUNDER' | 'TEAM_MEMBER' | 'MENTOR' | 'INVESTOR' | 'ADMIN'`
- `StartupStage`: `'IDEA' | 'VALIDATION' | 'MVP' | 'EARLY_TRACTION' | 'GROWTH' | 'SCALE'`
- `ProductStatus`: `'CONCEPT' | 'PROTOTYPE_IN_PROGRESS' | 'BETA_LIVE' | 'IN_PRODUCTION' | 'SUNSET'`
- `ValidationTag`: `'FACT' | 'USER INPUT' | 'ASSUMPTION' | 'AI ESTIMATE' | 'RECOMMENDATION'`
- `TaskStatus`: `'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED'`
- `TaskPriority`: `'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'`

---

## 10. Mock Data Fixtures & Demo Resilience

Located in [`src/data/mockData.ts`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/src/data/mockData.ts).

To ensure high reliability during live venture pitches, user testing, or offline development:
- Contains pre-configured, realistic startups (e.g. *NovaMetrics AI*, *FlowStack OS*, *EcoSupply Chain*).
- Complete with historical monthly financial records, active competitors, verified user interviews, persona profiles, tasks, and mentor directory.
- Guarantees that even without internet access or an active Supabase connection, the entire user interface functions seamlessly.

---

## 11. Build, Development & Verification Workflows

### Running in Development
```bash
# Starts both frontend Vite middleware and Express backend on single unified port
npm run dev
```

### Static Type Checking
```bash
npm run lint
# Executes: tsc --noEmit
```

### Compiling Production Bundle
```bash
npm run build
# Executes: vite build
# Artifacts compiled to /dist
```

### Previewing Production Build
```bash
npm run preview
```
