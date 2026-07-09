import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Download, Share2, Youtube, TrendingUp,
  Target, Shield, Brain, BarChart3, Lightbulb,
  ExternalLink, CheckCircle2, AlertTriangle, Clock,
  Zap, Mountain, Lock, Waves, Dna, Award, BookOpen,
  DollarSign, Wifi, Key, Cookie
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { classifyPyramidLevel } from '../lib/analysis/pyramid';
import { scoreBarriers } from '../lib/analysis/barriers';
import { detectMarketStage } from '../lib/analysis/saturation';
import { scoreBlueOceanGap } from '../lib/analysis/blueOcean';
import { calculateWeightedOpportunityScore } from '../lib/analysis/opportunityScore';
import { extractScriptDNA } from '../lib/analysis/scriptDNA';
import { getAnalysis } from '../lib/storage/analysisStore';
import type { AnalysisResult } from '../lib/analysis/types';
import type { DataProviderInfo } from '../lib/analysis/types';
import type { PyramidResult } from '../lib/analysis/pyramid';
import type { BarrierResult } from '../lib/analysis/barriers';
import type { SaturationResult } from '../lib/analysis/saturation';
import type { BlueOceanResult } from '../lib/analysis/blueOcean';
import type { ScriptDNAResult } from '../lib/analysis/scriptDNA';

