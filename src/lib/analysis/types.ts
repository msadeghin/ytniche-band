// Shared types for the analysis pipeline

export type AnalysisMode = "auto" | "channel" | "video" | "keyword";
export type Recommendation = "build" | "test" | "bend_first" | "avoid";

export interface CreatorProfile {
  topics: string;
  interests: string;
  skills: string;
  budget: string;
  preferredFormat: string;
  productionStyle: string;
  language: string;
  goal: string;
  publishingSpeed: string;
  exampleChannels: string;
}

export interface AnalysisRequest {
  mode: AnalysisMode;
  input: string;
  profile: CreatorProfile;
  createdAt: string;
}

export interface DataProviderInfo {
  used: string[];
  warnings: string[];
  noKeyMode: boolean;
  exactStatsAvailable: boolean;
  cookiesEnabled?: boolean;
}

export interface AnalysisResult {
  id: string;
  request: AnalysisRequest;
  dataProvider: DataProviderInfo;
  source: {
    name: string;
    url?: string;
    description: string;
    subscriberCount?: number;
    viewCount?: number;
    videoCount?: number;
    monthlyViews?: number;
    estimatedRevenue?: number;
    format: string;
    category: string;
    strategy: "FORMAT_TREND" | "MARKET_PLAY" | "HYBRID";
    rpm: string;
  };
  scores: {
    opportunity: number;
    recommendation: Recommendation;
    breakdown: Record<string, number>;
    demandScore: number;
    blueOceanScore: number;
    barrierScore: number;
    formatProofScore: number;
    freshnessScore: number;
    assetPotentialScore: number;
    userFitScore: number;
    saturationRisk: number;
    policyRisk: number;
  };
  pyramid: {
    level: "bottom" | "middle" | "top";
    explanation: string[];
    competitionRisk: number;
    assetPotential: number;
  };
  barriers: {
    moneyBarrier: number;
    skillBarrier: number;
    insiderBarrier: number;
    speedBarrier: number;
    totalBarrierScore: number;
    moatLabel: "weak" | "moderate" | "strong";
    recommendations: string[];
  };
  saturation: {
    stage: "too_early" | "breakout" | "late_wave" | "saturated" | "declining";
    saturationScore: number;
    evidence: string[];
    action: "enter_now" | "test_fast" | "bend_first" | "avoid";
  };
  blueOcean: {
    blueOceanScore: number;
    label: "red_ocean" | "competitive" | "emerging_gap" | "blue_ocean";
    explanation: string[];
  };
  scriptDNA: {
    titlePattern: string;
    hookPattern: string;
    structure: Array<{ beat: string; purpose: string; timestampHint?: string }>;
    retentionDevices: string[];
    ctaPattern?: string;
    reusableSkeleton: string;
  };
  nicheBends: Array<{
    title: string;
    bendType: "category" | "audience" | "language" | "format";
    targetNiche: string;
    targetAudience: string;
    format: string;
    whyItCanWork: string[];
    riskFactors: string[];
    opportunityScore: number;
    executionDifficulty: number;
    firstFiveVideoIdeas: string[];
  }>;
  recommendations: string[];
  executionPlan: string[];
  risks: string[];
  testPlan: {
    budget: string;
    duration: string;
    firstFiveVideos: string[];
    successCriteria: string[];
    stopCriteria: string[];
  };
}
