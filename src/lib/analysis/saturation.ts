// 📊 Market Stage Detection & Saturation Analysis
// Detects which lifecycle stage a format-market combination is in

export type MarketStage =
  | "too_early"
  | "breakout"
  | "late_wave"
  | "saturated"
  | "declining";

export type Action = "enter_now" | "test_fast" | "bend_first" | "avoid";

export interface SimilarChannel {
  channelId?: string;
  title: string;
  startedPostingDaysAgo?: number;
  recentViews: number;
  topVideoViews: number;
  uploadCountLast30Days: number;
}

export interface SaturationInput {
  similarChannels: SimilarChannel[];
  sourceFormat: string;
  breakoutVideoAgeDays?: number;
}

export interface SaturationResult {
  stage: MarketStage;
  saturationScore: number; // 0-100
  evidence: string[];
  action: Action;
}

/**
 * Detects the market lifecycle stage for a format-market combination
 * by analyzing similar channels, their view patterns, and breakout timing.
 *
 * Stages:
 * - too_early: Few channels, low views, no proof of demand
 * - breakout: 2-5 channels getting views, growing steadily
 * - late_wave: 10+ channels, format spreading across categories
 * - saturated: Many channels, declining views, small channels failing
 * - declining: Format losing relevance across the board
 */
export function detectMarketStage(input: SaturationInput): SaturationResult {
  const evidence: string[] = [];
  const channels = input.similarChannels;
  const channelCount = channels.length;

  // Count channels that are getting meaningful views
  const channelsWithViews = channels.filter(
    (c) => c.recentViews > 10000
  ).length;

  const channelsWithHighViews = channels.filter(
    (c) => c.recentViews > 100000
  ).length;

  // Check for breakout signals (2-5 channels growing)
  const breakoutCandidates = channels.filter(
    (c) =>
      c.recentViews > 50000 &&
      c.topVideoViews > 200000 &&
      (c.startedPostingDaysAgo !== undefined ? c.startedPostingDaysAgo < 180 : true)
  ).length;

  // Check for saturation signals
  const smallChannelsFailing = channels.filter(
    (c) =>
      (c.startedPostingDaysAgo !== undefined && c.startedPostingDaysAgo > 90) &&
      c.recentViews < 1000 &&
      c.uploadCountLast30Days >= 4
  ).length;

  const totalSmallChannels = channels.filter(
    (c) =>
      c.startedPostingDaysAgo !== undefined &&
      c.startedPostingDaysAgo > 90 &&
      c.uploadCountLast30Days >= 4
  ).length;

  const graveyardRatio =
    totalSmallChannels > 0 ? smallChannelsFailing / totalSmallChannels : 0;

  // Check for declining signals
  const decliningChannels = channels.filter(
    (c) =>
      c.topVideoViews > 500000 &&
      c.recentViews < 10000 &&
      c.uploadCountLast30Days > 0
  ).length;

  // Breadkout age check
  const breakoutAge =
    input.breakoutVideoAgeDays !== undefined ? input.breakoutVideoAgeDays : 999;

  // ─── Determine Stage ────────────────────────────────────────
  let stage: MarketStage;
  let saturationScore: number;
  let action: Action;

  if (channelCount === 0) {
    stage = "too_early";
    saturationScore = 5;
    action = "test_fast";
    evidence.push("No similar channels found in this format-market combination.");
    evidence.push(
      "This could mean untapped opportunity OR no audience demand. Test with 3-5 videos."
    );
  } else if (breakoutCandidates >= 2 && breakoutCandidates <= 5 && graveyardRatio < 0.4) {
    stage = "breakout";
    saturationScore = 20 + breakoutCandidates * 5;
    action = "enter_now";
    evidence.push(
      `${breakoutCandidates} channels are growing strongly in this format — demand is validated.`
    );
    evidence.push(
      "The format hasn't saturated yet. This is the ideal entry window."
    );
    if (breakoutAge < 90) {
      evidence.push(
        "Recent breakout signals the format is still early in its lifecycle."
      );
    }
  } else if (channelCount >= 10 && channelsWithHighViews >= 5 && graveyardRatio < 0.5) {
    stage = "late_wave";
    saturationScore = 50 + channelsWithHighViews * 5;
    action = "bend_first";
    evidence.push(
      `${channelCount} channels found with ${channelsWithHighViews} performing well.`
    );
    evidence.push(
      "Late-wave stage — entering directly is risky. Consider a niche bend (different category, audience, or language)."
    );
  } else if (graveyardRatio >= 0.6) {
    stage = "saturated";
    saturationScore = 75 + Math.round(graveyardRatio * 20);
    action = "avoid";
    evidence.push(
      `${Math.round(graveyardRatio * 100)}% of small channels in this format are failing (<1K avg views).`
    );
    evidence.push(
      "Small channel graveyard detected — the format looks open but is actually saturated."
    );
    evidence.push(
      "Recommendation: Avoid this format and find a different angle."
    );
  } else if (decliningChannels >= 3) {
    stage = "declining";
    saturationScore = 85 + decliningChannels * 3;
    action = "avoid";
    evidence.push(
      `${decliningChannels} previously successful channels are now declining in views.`
    );
    evidence.push(
      "This format is losing audience interest. Avoid entering."
    );
  } else {
    stage = "breakout";
    saturationScore = 30;
    action = "test_fast";
    evidence.push(
      "Early-stage market with moderate signals. Test fast to validate."
    );
  }

  // Cap saturation score
  saturationScore = Math.min(100, Math.max(0, saturationScore));

  // Additional evidence based on format
  evidence.push(`Format analyzed: ${input.sourceFormat}`);

  if (channelCount > 0) {
    const avgRecentViews = Math.round(
      channels.reduce((sum, c) => sum + c.recentViews, 0) / channelCount
    );
    evidence.push(`Average recent views across ${channelCount} channels: ${avgRecentViews.toLocaleString()}`);
  }

  return {
    stage,
    saturationScore,
    evidence,
    action,
  };
}

/**
 * Human-readable label for a market stage.
 */
export function stageLabel(stage: MarketStage): string {
  const labels: Record<MarketStage, string> = {
    too_early: "🟦 Too Early — No Proof of Demand",
    breakout: "🟩 Breakout — Ideal Entry Window",
    late_wave: "🟨 Late Wave — Bend Before Entering",
    saturated: "🟥 Saturated — Avoid Direct Entry",
    declining: "⬛ Declining — Do Not Enter",
  };
  return labels[stage];
}

/**
 * Quick saturation check: is this niche worth entering?
 */
export function isEnterable(stage: MarketStage): boolean {
  return stage === "breakout" || stage === "too_early";
}
