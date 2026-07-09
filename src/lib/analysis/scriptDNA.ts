// 🧬 Script DNA Extraction & Bending
// Analyzes video scripts to extract reusable patterns and bend them to new niches

export interface ScriptDNAInput {
  title: string;
  transcript?: string;
  description?: string;
  videoFormat?: string;
}

export interface ScriptBeat {
  beat: string;
  purpose: string;
  timestampHint?: string;
}

export interface ScriptDNAResult {
  titlePattern: string;
  hookPattern: string;
  structure: ScriptBeat[];
  retentionDevices: string[];
  ctaPattern?: string;
  reusableSkeleton: string;
}

export interface ScriptBendInput {
  sourceDNA: ScriptDNAResult;
  newNiche: string;
  newTopic: string;
  targetAudience: string;
}

export interface ScriptBendResult {
  bentTitle: string;
  scriptOutline: string[];
  thumbnailConcept: string;
  openingHook: string;
  retentionPlan: string[];
}

/**
 * Common hook patterns observed across successful faceless channels.
 */
const HOOK_PATTERNS = {
  "curiosity-gap": {
    pattern: '"Why {Topic} Is/Are {Claim} Than You Think"',
    purpose: "Creates an information gap the audience needs to close",
  },
  "bold-claim": {
    pattern: '"The Truth About {Topic} Nobody Talks About"',
    purpose: "Challenges assumptions and promises exclusive information",
  },
  question: {
    pattern: '"What If {Topic} Was Actually {SurprisingFact}?"',
    purpose: "Engages the audience by making them wonder",
  },
  "statistic-open": {
    pattern: '"{Stat}% of People Don\'t Know This About {Topic}"',
    purpose: "Uses numbers to create authority and curiosity",
  },
  story: {
    pattern: '"I Discovered {Topic} And It Changed Everything"',
    purpose: "Personal narrative hook builds emotional investment",
  },
  contrast: {
    pattern: '"{Topic} Then vs Now — The Shocking Difference"',
    purpose: "Shows transformation or change over time",
  },
};

/**
 * Extracts the script DNA from a video by analyzing its title,
 * transcript (if available), description, and format.
 *
 * Returns a reusable skeleton that can be bent to other niches.
 */
