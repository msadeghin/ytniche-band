import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Download, Share2, Youtube, TrendingUp,
  Target, Shield, Brain, BarChart3, Lightbulb,
  ExternalLink, CheckCircle2, AlertTriangle, Clock,
  Zap, Mountain, Lock, Waves, Dna, Award, BookOpen,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { classifyPyramidLevel } from '../lib/analysis/pyramid';
import { scoreBarriers } from '../lib/analysis/barriers';
import { detectMarketStage } from '../lib/analysis/saturation';
import { scoreBlueOceanGap } from '../lib/analysis/blueOcean';
import { calculateWeightedOpportunityScore } from '../lib/analysis/opportunityScore';
import { extractScriptDNA, bendScriptSkeleton } from '../lib/analysis/scriptDNA';
import type { PyramidResult } from '../lib/analysis/pyramid';
import type { BarrierResult } from '../lib/analysis/barriers';
import type { SaturationResult } from '../lib/analysis/saturation';
import type { BlueOceanResult } from '../lib/analysis/blueOcean';
import type { OpportunityResult } from '../lib/analysis/opportunityScore';
import type { ScriptDNAResult } from '../lib/analysis/scriptDNA';

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
  pyramid: classifyPyramidLevel({
    productionComplexity: 5,
    copyability: 4,
    requiredBudget: 800,
    requiredSkill: 5,
    trendSpeed: 6,
    insiderKnowledge: 3,
  }),
  barriers: scoreBarriers({
    budgetMonthly: 800,
    productionType: '2d-animation',
    topicExpertise: 6,
    interestLevel: 8,
    uploadVelocity: 8,
    trendFreshnessDays: 45,
    originalFormatScore: 4,
  }),
  saturation: detectMarketStage({
    similarChannels: [
      { title: 'Channel A', recentViews: 85000, topVideoViews: 420000, uploadCountLast30Days: 8, startedPostingDaysAgo: 120 },
      { title: 'Channel B', recentViews: 120000, topVideoViews: 680000, uploadCountLast30Days: 6, startedPostingDaysAgo: 90 },
      { title: 'Channel C', recentViews: 45000, topVideoViews: 210000, uploadCountLast30Days: 10, startedPostingDaysAgo: 150 },
      { title: 'Channel D', recentViews: 8000, topVideoViews: 35000, uploadCountLast30Days: 12, startedPostingDaysAgo: 200 },
      { title: 'Channel E', recentViews: 95000, topVideoViews: 510000, uploadCountLast30Days: 4, startedPostingDaysAgo: 60 },
    ],
    sourceFormat: 'explainer',
    breakoutVideoAgeDays: 45,
  }),
  blueOcean: scoreBlueOceanGap({
    demandSignals: 8,
    directCompetitors: 3,
    competitorQuality: 5,
    recentBreakouts: 4,
    adjacentMarketProof: 7,
    formatMissingScore: 7,
  }),
  opportunityScore: calculateWeightedOpportunityScore({
    demandScore: 78,
    blueOceanScore: 72,
    barrierScore: 45,
    formatProofScore: 80,
    freshnessScore: 70,
    assetPotentialScore: 55,
    userFitScore: 65,
    saturationRisk: 30,
    policyRisk: 25,
  }),
  scriptDNA: extractScriptDNA({
    title: 'Why AI Is More Dangerous Than You Think',
    description: 'In this video, we explore the hidden dangers of artificial intelligence and why experts are worried.',
    videoFormat: 'long',
  }),
  subNiches: [
    { name: 'History', score: 9, untouched: false },
    { name: 'Psychology', score: 8, untouched: false },
    { name: 'Space', score: 7, untouched: true },
    { name: 'Philosophy', score: 6, untouched: true },
  ],
  recommendations: [
    'High opportunity — consider fast entry into niche',
    'Channel is fresh — first-mover advantage possible',
    'Focus on Education & Science content with explainer format',
    'Test with 5 shorts before committing to long-form',
  ],
  executionPlan: [
    'Week 1: Set up production pipeline (AI voiceover + 2D animation tools)',
    'Week 2-3: Produce and publish first 3 test videos',
    'Week 4-5: Analyze CTR, retention, and audience feedback',
    'Week 6: Scale what works, pivot what doesn\'t',
    'Month 3+: Optimize for monetization and consistency',
  ],
  risks: [
    'Education niche has lower RPM compared to Finance ($4-$10 vs $15-$40)',
    'Format lifespan for explainer videos is ~6-8 months before saturation',
    'YouTube policy risk if content is perceived as generic AI',
    'Competition may increase as barriers are moderate',
  ],
};

