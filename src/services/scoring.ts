import {
  Startup,
  StartupHealthScore,
  FactorScore,
  IdeaAnalysis,
  RevenueSimulatorInputs,
  SimulationResult,
  MonthlyProjection,
  MentorProfile,
  TeamMemberCandidate,
} from '../types';

/**
 * DETERMINISTIC MARKET OPPORTUNITY SCORING
 * Customer Problem: 20%
 * Market Size: 20%
 * Competition: 15%
 * Monetization: 15%
 * Growth Potential: 15%
 * Execution Feasibility: 15%
 */
export function calculateMarketOpportunityScore(startup: Partial<Startup>) {
  const weights = {
    problem: 0.20,
    marketSize: 0.20,
    competition: 0.15,
    monetization: 0.15,
    growth: 0.15,
    execution: 0.15,
  };

  // Evaluate problem definition depth
  const problemLength = (startup.problem || '').trim().length;
  const problemScore = Math.min(95, Math.max(30, 35 + (problemLength > 60 ? 30 : problemLength > 20 ? 15 : 0) + (startup.targetCustomers ? 25 : 0)));

  // Evaluate market size assumption
  const industryKnown = Boolean(startup.industry && startup.industry !== 'Other');
  const locationKnown = Boolean(startup.location && startup.location.trim().length > 2);
  const marketSizeScore = (industryKnown ? 45 : 25) + (locationKnown ? 35 : 15);

  // Evaluate competition / differentiation
  const diffScore = startup.solution && startup.solution.length > 50 ? 70 : 45;

  // Evaluate monetization model clarity
  const hasModel = Boolean(startup.businessModel && startup.businessModel !== 'Undecided');
  const hasPricing = Boolean(startup.expectedPricing && startup.expectedPricing.trim().length > 0);
  const monetizationScore = (hasModel ? 50 : 20) + (hasPricing ? 35 : 10);

  // Growth potential based on target customer scale
  const growthScore = startup.stage === 'SCALE' ? 90 : startup.stage === 'GROWTH' ? 82 : startup.stage === 'EARLY_TRACTION' ? 75 : startup.stage === 'MVP' ? 65 : 55;

  // Execution feasibility based on budget, team size, product status
  const teamScore = (startup.teamSize || 1) >= 2 ? 40 : 25;
  const budgetScore = (startup.estimatedBudget || 0) > 0 ? 30 : 15;
  const statusScore = startup.productStatus === 'IN_PRODUCTION' ? 25 : startup.productStatus === 'BETA_LIVE' ? 20 : 10;
  const executionScore = teamScore + budgetScore + statusScore;

  const totalWeighted = (
    problemScore * weights.problem +
    marketSizeScore * weights.marketSize +
    diffScore * weights.competition +
    monetizationScore * weights.monetization +
    growthScore * weights.growth +
    executionScore * weights.execution
  );

  const rounded = Math.round(totalWeighted);

  return {
    overallScore: rounded,
    isProvisional: !startup.targetCustomers || !startup.problem || !startup.expectedPricing,
    factors: [
      { factor: 'Customer Problem Urgency', score: problemScore, weight: 20, explanation: 'Clarity and critical pain level of target audience problem.' },
      { factor: 'Target Market Scale', score: marketSizeScore, weight: 20, explanation: 'Identifiable industry vertical and geographical reach.' },
      { factor: 'Competitive Differentiation', score: diffScore, weight: 15, explanation: 'Clear unique value proposition vs existing workarounds.' },
      { factor: 'Monetization Feasibility', score: monetizationScore, weight: 15, explanation: 'Defined business model and concrete willingness-to-pay model.' },
      { factor: 'Scalability & Growth', score: growthScore, weight: 15, explanation: 'Operating leverage and capacity to expand across cohorts.' },
      { factor: 'Execution Feasibility', score: executionScore, weight: 15, explanation: 'Team resources, capital allocation, and current stage velocity.' },
    ],
    missingInformation: [
      !startup.expectedPricing ? 'Specific unit pricing assumptions not yet validated' : null,
      !startup.targetCustomers ? 'Detailed target persona segmentation required' : null,
      (startup.teamSize || 1) < 2 ? 'Single founder execution risk: technical/GTM co-founder recommended' : null,
    ].filter(Boolean) as string[],
  };
}

