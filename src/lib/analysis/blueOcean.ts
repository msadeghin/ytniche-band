// 🌊 Blue Ocean Gap Detection
// Identifies format-market combinations with high demand and low supply

export type OceanLabel =
  | "red_ocean"
  | "competitive"
  | "emerging_gap"
  | "blue_ocean";

export interface BlueOceanInput {
  demandSignals: number; // 1-10 (no demand → massive demand)
  directCompetitors: number; // 1-10 (no competitors → many established)
  competitorQuality: number; // 1-10 (low quality → high production value)
  recentBreakouts: number; // 1-10 (no breakouts → many recent hits)
  adjacentMarketProof: number; // 1-10 (no proof → strong adjacent proof)
  formatMissingScore: number; // 1-10 (format everywhere → format completely absent)
}

export interface BlueOceanResult {
  blueOceanScore: number; // 0-100
  label: OceanLabel;
  explanation: string[];
}

/**
 * Scores how "blue ocean" a format-market combination is.
 *
 * Blue ocean = high demand, low competition, strong adjacent proof.
 * Red ocean = saturated competition, declining returns.
 *
 * Formula:
 * blueOceanScore = demandSignals * 0.15
 *                + (11 - directCompetitors) * 0.25
 *                + (11 - competitorQuality) * 0.15
 *                + (11 - recentBreakouts) * 0.10
 *                + adjacentMarketProof * 0.15
 *                + formatMissingScore * 0.20
 */
export function scoreBlueOceanGap(input: BlueOceanInput): BlueOceanResult {
  const explanation: string[] = [];

  // ─── Calculate Score ───────────────────────────────────────
  const score =
    input.demandSignals * 0.15 +
    (11 - input.directCompetitors) * 0.25 +
    (11 - input.competitorQuality) * 0.15 +
    (11 - input.recentBreakouts) * 0.1 +
    input.adjacentMarketProof * 0.15 +
    input.formatMissingScore * 0.2;

  const blueOceanScore = Math.max(0, Math.min(100, Math.round(score * 10)));

  // ─── Determine Label ───────────────────────────────────────
  let label: OceanLabel;
  if (blueOceanScore >= 75) {
    label = "blue_ocean";
  } else if (blueOceanScore >= 55) {
    label = "emerging_gap";
  } else if (blueOceanScore >= 35) {
    label = "competitive";
  } else {
    label = "red_ocean";
  }

  // ─── Build Explanations ────────────────────────────────────
  if (input.demandSignals >= 7) {
    explanation.push(
      `✅ Strong demand signals (${input.demandSignals}/10) — the audience is looking for this content.`
    );
  } else if (input.demandSignals >= 4) {
    explanation.push(
      `⚠️ Moderate demand signals (${input.demandSignals}/10) — some interest but unproven at scale.`
    );
  } else {
    explanation.push(
      `🔴 Weak demand signals (${input.demandSignals}/10) — may not have enough audience interest.`
    );
  }

  if (input.directCompetitors <= 3) {
    explanation.push(
      `✅ Few direct competitors (${input.directCompetitors}/10) — this combination is underserved.`
    );
  } else if (input.directCompetitors <= 6) {
    explanation.push(
      `⚠️ Some competitors (${input.directCompetitors}/10) — differentiation is needed.`
    );
  } else {
    explanation.push(
      `🔴 Many competitors (${input.directCompetitors}/10) — difficult to stand out.`
    );
  }

  if (input.formatMissingScore >= 7) {
    explanation.push(
      `✅ Format gap is real (${input.formatMissingScore}/10) — this format is not present in this market.`
    );
  } else if (input.formatMissingScore >= 4) {
    explanation.push(
      `⚠️ Format partially present (${input.formatMissingScore}/10) — some channels are using similar formats.`
    );
  } else {
    explanation.push(
      `🔴 Format is common (${input.formatMissingScore}/10) — many channels already use this format.`
    );
  }

  if (input.adjacentMarketProof >= 7) {
    explanation.push(
      `✅ Strong adjacent proof (${input.adjacentMarketProof}/10) — similar formats work in related niches.`
    );
    explanation.push(
      "This reduces risk significantly — demand is proven in adjacent spaces."
    );
  } else if (input.adjacentMarketProof >= 4) {
    explanation.push(
      `⚠️ Moderate adjacent proof (${input.adjacentMarketProof}/10) — some evidence but not conclusive.`
    );
  } else {
    explanation.push(
      `🔴 Weak adjacent proof (${input.adjacentMarketProof}/10) — no evidence this format works nearby.`
    );
    explanation.push(
      "Higher risk — consider testing with the smallest possible budget first."
    );
  }

  // Overall label explanation
  switch (label) {
    case "blue_ocean":
      explanation.push(
        "🏆 Blue Ocean — High demand, low competition, strong opportunity."
      );
      explanation.push(
        "This is an ideal entry point. Move fast to establish first-mover advantage."
      );
      break;
    case "emerging_gap":
      explanation.push(
        "🟢 Emerging Gap — Some competition but significant room for new entrants."
      );
      explanation.push(
        "Enter now with a niche bend to differentiate from existing players."
      );
      break;
    case "competitive":
      explanation.push(
        "🟡 Competitive — Many players, some differentiation needed."
      );
      explanation.push(
        "Find a specific angle or sub-niche within this space to stand out."
      );
      break;
    case "red_ocean":
      explanation.push(
        "🔴 Red Ocean — Highly competitive with limited opportunity for new entrants."
      );
      explanation.push(
        "Recommend finding a different format or market combination."
      );
      break;
  }

  return {
    blueOceanScore,
    label,
    explanation,
  };
}