export function extractScriptDNA(input: ScriptDNAInput): ScriptDNAResult {
  const title = input.title;
  const titleLower = title.toLowerCase();

  // ─── Detect Title Pattern ──────────────────────────────────
  let titlePattern = title;

  // Try to detect pattern from common structures
  if (titleLower.startsWith("why ") || titleLower.startsWith("what ")) {
    titlePattern = titleLower.startsWith("why ")
      ? '"Why {Topic} Is/Are {Claim}"'
      : '"What {Question} Means For {Audience}"';
  } else if (titleLower.startsWith("how ")) {
    titlePattern = '"How {Topic} Actually Works"';
  } else if (titleLower.startsWith("the truth about ")) {
    titlePattern = '"The Truth About {Topic} Nobody Talks About"';
  } else if (titleLower.startsWith("top ") || titleLower.includes(" best ")) {
    titlePattern = '"Top/Best {Count} {Topic} That Will {Result}"';
  } else if (titleLower.includes(" vs ") || titleLower.includes(" versus ")) {
    titlePattern = '"{Topic1} vs {Topic2}: Which Is Better?"';
  } else if (titleLower.startsWith("i tried ") || titleLower.startsWith("i tested ")) {
    titlePattern = '"I Tried {Topic} For {Duration} — Here\'s What Happened"';
  } else if (titleLower.includes("debunk") || titleLower.includes("myth")) {
    titlePattern = '"{Count} {Topic} Myths Debunked"';
  } else {
    titlePattern = '"{HookWord} {Topic} {Payoff}"';
  }

  // ─── Detect Hook Pattern ───────────────────────────────────
  let hookPattern = "curiosity-gap";
  if (titleLower.startsWith("why ")) hookPattern = "curiosity-gap";
  else if (titleLower.includes("truth about")) hookPattern = "bold-claim";
  else if (titleLower.startsWith("what ")) hookPattern = "question";
  else if (titleLower.includes("%") || titleLower.includes("percent")) hookPattern = "statistic-open";
  else if (titleLower.startsWith("i ")) hookPattern = "story";
  else if (titleLower.includes(" vs ") || titleLower.includes("then vs now")) hookPattern = "contrast";

  const hookInfo = HOOK_PATTERNS[hookPattern as keyof typeof HOOK_PATTERNS] || HOOK_PATTERNS["curiosity-gap"];

  // ─── Build Structure ───────────────────────────────────────
  const structure: ScriptBeat[] = [];
  if (input.videoFormat === "shorts" || input.videoFormat === "short") {
    structure.push(
      { beat: "Hook (0:00-0:03)", purpose: "Grab attention immediately" },
      { beat: "Problem Statement (0:03-0:10)", purpose: "Identify the tension or curiosity gap" },
      { beat: "Payoff / Answer (0:10-0:45)", purpose: "Deliver the value or answer" },
      { beat: "CTA (0:45-0:60)", purpose: "Subscribe or comment prompt" }
    );
  } else {
    // Long-form structure
    structure.push(
      { beat: "Hook (0:00-0:30)", purpose: "Grab attention with question/claim/stat", timestampHint: "0:00" },
      { beat: "Open Loop #1 (0:30-1:00)", purpose: "Create curiosity that keeps viewers watching", timestampHint: "0:30" },
      { beat: "Payoff #1 (1:00-3:00)", purpose: "Deliver first value: claim → evidence → insight", timestampHint: "1:00" },
      { beat: "Transition + Open Loop #2 (3:00-3:30)", purpose: "Bridge to next point with new curiosity gap", timestampHint: "3:00" },
      { beat: "Payoff #2 (3:30-6:00)", purpose: "Second value delivery: deeper evidence", timestampHint: "3:30" },
      { beat: "Mid-Video CTA (6:00-6:15)", purpose: "Subscribe/like prompt", timestampHint: "6:00" },
      { beat: "Payoff #3 (6:15-8:30)", purpose: "Third value delivery with strongest evidence", timestampHint: "6:15" },
      { beat: "Final Peak (8:30-9:30)", purpose: "Highest-impact takeaway or twist", timestampHint: "8:30" },
      { beat: "Conclusion + CTA (9:30-10:00)", purpose: "Summarize + final call to action", timestampHint: "9:30" }
    );
  }

  // ─── Retention Devices ─────────────────────────────────────
  const retentionDevices: string[] = [
    "Curiosity gaps at open loops",
    "Pattern interrupts (unexpected statements)",
    "Promise of exclusive/insider information",
    "Visual variety (scene changes, graphics, B-roll)",
    "Pacing variation (fast sections followed by contemplation)",
  ];

  // ─── CTA Pattern ───────────────────────────────────────────
  let ctaPattern = '"If you found this valuable, subscribe for more {topic} content"';
  if (titleLower.includes("subscribe") || input.description?.toLowerCase().includes("subscribe")) {
    ctaPattern = '"Subscribe to join [X] other {topic} enthusiasts"';
  }

  // ─── Reusable Skeleton ─────────────────────────────────────
  const reusableSkeleton = [
    `Hook: ${hookInfo.pattern} — creates ${hookInfo.purpose.toLowerCase()}`,
    "",
    "Open Loop #1: {Tease something surprising or contradictory}",
    "Payoff #1: {Claim} → {Evidence/Example} → {Insight/Takeaway}",
    "Transition: '{Connector phrase that bridges the points}'",
    "",
    "Open Loop #2: {Tease the next big point}",
    "Payoff #2: {Claim} → {Evidence/Data} → {Actionable Conclusion}",
    "",
    "Payoff #3: {Strongest claim} → {Convincing evidence} → {Peak insight}",
    "",
    "Final Peak: {Most memorable takeaway or twist}",
    "Conclusion: {Summarize key points + emotional call to action}",
    `CTA: "${ctaPattern}"`,
  ].join("\n");

  return {
    titlePattern,
    hookPattern: hookInfo.pattern,
    structure,
    retentionDevices,
    ctaPattern,
    reusableSkeleton,
  };
}

/**
 * Bends an existing script DNA skeleton to a new niche and topic.
 * Keeps the proven structure but replaces topic references.
 */
