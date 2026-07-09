import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Youtube, TrendingUp, Search, Target, Sparkles, Globe,
  Brain, Shield, BarChart3, ArrowRight, CheckCircle2,
  Play, Star, ChevronRight, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function Landing() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[80px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="mb-6">
              <Badge variant="outline" className="px-4 py-2 text-sm border-red-500/30 text-red-400 bg-red-500/5">
                <Sparkles className="w-4 h-4 mr-2" />
                v6 — AI-Powered Niche Discovery
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1]"
            >
              <span className="text-gradient">Discover</span>{' '}
              <br className="sm:hidden" />
              <span className="text-white">Profitable</span>
              <br />
              <span className="text-white">YouTube Niches</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              From prompt to platform. Analyze faceless channels, generate Niche Bends across
              4 axes, validate with real data — all without Claude or NexLev.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/workflow">
                <Button variant="gradient" size="xl" className="group">
                  Start Free Analysis
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="xl">
                  View Dashboard
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
            >
              {[
                { label: 'Bend Axes', value: '4' },
                { label: 'Analysis Phases', value: '6' },
                { label: 'Categories', value: '8' },
                { label: 'Free Tools', value: '100%' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              6 phases of automated niche analysis and discovery
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">              {[
                { phase: '00',
                  icon: Calendar,
                  title: 'Setup',
                  desc: 'Register today\'s date, upload cookies.txt (optional), and choose your analysis mode — AUTO, Channel, Video, or Keyword.',
                },
                {
                  phase: '01',
                  icon: Search,
                  title: 'Niche Discovery',
                  desc: 'Scan channels, apply 3 hard gates (freshness, faceless, quality), and filter out saturated markets.',
                },
                {
                  phase: '02',
                  icon: Brain,
                  title: 'Format Analysis',
                  desc: 'Detect strategy type (FORMAT TREND / MARKET PLAY / HYBRID) and generate 4-axis Niche Bends.',
                },
                {
                  phase: '03',
                  icon: Shield,
                  title: 'Validation',
                  desc: 'Cross-check each bend idea with YouTube data, competition analysis, and trend signals.',
                },
                {
                  phase: '3.5',
                  icon: Target,
                  title: 'Low-Cost Test',
                  desc: 'Plan a $100-$200 test before committing to full production.',
                },
                {
                  phase: '04',
                  icon: BarChart3,
                  title: 'Script DNA',
                  desc: 'Extract hook templates, open loops, payoff structures, and voice rules from top videos.',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.phase}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="group hover:border-red-500/30 transition-all duration-500 h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-600/20 to-orange-500/20 border border-red-500/20">
                          <item.icon className="w-6 h-6 text-red-400" />
                        </div>
                        <span className="text-sm font-mono text-muted-foreground">Phase {item.phase}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-32 border-t border-dark-800/50">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/50 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Everything You Need
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Pure logic analysis engine — no paid APIs, no AI subscriptions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: '4-Axis Niche Bending',
                desc: 'Category, Format, Geography/Language, and Audience Specificity — the complete bending framework from v6.',
                color: 'from-blue-600/20 to-cyan-500/20',
              },
              {
                icon: TrendingUp,
                title: 'Opportunity Scoring',
                desc: 'Algorithmic scoring based on views, revenue, freshness, and category RPM multipliers.',
                color: 'from-green-600/20 to-emerald-500/20',
              },
              {
                icon: Search,
                title: 'YouTube API v3',
                desc: 'Real channel data via free Google API. No NexLev, no Claude, no paid services required.',
                color: 'from-red-600/20 to-orange-500/20',
              },
              {
                icon: Target,
                title: 'Saturation Detection',
                desc: '"Small failed channels" gate identifies hidden saturation that big-competitor checks miss.',
                color: 'from-purple-600/20 to-pink-500/20',
              },
              {
                icon: Shield,
                title: 'Validation Engine',
                desc: 'Competition, demand, and trend checks for every niche bend proposal before commitment.',
                color: 'from-yellow-600/20 to-orange-500/20',
              },
              {
                icon: Brain,
                title: 'Strategy Detection',
                desc: 'Auto-detects FORMAT TREND vs MARKET PLAY vs HYBRID to optimize bending direction.',
                color: 'from-indigo-600/20 to-blue-500/20',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="group h-full hover:border-dark-500/50 transition-all duration-500">
                  <CardContent className="p-6">
                    <div className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} border border-white/5 mb-5 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-t from-red-500/5 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="glow-red-lg rounded-3xl border border-red-500/20 bg-dark-900/50 backdrop-blur-sm p-12 sm:p-16">
              <Youtube className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
                Ready to Find Your Next Niche?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                No Claude, no NexLev, no AI subscriptions. Just pure YouTube data and smart algorithms.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/workflow">
                  <Button variant="gradient" size="xl" className="group">
                    Start Analyzing
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="xl">
                    See Examples
                  </Button>
                </Link>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Free • No sign-up required • YouTube API key optional
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-800/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            YouTube Niche Band v6 — Built with ❤️ for faceless creators
          </p>
        </div>
      </footer>
    </div>
  );
}
