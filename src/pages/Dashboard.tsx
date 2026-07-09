import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BarChart3, TrendingUp, Search, Youtube, Clock,
  ArrowRight, Plus, ExternalLink, Brain, Sparkles, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { listAnalyses } from '@/lib/storage/analysisStore';
import type { AnalysisResult } from '@/lib/analysis/types';

export function Dashboard() {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage
    const saved = listAnalyses();
    setAnalyses(saved);
    setIsLoading(false);
  }, []);

  // Compute stats from saved analyses
  const totalAnalyses = analyses.length;
  const avgScore = totalAnalyses > 0
    ? Math.round(analyses.reduce((sum, a) => sum + a.scores.opportunity, 0) / totalAnalyses)
    : 0;
  const buildCount = analyses.filter((a) => a.scores.recommendation === "build").length;
  const testCount = analyses.filter((a) => a.scores.recommendation === "test").length;

  const stats = [
    { label: 'Analyses Run', value: String(totalAnalyses), icon: BarChart3, change: 'saved locally' },
    { label: 'Avg Opportunity', value: totalAnalyses > 0 ? `${avgScore}%` : '--', icon: Brain, change: totalAnalyses > 0 ? `from ${totalAnalyses} analyses` : 'run your first' },
    { label: 'Build Recs', value: String(buildCount), icon: TrendingUp, change: 'full production' },
    { label: 'Test Recs', value: String(testCount), icon: Sparkles, change: '3-5 videos first' },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Track your niche analyses and discoveries</p>
          </div>
          <div className="flex gap-2">
            <Link to="/results/demo">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Demo
              </Button>
            </Link>
            <Link to="/workflow">
              <Button variant="gradient" size="lg">
                <Plus className="w-4 h-4 mr-2" />
                New Analysis
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border-dark-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600/20 to-orange-500/20 border border-red-500/20">
                      <Icon className="w-5 h-5 text-red-400" />
                    </div>
                    <Badge variant="outline" className="text-[10px] border-dark-600">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Recent Analyses */}
        {analyses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Analyses</h2>
            </div>

            <div className="space-y-4">
              {analyses.slice(0, 10).map((analysis, i) => (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                >
                  <Link to={`/results/${analysis.id}`}>
                    <Card className="border-dark-700/50 hover:border-dark-500/50 transition-all duration-300 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-600/20 to-orange-500/20 border border-red-500/20 group-hover:scale-105 transition-transform">
                              <Search className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-white">{analysis.source.name}</h3>
                                <Badge variant="secondary" className="text-[10px]">{analysis.request.mode}</Badge>
                                <Badge variant={analysis.scores.recommendation === "build" ? "success" : analysis.scores.recommendation === "test" ? "warning" : analysis.scores.recommendation === "avoid" ? "destructive" : "info"} className="text-[10px]">
                                  {analysis.scores.recommendation}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                <span>{analysis.source.category}</span>
                                <span>•</span>
                                <span>{analysis.source.format}</span>
                                <span>•</span>
                                <span className={`font-medium ${analysis.scores.opportunity >= 75 ? "text-green-400" : analysis.scores.opportunity >= 55 ? "text-yellow-400" : "text-red-400"}`}>
                                  Score: {analysis.scores.opportunity}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {new Date(analysis.request.createdAt).toLocaleDateString()}
                            </div>
                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && analyses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-dark-700/50">
              <CardContent className="p-16 text-center">
                <Youtube className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No analyses yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Start your first niche analysis to discover profitable YouTube opportunities, or view the demo to see what a report looks like.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link to="/results/demo">
                    <Button variant="outline" size="lg">
                      <Eye className="w-4 h-4 mr-2" />
                      View Demo
                    </Button>
                  </Link>
                  <Link to="/workflow">
                    <Button variant="gradient" size="lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Start First Analysis
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Loading state */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="border-dark-700/50">
              <CardContent className="p-16 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-red-400 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-muted-foreground">Loading your analyses...</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
