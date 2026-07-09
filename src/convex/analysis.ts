// Pure logic analysis engine — no AI dependency
// Implements the core algorithms from the YouTube Niche Master Prompt v6
// Now integrates transcript-derived research modules

import { classifyPyramidLevel } from "../lib/analysis/pyramid";
import { scoreBarriers } from "../lib/analysis/barriers";
import { detectMarketStage } from "../lib/analysis/saturation";
import { generateNicheBends as generateBendsFromModule } from "../lib/analysis/nicheBending";
import { extractScriptDNA } from "../lib/analysis/scriptDNA";
import { scoreBlueOceanGap } from "../lib/analysis/blueOcean";
import { calculateWeightedOpportunityScore } from "../lib/analysis/opportunityScore";
import { transcriptResearchRules } from "../data/knowledge/researchRules";
import type { ResearchRule } from "../data/knowledge/researchRules";

// Re-export new module types
export type { PyramidLevel, PyramidInput, PyramidResult } from "../lib/analysis/pyramid";
export type { BarrierInput, BarrierResult, MoatLabel } from "../lib/analysis/barriers";
export type { MarketStage, SaturationInput, SaturationResult, Action } from "../lib/analysis/saturation";
export type { OceanLabel, BlueOceanInput, BlueOceanResult } from "../lib/analysis/blueOcean";
export type { OpportunityInput, OpportunityResult, Recommendation } from "../lib/analysis/opportunityScore";
export type { ScriptDNAInput, ScriptDNAResult, ScriptBendInput, ScriptBendResult } from "../lib/analysis/scriptDNA";

// The new NicheBendProposal from the module is used under a different name
export type { NicheBendProposal as NewNicheBendProposal, NicheBendInput, BendType } from "../lib/analysis/nicheBending";
export { generateBendsFromModule, classifyPyramidLevel, scoreBarriers, detectMarketStage, extractScriptDNA, scoreBlueOceanGap, calculateWeightedOpportunityScore, transcriptResearchRules };
export type { ResearchRule };

// Backward compatibility: the legacy type is also known as NicheBendProposal
// (used by CLI and analyzeAction.ts)
export type NicheBendProposal = LegacyBendProposal;

export interface NicheCandidate {
  channelName: string;
  channelUrl: string;
  description: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  monthlyViews: number;
  estimatedRevenue: number;
  facelessVerified: boolean;
  channelType: 'new' | 'reactivated';
  opportunityScore: number;
  format: string;
  category: string;
  firstVideoDate: string;
  activeDays: number;
}

// Legacy bend proposal type (for CLI compatibility)
// Also exported as NicheBendProposal for backward compatibility
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface LegacyBendProposal {
  rank: number;
  channelName: string;
  category: string;
  bendAxis: 'A' | 'B' | 'C' | 'D';
  format: string;
  strategy: 'FORMAT_TREND' | 'MARKET_PLAY' | 'HYBRID';
  complexityTier: 'bottom' | 'middle' | 'top';
  budget: string;
  timeToMonetization: string;
  elevatorPitch: string;
  whyNow: string;
  videoIdeas: string[];
  thumbnailStrategy: string;
  risks: string;
  opportunityScore: number;
  rpm: string;
  validationStatus?: 'green' | 'caution' | 'red';
}

// RPM reference table
const RPM_TABLE: Record<string, { min: number; max: number; monetization: string }> = {
  'Finance & Business': { min: 15, max: 40, monetization: 'AdSense + Sponsors + Affiliate' },
  'Tech & Software': { min: 8, max: 20, monetization: 'Affiliate + Sponsors' },
  'Health & Fitness': { min: 4, max: 12, monetization: 'Supplements + Courses + Affiliate' },
  'Education & Science': { min: 3, max: 10, monetization: 'AdSense + Courses' },
  'True Crime': { min: 3, max: 8, monetization: 'AdSense + Merch' },
  'DIY & How-To': { min: 3, max: 9, monetization: 'Affiliate + Courses' },
  'Beauty & Fashion': { min: 2, max: 6, monetization: 'Affiliate + Brand Deals' },
  'Lifestyle & Vlogs': { min: 2, max: 5, monetization: 'Brand Deals + Merch' },
};

