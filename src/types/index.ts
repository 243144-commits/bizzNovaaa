export type UserRole = 'FOUNDER' | 'TEAM_MEMBER' | 'MENTOR' | 'INVESTOR' | 'ADMIN';

export type StartupStage = 'IDEA' | 'VALIDATION' | 'MVP' | 'EARLY_TRACTION' | 'GROWTH' | 'SCALE';

export type ProductStatus = 'CONCEPT' | 'PROTOTYPE_IN_PROGRESS' | 'BETA_LIVE' | 'IN_PRODUCTION' | 'SUNSET';

export type ValidationTag = 'FACT' | 'USER INPUT' | 'ASSUMPTION' | 'AI ESTIMATE' | 'RECOMMENDATION';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface StartupMetrics {
  totalUsers: number;
  monthlyActiveUsers: number;
  monthlyRevenue: number;
  payingCustomers: number;
  conversionRate: number; // percentage e.g. 3.2
  retentionRate: number; // percentage e.g. 68
  churnRate: number; // percentage e.g. 4.5
  monthlyBurn: number;
  cashRunwayMonths: number;
  historicalRevenue?: Array<{ month: string; revenue: number; expenses: number; users: number }>;
}

export interface Startup {
  id: string;
  name: string;
  tagline: string;
  oneLineIdea: string;
  problem: string;
  solution: string;
  targetCustomers: string;
  industry: string;
  location: string;
  businessModel: string;
  expectedPricing: string;
  stage: StartupStage;
  teamSize: number;
  estimatedBudget: number;
  currentFunding: number;
  productStatus: ProductStatus;
  metrics: StartupMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface FactorScore {
  factor: string;
  score: number; // 0 to 100
  weight: number; // percentage
  status: 'EXCELLENT' | 'SOLID' | 'MODERATE' | 'NEEDS_WORK' | 'CRITICAL_RISK';
  explanation: string;
  basis: string;
}

export interface IdeaAnalysis {
  id: string;
  startupId: string;
  overallScore: number;
  confidence: 'PROVISIONAL' | 'MODERATE' | 'HIGH';
  factorScores: FactorScore[];
  strengths: string[];
  weaknesses: string[];
  unansweredQuestions: string[];
  keyAssumptions: string[];
  validationExperiments: Array<{ experiment: string; hypothesis: string; metric: string; timeframe: string }>;
  nextActions: Array<{ action: string; reason: string; priority: 'HIGH' | 'MEDIUM' | 'LOW'; expectedOutcome: string }>;
  isAiGenerated: boolean;
  analyzedAt: string;
  modelUsed?: string;
  disclaimer: string;
}

export interface MarketValidationItem {
  id: string;
  startupId: string;
  tag: ValidationTag;
  category: 'Problem' | 'Customer' | 'Alternative' | 'Demand' | 'Pricing' | 'Trend';
  statement: string;
  supportingEvidence: string;
  validationStatus: 'UNVALIDATED' | 'IN_PROGRESS' | 'VALIDATED' | 'INVALIDATED';
  updatedAt: string;
}

export interface CustomerInterviewRecord {
  id: string;
  startupId: string;
  interviewee: string;
  role: string;
  segment: string;
  keyPainPoints: string;
  willingnessToPay: string;
  currentWorkaround: string;
  validationConclusion: 'SUPPORTS_HYPOTHESIS' | 'NEUTRAL' | 'CONTRADICTS_HYPOTHESIS';
  interviewDate: string;
}

export interface CustomerPersona {
  id: string;
  startupId: string;
  name: string;
  title: string;
  ageRange: string;
  occupation: string;
  isHypothesis: boolean; // clearly distinguishes AI-generated hypothesis from verified customer research
  customerNeeds: string[];
  problems: string[];
  currentAlternatives: string[];
  painPoints: string[];
  buyingMotivation: string;
  budgetSensitivity: 'LOW' | 'MEDIUM' | 'HIGH';
  adoptionBarriers: string[];
}

export interface Competitor {
  id: string;
  startupId: string;
  name: string;
  product: string;
  targetAudience: string;
  pricing: string;
  features: string[];
  strengths: string[];
  weaknesses: string[];
  businessModel: string;
  source: string;
  lastReviewed: string;
}

export interface CompetitorGapAnalysis {
  featureGaps: string[];
  pricingOpportunities: string[];
  underservedCustomers: string[];
  geographicGaps: string[];
  serviceGaps: string[];
  positioningOpportunities: string[];
}

export interface RevenueSimulatorInputs {
  initialCustomers: number;
  pricePerCustomer: number;
  monthlyGrowthRate: number; // percentage e.g. 15
  monthlyChurnRate: number; // percentage e.g. 3.5
  operatingCostMonthly: number;
  marketingCostMonthly: number;
  cacPerCustomer: number;
  projectionMonths: number;
}

export interface MonthlyProjection {
  month: number;
  monthName: string;
  startingCustomers: number;
  newCustomers: number;
  churnedCustomers: number;
  endingCustomers: number;
  grossRevenue: number;
  cogsAndOps: number;
  marketingExpense: number;
  totalExpenses: number;
  netProfit: number;
  cumulativeCashFlow: number;
}

export interface SimulationResult {
  projections: MonthlyProjection[];
  breakEvenMonth: number | null;
  endingARR: number;
  endingMRR: number;
  averageLTV: number;
  cac: number;
  ltvCacRatio: number;
  totalRevenueYear1: number;
  totalProfitYear1: number;
  assumptionsNotes: string[];
}

export interface MVPFeature {
  id: string;
  startupId: string;
  title: string;
  description: string;
  category: 'MUST HAVE' | 'SHOULD HAVE' | 'NICE TO HAVE' | 'AVOID INITIALLY';
  rationale: string;
  phase: string;
  estimatedEffortDays: number;
  isCompleted: boolean;
}

export interface RoadmapPhase {
  phaseNumber: number;
  name: string;
  goals: string[];
  suggestedTimeline: string;
  successMetrics: string[];
  dependencies: string[];
  risks: string[];
  tasks: Array<{ id: string; title: string; completed: boolean }>;
}

export interface Task {
  id: string;
  startupId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  deadline: string;
  assignedMember: string;
  status: TaskStatus;
  milestoneRef?: string;
  createdAt: string;
}

export interface Milestone {
  id: string;
  startupId: string;
  key: 'idea_validated' | 'interviews_done' | 'mvp_launched' | 'first_customer' | 'first_revenue' | '100_users' | 'breakeven' | 'funding_round';
  title: string;
  achieved: boolean;
  targetDate: string;
  achievedDate?: string;
  verifiedEvidence?: string;
}

export interface StartupHealthScore {
  overallHealth: number; // 0-100
  factors: {
    validation: number; // 20%
    market: number; // 20%
    product: number; // 15%
    traction: number; // 20%
    financial: number; // 15%
    execution: number; // 10%
  };
  strongestArea: string;
  weakestArea: string;
  reasons: string[];
  recommendedActions: string[];
  provisionalNotice?: string;
}

export interface FailureDiagnosis {
  problemCategory: string;
  detectedSymptoms: string[];
  possibleRootCauses: string[];
  supportingEvidence: string[];
  missingInformation: string[];
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendedExperiments: string[];
  threeNextActions: Array<{
    action: string;
    reason: string;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    expectedOutcome: string;
    suggestedPeriod: string;
  }>;
}

export interface PitchDeckSlide {
  slideNumber: number;
  title: string;
  subtitle: string;
  category: string;
  bulletPoints: string[];
  founderNotes: string;
  missingInformationAlert?: string;
}

export interface MentorProfile {
  id: string;
  name: string;
  title: string;
  company: string;
  skills: string[];
  experienceYears: number;
  industries: string[];
  availability: '1-2 hrs/week' | '3-5 hrs/week' | 'Monthly advisory';
  desiredRole: 'Technical Advisor' | 'GTM Mentor' | 'Fundraising Coach' | 'Product Strategist';
  location: string;
  bio: string;
  matchScore?: number;
  matchExplanation?: string[];
  requestStatus?: 'NONE' | 'PENDING' | 'ACCEPTED' | 'DECLINED';
}

export interface TeamMemberCandidate {
  id: string;
  name: string;
  roleTitle: string;
  desiredRole: string;
  skills: string[];
  experienceYears: number;
  industries: string[];
  availability: string;
  location: string;
  matchScore?: number;
  matchExplanation?: string[];
  status?: 'AVAILABLE' | 'CONNECTED';
}

export interface Competition {
  id: string;
  name: string;
  organizer: string;
  description: string;
  eligibility: string;
  deadline: string;
  prizeInformation: string;
  participantsCount: number;
  scoringCriteria: {
    innovation: number; // 25%
    problem: number; // 20%
    market: number; // 20%
    execution: number; // 20%
    businessModel: number; // 15%
  };
  hasSubmitted?: boolean;
  submissionScore?: number;
  leaderboard: Array<{ rank: number; startupName: string; score: number; stage: string }>;
}

export interface RiskRadarItem {
  id: string;
  startupId: string;
  category: 'Market' | 'Financial' | 'Product' | 'Competition' | 'Team' | 'Legal' | 'Execution';
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  likelihood: 'LOW' | 'MEDIUM' | 'HIGH';
  evidenceOrInput: string;
  potentialImpact: string;
  recommendedMitigation: string;
  status: 'OPEN' | 'MONITORING' | 'MITIGATED';
}

export interface OpportunityItem {
  id: string;
  title: string;
  category: string;
  opportunityDescription: string;
  reasonItMatters: string;
  supportingInput: string;
  uncertaintyLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendedNextStep: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}
