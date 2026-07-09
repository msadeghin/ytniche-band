// 🗺️ Niche Bending Proposal Generator
// Four-axis framework: Category (A), Audience (B), Language (C), Format (D)

export type BendType = "category" | "audience" | "language" | "format";

export interface NicheBendInput {
  sourceNiche: string;
  sourceFormat: string;
  sourceAudience?: string;
  userInterests: string[];
  userSkills: string[];
  budgetMonthly: number;
  preferredLanguage?: string;
}

export interface NicheBendProposal {
  title: string;
  bendType: BendType;
  targetNiche: string;
  targetAudience: string;
  format: string;
  whyItCanWork: string[];
  riskFactors: string[];
  opportunityScore: number;
  executionDifficulty: number;
  firstFiveVideoIdeas: string[];
}

// Reference RPM data for various niches
const NICHE_RPM: Record<string, { min: number; max: number }> = {
  "Finance & Business": { min: 15, max: 40 },
  "Tech & Software": { min: 8, max: 20 },
  "Health & Fitness": { min: 4, max: 12 },
  "Education & Science": { min: 3, max: 10 },
  "True Crime & Mystery": { min: 3, max: 8 },
  "DIY & How-To": { min: 3, max: 9 },
  "Beauty & Fashion": { min: 2, max: 6 },
  Travel: { min: 3, max: 8 },
  "Personal Development": { min: 4, max: 10 },
  "AI & Automation": { min: 8, max: 25 },
  Gaming: { min: 1, max: 3 },
  "News & Politics": { min: 5, max: 15 },
  Sports: { min: 2, max: 6 },
  "Food & Cooking": { min: 3, max: 8 },
  "Music & Audio": { min: 2, max: 5 },
};

// Known high-demand niches with faceless potential
const HIGH_DEMAND_NICHES: Record<string, string[]> = {
  "Finance & Business": [
    "Personal Finance",
    "Cryptocurrency",
    "Real Estate Investing",
    "Side Hustles",
    "Stock Market",
  ],
  "Tech & Software": [
    "AI News",
    "Cybersecurity",
    "Productivity Tools",
    "Programming Education",
    "Gadget Reviews",
  ],
  "Health & Fitness": [
    "Weight Loss Science",
    "Mental Health",
    "Nutrition",
    "Sleep Optimization",
    "Longevity",
  ],
  "Education & Science": [
    "History Explained",
    "Psychology Facts",
    "Space Exploration",
    "Physics Concepts",
    "Philosophy",
  ],
  "True Crime & Mystery": [
    "Unsolved Cases",
    "Serial Killers",
    "Scams & Fraud",
    "Cults",
    "Missing Persons",
  ],
  "DIY & How-To": [
    "Woodworking",
    "Home Automation",
    "Gardening Tips",
    "Cooking Skills",
    "Craft Projects",
  ],
  "Personal Development": [
    "Productivity",
    "Minimalism",
    "Stoicism",
    "Habit Building",
    "Mindfulness",
  ],
  "AI & Automation": [
    "AI Tools Review",
    "Automation Workflows",
    "AI Art",
    "ChatGPT Tips",
    "Machine Learning",
  ],
};

// Format templates for video ideas
const VIDEO_TITLE_TEMPLATES: string[] = [
  "Why {Topic} Is More {Adjective} Than You Think",
  "The Truth About {Topic} Nobody Talks About",
  "How {Topic} Actually Works (Explained)",
  "The Rise and Fall of {Topic}",
  "I Tried {Topic} For 30 Days — Here's What Happened",
  "The Dark Side of {Topic}",
  "5 {Topic} Myths You Still Believe",
  "How {Topic} Is Changing Everything",
  "The Science Behind {Topic}",
  "What Happened to {Topic}?",
];

const ADJECTIVES = [
  "Dangerous", "Important", "Profitable", "Fascinating",
  "Complicated", "Misunderstood", "Shocking", "Brilliant",
];