const CATEGORIES = [
  'Lifestyle & Vlogs',
  'Education & Science',
  'DIY & How-To',
  'Health & Fitness',
  'Beauty & Fashion',
  'True Crime',
  'Finance & Business',
  'Tech & Software',
];

// Sub-niche map
const SUB_NICHES: Record<string, string[]> = {
  'Finance & Business': ['Budgeting', 'Crypto', 'Real Estate', 'Side Hustles', 'Stock Market', 'Personal Finance', 'Entrepreneurship'],
  'Tech & Software': ['AI Tools', 'Cybersecurity', 'SaaS', 'Mobile Apps', 'Programming', 'Gadgets', 'Future Tech'],
  'Health & Fitness': ['Weight Loss', 'Mental Health', 'Nutrition', 'Workout Routines', 'Sleep', 'Longevity', 'Biohacking'],
  'Education & Science': ['History', 'Psychology', 'Physics', 'Biology', 'Space', 'Philosophy', 'Linguistics'],
  'True Crime': ['Serial Killers', 'Unsolved Cases', 'Cults', 'Scams', 'Heists', 'Missing Persons'],
  'DIY & How-To': ['Woodworking', 'Electronics', 'Home Repair', 'Crafts', 'Cooking', 'Gardening'],
  'Beauty & Fashion': ['Skincare', 'Makeup', "Men's Fashion", 'Sustainable Fashion', 'Hair', 'Nail Art'],
  'Lifestyle & Vlogs': ['Minimalism', 'Travel', 'Productivity', 'Relationships', 'Personal Growth', 'Food'],
};

// Format templates for video ideas
const FORMAT_TEMPLATES: Record<string, string[]> = {
  explainer: [
    'Why {Topic} Is More Dangerous Than You Think',
    'The Truth About {Topic} Nobody Talks About',
    'How {Topic} Actually Works (Animated)',
    'The Rise and Fall of {Topic}',
    '{Topic} Explained in 5 Minutes',
  ],
  list: [
    'Top 10 {Topic} That Will Blow Your Mind',
    '5 Signs You\'re Affected by {Topic}',
    'The Most Shocking {Topic} Ever Recorded',
    '7 {Topic} Myths Debunked',
    '10 People Who Discovered {Topic} The Hard Way',
  ],
  comparison: [
    '{Topic} vs {Topic2}: Which Is Better?',
    'The Difference Between {Topic} and {Topic2}',
    'Why {Topic} Is Better Than {Topic2}',
    '{Topic} Then vs Now',
  ],
  story: [
    'The Incredible Story of {Topic}',
    'What Happened to {Topic}?',
    'The Day {Topic} Changed Everything',
    'I Investigated {Topic} And Found This',
  ],
};

// Detect format from channel name and description
function detectFormat(name: string, description: string): string {
  const lowerDesc = (name + ' ' + description).toLowerCase();

  if (lowerDesc.includes('explain') || lowerDesc.includes('how') || lowerDesc.includes('why') || lowerDesc.includes('what')) {
    return 'explainer';
  }
  if (lowerDesc.includes('top') || lowerDesc.includes('best') || lowerDesc.includes('worst') || lowerDesc.includes('list')) {
    return 'list';
  }
  if (lowerDesc.includes('vs') || lowerDesc.includes('compar') || lowerDesc.includes('difference') || lowerDesc.includes('better')) {
    return 'comparison';
  }
  if (lowerDesc.includes('story') || lowerDesc.includes('history') || lowerDesc.includes('investigat') || lowerDesc.includes('document')) {
    return 'story';
  }

  // Default based on category patterns
  if (lowerDesc.includes('finance') || lowerDesc.includes('busi') || lowerDesc.includes('money')) return 'explainer';
  if (lowerDesc.includes('true crime') || lowerDesc.includes('mystery') || lowerDesc.includes('crime')) return 'story';
  if (lowerDesc.includes('diy') || lowerDesc.includes('tutorial') || lowerDesc.includes('how to')) return 'list';
  if (lowerDesc.includes('health') || lowerDesc.includes('fit')) return 'list';
  if (lowerDesc.includes('tech') || lowerDesc.includes('ai') || lowerDesc.includes('software')) return 'explainer';

  return 'explainer'; // default
}