// ─── Demo Data ─────────────────────────────────────────────────
const demoResults: AnalysisResult = {
  id: "demo",
  dataProvider: {
    used: ["manual"],
    warnings: ["Demo data — not from a real analysis."],
    noKeyMode: true,
    exactStatsAvailable: false,
    cookiesEnabled: false,
  },
  request: {
    mode: "channel",
    input: "@visualmindai",
    profile: {
      topics: "AI, Technology, Machine Learning",
      interests: "Technology, Science",
      skills: "Animation, Video Editing",
      budget: "$800",
      preferredFormat: "Long-form",
      productionStyle: "2D Animation",
      language: "English",
      goal: "Cashflow",
      publishingSpeed: "Weekly",
      exampleChannels: "@3blue1brown, @veritasium",
    },
    createdAt: new Date().toISOString(),
  },
  source: {
    name: "VisualMind AI",
    description: "Exploring AI topics through 2D animation — from machine learning to ethical AI debates.",
    format: "explainer",
    category: "Education & Science",
    strategy: "FORMAT_TREND",
    rpm: "$4-$10",
    subscriberCount: 45200,
  },
  scores: {
    opportunity: 82,
    recommendation: "build",
    breakdown: {
      "Demand (×0.20)": 16,
      "Blue Ocean Gap (×0.15)": 11,
      "Barrier/Moat (×0.15)": 7,
      "Format Proof (×0.15)": 12,
      "Freshness (×0.10)": 7,
      "Asset Potential (×0.10)": 6,
      "User Fit (×0.10)": 7,
      "Saturation Risk (−×0.15)": -5,
      "Policy Risk (−×0.10)": -3,
    },
    demandScore: 78,
    blueOceanScore: 72,
    barrierScore: 45,
    formatProofScore: 80,
    freshnessScore: 70,
    assetPotentialScore: 55,
    userFitScore: 65,
    saturationRisk: 30,
    policyRisk: 25,
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
    productionType: "2d-animation",
    topicExpertise: 6,
    interestLevel: 8,
    uploadVelocity: 8,
    trendFreshnessDays: 45,
    originalFormatScore: 4,
  }),
  saturation: detectMarketStage({
    similarChannels: [
      { title: "Channel A", recentViews: 85000, topVideoViews: 420000, uploadCountLast30Days: 8, startedPostingDaysAgo: 120 },
      { title: "Channel B", recentViews: 120000, topVideoViews: 680000, uploadCountLast30Days: 6, startedPostingDaysAgo: 90 },
      { title: "Channel C", recentViews: 45000, topVideoViews: 210000, uploadCountLast30Days: 10, startedPostingDaysAgo: 150 },
      { title: "Channel D", recentViews: 8000, topVideoViews: 35000, uploadCountLast30Days: 12, startedPostingDaysAgo: 200 },
      { title: "Channel E", recentViews: 95000, topVideoViews: 510000, uploadCountLast30Days: 4, startedPostingDaysAgo: 60 },
    ],
    sourceFormat: "explainer",
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
  scriptDNA: extractScriptDNA({
    title: "Why AI Is More Dangerous Than You Think",
    description: "Exploring the hidden dangers of artificial intelligence.",
    videoFormat: "long",
  }),
  nicheBends: [],
  recommendations: [
    "🎯 Strong opportunity in Education & Science — proceed with full production plan",
    "Archive format: explainer | Production type: 2d-animation | Budget: $800/month",
    "Pyramid tier: Middle Pyramid — branded content, sustainable",
    "Saturation: Breakout — Ideal entry window",
    "Blue ocean score: 72/100 — emerging gap",
  ],
  executionPlan: [
    "Week 1: Set up 2d-animation production pipeline — budget: $800/month",
    "Week 2-3: Produce first 3 explainer videos on Education & Science topics",
    "Week 4-5: Analyze CTR, retention, audience feedback from first batch",
    "Week 6: Scale successful angles, pivot underperforming ones",
    "Month 3+: Optimize for monetization (AdSense + sponsors)",
  ],
  risks: [
    "Education & Science has moderate barriers — moderate moat",
    "Format lifespan: 6-12 months (moderate)",
    "Monitor growing competition in the coming months",
  ],
  testPlan: {
    budget: "$100-$200",
    duration: "3-10 days per video (2 months max)",
    firstFiveVideos: [
      'Test 1: "Why Education & Science Is More Important Than You Think"',
      'Test 2: "The Truth About History Nobody Talks About"',
      'Test 3: "How Psychology Actually Works"',
    ],
    successCriteria: [
      "At least one of the first 5 videos gets >2x the average views of similar fresh channels",
      "CTR above 8% indicates strong packaging",
      "Retention above 40% at mid-point indicates content-market fit",
    ],
    stopCriteria: [
      "All 5 videos get <500 views after 2 weeks each",
      "CTR consistently below 4%",
      "Negative audience signals in comments",
    ],
  },
};

// ─── Types ─────────────────────────────────────────────────────

type TabId =
  | "overview"
  | "score-breakdown"
  | "pyramid"
  | "barriers"
  | "saturation"
  | "blue-ocean"
  | "niche-bends"
  | "script-dna"
  | "test-plan"
  | "execution-plan"
  | "risks";

const tabs: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "score-breakdown", label: "Score Breakdown", icon: Target },
  { id: "pyramid", label: "Pyramid", icon: Mountain },
  { id: "barriers", label: "Barriers", icon: Lock },
  { id: "saturation", label: "Saturation", icon: Waves },
  { id: "blue-ocean", label: "Blue Ocean", icon: Award },
  { id: "niche-bends", label: "Niche Bends", icon: Target },
  { id: "script-dna", label: "Script DNA", icon: Dna },
  { id: "test-plan", label: "Test Plan", icon: BookOpen },
  { id: "execution-plan", label: "Execution Plan", icon: TrendingUp },
  { id: "risks", label: "Risks", icon: AlertTriangle },
];

// ─── Component ────────────────────────────────────────────────

