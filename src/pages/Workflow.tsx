import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Youtube, Search, Link2, Hash, ArrowRight, Loader2,
  Sparkles, Globe, Zap, AlertCircle, Brain, Target,
  DollarSign, Heart, Lightbulb, Trophy, Pen, User,
  Play, Eye, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const modes = [
  {
    id: 'auto' as const,
    label: 'AUTO',
    title: 'Automatic Discovery',
    icon: Sparkles,
    desc: 'No starting point needed — we find the best opportunities for you',
    gradient: 'from-red-600/20 to-orange-500/20',
    iconColor: 'text-red-400',
  },
  {
    id: 'channel' as const,
    label: 'CHANNEL',
    title: 'Analyze a Channel',
    icon: Youtube,
    desc: 'Paste a YouTube channel URL or handle to analyze its format',
    gradient: 'from-blue-600/20 to-cyan-500/20',
    iconColor: 'text-blue-400',
  },
  {
    id: 'video' as const,
    label: 'VIDEO',
    title: 'Analyze a Video',
    icon: Link2,
    desc: 'Analyze a viral video to understand its format and replicate it',
    gradient: 'from-purple-600/20 to-pink-500/20',
    iconColor: 'text-purple-400',
  },
  {
    id: 'keyword' as const,
    label: 'KEYWORD',
    title: 'Explore a Keyword',
    icon: Hash,
    desc: 'Enter a topic or keyword to discover niche bending opportunities',
    gradient: 'from-green-600/20 to-emerald-500/20',
    iconColor: 'text-green-400',
  },
];

interface UserProfile {
  topics: string;
  interests: string;
  skills: string;
  budget: string;
  preferredFormat: string;
  productionStyle: string;
  language: string;
  goal: string;
  publishingSpeed: string;
  exampleChannels: string;
}

const initialProfile: UserProfile = {
  topics: '',
  interests: '',
  skills: '',
  budget: '',
  preferredFormat: '',
  productionStyle: '',
  language: '',
  goal: '',
  publishingSpeed: '',
  exampleChannels: '',
};

