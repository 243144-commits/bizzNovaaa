import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Dynamic server-side Gemini client helper
let cachedAiClient: GoogleGenAI | null = null;
let cachedApiKey: string | undefined = undefined;

function getGeminiClient(): { client: GoogleGenAI | null; apiKey: string | undefined } {
  const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!key) {
    return { client: null, apiKey: undefined };
  }

  if (!cachedAiClient || cachedApiKey !== key) {
    try {
      cachedAiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      cachedApiKey = key;
      console.log('[BizzNova Backend] Google GenAI initialized successfully with gemini-3.8-flash');
    } catch (err) {
      console.error('[BizzNova Backend] Error initializing Google GenAI client:', err);
      return { client: null, apiKey: key };
    }
  }

  return { client: cachedAiClient, apiKey: key };
}

// Resilient content generator with model fallback
async function generateGeminiContent(
  aiClient: GoogleGenAI,
  prompt: string,
  preferredModel = 'gemini-3.5-flash-lite'
): Promise<{ text: string; modelUsed: string }> {
  const models = [preferredModel, 'gemini-3.8-flash', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await aiClient.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });
      if (response.text) {
        return { text: response.text, modelUsed: model };
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[BizzNova Backend] Model ${model} failed (${err?.message?.slice(0, 100) || err}), trying fallback model...`);
    }
  }

  throw lastError;
}

// System Status Endpoint
app.get('/api/system/status', (_req: Request, res: Response) => {
  const { client, apiKey } = getGeminiClient();
  res.json({
    status: 'ONLINE',
    version: '1.0.0-bizznova',
    aiProvider: client ? 'Google Gemini (gemini-3.5-flash-lite / gemini-3.8-flash)' : 'Deterministic Startup Engine',
    hasApiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// AI Idea Analyzer Endpoint
app.post('/api/ai/analyze-idea', async (req: Request, res: Response) => {
  const { idea, problem, solution, targetCustomer, industry, geography, businessModel } = req.body;

  if (!idea || !problem) {
    res.status(400).json({ error: 'idea and problem fields are required' });
    return;
  }

  // If Gemini API is configured, call gemini-3.8-flash
  const { client: aiClient } = getGeminiClient();
  if (aiClient) {
    try {
      const prompt = `You are a world-class startup investor, accelerator partner, and product strategist.
Analyze this startup idea with high intellectual rigor and transparency. Do not hype or flatter.

STARTUP DETAILS:
- One-line Idea: ${idea}
- Problem to Solve: ${problem}
- Proposed Solution: ${solution || 'Not specified'}
- Target Customer: ${targetCustomer || 'Not specified'}
- Industry: ${industry || 'Technology'}
- Target Geography: ${geography || 'Global'}
- Business Model: ${businessModel || 'Direct/Subscription'}

Evaluate across these 9 factors and give an honest score (0 to 100) and rationale for each:
1. Problem Clarity (15% weight)
2. Customer Pain Urgency (15% weight)
3. Target Market Attractiveness (12% weight)
4. Competitive Landscape (10% weight)
5. Differentiation & Defensibility (12% weight)
6. Monetization Potential (12% weight)
7. Scalability Potential (8% weight)
8. Technical Feasibility (8% weight)
9. Execution Difficulty (8% weight)

Return valid JSON strictly matching this schema:
{
  "overallScore": number (0-100 calculated weighted average),
  "confidence": "PROVISIONAL" | "MODERATE" | "HIGH",
  "factorScores": [
    {
      "factor": string,
      "score": number,
      "weight": number,
      "status": "EXCELLENT" | "SOLID" | "MODERATE" | "NEEDS_WORK" | "CRITICAL_RISK",
      "explanation": string,
      "basis": string
    }
  ],
  "strengths": string[],
  "weaknesses": string[],
  "unansweredQuestions": string[],
  "keyAssumptions": string[],
  "validationExperiments": [
    {
      "experiment": string,
      "hypothesis": string,
      "metric": string,
      "timeframe": string
    }
  ],
  "nextActions": [
    {
      "action": string,
      "reason": string,
      "priority": "HIGH" | "MEDIUM" | "LOW",
      "expectedOutcome": string
    }
  ]
}`;

      const { text: responseText, modelUsed } = await generateGeminiContent(aiClient, prompt);
      if (responseText) {
        const parsed = JSON.parse(responseText.trim());
        res.json({
          ...parsed,
          id: `analysis-${Date.now()}`,
          isAiGenerated: true,
          analyzedAt: new Date().toISOString(),
          modelUsed,
          disclaimer: 'Preliminary AI assessment. Scores provide diagnostic guidance to test, not a guarantee of commercial success.',
        });
        return;
      }
    } catch (apiError) {
      console.warn('[BizzNova Backend] Gemini call failed, falling back to deterministic engine:', apiError);
    }
  }

  // Deterministic fallback response
  // Compute transparent scores
  const pScore = Math.min(95, Math.max(40, 45 + (problem.length > 50 ? 25 : 10) + (targetCustomer?.length > 10 ? 15 : 0)));
  const painScore = Math.min(92, Math.max(45, 50 + (problem.toLowerCase().includes('cost') || problem.toLowerCase().includes('time') ? 25 : 10)));
  const diffScore = Math.min(90, solution?.length > 50 ? 75 : 55);
  const monScore = businessModel && businessModel !== 'Undecided' ? 78 : 52;
  const factors = [
    { factor: 'Problem Clarity', score: pScore, weight: 15, status: pScore > 75 ? 'EXCELLENT' : 'SOLID', explanation: 'Problem articulates a specific bottleneck in user workflows.', basis: 'Evaluated specificity and clarity of customer pain.' },
    { factor: 'Customer Pain Urgency', score: painScore, weight: 15, status: painScore > 75 ? 'EXCELLENT' : 'SOLID', explanation: 'Pain causes measurable friction in time or budget.', basis: 'Assessed consequence of leaving problem unsolved.' },
    { factor: 'Target Market Attractiveness', score: 74, weight: 12, status: 'SOLID', explanation: `Industry (${industry || 'Tech'}) shows sustainable demand.`, basis: 'Market growth indicators and segment accessibility.' },
    { factor: 'Competitive Landscape', score: 62, weight: 10, status: 'MODERATE', explanation: 'Existing workarounds and substitute solutions exist.', basis: 'Presence of incumbent tools and spreadsheet alternatives.' },
    { factor: 'Differentiation & Defensibility', score: diffScore, weight: 12, status: 'SOLID', explanation: 'Solution approaches workflow with distinct speed or automation.', basis: 'Proposed value proposition mechanism.' },
    { factor: 'Monetization Potential', score: monScore, weight: 12, status: 'SOLID', explanation: `Model (${businessModel || 'Direct'}) offers clear value exchange.`, basis: 'Willingness to pay and unit pricing viability.' },
    { factor: 'Scalability Potential', score: 76, weight: 8, status: 'SOLID', explanation: 'Digital architecture scales with minimal incremental cost.', basis: 'Software gross margin profile.' },
    { factor: 'Technical Feasibility', score: 82, weight: 8, status: 'EXCELLENT', explanation: 'Stack can be prototyped using standard modern frameworks.', basis: 'Tooling maturity and architectural simplicity.' },
    { factor: 'Execution Difficulty', score: 68, weight: 8, status: 'MODERATE', explanation: 'Primary hurdle is customer distribution and sales cycles.', basis: 'Go-to-market friction and adoption inertia.' },
  ];

  const overall = Math.round(factors.reduce((sum, f) => sum + (f.score * (f.weight / 100)), 0));

  res.json({
    id: `analysis-${Date.now()}`,
    overallScore: overall,
    confidence: 'PROVISIONAL',
    factorScores: factors,
    strengths: [
      'Identifiable core user problem with clear friction points.',
      'Feasible prototype scope achievable without heavy upfront infrastructure.',
      'Initial niche audience provides a manageable focus for early outreach.',
    ],
    weaknesses: [
      'Customer acquisition flywheel has not yet been experimentally proven.',
      'Switching inertia from existing manual habits requires compelling 10x improvement.',
      'Pricing willingness-to-pay needs validation through prospect pre-commitments.',
    ],
    unansweredQuestions: [
      'What specific trigger leads the customer to actively look for a solution this week?',
      'How much time or money does solving this save them monthly?',
      'Who holds the purchasing credit card or sign-off authority?',
    ],
    keyAssumptions: [
      'Users consider the existing workaround frustrating enough to spend budget replacing it.',
      'Onboarding can be completed self-serve without high-touch concierge setup.',
      'Customer lifetime value significantly outpaces initial blended acquisition cost.',
    ],
    validationExperiments: [
      { experiment: '5 Discovery Interviews', hypothesis: '80% of target users rank this in their top 3 weekly problems.', metric: 'Problem severity rating ≥ 8/10', timeframe: '7 days' },
      { experiment: 'High-Fidelity Smoke Test Page', hypothesis: 'Targeted visitors convert to waitlist at > 12%.', metric: 'Waitlist signup rate', timeframe: '5 days' },
      { experiment: 'Pre-Order / Pilot Commitment', hypothesis: 'At least 2 prospective buyers sign a letter of intent.', metric: 'Signed LOI count', timeframe: '14 days' },
    ],
    nextActions: [
      { action: 'Conduct 5 Mom-Test discovery interviews with target buyers', reason: 'Uncover genuine pain before presenting the solution.', priority: 'HIGH', expectedOutcome: 'Unbiased problem verification and direct customer quotes.' },
      { action: 'Build and ship an interactive single-flow MVP test', reason: 'Measure if users actually complete the primary action.', priority: 'HIGH', expectedOutcome: 'First usability benchmark and conversion rate.' },
      { action: 'Map out 3 direct competitors pricing and feature tiers', reason: 'Discover underserved customer tiers and pricing whitespace.', priority: 'MEDIUM', expectedOutcome: 'Clear competitive matrix and positioning differentiation.' },
    ],
    isAiGenerated: false,
    analyzedAt: new Date().toISOString(),
    disclaimer: 'Deterministic assessment generated by BizzNova Startup Engine. Connect GEMINI_API_KEY for dynamic generative analysis.',
  });
});

// Failure Diagnosis Endpoint
app.post('/api/ai/diagnose-failure', async (req: Request, res: Response) => {
  const { problemCategory, symptoms, startup } = req.body;

  const { client: aiClient } = getGeminiClient();
  if (aiClient) {
    try {
      const prompt = `You are a veteran startup turnaround specialist.
The founder is reporting this issue: "${problemCategory}".
Reported symptoms: ${JSON.stringify(symptoms || [])}
Startup Context:
- Stage: ${startup?.stage || 'Early'}
- Problem: ${startup?.problem || 'Unspecified'}
- Solution: ${startup?.solution || 'Unspecified'}
- Metrics: Users: ${startup?.metrics?.totalUsers || 0}, Revenue: $${startup?.metrics?.monthlyRevenue || 0}, Churn: ${startup?.metrics?.churnRate || 0}%

Provide a structured, brutally honest diagnostic report in JSON:
{
  "problemCategory": "${problemCategory}",
  "detectedSymptoms": string[],
  "possibleRootCauses": string[],
  "supportingEvidence": string[],
  "missingInformation": string[],
  "confidence": "LOW" | "MEDIUM" | "HIGH",
  "recommendedExperiments": string[],
  "threeNextActions": [
    {
      "action": string,
      "reason": string,
      "priority": "CRITICAL" | "HIGH" | "MEDIUM",
      "expectedOutcome": string,
      "suggestedPeriod": string
    }
  ]
}`;

      const { text: responseText } = await generateGeminiContent(aiClient, prompt);
      if (responseText) {
        res.json(JSON.parse(responseText.trim()));
        return;
      }
    } catch (e) {
      console.warn('Gemini failure diagnosis failed, falling back:', e);
    }
  }

  // Deterministic diagnosis based on category
  const diagnoses: Record<string, any> = {
    'Low customer acquisition': {
      possibleRootCauses: [
        'Value proposition does not convey immediate, tangible 10x ROI on the first screen.',
        'Target audience is too broad; marketing messages fail to resonate with any single persona.',
        'Distribution channels rely entirely on paid ads without organic word-of-mouth loops.',
      ],
      supportingEvidence: ['Recorded user acquisition growth is stagnating below target weekly cohorts.'],
      missingInformation: ['Funnel drop-off analytics between homepage visit and signup button click.'],
      confidence: 'MEDIUM',
      recommendedExperiments: [
        'A/B test a headline emphasizing specific time saved vs vague feature descriptions.',
        'Outreach to 30 targeted LinkedIn or niche community prospects with personalized value audits.',
      ],
      threeNextActions: [
        { action: 'Narrow ICP to single highest-urgency persona', reason: 'Generalist positioning dilutes conversion message.', priority: 'CRITICAL', expectedOutcome: 'Sharp positioning statement that converts 2x better.', suggestedPeriod: '48 hours' },
        { action: 'Audit top of funnel conversion analytics', reason: 'Pinpoint exact page bounce rates before spending on ads.', priority: 'HIGH', expectedOutcome: 'Identified dropoff step in signup flow.', suggestedPeriod: '3 days' },
        { action: 'Launch manual direct outreach pilot', reason: 'Uncover immediate objections through 1-on-1 prospect dialogue.', priority: 'HIGH', expectedOutcome: '5 qualitative feedback calls.', suggestedPeriod: '1 week' },
      ],
    },
    'Poor retention / High churn': {
      possibleRootCauses: [
        'Time-to-value is too long; new users do not achieve their "Aha!" moment in session 1.',
        'Product delivers temporary novelty rather than recurring operational utility.',
        'Core problem is episodic rather than continuous.',
      ],
      supportingEvidence: ['Customer churn rate exceeds sustainable SaaS benchmark (< 3%/mo).'],
      missingInformation: ['Day 1, Day 7, and Day 30 user activity cohorts.'],
      confidence: 'HIGH',
      recommendedExperiments: [
        'Implement an interactive 60-second onboarding checklist leading directly to first completion.',
        'Exit interview survey offering an incentive for churning users to share true cause.',
      ],
      threeNextActions: [
        { action: 'Conduct exit calls with last 5 churned users', reason: 'Directly identify the moment value stopped being delivered.', priority: 'CRITICAL', expectedOutcome: 'List of top 3 recurring reasons for abandonment.', suggestedPeriod: '72 hours' },
        { action: 'Streamline onboarding to single core workflow', reason: 'Eliminate distracting secondary features from initial setup.', priority: 'HIGH', expectedOutcome: '30% increase in Day-1 activation completion.', suggestedPeriod: '5 days' },
        { action: 'Set up automated email re-engagement for inactive users', reason: 'Prompt users at Day 3 before disengagement becomes permanent.', priority: 'MEDIUM', expectedOutcome: 'Reactivation of 10-15% of dormant signups.', suggestedPeriod: '1 week' },
      ],
    },
    'Weak revenue / Pricing friction': {
      possibleRootCauses: [
        'Pricing model is misaligned with the user value metric (e.g. charging per seat instead of usage).',
        'Target customers lack personal discretionary or operational budget to pay.',
        'Freemium tier is too generous, eliminating incentive to upgrade.',
      ],
      supportingEvidence: ['Users engage with free features but conversion to paid remains near zero.'],
      missingInformation: ['Price sensitivity survey data using Van Westendorp methodology.'],
      confidence: 'HIGH',
      recommendedExperiments: [
        'Introduce a hard feature gate on the single most valuable export or automation capability.',
        'Test a risk-free 14-day trial with credit card required upfront vs freemium.',
      ],
      threeNextActions: [
        { action: 'Recalibrate paywall boundaries on core high-value features', reason: 'Current free tier satisfies all immediate user requirements.', priority: 'CRITICAL', expectedOutcome: 'Immediate conversion pressure on power users.', suggestedPeriod: '3 days' },
        { action: 'Pitch existing active free users on paid pilot discount', reason: 'Test willingness to pay without building complex billing UI.', priority: 'HIGH', expectedOutcome: 'Cash commitment from first 3 customers.', suggestedPeriod: '5 days' },
        { action: 'Benchmark competitor tier boundaries', reason: 'Align packaging with industry expectations.', priority: 'MEDIUM', expectedOutcome: 'Clear pricing tiers: Starter, Pro, Business.', suggestedPeriod: '1 week' },
      ],
    },
  };

  const defaultDiag = diagnoses[problemCategory] || diagnoses['Low customer acquisition'];
  res.json({
    problemCategory: problemCategory || 'General Growth Obstacle',
    detectedSymptoms: symptoms && symptoms.length > 0 ? symptoms : ['Underperforming growth vs initial milestone expectations'],
    ...defaultDiag,
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[BizzNova Backend] Vite middleware mounted in dev mode');
  } else {
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

process.on('uncaughtException', (err) => {
  console.error('[BizzNova Server] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[BizzNova Server] Unhandled Rejection:', reason);
});

startServer().catch((err) => {
  console.error('[BizzNova Server] Failed to start:', err);
  process.exit(1);
});