/**
 * Generates multiple Niche Bend proposals based on the user's interests,
 * skills, budget, and a source niche/format combination.
 *
 * Uses the four-axis bending framework:
 * - category: Take format to a new field (Axis A)
 * - audience: Narrow to a specific sub-audience (Axis D)
 * - language: Enter a new language market (Axis C)
 * - format: Use a different format for proven niche (Axis B)
 */
export function generateNicheBends(input: NicheBendInput): NicheBendProposal[] {
  const proposals: NicheBendProposal[] = [];
  const format = input.sourceFormat;

  // ─── Axis A: Category Change ────────────────────────────────
  // Match user interests to potential niches
  const potentialNiches = Object.keys(HIGH_DEMAND_NICHES).filter(
    (n) => n !== input.sourceNiche
  );

  // Score each niche based on user interests and skills
  const scoredNiches = potentialNiches.map((niche) => {
    let score = 0;
    const subNiches = HIGH_DEMAND_NICHES[niche] || [];

    // Match user interests
    for (const interest of input.userInterests) {
      const lowerInterest = interest.toLowerCase();
      if (niche.toLowerCase().includes(lowerInterest)) score += 5;
      for (const sub of subNiches) {
        if (sub.toLowerCase().includes(lowerInterest)) score += 3;
      }
    }

    // Match user skills
    for (const skill of input.userSkills) {
      const lowerSkill = skill.toLowerCase();
      if (niche.toLowerCase().includes(lowerSkill)) score += 4;
      for (const sub of subNiches) {
        if (sub.toLowerCase().includes(lowerSkill)) score += 2;
      }
    }

    // RPM bonus
    const rpm = NICHE_RPM[niche];
    if (rpm) {
      score += rpm.min / 3;
    }

    return { niche, score };
  });

  scoredNiches.sort((a, b) => b.score - a.score);

  // Take top 2 for category bends
  const topCategoryBends = scoredNiches.slice(0, 2);
  for (const { niche } of topCategoryBends) {
    const rpm = NICHE_RPM[niche] || { min: 3, max: 8 };
    const subNiches = HIGH_DEMAND_NICHES[niche] || [];
    const targetSub = subNiches[Math.floor(Math.random() * subNiches.length)];

    proposals.push({
      title: `${format} for ${niche}`,
      bendType: "category",
      targetNiche: niche,
      targetAudience: `People interested in ${niche.toLowerCase()}`,
      format: format,
      whyItCanWork: [
        `${niche} has proven demand on YouTube with $${rpm.min}-$${rpm.max} RPM.`,
        `The ${format} format is underrepresented in this niche.`,
        `Your interest in ${input.userInterests[0] || niche} gives you topic authority.`,
        `Adjacent niches have proven this format works — it's a format transfer opportunity.`,
      ],
      riskFactors: [
        `${niche} audience may prefer different content formats.`,
        format === "educational" && niche === "True Crime & Mystery"
          ? "Crime audiences prefer storytelling over educational formats."
          : "Test audience response before full commitment.",
      ],
      opportunityScore: Math.min(95, Math.round(60 + rpm.min * 2 + scoreModifier(input, niche))),
      executionDifficulty: Math.max(1, Math.round(10 - input.budgetMonthly / 500)),
      firstFiveVideoIdeas: generateVideoIdeas(targetSub || niche, format),
    });
  }

  // ─── Axis D: Audience Specificity ───────────────────────────
  // Narrow the source niche to a specific sub-audience
  const sourceSubNiches = HIGH_DEMAND_NICHES[input.sourceNiche] || [];
  if (sourceSubNiches.length > 0) {
    const specificAudience = sourceSubNiches[0];

    proposals.push({
      title: `${specificAudience} — Niche-Specific ${format}`,
      bendType: "audience",
      targetNiche: input.sourceNiche,
      targetAudience: `${specificAudience} enthusiasts and practitioners`,
      format: format,
      whyItCanWork: [
        `Audience specificity creates stronger community and higher engagement.`,
        `${specificAudience} has passionate followers who want dedicated content.`,
        `Less competition than general ${input.sourceNiche} content.`,
        `Higher RPM potential through targeted sponsorships.`,
      ],
      riskFactors: [
        "Smaller total addressable audience.",
        "May take longer to grow subscriber count.",
      ],
      opportunityScore: Math.min(90, Math.round(65 + scoreModifier(input, input.sourceNiche))),
      executionDifficulty: Math.max(1, Math.round(7 - input.budgetMonthly / 800)),
      firstFiveVideoIdeas: generateVideoIdeas(specificAudience, format),
    });
  }

  // ─── Axis C: Language/Geography ─────────────────────────────
  if (input.preferredLanguage && input.preferredLanguage !== "English") {
    proposals.push({
      title: `${input.sourceNiche} in ${input.preferredLanguage}`,
      bendType: "language",
      targetNiche: input.sourceNiche,
      targetAudience: `${input.preferredLanguage}-speaking audience interested in ${input.sourceNiche.toLowerCase()}`,
      format: format,
      whyItCanWork: [
        `Growing ${input.preferredLanguage}-language YouTube market with less competition.`,
        "Proven format in English — lower execution risk.",
        "First-mover advantage in this language-format combination.",
      ],
      riskFactors: [
        "May need native-speaking voiceover talent.",
        "Smaller initial audience than English market.",
        "Monetization thresholds may differ by region.",
      ],
      opportunityScore: Math.min(85, Math.round(70 + scoreModifier(input, input.sourceNiche))),
      executionDifficulty: Math.max(1, Math.round(6)),
      firstFiveVideoIdeas: generateVideoIdeas(input.sourceNiche, format),
    });
  }

  // ─── Axis B: Format Change ──────────────────────────────────
  // Different format for the same niche
  const alternateFormat = getAlternateFormat(format);
  proposals.push({
    title: `${alternateFormat} for ${input.sourceNiche}`,
    bendType: "format",
    targetNiche: input.sourceNiche,
    targetAudience: `People interested in ${input.sourceNiche.toLowerCase()}`,
    format: alternateFormat,
    whyItCanWork: [
      `The ${alternateFormat} format is gaining traction on YouTube.`,
      `Existing ${input.sourceNiche} audience may want ${alternateFormat} content.`,
      "Stand out from competitors all using the same format.",
    ],
    riskFactors: [
      `No guarantee the ${alternateFormat} format resonates with this audience.`,
      "Requires learning a new production style.",
    ],
    opportunityScore: Math.min(80, Math.round(55 + scoreModifier(input, input.sourceNiche))),
    executionDifficulty: Math.max(1, Math.round(8)),
    firstFiveVideoIdeas: generateVideoIdeas(input.sourceNiche, alternateFormat),
  });

  return proposals.slice(0, 4); // Return top 4 proposals
}

