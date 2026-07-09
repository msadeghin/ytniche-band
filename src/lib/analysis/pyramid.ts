// 🏔️ Faceless YouTube Pyramid Level Classifier
// Determines content complexity tier based on production signals

export type PyramidLevel = "bottom" | "middle" | "top";

export interface PyramidInput {
  productionComplexity: number; // 1-10 (simple AI slideshow → complex 3D animation)
  copyability: number; // 1-10 (trivially copied → hard to replicate)
  requiredBudget: number; // Monthly budget in USD
  requiredSkill: number; // 1-10 (no skill needed → expert-level production)
  trendSpeed: number; // 1-10 (extremely fast → slow and steady)
  insiderKnowledge: number; // 1-10 (public info → industry insider access)
}

export interface PyramidResult {
  level: PyramidLevel;
  explanation: string[];
  competitionRisk: number; // 0-100
  assetPotential: number; // 0-100
}

/**
 * Classifies a content idea into one of three pyramid levels
 * based on production complexity, copyability, budget, skill, trend speed,
 * and insider knowledge requirements.
 *
 * Bottom: Simple, copyable, fast-entry, short lifespan (2-4 months)
 * Middle: Branded, requires skill, medium lifespan (6-12 months)
 * Top: Original, hard to copy, long lifespan (years)
 */
export function classifyPyramidLevel(input: PyramidInput): PyramidResult {
  const explanation: string[] = [];

  // Weighted scoring
  const complexityScore =
    input.productionComplexity * 0.2 +
    input.copyability * 0.25 +
    Math.min(input.requiredBudget / 500, 10) * 0.2 +
    input.requiredSkill * 0.15 +
    (11 - input.trendSpeed) * 0.1 +
    input.insiderKnowledge * 0.1;

  // Determine level
  let level: PyramidLevel;
  if (complexityScore <= 3.5) {
    level = "bottom";
  } else if (complexityScore <= 6.5) {
    level = "middle";
  } else {
    level = "top";
  }

  // Competition risk: lower complexity = higher competition
  const competitionRisk = Math.max(0, Math.min(100, 100 - complexityScore * 10));

  // Asset potential: higher complexity = better long-term asset
  const assetPotential = Math.max(0, Math.min(100, complexityScore * 10));

  // Build explanations
  if (level === "bottom") {
    explanation.push(
      "Bottom Pyramid: This content is highly copyable with low production requirements."
    );
    explanation.push(
      "Entry budget: $200-$500/month. Time to monetization: a few weeks."
    );
    explanation.push(
      "⚠️ Format lifespan: 2-4 months before saturation. Best for quick cashflow and channel flipping."
    );
    if (input.copyability > 7) {
      explanation.push(
        "High copyability means competitors can replicate your format within days."
      );
    }
    if (input.trendSpeed > 7) {
      explanation.push(
        "Fast-trending format signals imminent saturation — move quickly."
      );
    }
  } else if (level === "middle") {
    explanation.push(
      "Middle Pyramid: Requires consistent production quality and topic expertise."
    );
    explanation.push(
      "Entry budget: $1K-$1.5K/month. Time to monetization: 1-3 months."
    );
    explanation.push(
      "✅ Moderate competition risk. Sustainable income potential ($15K-$30K/month)."
    );
    if (input.requiredSkill >= 5) {
      explanation.push(
        "Skill requirement creates a moderate moat against copycats."
      );
    }
  } else {
    explanation.push(
      "Top Pyramid: Nearly zero competition — your format is hard to replicate."
    );
    explanation.push(
      "Entry budget: $1.5K+/month + team. Time to monetization: several months."
    );
    explanation.push(
      "✅ Strongest asset potential. Most sellable channel type. Sustainable long-term."
    );
    if (input.insiderKnowledge > 7) {
      explanation.push(
        "Insider knowledge provides a significant competitive advantage."
      );
    }
  }

  return {
    level,
    explanation,
    competitionRisk,
    assetPotential,
  };
}

/**
 * Estimate format lifespan in months based on pyramid level.
 */
export function estimateFormatLifespan(level: PyramidLevel): {
  min: number;
  max: number;
  description: string;
} {
  switch (level) {
    case "bottom":
      return {
        min: 2,
        max: 4,
        description:
          "Bottom-tier formats saturate quickly. Plan for 2-4 months of peak performance before considering exit or pivot.",
      };
    case "middle":
      return {
        min: 6,
        max: 12,
        description:
          "Middle-tier formats with branded identity can last 6-12 months before significant competition emerges.",
      };
    case "top":
      return {
        min: 18,
        max: 36,
        description:
          "Top-tier original formats can sustain for years, especially with ongoing innovation and community building.",
      };
  }
}