/**
 * DETERMINISTIC STARTUP HEALTH ENGINE
 * Validation: 20%
 * Market: 20%
 * Product: 15%
 * Traction: 20%
 * Financial: 15%
 * Execution: 10%
 */
export function calculateStartupHealth(startup: Startup): StartupHealthScore {
  const m = startup.metrics || {
    totalUsers: 0,
    monthlyActiveUsers: 0,
    monthlyRevenue: 0,
    payingCustomers: 0,
    conversionRate: 0,
    retentionRate: 0,
    churnRate: 0,
    monthlyBurn: 0,
    cashRunwayMonths: 0,
  };

  // 1. Validation (20%)
  let valScore = 20;
  if (startup.problem && startup.problem.length > 40) valScore += 25;
  if (startup.solution && startup.solution.length > 40) valScore += 25;
  if (startup.stage !== 'IDEA') valScore += 20;
  if (m.payingCustomers > 0) valScore += 10;
  valScore = Math.min(100, valScore);

  // 2. Market (20%)
  let marketScore = 30;
  if (startup.industry && startup.industry !== 'Other') marketScore += 30;
  if (startup.targetCustomers && startup.targetCustomers.length > 15) marketScore += 25;
  if (startup.location) marketScore += 15;
  marketScore = Math.min(100, marketScore);

  // 3. Product (15%)
  let prodScore = 20;
  if (startup.productStatus === 'IN_PRODUCTION') prodScore = 95;
  else if (startup.productStatus === 'BETA_LIVE') prodScore = 80;
  else if (startup.productStatus === 'PROTOTYPE_IN_PROGRESS') prodScore = 55;
  else prodScore = 25;

  // 4. Traction (20%) - Strictly based on founder entered metrics
  let tracScore = 15;
  if (m.totalUsers > 1000) tracScore += 50;
  else if (m.totalUsers > 100) tracScore += 35;
  else if (m.totalUsers > 10) tracScore += 20;

  if (m.payingCustomers > 50) tracScore += 30;
  else if (m.payingCustomers > 5) tracScore += 20;
  else if (m.payingCustomers > 0) tracScore += 10;
  tracScore = Math.min(100, tracScore);

  // 5. Financial (15%)
  let finScore = 25;
  if (m.monthlyRevenue > 5000) finScore += 45;
  else if (m.monthlyRevenue > 500) finScore += 30;
  else if (m.monthlyRevenue > 0) finScore += 15;

  if (m.cashRunwayMonths >= 12) finScore += 30;
  else if (m.cashRunwayMonths >= 6) finScore += 20;
  else if (m.cashRunwayMonths >= 3) finScore += 10;
  else if (m.monthlyBurn > 0 && m.cashRunwayMonths < 3) finScore = Math.max(10, finScore - 20);
  finScore = Math.min(100, finScore);

  // 6. Execution (10%)
  let execScore = 30;
  if (startup.teamSize >= 3) execScore += 35;
  else if (startup.teamSize >= 2) execScore += 25;
  if (startup.currentFunding > 0 || startup.estimatedBudget > 5000) execScore += 30;
  execScore = Math.min(100, execScore);

  const overall = Math.round(
    valScore * 0.20 +
    marketScore * 0.20 +
    prodScore * 0.15 +
    tracScore * 0.20 +
    finScore * 0.15 +
    execScore * 0.10
  );

  const factorMap = [
    { name: 'Validation', score: valScore },
    { name: 'Market', score: marketScore },
    { name: 'Product', score: prodScore },
    { name: 'Traction', score: tracScore },
    { name: 'Financial', score: finScore },
    { name: 'Execution', score: execScore },
  ];

  const sorted = [...factorMap].sort((a, b) => b.score - a.score);
  const strongest = sorted[0].name;
  const weakest = sorted[sorted.length - 1].name;

  const reasons: string[] = [];
  if (tracScore < 40) reasons.push('Traction signals are low; early user acquisition requires structured customer discovery.');
  if (finScore < 40) reasons.push('Runway or revenue streams are limited; consider validating willingness to pay.');
  if (valScore > 70) reasons.push('Strong problem-solution framing established.');
  if (reasons.length === 0) reasons.push('Balanced early stage progress across core pillars.');

  const recommendations: string[] = [];
  if (weakest === 'Traction') recommendations.push('Conduct 10 qualitative user discovery calls to pinpoint primary conversion blocker.');
  else if (weakest === 'Financial') recommendations.push('Simulate cash runway scenarios and test an upfront annual subscription discount.');
  else if (weakest === 'Product') recommendations.push('Focus on must-have MVP feature slice to launch interactive beta within 3 weeks.');
  else recommendations.push('Advance to structured competitor benchmarking and pricing experiments.');

  return {
    overallHealth: overall,
    factors: {
      validation: valScore,
      market: marketScore,
      product: prodScore,
      traction: tracScore,
      financial: finScore,
      execution: execScore,
    },
    strongestArea: strongest,
    weakestArea: weakest,
    reasons,
    recommendedActions: recommendations,
    provisionalNotice: m.totalUsers === 0 && m.monthlyRevenue === 0 ? 'Score incorporates early-stage baseline assumptions since active traction data has not yet been recorded.' : undefined,
  };
}

