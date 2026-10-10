import { IdeaAnalysis, FailureDiagnosis, Startup } from '../types';
import { generateDeterministicIdeaAnalysis } from './scoring';

export async function checkSystemStatus() {
  try {
    const res = await fetch('/api/system/status');
    if (!res.ok) throw new Error('Status HTTP error');
    return await res.json();
  } catch (err) {
    return {
      status: 'LOCAL_MODE',
      version: '1.0.0-client',
      aiProvider: 'Client Deterministic Engine',
      hasApiKey: false,
    };
  }
}

export async function analyzeIdeaViaBackend(data: {
  idea: string;
  problem: string;
  solution: string;
  targetCustomer: string;
  industry: string;
  geography: string;
  businessModel?: string;
}): Promise<IdeaAnalysis> {
  try {
    const res = await fetch('/api/ai/analyze-idea', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend call failed, using client fallback:', err);
  }

  // Graceful deterministic fallback
  return generateDeterministicIdeaAnalysis(data);
}

export async function diagnoseStartupFailure(payload: {
  problemCategory: string;
  symptoms: string[];
  startup: Startup;
}): Promise<FailureDiagnosis> {
  try {
    const res = await fetch('/api/ai/diagnose-failure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend failure diagnosis failed, using client fallback:', err);
  }

  // Client deterministic fallback
  return {
    problemCategory: payload.problemCategory,
    detectedSymptoms: payload.symptoms.length > 0 ? payload.symptoms : ['Growth velocity below initial projections'],
    possibleRootCauses: [
      'Value proposition does not convey immediate, tangible 10x ROI on the first screen.',
      'Target audience is too broad; marketing messages fail to resonate with any single persona.',
      'Core workflow requires high onboarding inertia before value realization.',
    ],
    supportingEvidence: ['Stagnant activation rates and conversion friction reported by early visitors.'],
    missingInformation: ['Funnel drop-off analytics between homepage visit and signup button click.'],
    confidence: 'MEDIUM',
    recommendedExperiments: [
      'A/B test a headline emphasizing specific time saved vs vague feature descriptions.',
      'Outreach to 30 targeted prospects with a concise 3-question survey.',
    ],
    threeNextActions: [
      {
        action: 'Conduct 5 exit interviews with drop-off users',
        reason: 'Identify exact step where friction overwhelmed willingness to continue.',
        priority: 'CRITICAL',
        expectedOutcome: 'Direct qualitative root causes documented.',
        suggestedPeriod: '72 hours',
      },
      {
        action: 'Simplify onboarding flow to single core action',
        reason: 'Eliminate secondary form fields during initial setup.',
        priority: 'HIGH',
        expectedOutcome: '30% increase in Day-1 completion rate.',
        suggestedPeriod: '5 days',
      },
      {
        action: 'Audit competitor pricing tiers and feature gates',
        reason: 'Verify if pricing structure aligns with buyer expectations.',
        priority: 'MEDIUM',
        expectedOutcome: 'Competitive pricing matrix established.',
        suggestedPeriod: '1 week',
      },
    ],
  };
}
