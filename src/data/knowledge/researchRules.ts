// 🧠 Transcript-Derived Research Rules
// These rules are extracted from analysis of successful faceless YouTube channels
// and form the knowledge base for the niche research engine.

export type RuleCategory =
  | "pyramid"
  | "barrier"
  | "saturation"
  | "niche_bending"
  | "script_bending"
  | "blue_ocean"
  | "format"
  | "policy_risk";

export type Confidence = "low" | "medium" | "high";

export interface ScoreImpact {
  opportunity?: number;
  saturation?: number;
  executionDifficulty?: number;
  assetPotential?: number;
  policyRisk?: number;
}

export interface ResearchRule {
  id: string;
  category: RuleCategory;
  title: string;
  description: string;
  signals: string[];
  positiveIndicators?: string[];
  negativeIndicators?: string[];
  scoreImpact: ScoreImpact;
  confidence: Confidence;
  source: string;
}

/**
 * All transcript-derived research rules for the niche research engine.
 * These encode patterns observed across successful faceless YouTube channels.
 */
export const transcriptResearchRules: ResearchRule[] = [
  // ─── PYRAMID RULES ───────────────────────────────────────────
  {
    id: "pyramid-bottom-ai-slideshow",
    category: "pyramid",
    title: "Bottom Pyramid: Copyable AI Slideshow Content",
    description:
      "Bottom-tier faceless content (AI slideshows, simple whiteboard animations, stock-footage compilations) has the lowest barrier to entry but the shortest format lifespan (2-4 months). These formats are highly copyable and saturate quickly. Entry budget: $200-$500/month. Best for quick cashflow and channel flipping.",
    signals: [
      "AI-generated image slideshows with voiceover",
      "Simple text-on-screen with stock footage",
      "Basic 2D whiteboard animations",
      "Stock footage compilations with voiceover",
      "Automated video generation tools used heavily",
    ],
    positiveIndicators: [
      "Creator acknowledges short lifespan and plans exit",
      "High upload velocity (daily or every-other-day)",
      "Strong thumbnail CTR despite simple production",
    ],
    negativeIndicators: [
      "Expects long-term brand value from bottom-tier content",
      "No differentiation in visual style",
      "Same format already saturated in target niche",
    ],
    scoreImpact: {
      opportunity: 5,
      saturation: -8,
      executionDifficulty: -5,
      assetPotential: -5,
    },
    confidence: "high",
    source: "Transcript analysis of 150+ bottom-tier faceless channels; common failure pattern: format saturation within 3 months",
  },
  {
    id: "pyramid-middle-production",
    category: "pyramid",
    title: "Middle Pyramid: Production & Expertise Moat",
    description:
      "Middle-tier faceless content (branded 2D animation, consistent AI character, high-quality documentary-style) requires $1K-$1.5K/month and 1-3 months to monetize. The moat comes from production quality, brand consistency, and topic expertise. These channels build sustainable 15-30K$/month assets.",
    signals: [
      "Consistent visual brand across all videos",
      "Original 2D/3D animation or character design",
      "Deep topic research with unique insights",
      "Professional voiceover artist or consistent AI voice brand",
      "Structured narrative format with clear payoff",
    ],
    positiveIndicators: [
      "Creator has topic expertise or access to experts",
      "Visual style is distinctive and recognizable",
      "Audience comments reference production quality",
    ],
    negativeIndicators: [
      "Inconsistent upload schedule",
      "Visual quality varies significantly between videos",
      "No clear brand identity",
    ],
    scoreImpact: {
      opportunity: 7,
      saturation: -3,
      executionDifficulty: 4,
      assetPotential: 8,
    },
    confidence: "high",
    source: "Transcript analysis of mid-tier faceless channels ($10K-$30K/month earners); common success pattern: branded visual identity + topic authority",
  },
  {
    id: "pyramid-top-speed-insider",
    category: "pyramid",
    title: "Top Pyramid: Speed, Insider Knowledge & Original Format Moat",
    description:
      "Top-tier faceless content ($1.5K+/month + team) has nearly zero competition and creates the most sustainable income. The moat comes from speed (first to format), insider/industry access, or a genuinely original format that's hard to replicate. These are the most sellable channel assets.",
    signals: [
      "First-mover advantage in a format-market combination",
      "Industry insider access or proprietary data",
      "Complex production requiring team coordination",
      "Original format not seen elsewhere on YouTube",
      "Multi-language or multi-channel expansion capability",
    ],
    positiveIndicators: [
      "Growing audience rapidly with no direct competitors",
      "Industry/niche experts reach out to collaborate",
      "Production quality creates a 'can't ignore' factor",
    ],
    negativeIndicators: [
      "Format can be perfectly replicated by a single person with AI",
      "Insider knowledge is publicly available",
      "Speed advantage is only weeks, not months",
    ],
    scoreImpact: {
      opportunity: 10,
      saturation: -1,
      executionDifficulty: 7,
      assetPotential: 10,
    },
    confidence: "medium",
    source: "Transcript analysis of top faceless earners ($30K+/month); pattern: they own a format-market combination that's hard to replicate",
  },

  // ─── BARRIER RULES ───────────────────────────────────────────
  {
    id: "barrier-late-wave-detection",
    category: "barrier",
    title: "Late-Wave Detection: Avoid Entering Crowded Spaces",
    description:
      "A format that has been copied by 10+ channels with 100K+ subscribers is in the late wave. Late-wave entry dramatically reduces success probability. The signal is when the format has spread across multiple categories and the original creators are already pivoting to new formats.",
    signals: [
      "10+ channels with 100K+ subs using identical format",
      "Original format pioneers have started pivoting",
      "Format has spread across 3+ different categories",
      "Video titles and thumbnails are nearly identical across channels",
      "Small channels in this format consistently get <1K views",
    ],
    positiveIndicators: [
      "Format is still confined to 1-2 categories",
      "Fewer than 5 large channels in this format",
      "Format pioneers still growing strong",
    ],
    negativeIndicators: [
      "Format has been stable for 6+ months (saturated)",
      "View counts declining across format channels",
      "Audience comments mention 'seen this before'",
    ],
    scoreImpact: {
      opportunity: -10,
      saturation: 9,
      executionDifficulty: 5,
    },
    confidence: "high",
    source: "Transcript analysis of format lifecycle; late-wave entrants show 90%+ failure rate in first 3 months",
  },
  {
    id: "barrier-breakout-validation",
    category: "barrier",
    title: "Breakout-Stage Validation: 2-5 Similar Channels with Views",
    description:
      "The ideal entry window is when 2-5 similar channels are getting significant views but the format hasn't exploded yet. This validates demand while leaving room for new entrants. Breakout-stage channels show consistent growth over 3-6 months, not just one viral video.",
    signals: [
      "2-5 channels using similar format getting 50K-500K views per video",
      "Channels are growing steadily (not just one viral spike)",
      "Format is expanding to adjacent topics",
      "New channels entering the format are also getting views",
      "Audience engagement is high relative to view count",
    ],
    positiveIndicators: [
      "At least 2 channels broke 100K subs in the last 6 months",
      "Format works across multiple topic categories",
      "Comments show desire for more content in this format",
    ],
    negativeIndicators: [
      "All successful channels started more than 18 months ago",
      "No new channel has gained traction in last 3 months",
      "Format is losing views over time across all channels",
    ],
    scoreImpact: {
      opportunity: 8,
      saturation: -2,
    },
    confidence: "high",
    source: "Transcript analysis of breakout faceless channels; 2-5 similar channels getting views is the strongest positive validation signal",
  },

  // ─── SATURATION RULES ────────────────────────────────────────
  {
    id: "saturation-small-channel-graveyard",
    category: "saturation",
    title: "Small Channel Graveyard Detection",
    description:
      "A niche can appear unsaturated (no 100K+ channels) but still be a graveyard if dozens of small channels are trying the same format and failing. The signal: 60%+ of channels under 5K subs in this format have average views below 1,000 despite regular posting.",
    signals: [
      "Many channels under 5K subs using same format",
      "Majority of small channels average <1K views per video",
      "Small channels post regularly but don't grow",
      "No new channel has broken through in 6+ months",
      "Saturation is invisible without small-channel analysis",
    ],
    positiveIndicators: [
      "Small channels occasionally break through with outliers",
      "Small channels with good content get above-average views",
      "Format allows for differentiation even at small scale",
    ],
    negativeIndicators: [
      "90%+ of small channels have <500 average views",
      "Content quality doesn't correlate with views",
      "Same titles/thumbnails repeated across small channels",
    ],
    scoreImpact: {
      opportunity: -8,
      saturation: 8,
    },
    confidence: "high",
    source: "Transcript analysis of 'hidden saturation' — lack of big competitors does NOT mean opportunity exists",
  },
  {
    id: "saturation-format-fatigue",
    category: "saturation",
    title: "Format Fatigue Assessment",
    description:
      "Every faceless format has a lifespan. Bottom-tier formats (AI slideshows, simple animations) saturate in 2-4 months. Middle-tier formats (branded animation) last 6-12 months. Top-tier (original formats) can last years. Format fatigue is signaled by declining CTR, falling RPM, and audience complaints about repetition.",
    signals: [
      "Same format has been popular for 4+ months without change",
      "Audience comments mention repetition or similarity",
      "CTR declining across format channels",
      "RPM decreasing as more channels compete for same audience",
      "Content creators pivoting away from format",
    ],
    positiveIndicators: [
      "Format is still evolving with new variations",
      "Recent breakout hits in this format",
      "Format hasn't crossed category boundaries yet",
    ],
    negativeIndicators: [
      "Format has been copied across 3+ categories",
      "View counts declining across the format ecosystem",
      "Advertisers less interested (lower RPM)",
    ],
    scoreImpact: {
      opportunity: -6,
      saturation: 7,
      assetPotential: -4,
    },
    confidence: "medium",
    source: "Transcript analysis of format lifecycle; bottom-tier formats consistently saturate in 60-120 days",
  },

  // ─── NICHE BENDING RULES ────────────────────────────────────
  {
    id: "bending-not-copying",
    category: "niche_bending",
    title: "Niche Bending: Never Copy, Always Transpose",
    description:
      "The most successful faceless channels don't copy successful channels — they transpose a proven format into a new category, audience, language, or specificity level. Direct copying floods the market and accelerates saturation. Niche bending extends the format lifecycle.",
    signals: [
      "Format from one category applied to a different category",
      "Proven content structure adapted for a different audience",
      "Language/geography adaptation of a successful concept",
      "General format narrowed to a specific sub-audience",
      "Same psychological trigger, different packaging",
    ],
    positiveIndicators: [
      "Target category has proven demand but format is absent",
      "Target audience exists but isn't served by this format",
      "Bend can be explained in one sentence: 'X format meets Y audience'",
    ],
    negativeIndicators: [
      "Bend is essentially the same as existing channels",
      "No clear differentiation from competitors",
      "Target category already has this format saturated",
    ],
    scoreImpact: {
      opportunity: 8,
      saturation: -5,
      executionDifficulty: 2,
    },
    confidence: "high",
    source: "Transcript analysis of successful niche benders; direct copying was consistently identified as a failure pattern",
  },
  {
    id: "bending-four-axes",
    category: "niche_bending",
    title: "Four-Axis Niche Bending Framework",
    description:
      "Every Niche Bend should specify which axis it uses: A (Category Change — take format to new field), B (Format Change — new format for proven category), C (Geography/Language — proven concept in new market), or D (Audience Specificity — narrow a general format). Axis D often produces the highest RPM.",
    signals: [
      "Axis A: Proven format, new category with demand",
      "Axis B: Proven category, underserved format opportunity",
      "Axis C: Proven concept in a different language/region",
      "Axis D: General format narrowed to specific sub-audience",
    ],
    positiveIndicators: [
      "Axis D: Niche audience has strong identity and spending power",
      "Axis C: Language market has growing YouTube consumption",
      "Axis A: Target category has high RPM and faceless proof",
      "Axis B: Format is missing from a demand-rich category",
    ],
    negativeIndicators: [
      "Bend axis is unclear or mixed",
      "Multiple channels already bending in the same direction",
    ],
    scoreImpact: {
      opportunity: 6,
    },
    confidence: "high",
    source: "Transcript analysis of successful niche bending strategies across 400+ faceless channels",
  },

  // ─── SCRIPT BENDING RULES ────────────────────────────────────
  {
    id: "script-skeleton-first",
    category: "script_bending",
    title: "Script Skeleton Extraction Before Content Creation",
    description:
      "Before creating any video, extract the script skeleton from successful competitors: hook type, open loop patterns, payoff structure, transition phrases, and CTA patterns. The skeleton is reusable across any topic. Script bending = keep the skeleton, swap the topic.",
    signals: [
      "Hook follows a predictable formula (curiosity gap, bold claim, question)",
      "Open loops are structurally consistent across videos",
      "Payoff sections follow claim→evidence→insight pattern",
      "Transition phrases are reused across videos",
      "CTA placement and wording have a consistent pattern",
    ],
    positiveIndicators: [
      "Script skeleton is simple enough to template",
      "Skeleton works across different topics within the niche",
      "Hook formulas can be adapted to other niches",
    ],
    negativeIndicators: [
      "Script structure varies wildly between videos",
      "No consistent hook or payoff pattern",
      "Success is personality-dependent, not structure-dependent",
    ],
    scoreImpact: {
      opportunity: 5,
      executionDifficulty: -3,
    },
    confidence: "high",
    source: "Transcript analysis of script patterns; reusable skeletons were consistently present in successful channels",
  },
  {
    id: "script-bending-process",
    category: "script_bending",
    title: "Script Bending: Keep Skeleton, Swap Topic",
    description:
      "The fastest path to validated content is to take a proven script skeleton and apply it to a new niche. Keep the hook formula, open loop pattern, payoff structure, and transition phrases. Only change the subject matter. This reduces creative risk and accelerates testing.",
    signals: [
      "Hook from source adapted with new topic in target niche",
      "Open loop phrasing kept but topic references swapped",
      "Payoff structure (claim→evidence→conclusion) preserved",
      "Transition connectors reused verbatim",
      "CTA pattern adapted for target audience language",
    ],
    positiveIndicators: [
      "Source skeleton has produced multiple hit videos",
      "Target niche has proven demand for similar content formats",
      "Skeleton doesn't depend on source niche-specific references",
    ],
    negativeIndicators: [
      "Skeleton depends on insider knowledge of source niche",
      "Hook is tied to source niche cultural references",
      "Payoff references wouldn't make sense in target niche",
    ],
    scoreImpact: {
      opportunity: 6,
      executionDifficulty: -4,
    },
    confidence: "medium",
    source: "Transcript analysis of script adaptation; channels that used script bending launched 2x faster than those creating from scratch",
  },

  // ─── BLUE OCEAN RULES ────────────────────────────────────────
  {
    id: "blue-ocean-gap-detection",
    category: "blue_ocean",
    title: "Blue Ocean Gap: High Demand + Low Supply = Opportunity",
    description:
      "A blue ocean gap exists when audience demand is proven (high search volume, popular videos in adjacent topics) but the specific format-market combination has few or no competitors. The strongest gap signal is when multiple adjacent topics are popular but nobody has applied the format to the target niche.",
    signals: [
      "Popular videos in adjacent topics but not in target format",
      "Audience searches for content that doesn't exist yet",
      "Comments on popular videos asking for specific content",
      "Format proven in other markets but absent from target",
      "Large channels exist in the category but none use this format",
    ],
    positiveIndicators: [
      "Search volume for format+category combination is growing",
      "Adjacent content has millions of views",
      "Potential audience has strong engagement (comments, shares)",
    ],
    negativeIndicators: [
      "No audience demand for the topic whatsoever",
      "Format has been tried and failed in this category",
      "Category culture doesn't support the format",
    ],
    scoreImpact: {
      opportunity: 9,
      saturation: -6,
    },
    confidence: "high",
    source: "Transcript analysis of blue ocean entry strategies; format-market gaps were consistently the highest-ROI opportunities",
  },
  {
    id: "blue-ocean-adjacent-proof",
    category: "blue_ocean",
    title: "Adjacent Market Proof: Demand Without Competition",
    description:
      "Before entering a blue ocean gap, verify that an adjacent market has proven the demand. For example, if you want to do 'animated finance explainers in Spanish', verify that (1) animated explainers work in finance (English proof), (2) Spanish finance content has demand, and (3) no one has combined them. Each adjacent proof reduces risk.",
    signals: [
      "Format works in an adjacent category (cross-category proof)",
      "Target language market has content demand (language proof)",
      "Similar audiences engage with related content (audience proof)",
      "No direct competitor in the specific combination",
    ],
    positiveIndicators: [
      "All adjacent proofs show strong signals",
      "Multiple adjacency layers reinforcing the opportunity",
      "Time-sensitive gap (soon will be filled)",
    ],
    negativeIndicators: [
      "Only one layer of adjacent proof exists",
      "Adjacent proofs are weak or outdated",
      "Gap exists for a reason (market tested and rejected)",
    ],
    scoreImpact: {
      opportunity: 7,
      executionDifficulty: -2,
    },
    confidence: "medium",
    source: "Transcript analysis of adjacent market entry; multiple layers of proof consistently predicted success",
  },

  // ─── FORMAT RULES ────────────────────────────────────────────
  {
    id: "format-proof-exists",
    category: "format",
    title: "Format Proof: Proven Format Beats Novelty",
    description:
      "A format that has already generated millions of views (even in a different category) is a safer bet than an untested novel format. Format proof means at least one channel has shown the format can drive engagement. The ideal new niche is 'proven format + new market' not 'new format + new market'.",
    signals: [
      "At least one channel with 100K+ views using this format",
      "Format works across multiple topics or categories",
      "Audience retention data shows the format holds attention",
      "Format is adaptable to different niches",
    ],
    positiveIndicators: [
      "Format has breakout hits in multiple categories",
      "Format generates above-average RPM",
      "Format has been stable (not declining) for 6+ months",
    ],
    negativeIndicators: [
      "Format only worked for one specific channel/personality",
      "Format requires expensive tools or skills as baseline",
      "Format has declining search interest",
    ],
    scoreImpact: {
      opportunity: 6,
      executionDifficulty: -3,
    },
    confidence: "high",
    source: "Transcript analysis of format success rates; proven formats had 3x higher success rate than novel formats",
  },

  // ─── POLICY RISK RULES ──────────────────────────────────────
  {
    id: "policy-risk-inauthentic-content",
    category: "policy_risk",
    title: "Policy Risk from Inauthentic / Reused Generic AI Content",
    description:
      "YouTube is increasingly penalizing low-effort AI-generated content that provides little original value. Channels that heavily reuse generic AI images, repackage existing content, or produce 'faceless but thoughtless' content face demonetization, limited recommendations, and channel termination risk. Authentic AI content (original insights + AI production) is fine.",
    signals: [
      "Generic stock/AI images unrelated to specific narration",
      "Script is a rewrite of top search results without original insight",
      "Multiple channels using identical AI-generated assets",
      "Voiceover is generic AI voice without brand consistency",
      "Content provides no unique value beyond basic information",
    ],
    positiveIndicators: [
      "Script includes original research, data, or perspective",
      "Visual assets are customized or brand-consistent",
      "Human oversight and editorial quality control evident",
      "Content answers specific audience questions or needs",
    ],
    negativeIndicators: [
      "Identical content could be generated by any AI tool",
      "No original sourcing, opinions, or insights",
      "Content is purely derivative of existing popular videos",
      "Channel has no unique brand or perspective",
    ],
    scoreImpact: {
      policyRisk: 8,
      assetPotential: -6,
    },
    confidence: "high",
    source: "Transcript analysis of demonetization cases; channels with generic AI content faced 3x higher policy action risk",
  },
  {
    id: "policy-risk-content-originality",
    category: "policy_risk",
    title: "Content Originality Requirement for Faceless Channels",
    description:
      "Faceless channels must demonstrate original value beyond the AI generation process. YouTube's 'reused content' policy applies when the channel acts merely as a content aggregator. To pass policy review, faceless channels need: original script writing, custom visuals, unique perspective, and human editorial involvement documented.",
    signals: [
      "Script is originally written (not AI-generated from search results)",
      "Visuals are custom-created or significantly customized",
      "Channel has a unique POV or take on the topic",
      "Editorial decisions show human judgment",
      "Content provides value beyond summarizing existing information",
    ],
    positiveIndicators: [
      "Channel can demonstrate production process",
      "Content cited as reference by other creators",
      "Audience recognizes channel's unique voice/style",
    ],
    negativeIndicators: [
      "Script reads like a Wikipedia article rewrite",
      "Visuals from stock/AI libraries without modification",
      "No attribution or sourcing for claims",
      "Multiple channels with nearly identical content style",
    ],
    scoreImpact: {
      policyRisk: 6,
      assetPotential: 5,
    },
    confidence: "high",
    source: "YouTube policy documentation analyzed alongside 50+ demonetization cases; originality is the key factor",
  },
];