/**
 * DETERMINISTIC REVENUE SIMULATION ENGINE
 * Transparent arithmetic, handles division by zero and scenario checks.
 */
export function simulateRevenue(inputs: RevenueSimulatorInputs): SimulationResult {
  const {
    initialCustomers,
    pricePerCustomer,
    monthlyGrowthRate,
    monthlyChurnRate,
    operatingCostMonthly,
    marketingCostMonthly,
    cacPerCustomer,
    projectionMonths = 12,
  } = inputs;

  const safeGrowth = Math.max(0, Math.min(200, monthlyGrowthRate)) / 100;
  const safeChurn = Math.max(0, Math.min(100, monthlyChurnRate)) / 100;
  const safePrice = Math.max(0, pricePerCustomer);

  const projections: MonthlyProjection[] = [];
  let currentCustomers = Math.max(0, initialCustomers);
  let cumulativeCash = 0;
  let breakEvenMonth: number | null = null;
  let totalRevenueYear1 = 0;
  let totalProfitYear1 = 0;

  for (let m = 1; m <= projectionMonths; m++) {
    const starting = currentCustomers;
    // New customers generated this month via growth
    const newCust = Math.round(starting * safeGrowth) + (m === 1 && starting === 0 ? 5 : 0);
    // Churned customers
    const churned = Math.min(starting, Math.round(starting * safeChurn));
    const ending = Math.max(0, starting + newCust - churned);

    const grossRevenue = ending * safePrice;
    const directMarketing = marketingCostMonthly + (newCust * Math.max(0, cacPerCustomer));
    const totalExpenses = operatingCostMonthly + directMarketing;
    const netProfit = grossRevenue - totalExpenses;
    cumulativeCash += netProfit;

    if (breakEvenMonth === null && netProfit > 0) {
      breakEvenMonth = m;
    }

    if (m <= 12) {
      totalRevenueYear1 += grossRevenue;
      totalProfitYear1 += netProfit;
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const label = `M${m} (${monthNames[(m - 1) % 12]})`;

    projections.push({
      month: m,
      monthName: label,
      startingCustomers: starting,
      newCustomers: newCust,
      churnedCustomers: churned,
      endingCustomers: ending,
      grossRevenue,
      cogsAndOps: operatingCostMonthly,
      marketingExpense: directMarketing,
      totalExpenses,
      netProfit,
      cumulativeCashFlow: cumulativeCash,
    });

    currentCustomers = ending;
  }

  const endingMonthData = projections[projections.length - 1];
  const endingMRR = endingMonthData ? endingMonthData.grossRevenue : 0;
  const endingARR = endingMRR * 12;

  // LTV = ARPU / Churn Rate. Avoid division by zero!
  const averageLTV = safeChurn > 0 ? Math.round(safePrice / safeChurn) : Math.round(safePrice * 24);
  const cac = Math.max(1, cacPerCustomer || 50);
  const ltvCacRatio = Number((averageLTV / cac).toFixed(2));

  const assumptionsNotes = [
    `Price per unit/customer modeled at $${safePrice.toLocaleString()}/month.`,
    `Monthly net compounding customer growth rate: ${(safeGrowth * 100).toFixed(1)}%.`,
    `Monthly customer churn modeled at ${(safeChurn * 100).toFixed(1)}%.`,
    `Baseline fixed operating expenses: $${operatingCostMonthly.toLocaleString()}/month.`,
    `All financial arithmetic is calculated deterministically with safe zero-bound checks.`,
  ];

  return {
    projections,
    breakEvenMonth,
    endingARR,
    endingMRR,
    averageLTV,
    cac,
    ltvCacRatio,
    totalRevenueYear1,
    totalProfitYear1,
    assumptionsNotes,
  };
}

/**
 * DETERMINISTIC MENTOR MATCHING ENGINE
 * Weights:
 * Skills: 30%
 * Experience: 20%
 * Industry: 20%
 * Role compatibility: 15%
 * Availability: 10%
 * Goals/Location: 5%
 */
export function matchMentorWithStartup(mentor: MentorProfile, startup: Startup): { score: number; explanations: string[] } {
  const startupIndustry = (startup.industry || '').toLowerCase();
  const startupNeeds = `${startup.problem} ${startup.solution} ${startup.businessModel}`.toLowerCase();

  let skillMatchCount = 0;
  mentor.skills.forEach(skill => {
    if (startupNeeds.includes(skill.toLowerCase())) skillMatchCount++;
  });
  const skillScore = Math.min(100, Math.max(30, (skillMatchCount / Math.max(1, mentor.skills.length)) * 100 + 40));

  const expScore = Math.min(100, Math.max(40, mentor.experienceYears * 7));

  const industryScore = mentor.industries.some(i => i.toLowerCase().includes(startupIndustry) || startupIndustry.includes(i.toLowerCase())) ? 95 : 50;

  const roleScore = startup.stage === 'IDEA' || startup.stage === 'VALIDATION'
    ? (mentor.desiredRole === 'Product Strategist' || mentor.desiredRole === 'GTM Mentor' ? 95 : 70)
    : (mentor.desiredRole === 'Fundraising Coach' || mentor.desiredRole === 'GTM Mentor' ? 90 : 75);

  const availScore = mentor.availability.includes('3-5') ? 95 : 80;
  const locScore = mentor.location.toLowerCase().includes((startup.location || '').toLowerCase()) ? 90 : 70;

  const total = Math.round(
    skillScore * 0.30 +
    expScore * 0.20 +
    industryScore * 0.20 +
    roleScore * 0.15 +
    availScore * 0.10 +
    locScore * 0.05
  );

  const explanations: string[] = [
    `Industry Alignment (${Math.round(industryScore * 0.20)}/20 pts): ${mentor.industries.join(', ')} directly overlaps with ${startup.industry}.`,
    `Skill Complementarity (${Math.round(skillScore * 0.30)}/30 pts): Mentor specializes in ${mentor.skills.slice(0, 3).join(', ')}.`,
    `Track Record (${Math.round(expScore * 0.20)}/20 pts): ${mentor.experienceYears}+ years hands-on operational leadership.`,
  ];

  return { score: total, explanations };
}

/**
 * DETERMINISTIC TEAM MEMBER MATCHING ENGINE
 */
export function matchTeamCandidateWithStartup(candidate: TeamMemberCandidate, startup: Startup): { score: number; explanations: string[] } {
  const startupIndustry = (startup.industry || '').toLowerCase();
  const startupTech = `${startup.solution} ${startup.oneLineIdea}`.toLowerCase();

  let skillMatchCount = 0;
  candidate.skills.forEach(skill => {
    if (startupTech.includes(skill.toLowerCase())) skillMatchCount++;
  });
  const skillScore = Math.min(100, Math.max(35, (skillMatchCount / Math.max(1, candidate.skills.length)) * 100 + 45));
  const expScore = Math.min(100, candidate.experienceYears * 12 + 30);
  const indScore = candidate.industries.some(i => i.toLowerCase().includes(startupIndustry)) ? 90 : 55;

  const total = Math.round(skillScore * 0.40 + expScore * 0.35 + indScore * 0.25);

  return {
    score: total,
    explanations: [
      `Skill Compatibility: High synergy with ${candidate.skills.slice(0, 3).join(', ')}.`,
      `Domain Familiarity: Previous exposure to ${candidate.industries.join(', ')}.`,
    ],
  };
}

/**
 * DETERMINISTIC FALLBACK FOR IDEA ANALYSIS
 * Used when offline or Gemini API is not provisioned, ensuring transparent factor explanations.
 */
export function generateDeterministicIdeaAnalysis(startupData: {
  idea: string;
  problem: string;
  solution: string;
  targetCustomer: string;
  industry: string;
  geography: string;
  businessModel?: string;
}): IdeaAnalysis {
  const { idea, problem, solution, targetCustomer, industry, geography, businessModel } = startupData;

  const problemScore = Math.min(95, Math.max(35, 40 + (problem.length > 50 ? 30 : 15) + (targetCustomer.length > 15 ? 20 : 5)));
  const customerPainScore = Math.min(90, Math.max(40, 45 + (problem.includes('cost') || problem.includes('time') || problem.includes('delay') || problem.includes('complex') ? 25 : 10)));
  const targetMarketScore = Math.min(92, industry ? 75 : 45);
  const competitiveIntensityScore = Math.min(88, 65); // High competition usually means lower differentiation score
  const differentiationScore = Math.min(90, solution.length > 60 ? 78 : 55);
  const monetizationScore = businessModel && businessModel !== 'Undecided' ? 76 : 50;
  const scalabilityScore = 74;
  const technicalFeasibilityScore = solution.toLowerCase().includes('hardware') ? 55 : 82;
  const executionDifficultyScore = 68;

  const factorScores: FactorScore[] = [
    { factor: 'Problem Clarity', score: problemScore, weight: 15, status: problemScore > 75 ? 'EXCELLENT' : 'MODERATE', explanation: 'Problem definition highlights a specific pain point with understandable context.', basis: 'Evaluated length, structural clarity, and target customer framing.' },
    { factor: 'Customer Pain Urgency', score: customerPainScore, weight: 15, status: customerPainScore > 75 ? 'EXCELLENT' : 'MODERATE', explanation: 'Pain point is urgent if it directly causes loss of time, capital, or revenue.', basis: 'Assessed friction keywords and quantified impact.' },
    { factor: 'Target Market Attractiveness', score: targetMarketScore, weight: 12, status: 'SOLID', explanation: `Industry (${industry || 'Tech'}) shows steady addressable customer segment.`, basis: 'Vertical market depth and geographic expansion potential.' },
    { factor: 'Competitive Landscape', score: competitiveIntensityScore, weight: 10, status: 'MODERATE', explanation: 'Incumbent workarounds and substitute workflows exist in this space.', basis: 'Market maturity and existing manual alternatives.' },
    { factor: 'Differentiation & Defensibility', score: differentiationScore, weight: 12, status: 'SOLID', explanation: 'Solution offers distinct speed and workflow advantages over existing methods.', basis: 'Unique mechanism and barrier to immediate replication.' },
    { factor: 'Monetization Potential', score: monetizationScore, weight: 12, status: 'SOLID', explanation: `Business model (${businessModel || 'Direct'}) offers quantifiable value-capture.`, basis: 'Willingness to pay linkage and margin structure.' },
    { factor: 'Scalability Potential', score: scalabilityScore, weight: 8, status: 'SOLID', explanation: 'Digital architecture allows customer onboarding with sub-linear support costs.', basis: 'Unit economics and distribution viral loops.' },
    { factor: 'Technical Feasibility', score: technicalFeasibilityScore, weight: 8, status: 'EXCELLENT', explanation: 'Core workflow can be built using modern web stack and mature APIs.', basis: 'Availability of required tooling and infrastructure.' },
    { factor: 'Execution Difficulty', score: executionDifficultyScore, weight: 8, status: 'MODERATE', explanation: 'Execution risk centers primarily on customer distribution rather than tech build.', basis: 'Customer acquisition cost and sales cycle duration.' },
  ];

  const overall = Math.round(
    factorScores.reduce((acc, f) => acc + (f.score * (f.weight / 100)), 0)
  );

  return {
    id: `analysis-${Date.now()}`,
    startupId: 'active-startup',
    overallScore: overall,
    confidence: 'PROVISIONAL',
    factorScores,
    strengths: [
      'Crisp connection between user problem and proposed core mechanism.',
      'Software-centric architecture enables fast prototyping and iteration.',
      'Identifiable niche audience simplifies initial customer discovery outreach.',
    ],
    weaknesses: [
      'Customer acquisition strategy lacks validated organic distribution loops.',
      'Pricing elasticity and willingness-to-pay require customer interview validation.',
      'Incumbent solutions and manual spreadsheets remain strong default competitors.',
    ],
    unansweredQuestions: [
      'What specific daily trigger compels a user to switch from their current habit?',
      'What is the payback period on initial customer acquisition?',
      'Can the core value proposition be delivered in a 3-minute self-serve onboarding flow?',
    ],
    keyAssumptions: [
      'Target customers actively search for digital solutions rather than enduring manual workarounds.',
      'Budget decision makers possess the authority to adopt without lengthy enterprise procurement.',
      'Switching costs from current tool are low enough to permit frictionless trial.',
    ],
    validationExperiments: [
      {
        experiment: 'Smoke Test Landing Page',
        hypothesis: 'At least 15% of qualified visitors will enter their email for early beta access.',
        metric: 'Visitor-to-waitlist conversion rate',
        timeframe: '5 days (100 targeted visitors)',
      },
      {
        experiment: '5 Discovery Interviews',
        hypothesis: '4 out of 5 target users rank this problem as one of their top 3 weekly headaches.',
        metric: 'Problem urgency confirmation rate',
        timeframe: '1 week',
      },
      {
        experiment: 'Pre-Order / Letter of Intent Test',
        hypothesis: 'At least 2 prospects agree to a discounted pilot upon beta release.',
        metric: 'Signed LOI or deposit commitment',
        timeframe: '2 weeks',
      },
    ],
    nextActions: [
      {
        action: 'Schedule 5 customer discovery interviews using Mom Test questions',
        reason: 'Validate real pain points without pitching the solution prematurely.',
        priority: 'HIGH',
        expectedOutcome: '3 concrete customer quotes confirming willingness to switch.',
      },
      {
        action: 'Build a single-feature prototype (concierge or interactive mock)',
        reason: 'Test if user actually completes the core transaction in under 2 minutes.',
        priority: 'HIGH',
        expectedOutcome: 'Usability feedback and time-to-value benchmark.',
      },
      {
        action: 'Benchmark top 3 direct competitors on pricing and onboarding friction',
        reason: 'Identify underserved pricing tiers or missing self-serve workflows.',
        priority: 'MEDIUM',
        expectedOutcome: 'Competitor differentiation matrix with verified gaps.',
      },
    ],
    isAiGenerated: false,
    analyzedAt: new Date().toISOString(),
    disclaimer: 'Preliminary algorithmic assessment based on founder inputs. This provides diagnostic guidance and hypotheses to test, not a definitive prediction of venture success.',
  };
}
