// 🚧 Barrier-to-Entry Scoring System
// Evaluates the four key barriers: money, skill, insider knowledge, speed

export type MoatLabel = "weak" | "moderate" | "strong";

export interface BarrierInput {
  budgetMonthly: number; // Monthly budget in USD
  productionType: string; // Type of production (e.g., "ai-slideshow", "2d-animation", "3d-animation", "documentary", "screen-record")
  topicExpertise: number; // 1-10 (beginner → domain expert)
  interestLevel: number; // 1-10 (low interest → passionate about topic)
  uploadVelocity: number; // Videos per month
  trendFreshnessDays?: number; // Days since this format started trending
  originalFormatScore: number; // 1-10 (derivative → completely original format)
}

export interface BarrierResult {
  moneyBarrier: number; // 0-100
  skillBarrier: number; // 0-100
  insiderBarrier: number; // 0-100
  speedBarrier: number; // 0-100
  totalBarrierScore: number; // 0-100
  moatLabel: MoatLabel;
  recommendations: string[];
}

// Production type complexity reference
const PRODUCTION_COMPLEXITY: Record<string, { money: number; skill: number }> = {
  "ai-slideshow": { money: 10, skill: 5 },
  "text-on-screen": { money: 5, skill: 3 },
  "stock-footage": { money: 15, skill: 10 },
  "whiteboard-animation": { money: 20, skill: 20 },
  "2d-animation": { money: 40, skill: 50 },
  "3d-animation": { money: 70, skill: 80 },
  "screen-record": { money: 10, skill: 20 },
  documentary: { money: 50, skill: 60 },
  "ai-character": { money: 30, skill: 25 },
  "audio-only": { money: 5, skill: 10 },
  custom: { money: 25, skill: 25 }, // default
};

/**
 * Scores the four key barriers to entry for a faceless YouTube niche:
 * Money, Skill, Insider Knowledge, and Speed.
 *
 * Higher barrier scores = harder to enter but stronger moat once established.
 */
export function scoreBarriers(input: BarrierInput): BarrierResult {
  const production = PRODUCTION_COMPLEXITY[input.productionType] || PRODUCTION_COMPLEXITY.custom;

  // ─── Money Barrier (0-100) ──────────────────────────────────
  // Production cost + monthly budget needed
  const productionCostRatio = production.money / 100;
  const budgetRatio = Math.min(input.budgetMonthly / 2000, 1);
  const moneyBarrier = Math.round(
    productionCostRatio * 50 + budgetRatio * 50
  );

  // ─── Skill Barrier (0-100) ──────────────────────────────────
  // Production skill + topic expertise needed
  const productionSkillRatio = production.skill / 100;
  const expertiseRatio = input.topicExpertise / 10;
  const skillBarrier = Math.round(
    productionSkillRatio * 50 + expertiseRatio * 50
  );

  // ─── Insider Barrier (0-100) ────────────────────────────────
  // How much insider/niche knowledge is needed
  const insiderBarrier = Math.round(
    input.topicExpertise * 7 + input.interestLevel * 3
  );

  // ─── Speed Barrier (0-100) ──────────────────────────────────
  // How fast you need to move (late-wave avoidance)
  const freshnessFactor = input.trendFreshnessDays !== undefined
    ? Math.max(0, 1 - input.trendFreshnessDays / 180)
    : 0.5;
  const speedBarrier = Math.round(
    (11 - input.uploadVelocity) * 8 +
    freshnessFactor * 30 +
    input.originalFormatScore * 2
  );

  // ─── Total Score ────────────────────────────────────────────
  const totalBarrierScore = Math.round(
    (moneyBarrier + skillBarrier + insiderBarrier + speedBarrier) / 4
  );

  // ─── Moat Label ─────────────────────────────────────────────
  let moatLabel: MoatLabel;
  if (totalBarrierScore <= 30) {
    moatLabel = "weak";
  } else if (totalBarrierScore <= 60) {
    moatLabel = "moderate";
  } else {
    moatLabel = "strong";
  }

  // ─── Recommendations ────────────────────────────────────────
  const recommendations: string[] = [];

  if (moneyBarrier < 20) {
    recommendations.push(
      "Low money barrier — expect high competition. Differentiate through topic expertise or scripting quality."
    );
  } else if (moneyBarrier > 70) {
    recommendations.push(
      "High money barrier — strong moat. Ensure budget can be sustained for 3+ months before monetization."
    );
  }

  if (skillBarrier < 20) {
    recommendations.push(
      "Low skill barrier — format is easy to copy. Build brand loyalty to retain audience."
    );
  } else if (skillBarrier > 70) {
    recommendations.push(
      "High skill barrier — skill itself is a moat. Highlight production quality in thumbnails."
    );
  }

  if (insiderBarrier < 30) {
    recommendations.push(
      "Low insider knowledge needed — anyone can enter. Add unique perspective or data to stand out."
    );
  } else {
    recommendations.push(
      "Insider knowledge required — leverage your expertise as the core differentiator."
    );
  }

  if (speedBarrier < 30) {
    recommendations.push(
      "Speed is critical — this window is closing fast. Prioritize publishing over perfection."
    );
  } else {
    recommendations.push(
      "Speed isn't the main barrier — focus on quality and differentiation."
    );
  }

  if (totalBarrierScore > 60) {
    recommendations.push(
      "Overall strong moat — competitors will struggle to replicate your setup."
    );
  } else if (totalBarrierScore < 25) {
    recommendations.push(
      "Overall weak moat — plan for short format lifespan and have an exit strategy."
    );
  }

  return {
    moneyBarrier,
    skillBarrier,
    insiderBarrier,
    speedBarrier,
    totalBarrierScore,
    moatLabel,
    recommendations,
  };
}

/**
 * Provide a quick assessment of what's needed to strengthen the moat.
 */
export function suggestMoatStrengthening(input: BarrierInput): string[] {
  const suggestions: string[] = [];

  if (input.budgetMonthly < 500) {
    suggestions.push(
      "Increase monthly budget to $1K+ for production quality improvements that create a visual moat."
    );
  }
  if (input.topicExpertise < 5) {
    suggestions.push(
      "Deepen topic expertise through research or collaboration with domain experts."
    );
  }
  if (input.originalFormatScore < 4) {
    suggestions.push(
      "Add a unique format twist (e.g., data-driven segments, original research, expert interviews)."
    );
  }
  if (input.uploadVelocity < 4) {
    suggestions.push(
      "Upload velocity is low — increasing to 8+ videos/month builds algorithmic momentum as a first-mover advantage."
    );
  }

  return suggestions;
}
