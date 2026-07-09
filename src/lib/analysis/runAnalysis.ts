// Local analysis orchestrator — runs the full research pipeline deterministically
// Now uses optional YouTube provider layer for enriched metadata
// Falls back to heuristic analysis when providers are unavailable

import type {
  AnalysisRequest,
  AnalysisResult,
  Recommendation,
  DataProviderInfo,
} from "./types";
import { classifyPyramidLevel } from "./pyramid";
import { scoreBarriers } from "./barriers";
import { detectMarketStage } from "./saturation";
import { scoreBlueOceanGap } from "./blueOcean";
import { calculateWeightedOpportunityScore } from "./opportunityScore";
import { extractScriptDNA } from "./scriptDNA";
import { generateNicheBends } from "./nicheBending";
import { parseYouTubeInput } from "../youtube/parseYouTubeInput";
import { resolveChannel, resolveKeyword } from "../providers/providerRouter";
import { getLocalRuntimeConfig } from "../config/localRuntimeConfig";

// ─── Helper: Deterministic hash-based pseudo-random ──────────
function hashSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pick<T>(arr: T[], seed: number, index: number = 0): T {
  return arr[(seed + index) % arr.length];
}

// ─── Category / Format detection (deterministic from string signals) ──

const CATEGORIES: string[] = [
  "Finance & Business",
  "Tech & Software",
  "Health & Fitness",
  "Education & Science",
  "True Crime",
  "DIY & How-To",
  "Beauty & Fashion",
  "Lifestyle & Vlogs",
];

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Finance & Business": [
    "finance",
    "business",
    "money",
    "invest",
    "crypto",
    "stock",
    "wealth",
    "side hustle",
    "entrepreneur",
  ],
  "Tech & Software": [
    "tech",
    "software",
    "ai",
    "programming",
    "code",
    "saas",
    "cyber",
    "gadget",
    "digital",
  ],
  "Health & Fitness": [
    "health",
    "fitness",
    "weight",
    "nutrition",
    "workout",
    "mental health",
    "wellness",
    "sleep",
  ],
  "Education & Science": [
    "education",
    "science",
    "history",
    "psychology",
    "physics",
    "space",
    "philosophy",
    "learn",
  ],
  "True Crime": [
    "true crime",
    "crime",
    "mystery",
    "serial killer",
    "unsolved",
    "scam",
    "fraud",
  ],
  "DIY & How-To": [
    "diy",
    "how to",
    "tutorial",
    "craft",
    "woodworking",
    "garden",
    "cooking",
    "repair",
  ],
  "Beauty & Fashion": [
    "beauty",
    "fashion",
    "skincare",
    "makeup",
    "style",
    "hair",
    "nails",
  ],
  "Lifestyle & Vlogs": [
    "lifestyle",
    "travel",
    "minimalism",
    "productivity",
    "relationship",
    "food",
    "home",
  ],
};

const FORMATS = [
  "explainer",
  "storytelling",
  "list",
  "comparison",
  "documentary",
  "tutorial",
] as const;
const PRODUCTION_TYPES = [
  "ai-slideshow",
  "2d-animation",
  "stock-footage",
  "voiceover-only",
  "screen-record",
] as const;

function detectCategoryFromInput(text: string): string {
  const lower = text.toLowerCase();
  let bestCat = CATEGORIES[0];
  let bestScore = 0;
  for (const cat of CATEGORIES) {
    const keywords = CATEGORY_KEYWORDS[cat] || [];
    const score = keywords.reduce(
      (s, kw) => (lower.includes(kw) ? s + kw.length : s),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      bestCat = cat;
    }
  }
  return bestCat;
}

function detectFormatFromInput(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("explain") || lower.includes("how") || lower.includes("why"))
    return "explainer";
  if (
    lower.includes("story") ||
    lower.includes("history") ||
    lower.includes("document")
  )
    return "storytelling";
  if (
    lower.includes("top") ||
    lower.includes("best") ||
    lower.includes("list")
  )
    return "list";
  if (lower.includes("compar") || lower.includes("vs")) return "comparison";
  if (
    lower.includes("tutorial") ||
    lower.includes("how to") ||
    lower.includes("guide")
  )
    return "tutorial";
  return "explainer";
}

function inferProductionType(format: string, budget: number): string {
  if (budget < 300) return "ai-slideshow";
  if (budget < 600) return "stock-footage";
  if (budget < 1000) return "2d-animation";
  if (format === "storytelling") return "documentary";
  return "2d-animation";
}

// ─── Parsing helpers ──────────────────────────────────────────

