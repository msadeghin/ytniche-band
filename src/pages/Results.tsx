import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Download, Share2, Youtube, TrendingUp,
  Target, Shield, Brain, BarChart3, Lightbulb,
  ExternalLink, CheckCircle2, AlertTriangle, Clock,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Demo results data
const demoResults = {
  sourceChannel: {
    name: 'VisualMind AI',
    url: 'https://youtube.com/@visualmindai',
    description: 'Exploring AI topics through 2D animation — from machine learning to ethical AI debates.',
    subscriberCount: 45200,
    format: 'explainer',
    category: 'Education & Science',
    strategy: 'FORMAT_TREND',
    opportunityScore: 82,
    rpm: '$4-$10',
    saturationStatus: 'Growing population',
  },
  subNiches: [
    { name: 'History', score: 9, untouched: false },
    { name: 'Psychology', score: 8, untouched: false },
    { name: 'Space', score: 7, untouched: true },
    { name: 'Philosophy', score: 6, untouched: true },
  ],
  bendProposals: [
    {
      rank: 1,
      channelName: 'Biz Explained',
      category: 'Finance & Business',
      bendAxis: 'A' as const,
      strategy: 'FORMAT_TREND' as const,
      complexityTier: 'bottom' as const,
      budget: '$200-$500/month',
      timeToMonetization: 'Few weeks',
      elevatorPitch: 'Bringing animated explainer videos to the Finance niche — like VisualMind AI but for business audience',
      whyNow: 'The finance market on YouTube is growing rapidly with high RPM ($15-$40). Faceless animation content is still rare in this space.',
      videoIdeas: [
        'Why Your Credit Score Matters More Than You Think',
        'The Truth About Crypto in 2026 (Animated)',
        'How The Stock Market Actually Works',
        '5 Side Hustles That Actually Make Money',
        'The Rise and Fall of Real Estate',
      ],
      thumbnailStrategy: 'Bold text overlays on finance-themed visuals. Use red/green color contrast. Add dramatic close-ups of money charts.',
      risks: 'Finance content requires accuracy. One wrong fact can damage credibility.',
      opportunityScore: 91,
      rpm: '$15-$40',
    },
    {
      rank: 2,
      channelName: 'TechVerse Lab',
      category: 'Tech & Software',
      bendAxis: 'A' as const,
      strategy: 'FORMAT_TREND' as const,
      complexityTier: 'middle' as const,
      budget: '$500-$1000/month',
      timeToMonetization: '1-3 months',
      elevatorPitch: 'Bringing animated explainer videos to Tech — like VisualMind AI but for software and gadgets',
      whyNow: 'Tech is a booming category with $8-$20 RPM. AI tools make content creation faster than ever.',
      videoIdeas: [
        'How AI Is Changing Everything (Explained)',
        'The Dark Side of Social Media Algorithms',
        'Why Your Data Is Never Safe Online',
        'The Future of Quantum Computing',
        '5 Cybersecurity Threats You Ignore Every Day',
      ],
      thumbnailStrategy: 'Dark backgrounds with glowing tech elements. Use blue/purple gradients. Show futuristic interfaces.',
      risks: 'Tech moves fast — content can become outdated within months.',
      opportunityScore: 85,
      rpm: '$8-$20',
    },
    {
      rank: 3,
      channelName: 'Health Central',
      category: 'Health & Fitness',
      bendAxis: 'D' as const,
      strategy: 'FORMAT_TREND' as const,
      complexityTier: 'bottom' as const,
      budget: '$200-$500/month',
      timeToMonetization: 'Few weeks',
      elevatorPitch: 'Animated health explainers for the wellness audience',
      whyNow: 'Health content has proven demand. Faceless explainers can cover nutrition, sleep, and mental health.',
      videoIdeas: [
        'The Science of Weight Loss (Animated)',
        'Why You Can\'t Sleep (And How to Fix It)',
        'The Truth About Supplements',
        'How Stress Affects Your Body',
        '5 Mental Health Myths Debunked',
      ],
      thumbnailStrategy: 'Clean white/green backgrounds. Simple body diagrams. Before/after contrasts.',
      risks: 'Health claims need scientific backing. Misinformation can demonetize the channel.',
      opportunityScore: 78,
      rpm: '$4-$12',
    },
  ],
  testPlan: {
    budget: '$100-$200',
    duration: '3-10 days per video (2 months max)',
    successCriteria: 'At least one of the first 5 videos gets >2x the average views of similar fresh channels',
    videoPlan: [
      'Week 1: "Why Your Credit Score Matters More Than You Think"',
      'Week 2: "How The Stock Market Actually Works"',
      'Week 3: "5 Side Hustles That Actually Make Money"',
    ],
    failurePlan: 'Return to Phase 1 — try the next ranked niche (Tech). Analyze if format, packaging, or video length was the issue.',
  },
  recommendations: [
    'High opportunity — consider fast entry into Finance niche',
    'Channel is fresh — first-mover advantage possible',
    'Focus on Finance & Business content with explainer format',
    'Test with 5 shorts before committing to long-form',
  ],
};

