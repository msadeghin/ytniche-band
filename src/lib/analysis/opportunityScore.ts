// 📊 Weighted Opportunity Score Calculator
// Combines all research dimensions into a single actionable score

export type Recommendation = "build" | "test" | "bend_first" | "avoid";

export interface OpportunityInput {
  demandScore: number; // 0-100
  blueOceanScore: number; // 0-100
  barrierScore: number; // 0-100 (high = strong moat)
  formatProofScore: number; // 0-100
  freshnessScore: number; // 0-100 (high = fresh/early)
  assetPotentialScore: number; // 0-100
  userFitScore: number; // 0-100
  saturationRisk: number; // 0-100 (negative factor)
  policyRisk: number; // 0-100 (negative factor)
}

export interface OpportunityResult {
  score: number; // 0-100
  breakdown: Record<string, number>;
  recommendation: Recommendation;
}

/**
 * Calculates a weighted opportunity score from multiple research dimensions.
 *
 * Formula:
 * opportunityScore =
 *   0.20 * demandScore +
 *   0.15 * blueOceanScore +
 *   0.15 * barrierScore +
 *   0.15 * formatProofScore +
 *   0.10 * freshnessScore +
 *   0.10 * assetPotentialScore +
 *   0.10 * userFitScore -
 *   0.15 * saturationRisk -
 *   0.10 * policyRisk
 */
export function calculateWeightedOpportunityScore(
  input: OpportunityInput
): OpportunityResult {
  // ─── Weighted Calculation ─────────────────────────────────
  const weightedScore =
    0.2 * input.demandScore +
    0.15 * input.blueOceanScore +
    0.15 * input.barrierScore +
    0.15 * input.formatProofScore +
    0.1 * input.freshnessScore +
    0.1 * input.assetPotentialScore +
    0.1 * input.userFitScore -
    0.15 * input.saturationRisk -
    0.1 * input.policyRisk;

  // Clamp to 0-100 range
  const score = Math.max(0, Math.min(100, Math.round(weightedScore)));

  // ─── Breakdown for transparency ───────────────────────────
  const breakdown: Record<string, number> = {
    "Demand (×0.20)": Math.round(input.demandScore * 0.2),
    "Blue Ocean Gap (×0.15)": Math.round(input.blueOceanScore * 0.15),
    "Barrier/Moat (×0.15)": Math.round(input.barrierScore * 0.15),
    "Format Proof (×0.15)": Math.round(input.formatProofScore * 0.15),
    "Freshness (×0.10)": Math.round(input.freshnessScore * 0.1),
    "Asset Potential (×0.10)": Math.round(input.assetPotentialScore * 0.1),
    "User Fit (×0.10)": Math.round(input.userFitScore * 0.1),
    "Saturation Risk (−×0.15)": -Math.round(input.saturationRisk * 0.15),
    "Policy Risk (−×0.10)": -Math.round(input.policyRisk * 0.1),
  };

  // ─── Determine Recommendation ─────────────────────────────
  let recommendation: Recommendation;
  if (score >= 75) {
    recommendation = "build";
  } else if (score >= 55) {
    recommendation = "test";
  } else if (score >= 35) {
    recommendation = "bend_first";
  } else {
    recommendation = "avoid";
  }

  return {
    score,
    breakdown,
    recommendation,
  };
}

/**
 * Get a human-readable explanation of the recommendation.
 */
export function recommendationExplanation(rec: Recommendation): string {
  switch (rec) {
    case "build":
      return "✅ Strong opportunity — proceed with full content production and channel development.";
    case "test":
      return "🟡 Moderate opportunity — test with 3-5 videos before committing significant resources.";
    case "bend_first":
      return "🟠 Weak opportunity in current form — consider a niche bend before entering.";
    case "avoid":
      return "🔴 High risk — not recommended in current form. Find a different angle or market.";
  }
}

/**
 * Quick sanity check: is the basic demand there?
 */
export function hasMinimumDemand(input: OpportunityInput): boolean {
  return input.demandScore >= 30 && input.formatProofScore >= 20;
}