function parseBudget(budgetStr: string): number {
  const match = budgetStr.match(/\$?(\d+)/);
  return match ? parseInt(match[1], 10) : 500;
}

function parseList(text: string): string[] {
  return text
    .split(/[,;/\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
}

function inferPublishingSpeed(speedStr: string): number {
  const lower = speedStr.toLowerCase();
  if (lower.includes("daily")) return 30;
  if (lower.includes("3x") || lower.includes("three")) return 12;
  if (lower.includes("weekly")) return 4;
  if (lower.includes("bi") || lower.includes("every two")) return 2;
  if (lower.includes("monthly")) return 1;
  return 4;
}

function scoreFromProfile(texts: string[], max: number): number {
  const combined = texts.join(" ").trim();
  if (!combined) return Math.round(max * 0.3);
  const length = combined.length;
  return Math.min(max, Math.round(max * (0.3 + length / 500)));
}

// ─── Main orchestrator ───────────────────────────────────────

export async function runLocalAnalysis(
  request: AnalysisRequest
): Promise<AnalysisResult> {
  const { mode, input, profile, createdAt } = request;
  const seed = hashSeed(input + createdAt + Object.values(profile).join(""));
  const id = `analysis-${Date.now()}-${seed % 10000}`;

  // ─── Resolve input via provider layer ─────────────────────
  const config = getLocalRuntimeConfig();
  const parsed = parseYouTubeInput(input);

  let resolvedName = parsed.displayName;
  let resolvedDescription = "";
  let resolvedSubscriberCount: number | undefined;
  let resolvedViewCount: number | undefined;
  let resolvedVideoCount: number | undefined;
  const providerWarnings: string[] = [];
  const providersUsed: string[] = [];

  if (mode === "channel" && input) {
    const channelResult = await resolveChannel(input);
    providersUsed.push(channelResult.provider);
    providerWarnings.push(...channelResult.warnings);
    if (channelResult.data) {
      resolvedName = channelResult.data.title;
      resolvedDescription = channelResult.data.description || "";
      resolvedSubscriberCount = channelResult.data.subscriberCount;
      resolvedViewCount = channelResult.data.viewCount;
      resolvedVideoCount = channelResult.data.videoCount;
    }
  } else if (mode === "keyword" && input) {
    const keywordResult = await resolveKeyword(input);
    providersUsed.push(keywordResult.provider);
    providerWarnings.push(...keywordResult.warnings);
    if (keywordResult.data) {
      resolvedName = keywordResult.data.title;
      resolvedDescription = keywordResult.data.description || "";
    }
  } else {
    providersUsed.push("manual");
  }

  const dataProvider: DataProviderInfo = {
    used: [...new Set(providersUsed)],
    warnings: providerWarnings,
    noKeyMode: config.noKeyMode,
    exactStatsAvailable:
      !config.noKeyMode &&
      (resolvedSubscriberCount !== undefined ||
        resolvedViewCount !== undefined),
    cookiesEnabled: config.enableCookies,
  };

  // Parse profile
  const budget = parseBudget(profile.budget);
  const interests = parseList(profile.interests);
  const skills = parseList(profile.skills);
  const topics = parseList(profile.topics);
  const publishingSpeed = inferPublishingSpeed(profile.publishingSpeed);

  // Determine source details from mode
  const sourceInput =
    input ||
    interests.join(" ") ||
    profile.interests ||
    "general content creation";
  const name =
    mode === "channel"
      ? resolvedName
      : mode === "video"
      ? `Video: ${input.substring(0, 40)}`
      : mode === "keyword"
      ? input
      : topics[0] || "Auto Discovery";

  const category = detectCategoryFromInput(sourceInput);
  const format = detectFormatFromInput(sourceInput);

  // Heuristic signals from profile
  const demandScore = scoreFromProfile([...interests, ...topics], 85) + 15;
  const userFitScore = scoreFromProfile([...interests, ...skills], 80) + 10;
  const formatProofScore = scoreFromProfile([format, ...topics], 75) + 15;
  const assetPotentialScore = Math.min(
    100,
    Math.round(40 + budget / 30 + publishingSpeed * 2)
  );
  const freshnessScore = profile.exampleChannels ? 65 : 50;
  const policyRisk = Math.min(
    100,
    Math.round(10 + (budget < 300 ? 30 : budget < 600 ? 15 : 5))
  );
  const saturationRisk = 30 + (interests.length > 3 ? 15 : 0);

  // Pyramid input
  const productionType = inferProductionType(format, budget);
  const productionComplexity = Math.min(10, Math.max(1, Math.round(budget / 150)));
  const copyability = Math.max(1, 11 - productionComplexity);
  const trendSpeed = Math.min(10, budget > 1000 ? 4 : 8);

  const pyramid = classifyPyramidLevel({
    productionComplexity,
    copyability,
    requiredBudget: budget,
    requiredSkill: Math.min(10, Math.max(1, skills.length * 2)),
    trendSpeed,
    insiderKnowledge: Math.min(10, Math.max(1, interests.length * 2)),
  });

  // Barriers
  const barriers = scoreBarriers({
    budgetMonthly: budget,
    productionType,
    topicExpertise: Math.min(10, Math.max(1, interests.length * 2)),
    interestLevel: Math.min(10, Math.max(1, interests.length * 2 + 1)),
    uploadVelocity: publishingSpeed,
    trendFreshnessDays: Math.max(1, 90 - freshnessScore * 0.8),
    originalFormatScore: Math.min(10, Math.max(1, 7 - copyability)),
  });

  // Saturation
  const saturation = detectMarketStage({
    similarChannels: [
      {
        title: "Competitor A",
        recentViews: 25000 + (seed % 50000),
        topVideoViews: 100000 + (seed % 200000),
        uploadCountLast30Days: 8 + (seed % 4),
        startedPostingDaysAgo: 60 + (seed % 120),
      },
      {
        title: "Competitor B",
        recentViews: 35000 + (seed % 40000),
        topVideoViews: 150000 + (seed % 300000),
        uploadCountLast30Days: 6 + (seed % 3),
        startedPostingDaysAgo: 90 + (seed % 90),
      },
      {
        title: "Competitor C",
        recentViews: 15000 + (seed % 60000),
        topVideoViews: 80000 + (seed % 400000),
        uploadCountLast30Days: 10 + (seed % 5),
        startedPostingDaysAgo: 30 + (seed % 150),
      },
      {
        title: "Competitor D",
        recentViews: 5000 + (seed % 30000),
        topVideoViews: 20000 + (seed % 80000),
        uploadCountLast30Days: 12 + (seed % 6),
        startedPostingDaysAgo: 120 + (seed % 180),
      },
      {
        title: "Competitor E",
        recentViews: 45000 + (seed % 55000),
        topVideoViews: 200000 + (seed % 500000),
        uploadCountLast30Days: 4 + (seed % 2),
        startedPostingDaysAgo: 45 + (seed % 30),
      },
    ],
    sourceFormat: format,
    breakoutVideoAgeDays: 45 + (seed % 30),
  });

  // Blue ocean
  const blueOcean = scoreBlueOceanGap({
    demandSignals: Math.min(10, Math.round(demandScore / 10)),
    directCompetitors: Math.min(10, Math.round(saturation.saturationScore / 12)),
    competitorQuality: Math.min(10, Math.round(copyability * 0.7)),
    recentBreakouts: Math.min(
      10,
      Math.max(1, Math.round(pyramid.competitionRisk / 15))
    ),
    adjacentMarketProof: Math.min(10, Math.round(formatProofScore / 10)),
    formatMissingScore: Math.min(
      10,
      Math.max(1, 11 - Math.round(saturation.saturationScore / 10))
    ),
  });

  // Opportunity score
  const barrierScore = barriers.totalBarrierScore;
  const opportunity = calculateWeightedOpportunityScore({
    demandScore,
    blueOceanScore: blueOcean.blueOceanScore,
    barrierScore,
    formatProofScore,
    freshnessScore,
    assetPotentialScore,
    userFitScore,
    saturationRisk,
    policyRisk,
  });

  // Script DNA
  const scriptDNA = extractScriptDNA({
    title: pick(
      [
        `Why ${category} Is More Important Than You Think`,
        `The Truth About ${category} Nobody Talks About`,
        `How ${category} Actually Works`,
        `The Rise and Fall of ${category}`,
      ],
      seed,
      0
    ),
    description: `Exploring the ${category} niche with ${format} content — designed for faceless creators.`,
    videoFormat: budget > 1000 ? "long" : "shorts",
  });

  // Niche bends
  const nicheBends = generateNicheBends({
    sourceNiche: category,
    sourceFormat: format,
    sourceAudience: `People interested in ${category.toLowerCase()}`,
    userInterests: interests.length > 0 ? interests : [category],
    userSkills: skills.length > 0 ? skills : ["content creation"],
    budgetMonthly: budget,
    preferredLanguage: profile.language || undefined,
  });

  // Recommendations
  const recommendations: string[] = [
    opportunity.recommendation === "build"
      ? `🎯 Strong opportunity in ${category} — proceed with full production plan`
      : opportunity.recommendation === "test"
      ? `🟡 Moderate opportunity in ${category} — test with 3-5 videos first`
      : opportunity.recommendation === "bend_first"
      ? `🟠 Weak opportunity — consider niche bending before entering ${category}`
      : `🔴 ${category} has high risk — consider a different niche or angle`,
    `Archive format: ${format} | Production type: ${productionType} | Budget: $${budget}/month`,
    `Pyramid tier: ${
      pyramid.level === "bottom"
        ? "Quick entry, short lifespan"
        : pyramid.level === "middle"
        ? "Branded content, sustainable"
        : "High moat, long-term asset"
    }`,
    `Saturation: ${
      saturation.stage === "breakout"
        ? "Ideal entry window"
        : saturation.stage === "late_wave"
        ? "Bend before entering"
        : saturation.stage === "saturated"
        ? "Avoid — consider different format"
        : "Test carefully"
    }`,
    `Blue ocean score: ${blueOcean.blueOceanScore}/100 — ${blueOcean.label.replace(
      /_/g,
      " "
    )}`,
    opportunity.recommendation === "build"
      ? "First-mover advantage is possible — prioritize speed"
      : "Monitor competitor landscape before scaling",
    ...(dataProvider.noKeyMode
      ? [
          `ℹ️ No-Key Mode: ${dataProvider.warnings[0] || "Running without YouTube API key."}`,
        ]
      : []),
  ];

  // Execution plan
  const executionPlan = [
    `Week 1: Set up ${productionType} production pipeline — budget: $${budget}/month`,
    `Week 2-3: Produce first 3 ${format} videos on ${category} topics`,
    `Week 4-5: Analyze CTR, retention, audience feedback from first batch`,
    `Week 6: Scale successful angles, pivot underperforming ones`,
    `Month 3+: Optimize for monetization (${budget > 600 ? "AdSense + sponsors" : "AdSense first"})`,
  ];

  // Risks
  const risks: string[] = [
    `${category} has ${barriers.totalBarrierScore < 30 ? "low" : barriers.totalBarrierScore < 60 ? "moderate" : "high"} barriers — ${barriers.moatLabel} moat`,
    `Format lifespan: ${pyramid.level === "bottom" ? "2-4 months (short)" : pyramid.level === "middle" ? "6-12 months (moderate)" : "18+ months (long)"}`,
    ...(policyRisk > 40
      ? [
          `⚠️ Policy risk elevated (${policyRisk}/100) — ensure original content creation`,
        ]
      : []),
    `Monitor ${
      saturation.stage === "breakout" ? "growing competition" : "market saturation signals"
    } in the coming months`,
  ];

  // Test plan
  const firstFiveIdeas =
    nicheBends.length > 0
      ? nicheBends[0].firstFiveVideoIdeas.map(
          (idea, i) => `Test ${i + 1}: "${idea}"`
        )
      : [
          `Test 1: "Why ${category} Is ${pick(["Dangerous", "Important", "Profitable"], seed)} Than You Think"`,
        ];

  const testPlan = {
    budget: "$100-$200",
    duration: "3-10 days per video (2 months max)",
    firstFiveVideos: firstFiveIdeas,
    successCriteria: [
      "At least one of the first 5 videos gets >2x the average views of similar fresh channels",
      "CTR above 8% indicates strong packaging",
      "Retention above 40% at mid-point indicates content-market fit",
    ],
    stopCriteria: [
      "All 5 videos get <500 views after 2 weeks each",
      "CTR consistently below 4%",
      "Negative audience signals in comments",
    ],
  };

  return {
    id,
    request,
    dataProvider,
    source: {
      name,
      url: mode === "channel" ? (parsed.cleanUrl || input) : undefined,
      description:
        resolvedDescription ||
        `${format} content in ${category} — faceless niche analysis based on your input`,
      subscriberCount: resolvedSubscriberCount,
      viewCount: resolvedViewCount,
      videoCount: resolvedVideoCount,
      monthlyViews: undefined,
      estimatedRevenue: undefined,
      format,
      category,
      strategy:
        saturation.action === "enter_now" ? "FORMAT_TREND" : "HYBRID",
      rpm: "N/A (no YouTube API)",
    },
    scores: {
      opportunity: opportunity.score,
      recommendation: opportunity.recommendation,
      breakdown: opportunity.breakdown,
      demandScore,
      blueOceanScore: blueOcean.blueOceanScore,
      barrierScore,
      formatProofScore,
      freshnessScore,
      assetPotentialScore,
      userFitScore,
      saturationRisk,
      policyRisk,
    },
    pyramid,
    barriers,
    saturation,
    blueOcean,
    scriptDNA,
    nicheBends,
    recommendations,
    executionPlan,
    risks,
    testPlan,
  };
}