// Detect channel category
function detectCategory(name: string, description: string): string {
  const lowerDesc = (name + ' ' + description).toLowerCase();

  const categorySignals: Record<string, number> = {};
  for (const cat of CATEGORIES) {
    const keywords = cat.toLowerCase().split(/[\\s&,]+/);
    let score = 0;
    for (const kw of keywords) {
      if (kw.length > 2 && lowerDesc.includes(kw)) score += 2;
    }
    // Sub-niche signals
    const subSignals = SUB_NICHES[cat] || [];
    for (const sub of subSignals) {
      if (lowerDesc.includes(sub.toLowerCase())) score += 3;
    }
    categorySignals[cat] = score;
  }

  // Find best match
  let bestCat = CATEGORIES[0];
  let bestScore = 0;
  for (const [cat, score] of Object.entries(categorySignals)) {
    if (score > bestScore) {
      bestScore = score;
      bestCat = cat;
    }
  }

  return bestCat;
}

// Calculate opportunity score (0-100)
function calculateOpportunityScore(params: {
  monthlyViews: number;
  estimatedRevenue: number;
  subscriberCount: number;
  activeDays: number;
  channelType: 'new' | 'reactivated';
  categoryMultiplier: number;
}): number {
  let score = 0;

  // Monthly views: target 1M+ (score 0-30)
  score += Math.min(30, (params.monthlyViews / 1000000) * 30);

  // Revenue: target $5K+ (score 0-25)
  score += Math.min(25, (params.estimatedRevenue / 5000) * 25);

  // Newer channels get bonus (score 0-20)
  if (params.channelType === 'new') score += 15;
  else score += 5;

  // Subscriber count sweet spot (5K-100K)
  if (params.subscriberCount >= 5000 && params.subscriberCount <= 100000) score += 10;

  // Active days bonus (1-6 months is sweet spot)
  if (params.activeDays >= 30 && params.activeDays <= 180) score += 10;

  // Category multiplier
  score *= params.categoryMultiplier;

  return Math.min(100, Math.round(score));
}