export function bendScriptSkeleton(input: ScriptBendInput): ScriptBendResult {
  const { sourceDNA, newNiche, newTopic, targetAudience } = input;

  // ─── Generate Bent Title ───────────────────────────────────
  let bentTitle = sourceDNA.titlePattern
    .replace("{Topic}", newTopic)
    .replace("{Claim}", `${newNiche} Secrets`)
    .replace("{Count}", "5")
    .replace("{Result}", "Blow Your Mind")
    .replace("{Duration}", "30 Days")
    .replace("{HookWord}", "Why")
    .replace("{Payoff}", "Will Change Everything")
    .replace("{Question}", `If ${newTopic} Could ${getRandomVerb()}`)
    .replace("{Audience}", targetAudience)
    .replace("{Topic1}", newTopic)
    .replace("{Topic2}", getAdjacentTopic(newTopic));

  // ─── Thumbnail Concept ─────────────────────────────────────
  const thumbnailConcept = `Bold text: "${getThumbnailHook(newTopic)}" over ${
    getThumbnailVisual(newNiche)
  }. Color scheme: ${getThumbnailColors(newNiche)}. Include a surprised/curious expression element.`;

  // ─── Opening Hook ──────────────────────────────────────────
  const openingHook = sourceDNA.hookPattern
    .replace("{Topic}", newTopic)
    .replace("{Claim}", getBoldClaim(newTopic))
    .replace("{Stat}", String(Math.floor(Math.random() * 80) + 10))
    .replace("{SurprisingFact}", getSurprisingAngle(newTopic));

  // ─── Script Outline ────────────────────────────────────────
  const scriptOutline = sourceDNA.structure.map((beat) => {
    const niche = newNiche.toLowerCase();
    return `${beat.beat}: ${beat.purpose.replace(/{topic}/g, niche).replace(/{Audience}/g, targetAudience)}`;
  });

  // ─── Retention Plan ────────────────────────────────────────
  const retentionPlan = [
    `Open with a {statistic or claim} about ${newTopic} that challenges common beliefs`,
    `Promise at the start: "By the end of this video, you'll understand why ${newTopic} matters to you"`,
    `Use ${getRetentionPattern(newNiche)} to maintain engagement`,
    `Include at least one ${getSurprisingElement(newNiche)} segment`,
    `End with a question to ${targetAudience} that encourages comments`,
  ];

  return {
    bentTitle,
    scriptOutline,
    thumbnailConcept,
    openingHook,
    retentionPlan,
  };
}

// ─── Helper Functions ──────────────────────────────────────────

function getRandomVerb(): string {
  const verbs = ["Speak", "Change", "Disappear", "Save Us", "Destroy Everything"];
  return verbs[Math.floor(Math.random() * verbs.length)];
}

function getAdjacentTopic(topic: string): string {
  const adjacentTopics: Record<string, string> = {
    "AI": "Human Intelligence",
    "Crypto": "Traditional Banking",
    "Weight Loss": "Muscle Gain",
    "Productivity": "Procrastination",
    "Meditation": "Stress",
    "Investing": "Saving",
  };
  return adjacentTopics[topic] || `${topic} Alternatives`;
}

function getThumbnailHook(topic: string): string {
  const hooks = [
    `${topic} Is NOT What You Think`,
    `The ${topic} Lie`,
    `I Discovered ${topic}`,
    `${topic}: The Truth`,
  ];
  return hooks[Math.floor(Math.random() * hooks.length)];
}

function getThumbnailVisual(niche: string): string {
  const visuals: Record<string, string> = {
    "Finance": "dollar signs and charts",
    "Tech": "circuit board patterns and neon",
    "Health": "human anatomy diagrams",
    "Education": "books and lightbulbs",
    "Crime": "dark silhouettes and evidence boards",
    "DIY": "tools and materials",
  };
  return visuals[niche.split(" ")[0]] || "dramatic split-screen comparison";
}

function getThumbnailColors(niche: string): string {
  const colors: Record<string, string> = {
    "Finance": "Red + Gold + White",
    "Tech": "Blue + Purple + Cyan",
    "Health": "Green + White + Orange",
    "Education": "Blue + Yellow + White",
    "Crime": "Dark Red + Black + Gray",
  };
  return colors[niche.split(" ")[0]] || "High contrast complementary colors";
}

function getBoldClaim(topic: string): string {
  return `More ${getRandomImpact()} Than Anyone Realizes`;
}

function getRandomImpact(): string {
  const impacts = ["Dangerous", "Important", "Profitable", "Fragile", "Powerful", "Misunderstood"];
  return impacts[Math.floor(Math.random() * impacts.length)];
}

function getSurprisingAngle(topic: string): string {
  return `Actually ${getRandomImpact()} for ${topic}`;
}

function getRetentionPattern(niche: string): string {
  const patterns = [
    "pattern interrupts (unexpected statistics)",
    "curiosity gaps between each section",
    "visual variety with data-driven graphics",
    "comparative analysis with surprising results",
  ];
  return patterns[Math.floor(Math.random() * patterns.length)];
}

function getSurprisingElement(niche: string): string {
  const elements = [
    "counter-intuitive data point",
    "expert opinion that contradicts common knowledge",
    "case study with unexpected outcome",
    "historical comparison that reframes the topic",
  ];
  return elements[Math.floor(Math.random() * elements.length)];
}
