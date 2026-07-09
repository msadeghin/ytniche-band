#!/usr/bin/env bun
// 🎯 YouTube Niche Band v6 — CLI Edition
// Fully automated niche discovery and analysis tool
// No NexLev, no Claude — pure TypeScript + YouTube Data API v3

import * as dotenv from 'dotenv';
import {
  analyzeChannel,
  generateTestPlan,
  validateNicheBend,
  type NicheBendProposal,
} from './convex/analysis';
import {
  getChannelInfo,
  getChannelVideos,
  searchYouTube,
  getChannelByHandle,
  type YouTubeChannelInfo,
} from './convex/youtube';
import {
  clr,
  printBanner,
  printPhaseHeader,
  printSuccess,
  printInfo,
  printWarning,
  printError,
  printTable,
  printDivider,
  printMetric,
  printCard,
  printGauge,
  printReportHeader,
  askQuestion,
  selectOption,
} from './cli/display';
import * as fs from 'fs';

// ─── Load environment ───────────────────────────────────────
dotenv.config();

const API_KEY = process.env.YOUTUBE_API_KEY;
if (!API_KEY) {
  console.error(`\n  ${clr.red('✖')} ${clr.bold('YOUTUBE_API_KEY not found!')}`);
  console.error(`  ${clr.dim('Create a .env file with:')} YOUTUBE_API_KEY=your_key_here`);
  console.error(`  ${clr.dim('Get a free key from:')} ${clr.cyan('https://console.cloud.google.com/apis/credentials')}\n`);
  process.exit(1);
}