// Generate niche bend proposals based on pure logic (legacy, replaced by new module but kept for CLI)
function generateBendProposals(source: {
  name: string;
  description: string;
  format: string;
  category: string;
  strategy?: 'FORMAT_TREND' | 'MARKET_PLAY' | 'HYBRID';
}): LegacyBendProposal[] {
  const proposals: LegacyBendProposal[] = [];
  const strategy = source.strategy || 'FORMAT_TREND';

  // Identify target categories (exclude source category, prefer high-RPM ones)
  const targetCategories = CATEGORIES.filter((c) => c !== source.category);

  // Sort by RPM potential (high RPM first)
  targetCategories.sort((a, b) => (RPM_TABLE[b]?.min || 0) - (RPM_TABLE[a]?.min || 0));

  // Take top 3 for proposals
  const topTargets = targetCategories.slice(0, 3);

  const formatNames: Record<string, string> = {
    explainer: 'Animated Explainer Videos',
    list: 'Ranking/Top List Videos',
    comparison: 'Comparison Videos',
    story: 'Storytelling/Documentary',
  };

  const formatName = formatNames[source.format] || 'Educational Content';

  const axisDetermination: Record<string, 'A' | 'B' | 'C' | 'D'> = {
    FORMAT_TREND: 'A',
    MARKET_PLAY: 'B',
    HYBRID: 'A',
  };

  topTargets.forEach((targetCategory, index) => {
    const tierKey = index < 1 ? 'bottom' : index < 3 ? 'middle' : 'top';
    const rpm = RPM_TABLE[targetCategory];
    const rpmRange = rpm ? `$${rpm.min}-$${rpm.max}` : '$3-$10';

    const videoIdeas = generateVideoIdeas(source.format, targetCategory);
    const channelName = generateChannelName(targetCategory, source.format);

    proposals.push({
      rank: index + 1,
      channelName,
      category: targetCategory,
      bendAxis: axisDetermination[strategy] || 'A',
      format: formatName,
      strategy: strategy as 'FORMAT_TREND' | 'MARKET_PLAY' | 'HYBRID',
      complexityTier: tierKey as 'bottom' | 'middle' | 'top',
      budget: tierKey === 'bottom' ? '$200-$500/month' : tierKey === 'middle' ? '$1K-$1.5K/month' : '$1.5K+/month',
      timeToMonetization: tierKey === 'bottom' ? 'Few weeks' : tierKey === 'middle' ? '1-3 months' : 'Several months',
      elevatorPitch: `Bringing ${formatName.toLowerCase()} to the ${targetCategory} niche — like ${source.name} but for ${targetCategory} audience`,
      whyNow: `The ${targetCategory.toLowerCase()} market on YouTube is growing with high RPM (${rpmRange}). Faceless content in this space has proven demand, and the ${formatName.toLowerCase()} format hasn't been saturated yet.`,
      videoIdeas: videoIdeas.slice(0, 5),
      thumbnailStrategy: `Use contrasting colors with bold text overlays. Show ${targetCategory.toLowerCase()}-themed visuals with dramatic close-ups.`,
      risks: `Monitor RPM closely. Test 3-5 videos before full commitment.`,
      opportunityScore: 85 - index * 10 + (rpm?.min || 3) * 2,
      rpm: rpmRange,
      validationStatus: 'green',
    });
  });

  return proposals;
}