export function Workflow() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<'auto' | 'channel' | 'video' | 'keyword' | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);

  const handleStartAnalysis = async () => {
    if (!selectedMode) return;
    setIsAnalyzing(true);

    // Simulate analysis — in production this calls the Convex action
    setTimeout(() => {
      setIsAnalyzing(false);
      navigate(`/results/demo-${Date.now()}`);
    }, 2000);
  };

  const getPlaceholder = () => {
    switch (selectedMode) {
      case 'channel': return 'e.g., https://youtube.com/@channelname';
      case 'video': return 'e.g., https://youtube.com/watch?v=...';
      case 'keyword': return 'e.g., AI tools, true crime, side hustles';
      default: return '';
    }
  };

  const updateProfile = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const profileFields: { key: keyof UserProfile; label: string; icon: typeof Brain; placeholder: string }[] = [
    { key: 'topics', label: 'Topics You Can Talk About for Hours', icon: Brain, placeholder: 'e.g., History, AI, fitness, investing' },
    { key: 'interests', label: 'Your Interests', icon: Heart, placeholder: 'e.g., Technology, psychology, space' },
    { key: 'skills', label: 'Skills & Background', icon: Trophy, placeholder: 'e.g., Animation, writing, coding, finance' },
    { key: 'budget', label: 'Monthly Budget for Content', icon: DollarSign, placeholder: 'e.g., $200, $500, $1000' },
    { key: 'preferredFormat', label: 'Preferred Format', icon: Play, placeholder: 'Shorts, Long-form, Both' },
    { key: 'productionStyle', label: 'Production Style', icon: Pen, placeholder: 'e.g., AI slideshow, animation, voiceover' },
    { key: 'language', label: 'Preferred Language / Market', icon: Globe, placeholder: 'e.g., English, Spanish, Persian' },
    { key: 'goal', label: 'Your Goal', icon: Target, placeholder: 'e.g., Cashflow, Asset resale, Portfolio, Learning' },
    { key: 'publishingSpeed', label: 'Publishing Speed', icon: BarChart3, placeholder: 'e.g., Daily, 3x/week, Weekly, Bi-weekly' },
    { key: 'exampleChannels', label: 'Example Channels You Like', icon: Eye, placeholder: 'e.g., @channel1, @channel2 (comma separated)' },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="px-4 py-2 text-sm border-red-500/30 text-red-400 bg-red-500/5 mb-4">
            <Zap className="w-4 h-4 mr-2" />
            6-Phase Analysis + Transcript Engine
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            Start{' '}
            <span className="text-gradient">Niche Analysis</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose your starting point and we'll guide you through all 6 phases with our transcript-based research engine
          </p>
        </motion.div>

        {/* Mode Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
        >
          {modes.map((mode) => {
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setSelectedMode(mode.id);
                  setInputValue('');
                }}
                className={`relative group text-left p-6 rounded-2xl border transition-all duration-300 ${
                  isSelected
                    ? 'border-red-500/50 bg-dark-800/80 shadow-lg shadow-red-500/10'
                    : 'border-dark-700/50 bg-dark-900/30 hover:border-dark-500/50 hover:bg-dark-800/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${mode.gradient} border border-white/5 flex-shrink-0`}>
                    <mode.icon className={`w-6 h-6 ${mode.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{mode.label}</span>
                      {isSelected && (
                        <Badge variant="success" className="text-[10px] px-1.5 py-0">Selected</Badge>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-white">{mode.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{mode.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </motion.div>

        {/* Input Section */}
        {selectedMode && selectedMode !== 'auto' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-dark-700/50">
              <CardContent className="p-6">
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  {selectedMode === 'channel' ? 'Channel URL or Handle' :
                   selectedMode === 'video' ? 'Video URL' :
                   'Keyword or Topic'}
                </label>
                <div className="flex gap-3">
                  <Input
                    placeholder={getPlaceholder()}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="gradient"
                    disabled={!inputValue || isAnalyzing}
                    onClick={handleStartAnalysis}
                  >
                    {isAnalyzing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4 mr-2" />
                    )}
                    Analyze
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* AUTO mode CTA */}
        {selectedMode === 'auto' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-dark-700/50">
              <CardContent className="p-8 text-center">
                <Globe className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Automatic Discovery</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We'll search across 5+ high-RPM categories to find the best faceless niche opportunities for you.
                </p>
                <Button
                  variant="gradient"
                  size="lg"
                  disabled={isAnalyzing}
                  onClick={() => setShowProfile(true)}
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Start Auto Discovery
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* User Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={showProfile || selectedMode ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="mb-8"
        >
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="w-full text-left mb-4"
          >
            <Card className={`border ${showProfile ? 'border-amber-500/30' : 'border-dark-700/50'} bg-dark-900/30 hover:bg-dark-800/30 transition-all`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-medium text-white">Your Creator Profile (Optional — improves recommendations)</span>
                </div>
                <Badge variant="outline" className="text-xs">{showProfile ? 'Hide' : 'Fill In'}</Badge>
              </CardContent>
            </Card>
          </button>

          {showProfile && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profileFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <field.icon className="w-3.5 h-3.5 text-amber-400/70" />
                    {field.label}
                  </label>
                  <Input
                    placeholder={field.placeholder}
                    value={profile[field.key]}
                    onChange={(e) => updateProfile(field.key, e.target.value)}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <Card className="border-dark-800/50 bg-dark-900/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Quick Tips</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• For best results, use "Channel" mode with a successful faceless channel URL</li>
                    <li>• Fill in your Creator Profile for personalized niche bending recommendations</li>
                    <li>• Our transcript-derived research engine provides rule-based analysis without AI costs</li>
                    <li>• Analysis takes ~30 seconds to complete all 6 phases</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