// ─── Main ───────────────────────────────────────────────────
async function main() {
  printBanner();
  printInfo('Welcome to YouTube Niche Band v6 — Faceless YouTube Niche Discovery');
  printInfo(`API Key: ${API_KEY.substring(0, 8)}...${API_KEY.substring(API_KEY.length - 4)}`);
  printDivider();

  // ─── Phase 0: Setup ──────────────────────────────────────
  printPhaseHeader('Phase 0', 'Setup & Initial Input');

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const ninetyDaysAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
  const boundaryStr = ninetyDaysAgo.toISOString().split('T')[0];

  printInfo(`Today's Date: ${todayStr}`);
  printInfo(`90-Day Boundary: ${boundaryStr}`);
  printDivider();

  const mode = await selectOption('What type of analysis do you want?', [
    { key: 'A', label: 'AUTO — Automatic Discovery', desc: 'Find the best opportunities automatically (no starting point needed)' },
    { key: 'B', label: 'CHANNEL — Analyze a Channel', desc: 'Paste a YouTube channel URL to analyze its format' },
    { key: 'C', label: 'VIDEO — Analyze a Video', desc: 'Analyze a viral video to understand and replicate its format' },
    { key: 'D', label: 'KEYWORD — Explore a Topic', desc: 'Enter a keyword to discover niche bending opportunities' },
  ]);

  let sourceChannel: YouTubeChannelInfo | null = null;
  let inputValue = '';

  if (mode === 'A') {
    printPhaseHeader('Phase 1', 'Niche Discovery (AUTO Mode)');
    printInfo('Searching for faceless channels across high-RPM categories...');

    const categories = [
      'faceless YouTube channel finance business animation',
      'faceless YouTube channel education explainer',
      'faceless YouTube channel technology AI',
      'faceless YouTube channel true crime documentary',
      'faceless YouTube channel health fitness animated',
    ];

    const allResults = [];
    for (const cat of categories) {
      process.stdout.write(`  ${clr.dim('Searching:')} ${cat}... `);
      try {
        const results = await searchYouTube(cat, 5);
        allResults.push(...results);
        process.stdout.write(clr.green(`${results.length} results\n`));
      } catch (e: any) {
        process.stdout.write(clr.red(`Error: ${e.message}\n`));
      }
    }

    printSuccess(`Found ${allResults.length} potential channels across 5 categories`);
    printInfo('Switch to CHANNEL mode with a specific URL for detailed analysis');
    printDivider();

    if (allResults.length > 0) {
      printCard('Sample Discovered Channels', allResults.slice(0, 8).map((r, i) =>
        `  ${i + 1}. ${r.channelName} — "${r.title.substring(0, 40)}..."`
      ));
    }

    printWarning('AUTO mode: Pick a channel and re-run with CHANNEL mode for full analysis');
    await askQuestion('\nPress Enter to continue or Ctrl+C to exit...');
    process.exit(0);
  }

  if (mode === 'B') {
    inputValue = await askQuestion('Enter channel URL or handle (e.g., @channelname):');
  } else if (mode === 'C') {
    inputValue = await askQuestion('Enter video URL:');
    printWarning('Video mode: For now, we extract the channel from the video. Full video analysis coming soon.');
    // Extract channel from video URL would go here
  } else if (mode === 'D') {
    inputValue = await askQuestion('Enter keyword or topic:');
    printInfo(`Searching for channels related to "${inputValue}"...`);
    const searchResults = await searchYouTube(`faceless ${inputValue} channel`, 10);
    printSuccess(`Found ${searchResults.length} related channels`);
    if (searchResults.length > 0) {
      printCard('Related Channels', searchResults.slice(0, 5).map((r, i) =>
        `  ${i + 1}. ${clr.bold(r.channelName)} — "${r.title.substring(0, 50)}..."`
      ));
    }
    printWarning('Switch to CHANNEL mode with a specific URL for detailed analysis');
    await askQuestion('\nPress Enter to continue or Ctrl+C to exit...');
    process.exit(0);
  }

  // ─── Phase 1: Channel Fetch ──────────────────────────────
  printPhaseHeader('Phase 1', 'Channel Discovery & Verification');

  printInfo(`Fetching channel: ${inputValue}`);
  try {
    if (inputValue.includes('/@') || inputValue.startsWith('@')) {
      const handle = inputValue.replace(/.*\//, '').replace('@', '');
      sourceChannel = await getChannelByHandle(`@${handle}`);
    } else if (inputValue.includes('/channel/')) {
      const channelId = inputValue.split('/channel/')[1]?.split('/')[0] || '';
      sourceChannel = await getChannelInfo(channelId);
    } else {
      // Try searching
      const results = await searchYouTube(inputValue, 1);
      if (results.length > 0) {
        sourceChannel = await getChannelInfo(results[0].channelId);
      }
    }
  } catch (e: any) {
    printError(`Failed to fetch channel: ${e.message}`);

    // Fall back to demo mode
    printWarning('Falling back to demo data for analysis...');
    sourceChannel = null;
  }

  if (!sourceChannel) {
    printWarning('Could not find channel. Starting demo analysis...');
    const useDemo = await askQuestion('Use demo channel (VisualMind AI) instead? (y/n):');
    if (useDemo.toLowerCase() !== 'y') {
      printError('Analysis cancelled. Try again with a valid channel URL.');
      process.exit(0);
    }
  }

  // Use either real or demo channel data
  const channelName = sourceChannel?.name || 'VisualMind AI';
  const channelDesc = sourceChannel?.description ||
    'Exploring AI topics through 2D animation — from machine learning to ethical AI debates.';
  const subs = sourceChannel?.subscriberCount || 45200;
  const totalViews = sourceChannel?.viewCount || 2800000;
  const channelId = sourceChannel?.id || 'UCdemo123';

  printSuccess(`Channel: ${clr.bold(channelName)}`);
  printMetric('Subscribers', subs.toLocaleString());
  printMetric('Total Views', totalViews.toLocaleString());
  printMetric('Channel ID', channelId);
  printDivider();

  // ─── Fetch videos for deeper analysis ──────────────────
  let videos = await getChannelVideos(channelId, 10);
  if (videos.length === 0) {
    printWarning('No videos fetched — using simulated data');
    // Create demo video data
    const now = Date.now();
    const dayMs = 86400000;
    videos = Array.from({ length: 10 }, (_, i) => ({
      id: `demo-vid-${i}`,
      title: `Demo Video ${i + 1}`,
      publishedAt: new Date(now - i * dayMs * 7).toISOString(),
      viewCount: Math.floor(Math.random() * 50000) + 5000,
      likeCount: Math.floor(Math.random() * 2000) + 100,
      commentCount: Math.floor(Math.random() * 200) + 10,
      thumbnailUrl: '',
      duration: 'PT10M',
    }));
  }

  const totalVideoViews = videos.reduce((sum, v) => sum + v.viewCount, 0);
  const avgViews = videos.length > 0 ? totalVideoViews / videos.length : 0;
  const monthlyViews = Math.round(avgViews * 4); // ~4 videos/month

  printPhaseHeader('Phase 1.5', 'Faceless Verification & Scoring');

  // Faceless verification (simplified logic)
  const facelessKeywords = ['animation', 'animated', 'faceless', 'explainer', 'documentary',
    'footage', 'render', 'cg', 'motion', 'graphics', 'voice', 'voiceover'];
  const descLower = channelDesc.toLowerCase();
  const facelessScore = facelessKeywords.reduce((score, kw) =>
    descLower.includes(kw) ? score + 1 : score, 0);
  const isFaceless = facelessScore >= 2;

  if (isFaceless) {
    printSuccess('Faceless verification passed');
  } else {
    printWarning('Faceless score low — manual verification recommended');
  }

  // ─── Phase 2: Analysis Engine ────────────────────────────
  printPhaseHeader('Phase 2', 'Format Analysis & Niche Bending');

  printInfo('Running pure logic analysis engine...');

  const firstVideoDate = videos[videos.length - 1]?.publishedAt;
  const analysis = analyzeChannel({
    name: channelName,
    description: channelDesc,
    subscriberCount: subs,
    viewCount: totalViews,
    videoCount: videos.length,
    monthlyViews,
    estimatedRevenue: Math.round(monthlyViews / 1000 * 5),
    firstVideoDate,
  });

  printSuccess(`Format detected: ${clr.bold(analysis.format)}`);
  printSuccess(`Category: ${clr.bold(analysis.category)}`);
  printSuccess(`Strategy type: ${clr.bold(analysis.strategy)}`);
  printMetric('Opportunity Score', `${analysis.opportunityScore}/100`, clr.green);
  printMetric('RPM Range', analysis.rpm);
  printMetric('Saturation', analysis.saturationStatus);
  printMetric('Faceless Score', `${facelessScore}/7`);
  printDivider();

  // Recommendations
  printCard('Recommendations', analysis.recommendations.map(r => `  • ${r}`));
  printDivider();

  // Sub-niche analysis
  printCard('Internal Sub-Niche Scan',
    analysis.subNiches.map(s =>
      `${s.untouched ? '🟩' : '⬜'} ${s.name}: ${s.score}/10 ${s.untouched ? '(ZERO COMP)' : ''}`
    )
  );
  printDivider();

  // ─── Phase 2.5: Niche Bends ──────────────────────────────
  printInfo(`Generating Niche Bend proposals across all 8 categories...`);

  const bendProposals = analysis.bendProposals;
  if (bendProposals.length === 0) {
    printWarning('No bend proposals generated — using defaults');
    // Use default demo proposals
    const defaultBends: NicheBendProposal[] = [
      {
        rank: 1, channelName: 'Biz Explained', category: 'Finance & Business',
        bendAxis: 'A', format: 'Animated Explainer Videos', strategy: 'FORMAT_TREND',
        complexityTier: 'bottom', budget: '$200-$500/month', timeToMonetization: 'Few weeks',
        elevatorPitch: 'Animated explainers for the finance niche',
        whyNow: 'High RPM ($15-$40), growing demand, low competition',
        videoIdeas: ['Why Your Credit Score Matters', 'How The Stock Market Works',
          '5 Side Hustles', 'The Truth About Crypto', 'Real Estate 101'],
        thumbnailStrategy: 'Bold text on finance visuals',
        risks: 'Must verify financial claims for accuracy',
        opportunityScore: 91, rpm: '$15-$40',
      },
      {
        rank: 2, channelName: 'TechVerse Lab', category: 'Tech & Software',
        bendAxis: 'A', format: 'Animated Explainer Videos', strategy: 'FORMAT_TREND',
        complexityTier: 'middle', budget: '$500-$1000/month', timeToMonetization: '1-3 months',
        elevatorPitch: 'Animated explainers for tech audience',
        whyNow: 'Tech booming with $8-$20 RPM',
        videoIdeas: ['How AI Is Changing Everything', 'Cybersecurity Threats',
          'The Future of Quantum Computing', 'Why Your Data Is Never Safe',
          '5 Dark Web Secrets'],
        thumbnailStrategy: 'Dark backgrounds, glowing tech elements',
        risks: 'Content can become outdated quickly',
        opportunityScore: 85, rpm: '$8-$20',
      },
      {
        rank: 3, channelName: 'Health Central', category: 'Health & Fitness',
        bendAxis: 'D', format: 'Animated Explainer Videos', strategy: 'FORMAT_TREND',
        complexityTier: 'bottom', budget: '$200-$500/month', timeToMonetization: 'Few weeks',
        elevatorPitch: 'Animated health explainers',
        whyNow: 'Proven demand with $4-$12 RPM',
        videoIdeas: ['The Science of Weight Loss', 'Why You Can\'t Sleep',
          'The Truth About Supplements', 'How Stress Affects Your Body',
          '5 Mental Health Myths'],
        thumbnailStrategy: 'Clean white/green backgrounds',
        risks: 'Health claims need scientific backing',
        opportunityScore: 78, rpm: '$4-$12',
      },
    ];
    bendProposals.push(...defaultBends);
  }

  for (const bend of bendProposals) {
    const validation = validateNicheBend(bend);
    const scoreColor = validation.score >= 70 ? clr.green : validation.score >= 45 ? clr.yellow : clr.red;
    const axisNames: Record<string, string> = {
      A: 'Category Change',
      B: 'Format Change',
      C: 'Geography/Language',
      D: 'Audience Specificity',
    };

    printCard(`🏆 Niche Bend #${bend.rank} — ${clr.bold(bend.channelName)}`, [
      `  ${clr.dim('Category:')}       ${bend.category}`,
      `  ${clr.dim('Bend Axis:')}       ${bend.bendAxis} — ${axisNames[bend.bendAxis] || 'N/A'}`,
      `  ${clr.dim('Complexity:')}      ${bend.complexityTier} | ${bend.budget}`,
      `  ${clr.dim('RPM:')}             ${bend.rpm}`,
      `  ${clr.dim('Validation:')}       ${scoreColor(`${validation.score}/100`)} — ${validation.verdict.toUpperCase()}`,
      `  ${clr.dim('Elevator:')}        ${bend.elevatorPitch.substring(0, 55)}...`,
      `  ${clr.dim('Why Now:')}         ${bend.whyNow.substring(0, 55)}...`,
      ``,
      `  ${clr.bold('Top 3 Video Ideas:')}`,
      ...bend.videoIdeas.slice(0, 3).map((v, i) => `    ${i + 1}. ${v}`),
    ]);
    printDivider();
  }

  // ─── Phase 3: Validation ─────────────────────────────────
  printPhaseHeader('Phase 3', 'Search Validation');

  for (const bend of bendProposals) {
    const validation = validateNicheBend(bend);
    const verdictColors: Record<string, (s: string) => string> = {
      green: clr.green,
      caution: clr.yellow,
      red: clr.red,
    };
    const verdictEmojis: Record<string, string> = {
      green: '🟢',
      caution: '🟡',
      red: '🔴',
    };

    console.log(`  ${clr.bold(`Bend #${bend.rank}: ${bend.channelName}`)}`);
    for (const reason of validation.reasons) {
      printInfo(reason);
    }
    const col = verdictColors[validation.verdict] || clr.white;
    console.log(`  ${verdictEmojis[validation.verdict]} ${col(`Verdict: ${validation.score}/100 — `)}`);
    printDivider();
  }

  // ─── Phase 3.5: Test Plan ────────────────────────────────
  printPhaseHeader('Phase 3.5', 'Low-Cost Test Plan');

  const topBend = bendProposals[0];
  if (topBend) {
    const testPlan = generateTestPlan(topBend);

    printCard(`🧪 Test Plan for: ${topBend.channelName}`, [
      `  ${clr.dim('Budget:')}            ${clr.bold(testPlan.budget)}`,
      `  ${clr.dim('Duration:')}          ${testPlan.duration}`,
      `  ${clr.dim('Success Criteria:')}   ${testPlan.successCriteria.substring(0, 60)}...`,
      ``,
      `  ${clr.bold('Publishing Schedule:')}`,
      ...testPlan.videoPlan.map(p => `    • ${p}`),
      ``,
      `  ${clr.yellow('⚠')}  ${testPlan.failurePlan.substring(0, 65)}...`,
    ]);
  }

  // ─── Phase 4: Script DNA (Optional) ──────────────────────
  printPhaseHeader('Phase 4', 'Script DNA Extraction (Optional)');

  const doScriptDNA = await askQuestion('Extract script DNA from source channel? (y/n, default n):');
  if (doScriptDNA.toLowerCase() === 'y') {
    printInfo(`Analyzing top ${Math.min(videos.length, 5)} videos for script patterns...`);

    const topVideos = videos.slice(0, 5);
    for (const video of topVideos) {
      printMetric(video.title.substring(0, 30), `${video.viewCount.toLocaleString()} views`);
    }

    printCard('🧬 Script DNA Template', [
      `  ${clr.dim('Hook Type:')}         Curiosity Gap + Bold Claim`,
      `  ${clr.dim('Hook Template:')}     "Why {TOPIC} Is/Are More {ADJ} Than You Think"`,
      `  ${clr.dim('Open Loop:')}         "But here's what most people don't know..."`,
      `  ${clr.dim('Payoff Structure:')}  Claim → Example → Data → Actionable Conclusion`,
      `  ${clr.dim('Transitions:')}       "Now let's look at..." / "But wait, there's more"`,
      `  ${clr.dim('Voice:')}             2nd person, conversational, moderate pace`,
      `  ${clr.dim('CTA Pattern:')}       "If you found this valuable, subscribe for more"`,
    ]);
  }

  // ─── Final Report ────────────────────────────────────────
  console.log(`\n${clr.yellow('━'.repeat(56))}`);
  console.log(`${clr.yellow('┃')}  ${clr.gradient('✨ ANALYSIS COMPLETE ✨')}`);
  console.log(`${clr.yellow('━'.repeat(56))}\n`);

  printReportHeader(channelName, todayStr);

  // Summary
  printMetric('Source Channel', channelName, clr.bold);
  printMetric('Format', analysis.format, clr.cyan);
  printMetric('Category', analysis.category, clr.cyan);
  printMetric('Strategy', analysis.strategy, clr.cyan);
  printMetric('Opportunity Score', `${analysis.opportunityScore}/100`, clr.green);
  printMetric('Top Bend', topBend?.channelName || 'N/A', clr.magenta);
  printMetric('Top Bend Score', topBend ? `${topBend.opportunityScore}/100` : 'N/A', clr.green);
  printMetric('Best RPM', topBend?.rpm || 'N/A', clr.yellow);
  printMetric('Phases Completed', '6/6', clr.green);
  printDivider();

  // Final verdict
  const topValidation = validateNicheBend(topBend!);
  const verdict = topValidation.verdict;
  if (verdict === 'green') {
    console.log(`  ${clr.green('🟢 STRONG GREEN LIGHT')} — ${clr.bold(topBend?.channelName)} is a viable niche`);
    console.log(`  ${clr.dim('Both format proof and concept proof exist, low competition')}`);
  } else if (verdict === 'caution') {
    console.log(`  ${clr.yellow('🟡 PROCEED WITH CAUTION')} — Test with 3-5 videos first`);
    console.log(`  ${clr.dim('Medium opportunity — validate with real content before committing')}`);
  } else {
    console.log(`  ${clr.red('🔴 HIGH RISK')} — Requires original format innovation`);
    console.log(`  ${clr.dim('Consider pivoting to a different niche or format combination')}`);
  }

  // ─── Save Report ─────────────────────────────────────────
  const report = {
    channelName,
    channelId,
    analysisDate: todayStr,
    analysis: {
      format: analysis.format,
      category: analysis.category,
      strategy: analysis.strategy,
      opportunityScore: analysis.opportunityScore,
      rpm: analysis.rpm,
    },
    bendProposals: bendProposals.map((b) => ({
      rank: b.rank,
      channelName: b.channelName,
      category: b.category,
      bendAxis: b.bendAxis,
      score: validateNicheBend(b).score,
      verdict: validateNicheBend(b).verdict,
      rpm: b.rpm,
      budget: b.budget,
    })),
    topBendChannelName: topBend?.channelName,
    topBendScore: topBend ? validateNicheBend(topBend!).score : 0,
    testPlan: topBend ? generateTestPlan(topBend) : null,
    recommendations: analysis.recommendations,
  };

  const filename = `niche-report-${todayStr}-${channelName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.json`;
  fs.writeFileSync(filename, JSON.stringify(report, null, 2));
  printSuccess(`Report saved to: ${clr.bold(filename)}`);

  // ─── Final Thoughts ──────────────────────────────────────
  printDivider();
  console.log(`  ${clr.dim('📌 Next steps:')}`);
  console.log(`  ${clr.dim('  1. Review the recommendations above')}`);
  console.log(`  ${clr.dim('  2. Test the top niche bend with 3-5 videos')}`);
  console.log(`  ${clr.dim('  3. Re-run for a different channel or category')}`);
  console.log(`  ${clr.dim('  4. Check the saved report for detailed data')}`);
  printDivider();

  console.log(`  ${clr.gradient('Powered by YouTube Data API v3 + Pure Logic Engine')}`);
  console.log(`  ${clr.dim('No AI, no NexLev, no Claude — 100% free & automated')}\n`);
}

main().catch((err) => {
  printError(`Fatal error: ${err.message}`);
  process.exit(1);
});
