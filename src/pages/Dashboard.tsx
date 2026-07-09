import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BarChart3, TrendingUp, Search, Youtube, Clock,
  ArrowRight, Plus, ExternalLink, Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Demo data
const demoAnalyses = [
  {
    id: 'demo-1',
    mode: 'Channel',
    channelName: 'VisualMind AI',
    category: 'Education & Science',
    format: 'Explainer',
    score: 82,
    date: '2 hours ago',
    status: 'completed' as const,
  },
  {
    id: 'demo-2',
    mode: 'Keyword',
    channelName: 'Finance Explored',
    category: 'Finance & Business',
    format: 'Storytelling',
    score: 91,
    date: '1 day ago',
    status: 'completed' as const,
  },
  {
    id: 'demo-3',
    mode: 'Auto',
    channelName: 'Auto Discovery',
    category: 'Multiple',
    format: 'Varied',
    score: 0,
    date: '3 days ago',
    status: 'completed' as const,
  },
];

const stats = [
  { label: 'Analyses Run', value: '12', icon: BarChart3, change: '+3 this week' },
  { label: 'Niches Discovered', value: '36', icon: TrendingUp, change: '12 new bends' },
  { label: 'Categories Explored', value: '6', icon: Youtube, change: '2 untouched' },
  { label: 'Avg Opportunity', value: '78%', icon: Brain, change: '+5% vs last month' },
];

export function Dashboard() {
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
          <Link to="/workflow">
            <Button variant="gradient" size="lg">
              <Plus className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        >
          {stats.map((stat) => (
            <Card key={stat.label} className="border-dark-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600/20 to-orange-500/20 border border-red-500/20">
                    <stat.icon className="w-5 h-5 text-red-400" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-dark-600">
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Recent Analyses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Analyses</h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {demoAnalyses.map((analysis, i) => (
              <motion.div
                key={analysis.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
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
                              <h3 className="font-semibold text-white">{analysis.channelName}</h3>
                              <Badge variant="secondary" className="text-[10px]">{analysis.mode}</Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                              <span>{analysis.category}</span>
                              <span>•</span>
                              <span>{analysis.format}</span>
                              {analysis.score > 0 && (
                                <>
                                  <span>•</span>
                                  <span className={`font-medium ${analysis.score >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                                    Score: {analysis.score}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {analysis.date}
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

        {/* Empty State */}
        {demoAnalyses.length === 0 && (
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
                  Start your first niche analysis to discover profitable YouTube opportunities.
                </p>
                <Link to="/workflow">
                  <Button variant="gradient" size="lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Start First Analysis
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