type TabId = 'overview' | 'pyramid' | 'barriers' | 'saturation' | 'blue-ocean' | 'bends' | 'script-dna' | 'risks';

const tabs: { id: TabId; label: string; icon: typeof Mountain }[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'pyramid', label: 'Pyramid', icon: Mountain },
  { id: 'barriers', label: 'Barriers', icon: Lock },
  { id: 'saturation', label: 'Saturation', icon: Waves },
  { id: 'blue-ocean', label: 'Blue Ocean', icon: Award },
  { id: 'bends', label: 'Niche Bends', icon: Target },
  { id: 'script-dna', label: 'Script DNA', icon: Dna },
  { id: 'risks', label: 'Risks', icon: AlertTriangle },
];

export function Results() {
  const { analysisId } = useParams();
  const [activeTab, setActiveTab] = useState<TabId>('overview');

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

          {/* Score Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <Card className={`border ${getScoreBorder(demoResults.opportunityScore.recommendation)}`}>
              <CardContent className="p-6 text-center">
                <div className="text-5xl font-bold mb-2">{demoResults.opportunityScore.score}</div>
                <Badge variant={getScoreBadgeVariant(demoResults.opportunityScore.recommendation)} className="text-sm px-4 py-1">
                  {recommendationLabel(demoResults.opportunityScore.recommendation)}
                </Badge>
                <div className="text-sm text-muted-foreground mt-2">Weighted Opportunity Score</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-dark-800 text-white border border-dark-600'
                      : 'text-muted-foreground hover:text-white hover:bg-dark-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ─── OVERVIEW TAB ─────────────────────────────────── */}
          {activeTab === 'overview' && <OverviewTab />}

          {/* ─── PYRAMID TAB ──────────────────────────────────── */}
          {activeTab === 'pyramid' && <PyramidTab pyramid={demoResults.pyramid} />}

          {/* ─── BARRIERS TAB ─────────────────────────────────── */}
          {activeTab === 'barriers' && <BarriersTab barriers={demoResults.barriers} />}

          {/* ─── SATURATION TAB ───────────────────────────────── */}
          {activeTab === 'saturation' && <SaturationTab saturation={demoResults.saturation} />}

          {/* ─── BLUE OCEAN TAB ──────────────────────────────── */}
          {activeTab === 'blue-ocean' && <BlueOceanTab blueOcean={demoResults.blueOcean} />}

          {/* ─── NICHE BENDS TAB ─────────────────────────────── */}
          {activeTab === 'bends' && <NicheBendsTab />}

          {/* ─── SCRIPT DNA TAB ──────────────────────────────── */}
          {activeTab === 'script-dna' && <ScriptDNATab dna={demoResults.scriptDNA} />}

          {/* ─── RISKS TAB ───────────────────────────────────── */}
          {activeTab === 'risks' && <RisksTab />}
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
          <Button variant="gradient">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}

// ─── TAB COMPONENTS ────────────────────────────────────────────

function OverviewTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Opportunity Score', value: demoResults.opportunityScore.score, unit: '/100', color: 'text-green-400', icon: Target },
          { label: 'Pyramid Level', value: demoResults.pyramid.level, unit: '', color: 'text-blue-400', icon: Mountain },
          { label: 'Market Stage', value: stageShortLabel(demoResults.saturation.stage), unit: '', color: 'text-yellow-400', icon: Waves },
          { label: 'Blue Ocean', value: oceanShortLabel(demoResults.blueOcean.label), unit: '', color: 'text-cyan-400', icon: Award },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="border-dark-700/50">
              <CardContent className="p-6 text-center">
                <Icon className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                <div className={`text-2xl font-bold ${metric.color}`}>
                  {typeof metric.value === 'number' ? metric.value : metric.value}{metric.unit}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{metric.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Opportunity Breakdown */}
      <Card className="border-dark-700/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📊 Score Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(demoResults.opportunityScore.breakdown).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-dark-800/50">
                <span className="text-sm text-muted-foreground">{key}</span>
                <span className={`text-sm font-mono font-medium ${value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {value > 0 ? '+' : ''}{value}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-700/50 border border-dark-600">
              <span className="text-sm font-bold text-white">Total Score</span>
              <span className="text-lg font-bold text-white">{demoResults.opportunityScore.score}/100</span>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  {sub.untouched && <Badge variant="success" className="text-[10px]">ZERO COMP</Badge>}
                </div>
                <span className="text-sm font-medium text-white">{sub.score}/10</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PyramidTab({ pyramid }: { pyramid: PyramidResult }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className={`border ${pyramid.level === 'bottom' ? 'border-green-500/30' : pyramid.level === 'middle' ? 'border-yellow-500/30' : 'border-red-500/30'}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-600/20 to-orange-500/20 border border-red-500/20">
              <Mountain className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {pyramid.level === 'bottom' ? '🏔️ Bottom Pyramid' : pyramid.level === 'middle' ? '⛰️ Middle Pyramid' : '🗻 Top Pyramid'}
              </h3>
              <p className="text-sm text-muted-foreground">Content Complexity Tier</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {pyramid.explanation.map((exp, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-dark-800/50">
                <span className="text-sm text-muted-foreground">{exp}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-dark-800/50">
              <div className="text-sm text-muted-foreground">Competition Risk</div>
              <div className="mt-2 h-3 rounded-full bg-dark-700 overflow-hidden">
                <div
                  className={`h-full rounded-full ${pyramid.competitionRisk > 60 ? 'bg-red-500' : pyramid.competitionRisk > 30 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${pyramid.competitionRisk}%` }}
                />
              </div>
              <div className="text-sm font-medium text-white mt-1">{pyramid.competitionRisk}/100</div>
            </div>
            <div className="p-4 rounded-xl bg-dark-800/50">
              <div className="text-sm text-muted-foreground">Asset Potential</div>
              <div className="mt-2 h-3 rounded-full bg-dark-700 overflow-hidden">
                <div
                  className={`h-full rounded-full ${pyramid.assetPotential > 60 ? 'bg-green-500' : pyramid.assetPotential > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${pyramid.assetPotential}%` }}
                />
              </div>
              <div className="text-sm font-medium text-white mt-1">{pyramid.assetPotential}/100</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function BarriersTab({ barriers }: { barriers: BarrierResult }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="border-dark-700/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-600/20 to-amber-500/20 border border-yellow-500/20">
              <Lock className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">🚧 Barrier to Entry Analysis</h3>
              <p className="text-sm text-muted-foreground">Moat:              <Badge variant={barriers.moatLabel === 'strong' ? 'success' : barriers.moatLabel === 'moderate' ? 'warning' : 'destructive'}>{barriers.moatLabel}</Badge></p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              { label: '💰 Money Barrier', value: barriers.moneyBarrier, color: 'bg-blue-500' },
              { label: '🔧 Skill Barrier', value: barriers.skillBarrier, color: 'bg-purple-500' },
              { label: '🧠 Insider Barrier', value: barriers.insiderBarrier, color: 'bg-amber-500' },
              { label: '⚡ Speed Barrier', value: barriers.speedBarrier, color: 'bg-red-500' },
            ].map((barrier) => (
              <div key={barrier.label} className="p-4 rounded-xl bg-dark-800/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{barrier.label}</span>
                  <span className="text-sm font-medium text-white">{barrier.value}/100</span>
                </div>
                <div className="h-2 rounded-full bg-dark-700 overflow-hidden">
                  <div className={`h-full rounded-full ${barrier.color}`} style={{ width: `${barrier.value}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-white mb-3">Total Barrier Score</h4>
            <div className="p-4 rounded-xl bg-dark-800/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Overall</span>
                <span className="text-2xl font-bold text-white">{barriers.totalBarrierScore}/100</span>
              </div>
              <div className="h-3 rounded-full bg-dark-700 overflow-hidden">
                <div
                  className={`h-full rounded-full ${barriers.totalBarrierScore > 60 ? 'bg-green-500' : barriers.totalBarrierScore > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${barriers.totalBarrierScore}%` }}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Recommendations</h4>
            <div className="space-y-2">
              {barriers.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-dark-800/50">
                  <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SaturationTab({ saturation }: { saturation: SaturationResult }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className={`border ${saturation.stage === 'breakout' ? 'border-green-500/30' : saturation.stage === 'late_wave' ? 'border-yellow-500/30' : saturation.stage === 'saturated' || saturation.stage === 'declining' ? 'border-red-500/30' : 'border-blue-500/30'}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600/20 to-blue-500/20 border border-cyan-500/20">
              <Waves className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">📊 Market Stage Detection</h3>                <Badge variant={saturation.stage === 'breakout' ? 'success' : saturation.stage === 'late_wave' ? 'warning' : saturation.stage === 'saturated' || saturation.stage === 'declining' ? 'destructive' : 'info'} className="mt-1">
                {stageLabel(saturation.stage)}
              </Badge>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Saturation Score</span>
              <span className="text-2xl font-bold text-white">{saturation.saturationScore}/100</span>
            </div>
            <div className="h-3 rounded-full bg-dark-700 overflow-hidden">
              <div
                className={`h-full rounded-full ${saturation.saturationScore > 60 ? 'bg-red-500' : saturation.saturationScore > 35 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${saturation.saturationScore}%` }}
              />
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-white mb-3">Action:                <Badge variant={saturation.action === 'enter_now' ? 'success' : saturation.action === 'test_fast' ? 'info' : saturation.action === 'bend_first' ? 'warning' : 'destructive'}>{actionLabel(saturation.action)}</Badge></h4>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Evidence</h4>
            <div className="space-y-2">
              {saturation.evidence.map((ev, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-dark-800/50">
                  <span className="text-xs text-muted-foreground">{ev}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function BlueOceanTab({ blueOcean }: { blueOcean: BlueOceanResult }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className={`border ${blueOcean.label === 'blue_ocean' ? 'border-blue-500/30' : blueOcean.label === 'emerging_gap' ? 'border-green-500/30' : blueOcean.label === 'competitive' ? 'border-yellow-500/30' : 'border-red-500/30'}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-blue-500/20">
              <Award className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">🌊 Blue Ocean Gap Analysis</h3>                <Badge variant={blueOcean.label === 'blue_ocean' ? 'success' : blueOcean.label === 'emerging_gap' ? 'info' : blueOcean.label === 'competitive' ? 'warning' : 'destructive'} className="mt-1">
                {oceanLabel(blueOcean.label)}
              </Badge>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Blue Ocean Score</span>
              <span className="text-2xl font-bold text-white">{blueOcean.blueOceanScore}/100</span>
            </div>
            <div className="h-3 rounded-full bg-dark-700 overflow-hidden">
              <div
                className={`h-full rounded-full ${blueOcean.blueOceanScore >= 75 ? 'bg-blue-500' : blueOcean.blueOceanScore >= 55 ? 'bg-green-500' : blueOcean.blueOceanScore >= 35 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${blueOcean.blueOceanScore}%` }}
              />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Analysis</h4>
            <div className="space-y-2">
              {blueOcean.explanation.map((exp, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-dark-800/50">
                  <span className="text-sm text-muted-foreground">{exp}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function NicheBendsTab() {
  const bendProposals = demoResults as any;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {bendProposals.map((bend, i) => (
        <Card key={i} className={`border-dark-700/50 ${i === 0 ? 'ring-1 ring-yellow-500/30' : ''}`}>
          <CardContent className="p-6">
            {i === 0 && <Badge variant="warning" className="mb-4">🏆 Top Pick</Badge>}

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
  );
}

function ScriptDNATab({ dna }: { dna: ScriptDNAResult }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="border-dark-700/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-500/20 border border-purple-500/20">
              <Dna className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">🧬 Script DNA Extraction</h3>
              <p className="text-sm text-muted-foreground">Reusable script skeleton from source content</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Title Pattern</h4>
              <div className="p-3 rounded-xl bg-dark-800/50 font-mono text-sm text-muted-foreground">
                {dna.titlePattern}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Hook Pattern</h4>
              <div className="p-3 rounded-xl bg-dark-800/50 font-mono text-sm text-cyan-400">
                {dna.hookPattern}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Script Structure</h4>
              <div className="space-y-2">
                {dna.structure.map((beat, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-dark-800/50">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{beat.beat}</div>
                      <div className="text-xs text-muted-foreground">{beat.purpose}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Retention Devices</h4>
              <div className="space-y-2">
                {dna.retentionDevices.map((device, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-dark-800/50">
                    <span className="text-sm text-muted-foreground">• {device}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Reusable Skeleton</h4>
              <pre className="p-4 rounded-xl bg-dark-900 border border-dark-600 text-xs text-muted-foreground font-mono whitespace-pre-wrap overflow-x-auto">
                {dna.reusableSkeleton}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function RisksTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="border-dark-700/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-600/20 to-rose-500/20 border border-red-500/20">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">⚠️ Risk Assessment</h3>
              <p className="text-sm text-muted-foreground">Honest evaluation of what could go wrong</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {demoResults.risks.map((risk, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-dark-800/50">
                <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{risk}</span>
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">📋 Execution Plan</h4>
            <div className="space-y-2">
              {demoResults.executionPlan.map((step, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/50">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-sm text-muted-foreground">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────

function getScoreBorder(rec: string): string {
  switch (rec) {
    case 'build': return 'border-green-500/50';
    case 'test': return 'border-yellow-500/50';
    case 'bend_first': return 'border-orange-500/50';
    case 'avoid': return 'border-red-500/50';
    default: return 'border-dark-700/50';
  }
}

function getScoreBadgeVariant(rec: string): 'success' | 'warning' | 'destructive' | 'info' {
  switch (rec) {
    case 'build': return 'success';
    case 'test': return 'warning';
    case 'bend_first': return 'warning';
    case 'avoid': return 'destructive';
    default: return 'info';
  }
}

function recommendationLabel(rec: string): string {
  switch (rec) {
    case 'build': return '✅ Build — Full Production';
    case 'test': return '🟡 Test — 3-5 Videos First';
    case 'bend_first': return '🟠 Bend First — Differentiate';
    case 'avoid': return '🔴 Avoid — High Risk';
    default: return rec;
  }
}

function stageLabel(stage: string): string {
  const labels: Record<string, string> = {
    too_early: '🟦 Too Early',
    breakout: '🟩 Breakout',
    late_wave: '🟨 Late Wave',
    saturated: '🟥 Saturated',
    declining: '⬛ Declining',
  };
  return labels[stage] || stage;
}

function stageShortLabel(stage: string): string {
  const labels: Record<string, string> = {
    too_early: 'Too Early',
    breakout: 'Breakout',
    late_wave: 'Late Wave',
    saturated: 'Saturated',
    declining: 'Declining',
  };
  return labels[stage] || stage;
}

function oceanLabel(ocean: string): string {
  const labels: Record<string, string> = {
    blue_ocean: '🌊 Blue Ocean',
    emerging_gap: '🟢 Emerging Gap',
    competitive: '🟡 Competitive',
    red_ocean: '🔴 Red Ocean',
  };
  return labels[ocean] || ocean;
}

function oceanShortLabel(ocean: string): string {
  const labels: Record<string, string> = {
    blue_ocean: 'Blue Ocean',
    emerging_gap: 'Emerging Gap',
    competitive: 'Competitive',
    red_ocean: 'Red Ocean',
  };
  return labels[ocean] || ocean;
}

function actionLabel(action: string): string {
  const labels: Record<string, string> = {
    enter_now: 'Enter Now',
    test_fast: 'Test Fast',
    bend_first: 'Bend First',
    avoid: 'Avoid',
  };
  return labels[action] || action;
}