const phaseColors: Record<string, string> = {
  green: 'bg-emerald-500/20 text-emerald-400',
  caution: 'bg-yellow-500/20 text-yellow-400',
  red: 'bg-red-500/20 text-red-400',
};

export function Results() {
  const { analysisId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const isDemo = analysisId?.startsWith('demo-');

  if (isDemo) {
    return (
      <div className="min-h-screen py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="mb-6 text-muted-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600/20 to-orange-500/20 border border-red-500/20">
                <Youtube className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{demoResults.sourceChannel.name}</h1>
                  <Badge variant="info">Demo</Badge>
                </div>
                <p className="text-muted-foreground text-sm mt-1">
                  {demoResults.sourceChannel.category} • {demoResults.sourceChannel.format} format
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-start lg:self-center">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'bends', label: 'Niche Bends' },
              { id: 'testplan', label: 'Test Plan' },
              { id: 'phases', label: 'Phases' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-dark-800 text-white border border-dark-600'
                    : 'text-muted-foreground hover:text-white hover:bg-dark-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Opportunity Score', value: demoResults.sourceChannel.opportunityScore, unit: '/100', color: 'text-green-400' },
                  { label: 'Strategy Type', value: demoResults.sourceChannel.strategy, unit: '', color: 'text-blue-400' },
                  { label: 'Best RPM', value: demoResults.bendProposals[0].rpm, unit: '', color: 'text-yellow-400' },
                  { label: 'Bends Generated', value: demoResults.bendProposals.length, unit: '', color: 'text-purple-400' },
                ].map((metric) => (
                  <Card key={metric.label} className="border-dark-700/50">
                    <CardContent className="p-6 text-center">
                      <div className={`text-2xl font-bold ${metric.color}`}>
                        {metric.value}{metric.unit}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{metric.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Source Channel Info */}
              <Card className="border-dark-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Source Channel Analysis</h3>
                    <Badge variant="success">Phase 1 & 2 Complete</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Format', value: demoResults.sourceChannel.format },
                      { label: 'Category', value: demoResults.sourceChannel.category },
                      { label: 'Strategy', value: demoResults.sourceChannel.strategy },
                      { label: 'Saturation', value: demoResults.sourceChannel.saturationStatus },
                      { label: 'Estimated RPM', value: demoResults.sourceChannel.rpm },
                      { label: 'Subscribers', value: `${(demoResults.sourceChannel.subscriberCount / 1000).toFixed(1)}K` },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-dark-800/50">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <span className="text-sm font-medium text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="border-dark-700/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Recommendations</h3>
                  <div className="space-y-3">
                    {demoResults.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-dark-800/50">
                        <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{rec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sub-niche Analysis */}
              <Card className="border-dark-700/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Internal Sub-Niche Scan</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {demoResults.subNiches.map((sub) => (
                      <div key={sub.name} className="flex items-center justify-between p-3 rounded-xl bg-dark-800/50">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white">{sub.name}</span>
                          {sub.untouched && (
                            <Badge variant="success" className="text-[10px]">ZERO COMP</Badge>
                          )}
                        </div>
                        <span className="text-sm font-medium text-white">{sub.score}/10</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Action */}
              <Link to="/workflow">
                <Button variant="gradient" size="lg" className="w-full">
                  <Zap className="w-4 h-4 mr-2" />
                  Start New Analysis
                </Button>
              </Link>
            </motion.div>
          )}

          {activeTab === 'bends' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {demoResults.bendProposals.map((bend, i) => (
                <Card key={i} className={`border-dark-700/50 ${i === 0 ? 'ring-1 ring-yellow-500/30' : ''}`}>
                  <CardContent className="p-6">
                    {i === 0 && (
                      <Badge variant="warning" className="mb-4">🏆 Top Pick</Badge>
                    )}
                    
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{bend.channelName}</h3>
                        <p className="text-sm text-muted-foreground">{bend.elevatorPitch}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">{bend.opportunityScore}</div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      {[
                        { label: 'Category', value: bend.category },
                        { label: 'Bend Axis', value: `Axis ${bend.bendAxis}` },
                        { label: 'Complexity', value: bend.complexityTier },
                        { label: 'Budget', value: bend.budget },
                      ].map((item) => (
                        <div key={item.label} className="p-3 rounded-xl bg-dark-800/50">
                          <div className="text-xs text-muted-foreground">{item.label}</div>
                          <div className="text-sm font-medium text-white mt-1">{item.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-white mb-2">🎬 Video Ideas</h4>
                      <div className="space-y-2">
                        {bend.videoIdeas.map((video, j) => (
                          <div key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-red-400 mt-0.5">›</span>
                            {video}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 rounded-xl bg-dark-800/50">
                        <h4 className="text-sm font-semibold text-white mb-1">🎨 Thumbnail Strategy</h4>
                        <p className="text-xs text-muted-foreground">{bend.thumbnailStrategy}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-dark-800/50">
                        <h4 className="text-sm font-semibold text-white mb-1">⚠️ Risks</h4>
                        <p className="text-xs text-muted-foreground">{bend.risks}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}

          {activeTab === 'testplan' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className="border-dark-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600/20 to-green-500/20 border border-emerald-500/20">
                      <Target className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Low-Cost Test Plan</h3>
                      <p className="text-sm text-muted-foreground">For: {demoResults.bendProposals[0].channelName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {[
                      { label: 'Budget', value: demoResults.testPlan.budget, icon: '💰' },
                      { label: 'Duration', value: demoResults.testPlan.duration, icon: '⏱️' },
                      { label: 'Success Criterion', value: demoResults.testPlan.successCriteria, icon: '🎯' },
                    ].map((item) => (
                      <div key={item.label} className="p-4 rounded-xl bg-dark-800/50">
                        <div className="text-2xl mb-2">{item.icon}</div>
                        <div className="text-sm text-muted-foreground">{item.label}</div>
                        <div className="text-sm font-medium text-white mt-1">{item.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-white mb-3">📅 Publishing Schedule</h4>
                    <div className="space-y-2">
                      {demoResults.testPlan.videoPlan.map((plan, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/50">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold">
                            {i + 1}
                          </div>
                          <span className="text-sm text-muted-foreground">{plan}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-amber-300 mb-1">If Test Fails</h4>
                        <p className="text-sm text-muted-foreground">{demoResults.testPlan.failurePlan}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'phases' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className="border-dark-700/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Analysis Phases Completed</h3>
                  <div className="space-y-4">
                    {[
                      { phase: 'Phase 0', name: 'Setup', status: 'completed', desc: 'Date registered, mode selected: Channel Analysis' },
                      { phase: 'Phase 1', name: 'Niche Discovery', status: 'completed', desc: 'Channel verified as faceless, freshness validated, metrics calculated' },
                      { phase: 'Phase 2', name: 'Format Analysis', status: 'completed', desc: 'Format detected, strategy identified, 3 niche bends generated across axes A-A-D' },
                      { phase: 'Phase 3', name: 'Validation', status: 'completed', desc: 'Search validation complete, scores assigned' },
                      { phase: 'Phase 3.5', name: 'Low-Cost Test Plan', status: 'completed', desc: 'Test plan generated with $100-$200 budget' },
                      { phase: 'Phase 4', name: 'Script DNA', status: 'caution', desc: 'Optional — requires video transcript access' },
                    ].map((phase) => (
                      <div key={phase.phase} className="flex items-start gap-4 p-4 rounded-xl bg-dark-800/50">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 ${
                          phase.status === 'completed' ? 'bg-emerald-500/20' : 'bg-yellow-500/20'
                        }`}>
                          {phase.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-yellow-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-muted-foreground">{phase.phase}</span>
                            <Badge variant={phase.status === 'completed' ? 'success' : 'warning'} className="text-[10px]">
                              {phase.status}
                            </Badge>
                          </div>
                          <h4 className="text-sm font-semibold text-white">{phase.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{phase.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <Youtube className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Analysis Not Found</h1>
        <p className="text-muted-foreground mb-6">This analysis doesn't exist or has expired.</p>
        <Link to="/dashboard">
          <Button variant="gradient">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