export function Results() {
  const { analysisId } = useParams();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const isDemo = analysisId === "demo" || analysisId?.startsWith("demo-");
  const analysisResult: AnalysisResult | null = isDemo
    ? demoResults
    : analysisId
    ? getAnalysis(analysisId)
    : null;

  if (!analysisResult) {
    return (
      <div className="min-h-screen py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Youtube className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Analysis Not Found</h1>
          <p className="text-muted-foreground mb-6">This analysis doesn't exist or has expired.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
            <Link to="/results/demo">
              <Button variant="gradient">View Demo Report</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const result = analysisResult;

  return (
    <div className="min-h-screen py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
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
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{result.source.name}</h1>
                {isDemo && <Badge variant="info">Demo</Badge>}
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                {result.source.category} • {result.source.format} format • Mode: {result.request.mode}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Score Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card className={`border ${getScoreBorder(result.scores.recommendation)}`}>
            <CardContent className="p-6 text-center">
              <div className="text-5xl font-bold mb-2">{result.scores.opportunity}</div>
              <Badge variant={getScoreBadgeVariant(result.scores.recommendation)} className="text-sm px-4 py-1">
                {recommendationLabel(result.scores.recommendation)}
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
                    ? "bg-dark-800 text-white border border-dark-600"
                    : "text-muted-foreground hover:text-white hover:bg-dark-800/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && <OverviewTab result={result} />}
        {activeTab === "score-breakdown" && <ScoreBreakdownTab result={result} />}
        {activeTab === "pyramid" && <PyramidTab pyramid={result.pyramid} />}
        {activeTab === "barriers" && <BarriersTab barriers={result.barriers} />}
        {activeTab === "saturation" && <SaturationTab saturation={result.saturation} />}
        {activeTab === "blue-ocean" && <BlueOceanTab blueOcean={result.blueOcean} />}
        {activeTab === "niche-bends" && <NicheBendsTab result={result} />}
        {activeTab === "script-dna" && <ScriptDNATab dna={result.scriptDNA} />}
        {activeTab === "test-plan" && <TestPlanTab result={result} />}
        {activeTab === "execution-plan" && <ExecutionPlanTab result={result} />}
        {activeTab === "risks" && <RisksTab result={result} />}
      </div>
    </div>
  );
}

// ─── TAB COMPONENTS ────────────────────────────────────────────

function OverviewTab({ result }: { result: AnalysisResult }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Opportunity Score", value: result.scores.opportunity, unit: "/100", color: "text-green-400", icon: Target },
          { label: "Pyramid Level", value: result.pyramid.level, unit: "", color: "text-blue-400", icon: Mountain },
          { label: "Market Stage", value: stageShortLabel(result.saturation.stage), unit: "", color: "text-yellow-400", icon: Waves },
          { label: "Blue Ocean", value: oceanShortLabel(result.blueOcean.label), unit: "", color: "text-cyan-400", icon: Award },
        ].map((metric) => {
          const Icon = metric.icon as React.ElementType;
          return (
            <Card key={metric.label} className="border-dark-700/50">
              <CardContent className="p-6 text-center">
                <Icon className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                <div className={`text-2xl font-bold ${metric.color}`}>
                  {typeof metric.value === "number" ? metric.value : metric.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{metric.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>          {/* Data Providers Used */}
          {result.dataProvider && (
            <Card className="border-dark-700/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600/20 to-green-500/20 border border-emerald-500/20">
                    <Wifi className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Data Providers Used</h3>
                  </div>
                </div>

                {/* Provider badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {result.dataProvider.used.map((p) => (
                    <Badge key={p} variant={p === "manual" ? "outline" : "secondary"} className="text-xs">
                      {p === "youtube-api" ? "🎬 YouTube API" : p === "oembed" ? "🔗 oEmbed" : p === "rss" ? "📡 RSS" : p === "ytdlp" ? "⚡ yt-dlp" : "🏠 Manual"}
                    </Badge>
                  ))}
                  {result.dataProvider.noKeyMode && (
                    <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400">
                      <Key className="w-3 h-3 mr-1" />
                      No-Key Mode
                    </Badge>
                  )}
                  {result.dataProvider.exactStatsAvailable && (
                    <Badge variant="success" className="text-xs">
                      Exact Stats Available
                    </Badge>
                  )}
                  {result.dataProvider.cookiesEnabled && (
                    <Badge variant="outline" className="text-xs border-orange-500/30 text-orange-400">
                      <Cookie className="w-3 h-3 mr-1" />
                      Cookie access: local-only
                    </Badge>
                  )}
                </div>

                {/* Warnings */}
                {result.dataProvider.warnings.length > 0 && (
                  <div className="space-y-2">
                    {result.dataProvider.warnings.map((w, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-dark-800/30">
                        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">{w}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Source Channel Info */}
      <Card className="border-dark-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Source Analysis</h3>
            <Badge variant="success">Complete</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Format", value: result.source.format },
              { label: "Category", value: result.source.category },
              { label: "Strategy", value: result.source.strategy },
              { label: "Estimated RPM", value: result.source.rpm },
              { label: "Mode", value: result.request.mode },
              { label: "Input", value: result.request.input || "Auto-discovery" },
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
            {result.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-dark-800/50">
                <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{rec}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ScoreBreakdownTab({ result }: { result: AnalysisResult }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="border-dark-700/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📊 Score Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(result.scores.breakdown).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-dark-800/50">
                <span className="text-sm text-muted-foreground">{key}</span>
                <span className={`text-sm font-mono font-medium ${value >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {value > 0 ? "+" : ""}{value}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-700/50 border border-dark-600">
              <span className="text-sm font-bold text-white">Total Score</span>
              <span className="text-lg font-bold text-white">{result.scores.opportunity}/100</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PyramidTab({ pyramid }: { pyramid: PyramidResult }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className={`border ${pyramid.level === "bottom" ? "border-green-500/30" : pyramid.level === "middle" ? "border-yellow-500/30" : "border-red-500/30"}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-600/20 to-orange-500/20 border border-red-500/20">
              <Mountain className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {pyramid.level === "bottom" ? "🏔️ Bottom Pyramid" : pyramid.level === "middle" ? "⛰️ Middle Pyramid" : "🗻 Top Pyramid"}
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
                  className={`h-full rounded-full ${pyramid.competitionRisk > 60 ? "bg-red-500" : pyramid.competitionRisk > 30 ? "bg-yellow-500" : "bg-green-500"}`}
                  style={{ width: `${pyramid.competitionRisk}%` }}
                />
              </div>
              <div className="text-sm font-medium text-white mt-1">{pyramid.competitionRisk}/100</div>
            </div>
            <div className="p-4 rounded-xl bg-dark-800/50">
              <div className="text-sm text-muted-foreground">Asset Potential</div>
              <div className="mt-2 h-3 rounded-full bg-dark-700 overflow-hidden">
                <div
                  className={`h-full rounded-full ${pyramid.assetPotential > 60 ? "bg-green-500" : pyramid.assetPotential > 30 ? "bg-yellow-500" : "bg-red-500"}`}
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
              <p className="text-sm text-muted-foreground">Moat: <Badge variant={barriers.moatLabel === "strong" ? "success" : barriers.moatLabel === "moderate" ? "warning" : "destructive"}>{barriers.moatLabel}</Badge></p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              { label: "💰 Money Barrier", value: barriers.moneyBarrier, color: "bg-blue-500" },
              { label: "🔧 Skill Barrier", value: barriers.skillBarrier, color: "bg-purple-500" },
              { label: "🧠 Insider Barrier", value: barriers.insiderBarrier, color: "bg-amber-500" },
              { label: "⚡ Speed Barrier", value: barriers.speedBarrier, color: "bg-red-500" },
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
                  className={`h-full rounded-full ${barriers.totalBarrierScore > 60 ? "bg-green-500" : barriers.totalBarrierScore > 30 ? "bg-yellow-500" : "bg-red-500"}`}
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
      <Card className={`border ${saturation.stage === "breakout" ? "border-green-500/30" : saturation.stage === "late_wave" ? "border-yellow-500/30" : saturation.stage === "saturated" || saturation.stage === "declining" ? "border-red-500/30" : "border-blue-500/30"}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600/20 to-blue-500/20 border border-cyan-500/20">
              <Waves className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">📊 Market Stage Detection</h3>
              <Badge variant={saturation.stage === "breakout" ? "success" : saturation.stage === "late_wave" ? "warning" : saturation.stage === "saturated" || saturation.stage === "declining" ? "destructive" : "info"} className="mt-1">
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
                className={`h-full rounded-full ${saturation.saturationScore > 60 ? "bg-red-500" : saturation.saturationScore > 35 ? "bg-yellow-500" : "bg-green-500"}`}
                style={{ width: `${saturation.saturationScore}%` }}
              />
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-white mb-3">Action: <Badge variant={saturation.action === "enter_now" ? "success" : saturation.action === "test_fast" ? "info" : saturation.action === "bend_first" ? "warning" : "destructive"}>{actionLabel(saturation.action)}</Badge></h4>
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
      <Card className={`border ${blueOcean.label === "blue_ocean" ? "border-blue-500/30" : blueOcean.label === "emerging_gap" ? "border-green-500/30" : blueOcean.label === "competitive" ? "border-yellow-500/30" : "border-red-500/30"}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-blue-500/20">
              <Award className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">🌊 Blue Ocean Gap Analysis</h3>
              <Badge variant={blueOcean.label === "blue_ocean" ? "success" : blueOcean.label === "emerging_gap" ? "info" : blueOcean.label === "competitive" ? "warning" : "destructive"} className="mt-1">
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
                className={`h-full rounded-full ${blueOcean.blueOceanScore >= 75 ? "bg-blue-500" : blueOcean.blueOceanScore >= 55 ? "bg-green-500" : blueOcean.blueOceanScore >= 35 ? "bg-yellow-500" : "bg-red-500"}`}
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

function NicheBendsTab({ result }: { result: AnalysisResult }) {
  const bends = result.nicheBends;
  if (bends.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="border-dark-700/50">
          <CardContent className="p-6">
            <p className="text-muted-foreground">Niche bend proposals will appear here after running the analysis with a creator profile.</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {bends.map((bend, i) => (
        <Card key={i} className={`border-dark-700/50 ${i === 0 ? "ring-1 ring-yellow-500/30" : ""}`}>
          <CardContent className="p-6">
            {i === 0 && <Badge variant="warning" className="mb-4">🏆 Top Pick</Badge>}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{bend.title}</h3>
                <p className="text-sm text-muted-foreground">{bend.targetNiche} • {bend.format}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">{bend.opportunityScore}</div>
                <div className="text-xs text-muted-foreground">Score</div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {[
                { label: "Bend Type", value: bend.bendType },
                { label: "Target Niche", value: bend.targetNiche },
                { label: "Difficulty", value: `${bend.executionDifficulty}/10` },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-xl bg-dark-800/50">
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                  <div className="text-sm font-medium text-white mt-1">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-white mb-2">Why It Works</h4>
              <ul className="space-y-1">
                {bend.whyItCanWork.map((w, j) => (
                  <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span> {w}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-white mb-2">🎬 First 5 Videos</h4>
              <div className="space-y-2">
                {bend.firstFiveVideoIdeas.map((video, j) => (
                  <div key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-red-400 mt-0.5">›</span>
                    {video}
                  </div>
                ))}
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
              <div className="p-3 rounded-xl bg-dark-800/50 font-mono text-sm text-muted-foreground">{dna.titlePattern}</div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Hook Pattern</h4>
              <div className="p-3 rounded-xl bg-dark-800/50 font-mono text-sm text-cyan-400">{dna.hookPattern}</div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Script Structure</h4>
              <div className="space-y-2">
                {dna.structure.map((beat, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-dark-800/50">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold flex-shrink-0">{i + 1}</div>
                    <div>
                      <div className="text-sm font-medium text-white">{beat.beat}</div>
                      <div className="text-xs text-muted-foreground">{beat.purpose}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Reusable Skeleton</h4>
              <pre className="p-4 rounded-xl bg-dark-900 border border-dark-600 text-xs text-muted-foreground font-mono whitespace-pre-wrap overflow-x-auto">{dna.reusableSkeleton}</pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TestPlanTab({ result }: { result: AnalysisResult }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="border-dark-700/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600/20 to-green-500/20 border border-emerald-500/20">
              <BookOpen className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">🧪 Test Plan</h3>
              <p className="text-sm text-muted-foreground">Low-cost validation before full commitment</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-dark-800/50">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-sm text-muted-foreground">Budget</div>
              <div className="text-sm font-medium text-white mt-1">{result.testPlan.budget}</div>
            </div>
            <div className="p-4 rounded-xl bg-dark-800/50">
              <div className="text-2xl mb-2">⏱️</div>
              <div className="text-sm text-muted-foreground">Duration</div>
              <div className="text-sm font-medium text-white mt-1">{result.testPlan.duration}</div>
            </div>
            <div className="p-4 rounded-xl bg-dark-800/50">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-sm text-muted-foreground">First 5 Videos</div>
              <div className="text-sm font-medium text-white mt-1">{result.testPlan.firstFiveVideos.length} planned</div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-white mb-3">📹 Test Videos</h4>
            <div className="space-y-2">
              {result.testPlan.firstFiveVideos.map((video, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/50">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold flex-shrink-0">{i + 1}</div>
                  <span className="text-sm text-muted-foreground">{video}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-white mb-3">✅ Success Criteria</h4>
            <div className="space-y-2">
              {result.testPlan.successCriteria.map((c, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-dark-800/50">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">⛔ Stop Criteria (When to Pivot)</h4>
            <div className="space-y-2">
              {result.testPlan.stopCriteria.map((c, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-dark-800/50">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ExecutionPlanTab({ result }: { result: AnalysisResult }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="border-dark-700/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-blue-500/20">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">📋 Execution Plan</h3>
              <p className="text-sm text-muted-foreground">Timeline from setup to monetization</p>
            </div>
          </div>
          <div className="space-y-3">
            {result.executionPlan.map((step, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-dark-800/50">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/10 text-red-400 text-sm font-bold flex-shrink-0">{i + 1}</div>
                <span className="text-sm text-muted-foreground">{step}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function RisksTab({ result }: { result: AnalysisResult }) {
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
          <div className="space-y-4">
            {result.risks.map((risk, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-dark-800/50">
                <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{risk}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────

function getScoreBorder(rec: string): string {
  switch (rec) {
    case "build": return "border-green-500/50";
    case "test": return "border-yellow-500/50";
    case "bend_first": return "border-orange-500/50";
    case "avoid": return "border-red-500/50";
    default: return "border-dark-700/50";
  }
}

function getScoreBadgeVariant(rec: string): "success" | "warning" | "destructive" | "info" {
  switch (rec) {
    case "build": return "success";
    case "test": return "warning";
    case "bend_first": return "warning";
    case "avoid": return "destructive";
    default: return "info";
  }
}

function recommendationLabel(rec: string): string {
  switch (rec) {
    case "build": return "✅ Build — Full Production";
    case "test": return "🟡 Test — 3-5 Videos First";
    case "bend_first": return "🟠 Bend First — Differentiate";
    case "avoid": return "🔴 Avoid — High Risk";
    default: return rec;
  }
}

function stageLabel(stage: string): string {
  const labels: Record<string, string> = { too_early: "🟦 Too Early", breakout: "🟩 Breakout", late_wave: "🟨 Late Wave", saturated: "🟥 Saturated", declining: "⬛ Declining" };
  return labels[stage] || stage;
}

function stageShortLabel(stage: string): string {
  const labels: Record<string, string> = { too_early: "Too Early", breakout: "Breakout", late_wave: "Late Wave", saturated: "Saturated", declining: "Declining" };
  return labels[stage] || stage;
}

function oceanLabel(ocean: string): string {
  const labels: Record<string, string> = { blue_ocean: "🌊 Blue Ocean", emerging_gap: "🟢 Emerging Gap", competitive: "🟡 Competitive", red_ocean: "🔴 Red Ocean" };
  return labels[ocean] || ocean;
}

function oceanShortLabel(ocean: string): string {
  const labels: Record<string, string> = { blue_ocean: "Blue Ocean", emerging_gap: "Emerging Gap", competitive: "Competitive", red_ocean: "Red Ocean" };
  return labels[ocean] || ocean;
}

function actionLabel(action: string): string {
  const labels: Record<string, string> = { enter_now: "Enter Now", test_fast: "Test Fast", bend_first: "Bend First", avoid: "Avoid" };
  return labels[action] || action;
}