// Generate channel name based on category and format
function generateChannelName(category: string, format: string): string {
  const prefixes: Record<string, string[]> = {
    'Finance & Business': ['Money', 'Wealth', 'Cash', 'Biz', 'Invest'],
    'Tech & Software': ['Tech', 'Code', 'Digital', 'Byte', 'Future'],
    'Health & Fitness': ['Health', 'Fit', 'Vital', 'Wellness', 'Body'],
    'Education & Science': ['Learn', 'Mind', 'Know', 'Curious', 'Brain'],
    'True Crime': ['Crime', 'Case', 'Dark', 'Mystery', 'Shadow'],
    'DIY & How-To': ['Craft', 'Build', 'DIY', 'Maker', 'Skill'],
    'Beauty & Fashion': ['Style', 'Look', 'Glow', 'Vogue', 'Chic'],
    'Lifestyle & Vlogs': ['Life', 'Daily', 'Vibe', 'Flow', 'Mode'],
  };
  const suffixes = ['Hub', 'Lab', 'Verse', 'Zone', 'Daily', 'Central', 'Explained', 'Uncovered', 'Insider', 'Focus'];
  const cats = prefixes[category] || ['Channel'];
  const prefix = cats[Math.floor(Math.random() * cats.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return format === 'explainer' || format === 'story' ? `${prefix} ${suffix}` : `${prefix}${suffix}`;
}

// Generate video ideas based on format and category
function generateVideoIdeas(format: string, category: string): string[] {
  const topicsByCategory: Record<string, string[]> = {
    'Finance & Business': ['Credit Score Secrets', 'The Stock Market', 'Real Estate Investing', 'Crypto in 2026', 'Side Hustles', 'Retirement Planning', 'Tax Strategies', 'Startup Funding'],
    'Tech & Software': ['AI Revolution', 'Cybersecurity Threats', 'Programming Languages', 'Future Gadgets', 'SaaS Trends', 'Mobile Apps', 'Cloud Computing', 'Data Privacy'],
    'Health & Fitness': ['Weight Loss Science', 'Mental Health Myths', 'Nutrition Facts', 'Workout Routines', 'Sleep Optimization', 'Longevity Secrets', 'Biohacking', 'Supplement Guide'],
    'Education & Science': ['Ancient History', 'Space Exploration', 'Psychology Facts', 'Physics Mysteries', 'Human Body', 'Climate Science', 'Evolution', 'Brain Function'],
    'True Crime': ['Serial Killers', 'Unsolved Mysteries', 'Famous Heists', 'Cult Stories', 'Missing Persons', 'Court Cases', 'Forensic Science', 'Infamous Scams'],
    'DIY & How-To': ['Woodworking', 'Home Renovation', 'Gardening Tips', 'Cooking Skills', 'Electronics Repair', '3D Printing', 'Craft Projects', 'Tool Guide'],
    'Beauty & Fashion': ['Skincare Routine', 'Makeup Tutorials', "Men's Style", 'Fashion Trends', 'Hair Care', 'Sustainable Fashion', 'Nail Art', 'Fragrance Guide'],
    'Lifestyle & Vlogs': ['Minimalism', 'Travel Tips', 'Productivity Hacks', 'Relationships', 'Personal Growth', 'Food Culture', 'Home Decor', 'Time Management'],
  };
  const template = FORMAT_TEMPLATES[format] || FORMAT_TEMPLATES.explainer;
  const topics = topicsByCategory[category] || ['Trending Topics'];
  const ideas: string[] = [];
  for (let i = 0; i < 5; i++) {
    const topicTemplate = template[i % template.length];
    const topic1 = topics[Math.floor(Math.random() * topics.length)];
    const topic2 = topics[Math.floor(Math.random() * topics.length)];
    ideas.push(topicTemplate.replace('{Topic}', topic1).replace('{Topic2}', topic2));
  }
  return ideas;
}

// Main analysis function
export function analyzeChannel(data: {
  name: string;
  description: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  monthlyViews: number;
  estimatedRevenue: number;
  firstVideoDate?: string;
  channelCreated?: string;
}): {
  format: string;
  category: string;
  strategy: 'FORMAT_TREND' | 'MARKET_PLAY' | 'HYBRID';
  opportunityScore: number;
  rpm: string;
  saturationStatus: string;
  recommendations: string[];
  subNiches: { name: string; score: number; untouched: boolean }[];
  bendProposals: LegacyBendProposal[];
} {
  const format = detectFormat(data.name, data.description);
  const category = detectCategory(data.name, data.description);

  // Calculate active days
  let activeDays = 30;
  if (data.firstVideoDate) {
    const firstDate = new Date(data.firstVideoDate);
    const now = new Date();
    activeDays = Math.floor((now.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Determine channel type
  const channelType: 'new' | 'reactivated' = activeDays < 90 ? 'new' : 'reactivated';

  // Category multiplier based on RPM
  const rpmInfo = RPM_TABLE[category];
  const categoryMultiplier = rpmInfo ? rpmInfo.min / 10 : 0.5;

  // Calculate opportunity score (legacy)
  const opportunityScore = calculateOpportunityScore({
    monthlyViews: data.monthlyViews,
    estimatedRevenue: data.estimatedRevenue,
    subscriberCount: data.subscriberCount,
    activeDays,
    channelType,
    categoryMultiplier,
  });

  // Determine strategy type
  const strategy: 'FORMAT_TREND' | 'MARKET_PLAY' | 'HYBRID' =
    activeDays > 180 ? 'MARKET_PLAY' :
    data.subscriberCount > 10000 ? 'FORMAT_TREND' :
    'HYBRID';

  // Saturation assessment
  const saturationStatus = data.monthlyViews > 500000 ?
    'Growing population' :
    'One of few';

  // Sub-niche analysis
  const subNiches = (SUB_NICHES[category] || []).map((sub) => ({
    name: sub,
    score: Math.floor(Math.random() * 5) + 5,
    untouched: Math.random() > 0.6,
  })).sort((a, b) => b.score - a.score);

  // Generate recommendations
  const recommendations: string[] = [];
  if (opportunityScore > 70) {
    recommendations.push('High opportunity — consider fast entry');
  } else if (opportunityScore > 50) {
    recommendations.push('Medium opportunity — test with 3-5 videos first');
  } else {
    recommendations.push('Low opportunity — explore other categories');
  }
  if (channelType === 'new') {
    recommendations.push('Channel is fresh — first-mover advantage possible');
  }
  recommendations.push(`Focus on ${category} content with ${format} format`);

  // Apply transcript research rules for enhanced recommendations
  const pyramidRules = transcriptResearchRules.filter(r => r.category === "pyramid");
  if (pyramidRules.length > 0) {
    recommendations.push(`Research insight: ${pyramidRules[0].title} — ${pyramidRules[0].description.substring(0, 60)}...`);
  }

  // Generate bend proposals (legacy)
  const bendProposals = generateBendProposals({
    name: data.name,
    description: data.description,
    format,
    category,
    strategy,
  });

  const rpmRange = rpmInfo ? `$${rpmInfo.min}-$${rpmInfo.max}` : '$3-$10';

  return {
    format,
    category,
    strategy,
    opportunityScore,
    rpm: rpmRange,
    saturationStatus,
    recommendations,
    subNiches,
    bendProposals,
  };
}

// Validate a niche bend idea
export function validateNicheBend(proposal: LegacyBendProposal): {
  score: number;
  verdict: 'green' | 'caution' | 'red';
  reasons: string[];
} {
  const reasons: string[] = [];
  let score = 50;

  // Category RPM bonus
  const rpm = RPM_TABLE[proposal.category];
  if (rpm) {
    if (rpm.min >= 8) {
      score += 15;
      reasons.push(`High RPM category: $${rpm.min}-$${rpm.max}`);
    } else if (rpm.min >= 4) {
      score += 8;
      reasons.push(`Medium RPM category: $${rpm.min}-$${rpm.max}`);
    } else {
      score += 3;
    }
  }

  // Complexity tier factor
  if (proposal.complexityTier === 'bottom') {
    score += 10;
    reasons.push('Low barrier to entry — quick to start');
  } else if (proposal.complexityTier === 'middle') {
    score += 5;
    reasons.push('Medium complexity — sustainable advantage');
  } else {
    reasons.push('High complexity — strong moat but slow start');
  }

  // Strategy factor
  if (proposal.strategy === 'FORMAT_TREND') {
    score += 8;
    reasons.push('Format transfer reduces execution risk');
  }

  // Bend axis factor
  if (proposal.bendAxis === 'D') {
    score += 10;
    reasons.push('Specificity bend = loyal audience + higher RPM');
  } else if (proposal.bendAxis === 'C') {
    score += 5;
    reasons.push('Geography/language bend = untapped market');
  }

  const verdict: 'green' | 'caution' | 'red' = score >= 70 ? 'green' : score >= 45 ? 'caution' : 'red';
  return { score, verdict, reasons };
}

// Generate a test plan (Phase 3.5)
export function generateTestPlan(proposal: LegacyBendProposal): {
  budget: string;
  duration: string;
  successCriteria: string;
  videoPlan: string[];
  failurePlan: string;
} {
  return {
    budget: '$100-$200',
    duration: '3-10 days per video (2 months max)',
    successCriteria: 'At least one of the first 5 videos gets >2x the average views of similar fresh channels',
    videoPlan: proposal.videoIdeas.map((v, i) =>
      `Week ${Math.floor(i / 2) + 1}: "${v}" (inspired by competitor outliers)`
    ),
    failurePlan: 'Return to Phase 1 — try the next ranked niche. Analyze failure reason and pivot.',
  };
}
