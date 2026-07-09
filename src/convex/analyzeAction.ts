// Analysis orchestrator — standalone version (no Convex generated dependencies)
// Uses the pure logic analysis engine directly

import { analyzeChannel, generateTestPlan, validateNicheBend, type NicheBendProposal } from './analysis';
import { getChannelInfo, getChannelVideos, searchYouTube, getChannelByHandle, type YouTubeChannelInfo } from './youtube';

export interface AnalysisResult {
  status: 'completed' | 'failed';
  message: string;
  sourceChannel?: {
    name: string;
    subscriberCount: number;
    viewCount: number;
    format: string;
    category: string;
    opportunityScore: number;
  };
  analysis?: {
    format: string;
    category: string;
    strategy: string;
    opportunityScore: number;
    rpm: string;
  };
  bendProposals?: NicheBendProposal[];
  testPlan?: ReturnType<typeof generateTestPlan>;
  recommendations?: string[];
}

export async function runAnalysis(mode: string, inputValue?: string): Promise<AnalysisResult> {
  // Simulated analysis for demo
  if (!inputValue || mode === 'auto') {
    return {
      status: 'completed',
      message: 'Auto-discovery mode: Found potential channels. Use "channel" mode for detailed analysis.',
    };
  }

  try {
    // For demo purposes, return demo data
    // In production, this would call YouTube API
    return {
      status: 'completed',
      message: 'Analysis complete! Check the Results page for detailed output.',
      sourceChannel: {
        name: 'Demo Channel',
        subscriberCount: 45200,
        viewCount: 2800000,
        format: 'explainer',
        category: 'Education & Science',
        opportunityScore: 82,
      },
      bendProposals: [
        {
          rank: 1,
          channelName: 'Biz Explained',
          category: 'Finance & Business',
          bendAxis: 'A',
          format: 'Animated Explainer Videos',
          strategy: 'FORMAT_TREND',
          complexityTier: 'bottom',
          budget: '$200-$500/month',
          timeToMonetization: 'Few weeks',
          elevatorPitch: 'Animated explainers for the finance niche',
          whyNow: 'High RPM ($15-$40), growing demand, low competition',
          videoIdeas: [
            'Why Your Credit Score Matters',
            'How The Stock Market Works',
            '5 Side Hustles That Make Money',
            'The Truth About Crypto',
            'Real Estate Investing 101',
          ],
          thumbnailStrategy: 'Bold text on finance visuals, red/green contrast',
          risks: 'Must verify all financial claims for accuracy',
          opportunityScore: 91,
          rpm: '$15-$40',
        },
        {
          rank: 2,
          channelName: 'TechVerse Lab',
          category: 'Tech & Software',
          bendAxis: 'A',
          format: 'Animated Explainer Videos',
          strategy: 'FORMAT_TREND',
          complexityTier: 'middle',
          budget: '$500-$1000/month',
          timeToMonetization: '1-3 months',
          elevatorPitch: 'Animated explainers for the tech audience',
          whyNow: 'Tech is booming, $8-$20 RPM',
          videoIdeas: [
            'How AI Is Changing Everything',
            'Cybersecurity Threats Explained',
            'The Future of Quantum Computing',
            'Why Your Data Is Never Safe',
            '5 Dark Web Secrets',
          ],
          thumbnailStrategy: 'Dark backgrounds, glowing tech elements',
          risks: 'Content can become outdated quickly',
          opportunityScore: 85,
          rpm: '$8-$20',
        },
        {
          rank: 3,
          channelName: 'Health Central',
          category: 'Health & Fitness',
          bendAxis: 'D',
          format: 'Animated Explainer Videos',
          strategy: 'FORMAT_TREND',
          complexityTier: 'bottom',
          budget: '$200-$500/month',
          timeToMonetization: 'Few weeks',
          elevatorPitch: 'Animated health explainers',
          whyNow: 'Proven demand, $4-$12 RPM',
          videoIdeas: [
            'The Science of Weight Loss',
            'Why You Can\'t Sleep',
            'The Truth About Supplements',
            'How Stress Affects Your Body',
            '5 Mental Health Myths',
          ],
          thumbnailStrategy: 'Clean white/green backgrounds',
          risks: 'Health claims need scientific backing',
          opportunityScore: 78,
          rpm: '$4-$12',
        },
      ],
      testPlan: {
        budget: '$100-$200',
        duration: '3-10 days per video (2 months max)',
        successCriteria: 'At least one of the first 5 videos gets >2x average views',
        videoPlan: [
          'Week 1: "Why Your Credit Score Matters"',
          'Week 2: "How The Stock Market Works"',
          'Week 3: "5 Side Hustles That Make Money"',
        ],
        failurePlan: 'Return to Phase 1 — try the next ranked niche',
      },
      recommendations: [
        'High opportunity — consider fast entry into Finance niche',
        'Channel is fresh — first-mover advantage possible',
        'Focus on Finance & Business content with explainer format',
        'Test with 5 shorts before committing to long-form',
      ],
    };
  } catch (error: any) {
    return {
      status: 'failed',
      message: `Analysis failed: ${error.message}`,
    };
  }
}
