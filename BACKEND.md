# ⚙️ BizzNova — Backend Architecture & Technical Documentation

> **Platform:** [BizzNova — AI Founder Operating System](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova)  
> **Classification:** Engineering & Systems Architecture Documentation  
> **Backend Stack:** Node.js, Express, TypeScript (TSX), Google GenAI SDK (`@google/genai`), Supabase PostgreSQL (RLS & Triggers)  
> **Last Updated:** October 2026  

---

## 📋 Table of Contents
1. [Backend Architectural Overview](#1-backend-architectural-overview)
2. [Server Architecture & Lifecycle (`server.ts`)](#2-server-architecture--lifecycle-serverts)
3. [Dual-Engine AI Architecture (Gemini + Deterministic Engine)](#3-dual-engine-ai-architecture-gemini--deterministic-engine)
4. [Complete REST API Endpoints Specification](#4-complete-rest-api-endpoints-specification)
5. [Database Architecture & Supabase PostgreSQL](#5-database-architecture--supabase-postgresql)
6. [Row Level Security (RLS) & Preventing Infinite Recursion](#6-row-level-security-rls--preventing-infinite-recursion)
7. [Database Setup Scripts & Automation](#7-database-setup-scripts--automation)
8. [Security, Authentication & Role Management](#8-security-authentication--role-management)
9. [Environment Variables & Configuration](#9-environment-variables--configuration)
10. [Production Deployment & Resilience](#10-production-deployment--resilience)

---

## 1. Backend Architectural Overview

The backend of **BizzNova** is implemented in TypeScript and orchestrated via **Express** ([`server.ts`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/server.ts)). It is designed around two core responsibilities:
1. **Intelligent Diagnostics & Turnaround API**: Serving as the analytical computation hub powered by Google Gemini generative AI with seamless deterministic mathematical fallbacks.
2. **Unified Single-Port Hosting**: Serving both the REST API endpoints (`/api/*`) and the React 19 frontend through Vite's dev middleware during development, and serving optimized static assets from `dist/` in production.

### High-Level Systems Architecture

```
                                 Client Requests
                                        │
                                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│               BizzNova Express Engine (Port 3000 / 0.0.0.0)             │
├───────────────────────────────────────┬────────────────────────────────┤
│           REST API Router             │     Vite / Static Asset Handler│
│   (/api/system/*, /api/ai/*)          │  (Dev: Vite Middleware /       │
│                                       │   Prod: Express Static)        │
└───────────────────┬───────────────────┴────────────────────────────────┘
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
┌──────────────────┐  ┌──────────────────┐
│ Google Gemini    │  │ Deterministic    │
│ GenAI Engine     │  │ Startup Engine   │
│ (@google/genai)  │  │ (Algorithmic)    │
└──────────────────┘  └──────────────────┘
         │                     │
         └──────────┬──────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 Supabase PostgreSQL (Database & Auth)                  │
│  - auth.users (Credentials & Session Tokens)                           │
│  - public.profiles (RBAC Roles, Profiles, Metadata)                    │
│  - Recursive-Safe RLS Policies (is_admin() Security Definer)           │
│  - Automated Triggers (handle_new_user(), update_timestamp)            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Server Architecture & Lifecycle (`server.ts`)

The primary backend entrypoint is [`server.ts`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/server.ts).

### 1. Initialization & Middleware Stack
- **Environment Hydration**: Evaluates `.env` variables via `dotenv.config()`.
- **JSON Body Parsing**: `app.use(express.json())` processes incoming payloads.
- **Port Binding**: Binds to `0.0.0.0` on port `3000` (or `process.env.PORT`).

### 2. Dual-Mode Server Lifecycle
```typescript
async function startServer() {
  if (!isProduction) {
    // DEVELOPMENT MODE: Attach Vite middleware directly to Express
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[BizzNova Backend] Vite middleware mounted in dev mode');
  } else {
    // PRODUCTION MODE: Serve compiled static files from dist/
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[BizzNova Backend] Static files served from dist directory');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BizzNova Server] Running on http://0.0.0.0:${PORT}`);
  });
}
```

### 3. Exception & Rejection Handlers
To guarantee zero-crash server stability, `server.ts` registers global process event traps:
- `process.on('uncaughtException', ...)`: Catches and logs unhandled synchronous errors without abrupt process exit.
- `process.on('unhandledRejection', ...)`: Captures unhandled promise rejections (e.g., API timeouts or network drops).

---

## 3. Dual-Engine AI Architecture (Gemini + Deterministic Engine)

BizzNova is built with an **Anti-Fragile Dual-Engine Intelligence** philosophy:

```
┌──────────────────────────────────────────────────────────────┐
│                    Incoming AI Request                       │
└──────────────────────────────┬───────────────────────────────┘
                               │
                Is GEMINI_API_KEY Configured?
                               │
            ┌──────────────────┴──────────────────┐
           YES                                    NO
            │                                     │
            ▼                                     ▼
Execute Google GenAI Client               Execute Deterministic Engine
- Model: gemini-3.5-flash-lite            - Mathematical Scoring
- Fallback 1: gemini-3.8-flash            - Keyword Weighted Analysis
- Fallback 2: gemini-flash-latest         - Structured Playbooks
- Enforce JSON response MIME              - Zero External Dependency
            │                                     │
       Success?                                   │
      ┌─────┴─────┐                               │
     YES          NO (Error/Timeout)              │
      │           │                               │
      ▼           └──────────────┬────────────────┘
Return AI Result                 ▼
(isAiGenerated: true)   Return Deterministic Result
                        (isAiGenerated: false)
```

### 1. Dynamic Gemini Client Management
- The AI client is dynamically instantiated on-demand via `getGeminiClient()`.
- Supports hot-reloading: If `GEMINI_API_KEY` is added or changed in the environment at runtime, the client cache invalidates and rebuilds without restarting the process.

### 2. Multi-Model Cascade & Fallback
The `generateGeminiContent` helper implements an automated model cascade:
1. Primary: `gemini-3.5-flash-lite` (Ultra-low latency, optimized for structured JSON)
2. Secondary: `gemini-3.8-flash` (Advanced reasoning)
3. Tertiary: `gemini-flash-latest` (General availability fallback)
4. Fallback: If all remote API calls fail (e.g., network disconnect or quota exhaustion), the endpoint catches the error and executes the local **Deterministic Engine**.

---

## 4. Complete REST API Endpoints Specification

### 1. System Status Check
- **Endpoint**: `GET /api/system/status`
- **Description**: Returns health metrics, backend version, and AI provider status.
- **Request Parameters**: None.
- **Response Format (`application/json`)**:
```json
{
  "status": "ONLINE",
  "version": "1.0.0-bizznova",
  "aiProvider": "Google Gemini (gemini-3.5-flash-lite / gemini-3.8-flash)",
  "hasApiKey": true,
  "timestamp": "2026-10-27T14:30:00.000Z"
}
```

---

### 2. Startup Idea Analyzer
- **Endpoint**: `POST /api/ai/analyze-idea`
- **Description**: Evaluates a startup idea across 9 intellectual factors, generating a weighted overall score, factor rationale, strengths, weaknesses, unanswered questions, key assumptions, validation experiments, and next actions.
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "idea": "An AI-powered automated bookkeeping platform for solo freelancers",
  "problem": "Freelancers waste 8 hours each month manually categorizing receipts and invoice expenses",
  "solution": "Bank feed integration with automated OCR receipt scanning and tax category mapping",
  "targetCustomer": "Self-employed designers, developers, and consultants",
  "industry": "FinTech / SaaS",
  "geography": "North America & Europe",
  "businessModel": "SaaS Subscription ($19/month)"
}
```

- **The 9 Evaluation Factors & Weights**:
  1. **Problem Clarity** (15% weight)
  2. **Customer Pain Urgency** (15% weight)
  3. **Target Market Attractiveness** (12% weight)
  4. **Competitive Landscape** (10% weight)
  5. **Differentiation & Defensibility** (12% weight)
  6. **Monetization Potential** (12% weight)
  7. **Scalability Potential** (8% weight)
  8. **Technical Feasibility** (8% weight)
  9. **Execution Difficulty** (8% weight)

- **Response Format (`application/json`)**:
```json
{
  "id": "analysis-1791909876543",
  "overallScore": 79,
  "confidence": "HIGH",
  "factorScores": [
    {
      "factor": "Problem Clarity",
      "score": 85,
      "weight": 15,
      "status": "EXCELLENT",
      "explanation": "Problem articulates a specific, measurable bottleneck in monthly tax workflows.",
      "basis": "Evaluated specificity of time friction."
    },
    {
      "factor": "Customer Pain Urgency",
      "score": 82,
      "weight": 15,
      "status": "EXCELLENT",
      "explanation": "Pain causes direct monetary penalties and stress during tax filing season.",
      "basis": "Consequence of tax compliance delinquency."
    }
  ],
  "strengths": [
    "Identifiable core customer problem with continuous monthly frequency.",
    "Well-understood willingness-to-pay benchmark established by legacy accounting software.",
    "Scalable software gross margins (> 80%)."
  ],
  "weaknesses": [
    "Crowded competitive landscape dominated by QuickBooks, Xero, and FreshBooks.",
    "High switching cost and inertia for customers already embedded in a spreadsheet workflow."
  ],
  "unansweredQuestions": [
    "How does the product ensure 99.9% OCR accuracy without manual human review overhead?",
    "What is the customer acquisition cost (CAC) through organic vs paid search channels?"
  ],
  "keyAssumptions": [
    "Freelancers are willing to link their primary bank accounts to a new software startup.",
    "Automated categorization reduces preparation time by at least 70%."
  ],
  "validationExperiments": [
    {
      "experiment": "5 Mom-Test Discovery Calls",
      "hypothesis": "80% of surveyed freelancers spend > 5 hours/month on bookkeeping.",
      "metric": "Pain severity rating ≥ 8/10",
      "timeframe": "7 days"
    },
    {
      "experiment": "Smoke Test Waitlist Landing Page",
      "hypothesis": "Targeted ad visitors convert to waitlist at > 10%.",
      "metric": "Conversion rate",
      "timeframe": "5 days"
    }
  ],
  "nextActions": [
    {
      "action": "Interview 5 freelance consultants about their latest tax filing experience",
      "reason": "Identify the exact emotional moment when frustration peaks.",
      "priority": "HIGH",
      "expectedOutcome": "5 qualitative objection quotes."
    }
  ],
  "isAiGenerated": true,
  "analyzedAt": "2026-10-27T14:30:00.000Z",
  "modelUsed": "gemini-3.5-flash-lite",
  "disclaimer": "Preliminary assessment for diagnostic guidance; not a guarantee of commercial success."
}
```

---

### 3. Startup Failure Diagnosis & Turnaround Playbook
- **Endpoint**: `POST /api/ai/diagnose-failure`
- **Description**: Diagnoses growth bottlenecks, churn spikes, or revenue friction and prescribes targeted turnaround experiments.
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "problemCategory": "Low customer acquisition",
  "symptoms": [
    "Visitors bounce from homepage after 12 seconds",
    "Ad spend is yielding $120 CAC against $40 LTV"
  ],
  "startup": {
    "stage": "MVP",
    "problem": "Freelancers struggle with manual expense tracking",
    "solution": "Automated OCR receipt scanner",
    "metrics": {
      "totalUsers": 120,
      "monthlyRevenue": 450,
      "churnRate": 6.5
    }
  }
}
```

- **Supported Problem Categories**:
  - `Low customer acquisition`
  - `Poor retention / High churn`
  - `Weak revenue / Pricing friction`
  - General Growth Obstacles
- **Response Format (`application/json`)**:
```json
{
  "problemCategory": "Low customer acquisition",
  "detectedSymptoms": [
    "Visitors bounce from homepage after 12 seconds",
    "Ad spend is yielding $120 CAC against $40 LTV"
  ],
  "possibleRootCauses": [
    "Value proposition fails to convey immediate 10x ROI on above-the-fold screen.",
    "Positioning is too broad; fails to target the single highest-urgency niche."
  ],
  "supportingEvidence": [
    "High bounce rate indicates messaging mismatch with ad traffic expectation."
  ],
  "missingInformation": [
    "Funnel drop-off analytics between headline view and first CTA click."
  ],
  "confidence": "HIGH",
  "recommendedExperiments": [
    "A/B test headline emphasizing specific tax dollar savings vs generic features.",
    "Conduct 10 direct outreach calls to recent website visitors."
  ],
  "threeNextActions": [
    {
      "action": "Narrow ICP to single highest-urgency niche persona",
      "reason": "Broad messaging dilutes conversion intent.",
      "priority": "CRITICAL",
      "expectedOutcome": "Positioning statement that doubles CTA conversion.",
      "suggestedPeriod": "48 hours"
    }
  ]
}
```

---

## 5. Database Architecture & Supabase PostgreSQL

All persistence is managed via **Supabase PostgreSQL**. The complete schema is located in [`supabase_setup.sql`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/supabase_setup.sql) and mirrored in [`supabase/migrations/20261014_init_profiles.sql`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/supabase/migrations/20261014_init_profiles.sql).

### Table: `public.profiles`
Stores extended user profile data, display attributes, and role permissions.

```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL,
  full_name   TEXT        NOT NULL DEFAULT '',
  role        TEXT        NOT NULL DEFAULT 'FOUNDER'
                          CHECK (role IN ('FOUNDER','TEAM_MEMBER','MENTOR','INVESTOR','ADMIN')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Constraints & Relations
- `id`: Foreign key referencing Supabase's internal `auth.users(id)` table with `ON DELETE CASCADE`.
- `role`: Enforced by `CHECK (role IN ('FOUNDER','TEAM_MEMBER','MENTOR','INVESTOR','ADMIN'))`.

---

## 6. Row Level Security (RLS) & Preventing Infinite Recursion

Row Level Security is enabled on `public.profiles`:
```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

### The Infinite Recursion Bug & Solution
In PostgreSQL, writing an RLS policy on `public.profiles` that queries `public.profiles` (e.g., `WHERE EXISTS (SELECT 1 FROM public.profiles WHERE role = 'ADMIN')`) triggers **PostgreSQL Infinite Recursion (Error 42P17)** because the query inside the policy re-triggers the policy itself.

BizzNova resolves this using a **`SECURITY DEFINER`** function that bypasses RLS during administrative privilege checking:

```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'ADMIN'
  );
$$;
```

### Active RLS Policies
```sql
-- 1. Regular users can read their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- 2. Regular users can update their own profile, but CANNOT self-promote to ADMIN
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id AND role != 'ADMIN');

-- 3. Regular users can insert their own profile (self-promotion prevented)
CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id AND role != 'ADMIN');

-- 4. Administrators can view all user profiles across the entire platform
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (public.is_admin());

-- 5. Administrators can update any profile (including role elevations)
CREATE POLICY "Admins can update all profiles" 
ON public.profiles FOR UPDATE 
USING (public.is_admin());
```

---

## 7. Database Setup Scripts & Automation

### 1. Automatic User Creation Trigger
When a user signs up via Supabase Auth, the database trigger `on_auth_user_created` automatically inserts a corresponding row into `public.profiles`:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'FOUNDER'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();
```

### 2. Role Assignment Helper Function
Allows administrators to programmatically reassign roles via SQL:
```sql
SELECT set_user_role('founder@bizznova.demo',  'FOUNDER');
SELECT set_user_role('admin@bizznova.demo',     'ADMIN');
```

### 3. Automated Migration Runner (`setup-database.mjs`)
Located in [`setup-database.mjs`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/setup-database.mjs).  
Can be run from the command line using a Supabase Service Role key:
```bash
SUPABASE_SERVICE_ROLE_KEY=your_key node setup-database.mjs
```

---

## 8. Security, Authentication & Role Management

### Role Hierarchy & Capabilities Matrix

| Capability / API Scope | `FOUNDER` | `TEAM_MEMBER` | `MENTOR` | `INVESTOR` | `ADMIN` |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Access Public API Endpoints | ✅ | ✅ | ✅ | ✅ | ✅ |
| Execute 9-Factor Idea Stress-Test | ✅ | ❌ | ✅ | ❌ | ✅ |
| Execute Failure Diagnostics Engine | ✅ | ❌ | ❌ | ✅ | ✅ |
| View System Telemetry (`/api/system/status`) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Access Admin Management Console | ❌ | ❌ | ❌ | ❌ | ✅ |
| Modify User Roles in Database | ❌ | ❌ | ❌ | ❌ | ✅ |

### Privilege Escalation Mitigations
1. **Frontend Guard**: `src/services/supabase.ts` enforces `safeRole`: If a client requests `ADMIN` during profile insertion or self-update, the role is forced to `FOUNDER`.
2. **Database RLS Guard**: Policies specify `WITH CHECK (role != 'ADMIN')` for regular users.
3. **Admin Exclusivity**: Admin promotions can only be executed through PostgreSQL stored procedures (`set_user_role`) or by an existing authenticated `ADMIN` holding `is_admin() = true`.

---

## 9. Environment Variables & Configuration

Configured via [`.env`](file:///c:/Users/ASUS/OneDrive/Desktop/BizzNOVAR/biznova/.env) or system environment variables:

| Variable Name | Required | Default / Example | Purpose |
| :--- | :---: | :--- | :--- |
| `PORT` | Optional | `3000` | Port on which Express listens |
| `NODE_ENV` | Optional | `development` | Set to `production` to serve static `dist/` |
| `VITE_SUPABASE_URL` | **Required** | `https://txbxrppepxyfqmtgxkfd.supabase.co` | Supabase API URL |
| `VITE_SUPABASE_ANON_KEY` | **Required** | `eyJhbGciOi...` | Supabase Public Anonymous API Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | `eyJhbGciOi...` | Administrative key used strictly by `setup-database.mjs` |
| `GEMINI_API_KEY` | Optional | `AIzaSy...` | Enables dynamic generative AI analysis via Google GenAI SDK |

> **Note:** If `GEMINI_API_KEY` is omitted, BizzNova automatically operates in its high-intellectual-rigor **Deterministic Startup Engine** mode without throwing runtime errors.

---

## 10. Production Deployment & Resilience

### Running the Production Server
```bash
# 1. Build frontend distribution bundle
npm run build

# 2. Start production server (Node + Express)
NODE_ENV=production npm start
```

### Docker / Containerized Deployment
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Health Check Endpoint
Load balancers (e.g. AWS ALB, Google Cloud Run, Kubernetes, or Nginx) can point their liveness and readiness probes to:
```
GET /api/system/status
```
Returns HTTP `200 OK` with JSON status payload when the server is operational.