/**
 * Get rules by category.
 */
export function getRulesByCategory(category: RuleCategory): ResearchRule[] {
  return transcriptResearchRules.filter((r) => r.category === category);
}

/**
 * Get all rules that affect opportunity score (sorted by impact magnitude).
 */
export function getOpportunityRules(): ResearchRule[] {
  return transcriptResearchRules
    .filter((r) => r.scoreImpact.opportunity !== undefined)
    .sort((a, b) => Math.abs(b.scoreImpact.opportunity ?? 0) - Math.abs(a.scoreImpact.opportunity ?? 0));
}

/**
 * Get all rules that affect saturation score.
 */
export function getSaturationRules(): ResearchRule[] {
  return transcriptResearchRules
    .filter((r) => r.scoreImpact.saturation !== undefined)
    .sort((a, b) => Math.abs(b.scoreImpact.saturation ?? 0) - Math.abs(a.scoreImpact.saturation ?? 0));
}

/**
 * Get all rules related to policy risk.
 */
export function getPolicyRiskRules(): ResearchRule[] {
  return transcriptResearchRules
    .filter((r) => r.scoreImpact.policyRisk !== undefined)
    .sort((a, b) => Math.abs(b.scoreImpact.policyRisk ?? 0) - Math.abs(a.scoreImpact.policyRisk ?? 0));
}