/**
 * Generate video ideas based on topic and format.
 */
function generateVideoIdeas(topic: string, format: string): string[] {
  const ideas: string[] = [];

  // Pick format-appropriate templates
  const templates = VIDEO_TITLE_TEMPLATES.slice(0, 5);

  for (let i = 0; i < 5; i++) {
    const template = templates[i % templates.length];
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const idea = template
      .replace("{Topic}", topic)
      .replace("{Adjective}", adj);
    ideas.push(idea);
  }

  return ideas;
}

/**
 * Calculate a score modifier based on user interest/skill match.
 */
function scoreModifier(input: NicheBendInput, niche: string): number {
  let mod = 0;
  const lowerNiche = niche.toLowerCase();

  for (const interest of input.userInterests) {
    if (lowerNiche.includes(interest.toLowerCase())) mod += 5;
  }
  for (const skill of input.userSkills) {
    if (lowerNiche.includes(skill.toLowerCase())) mod += 3;
  }

  // Budget bonus
  mod += Math.min(5, Math.floor(input.budgetMonthly / 500));

  return mod;
}

/**
 * Return an alternate format different from the current one.
 */
function getAlternateFormat(format: string): string {
  const formats = [
    "educational", "storytelling", "list/top X", "documentary",
    "tutorial", "debate/analysis", "comparison",
  ];
  const filtered = formats.filter((f) => f !== format);
  return filtered[Math.floor(Math.random() * filtered.length)];
}
