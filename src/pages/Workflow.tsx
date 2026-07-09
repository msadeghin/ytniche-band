import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Youtube, Search, Link2, Hash, ArrowRight, Loader2,
  Sparkles, Globe, Zap, AlertCircle, Brain, Target,
  DollarSign, Heart, Lightbulb, Trophy, Pen, User,
  Play, Eye, BarChart3, ExternalLink, Shield,
  Key, Wifi, Cookie, Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { runLocalAnalysis } from '@/lib/analysis/runAnalysis';
import { saveAnalysis } from '@/lib/storage/analysisStore';
import { getLocalRuntimeConfig } from '@/lib/config/localRuntimeConfig';
import type { AnalysisMode } from '@/lib/analysis/types';

const LOCAL_SERVER = "http://localhost:8787";

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

interface CreatorProfileState {
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

const initialProfile: CreatorProfileState = {
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
  const [selectedMode, setSelectedMode] = useState<AnalysisMode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState<CreatorProfileState>(initialProfile);
  const [cookieModal, setCookieModal] = useState<{ show: boolean; message: string }>({ show: false, message: "" });
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);

  // Check local server status
  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch(`${LOCAL_SERVER}/api/health`, { signal: AbortSignal.timeout(2000) });
        setServerOnline(res.ok);
      } catch {
        setServerOnline(false);
      }
    };
    checkServer();
  }, []);

  const handleStartAnalysis = async () => {
    if (!selectedMode) return;

    // Validate input
    if (selectedMode !== 'auto' && !inputValue.trim()) {
      setError('Please enter a channel URL, video URL, or keyword to analyze.');
      return;
    }
    if (selectedMode === 'auto' && !profile.topics && !profile.interests && !profile.skills) {
      // AUTO mode can run with default seed, just warn
      // proceed anyway
    }

    setError(null);
    setIsAnalyzing(true);

    setError(null);
    setIsAnalyzing(true);

    // For channel/video URLs, check if local server has cookies
    const isYouTubeUrl =
      (selectedMode === "channel" || selectedMode === "video") &&
      (inputValue.trim().includes("youtube.com") || inputValue.trim().includes("youtu.be") || inputValue.trim().startsWith("@"));

    if (isYouTubeUrl && serverOnline) {
      try {
        const cookieRes = await fetch(`${LOCAL_SERVER}/api/cookies/status`, {
          signal: AbortSignal.timeout(3000),
        });
        if (cookieRes.ok) {
          const cookieData = await cookieRes.json();
          if (!cookieData.configured) {
            // Show cookie modal instead of blocking entirely
            setCookieModal({
              show: true,
              message: "For real YouTube metadata, upload cookies.txt. Click 'Upload Cookies' or continue with heuristic analysis.",
            });
            // Still proceed with heuristic
          }
        }
      } catch {
        // Server not responding — proceed with heuristic
      }
    }

    try {
      const result = await runLocalAnalysis({
        mode: selectedMode,
        input: inputValue.trim(),
        profile,
        createdAt: new Date().toISOString(),
      });

      saveAnalysis(result);
      navigate(`/results/${result.id}`);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setError(err?.message || 'Analysis failed unexpectedly. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Runtime config for status badges
  const runtimeConfig = (() => {
    try {
      return getLocalRuntimeConfig();
    } catch {
      return { noKeyMode: true, enableYtDlp: false, enableCookies: false, youtubeApiKeyAvailable: false };
    }
  })();

  const getPlaceholder = () => {
    switch (selectedMode) {
      case 'channel': return 'e.g., https://youtube.com/@channelname';
      case 'video': return 'e.g., https://youtube.com/watch?v=...';
      case 'keyword': return 'e.g., AI tools, true crime, side hustles';
      default: return '';
    }
  };

  const updateProfile = (field: keyof CreatorProfileState, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const profileFields: { key: keyof CreatorProfileState; label: string; icon: typeof Brain; placeholder: string }[] = [
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
            Choose your starting point and we'll run the full research pipeline in seconds
          </p>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="border-red-500/30 bg-red-500/5">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-xs text-muted-foreground hover:text-white"
                >
                  Dismiss
                </button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Cookie Modal */}
        {cookieModal.show && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="border-orange-500/30 bg-orange-500/5">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Cookie className="w-6 h-6 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white mb-1">🍪 Cookies Not Configured</h4>
                    <p className="text-sm text-orange-300/80 mb-3">{cookieModal.message}</p>
                    <div className="flex gap-2 flex-wrap">
                      <Link to="/cookie-setup">
                        <Button variant="gradient" size="sm">
                          <Upload className="w-3 h-3 mr-1" />
                          Upload Cookies
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCookieModal({ show: false, message: "" })}
                        className="text-muted-foreground"
                      >
                        Dismiss — Use Heuristic
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Cookie Setup Banner (when server online + cookies missing) */}
        {serverOnline === true && runtimeConfig.noKeyMode && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Link to="/cookie-setup">
              <Card className="border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-all cursor-pointer">
                <CardContent className="p-3 flex items-center gap-3">
                  <Cookie className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <p className="text-xs text-amber-300/80 flex-1">
                    Cookies not configured — upload cookies.txt for real YouTube metadata
                  </p>
                  <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400">
                    Setup Cookies
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        )}

        {/* Runtime Status Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex flex-wrap gap-2 mb-6 justify-center"
        >
          {runtimeConfig.noKeyMode ? (
            <Badge variant="outline" className="px-3 py-1 text-xs border-amber-500/30 text-amber-400 bg-amber-500/5">
              <Key className="w-3 h-3 mr-1" />
              No-Key Mode
            </Badge>
          ) : (
            <Badge variant="outline" className="px-3 py-1 text-xs border-green-500/30 text-green-400 bg-green-500/5">
              <Shield className="w-3 h-3 mr-1" />
              YouTube API Enabled
            </Badge>
          )}
          {runtimeConfig.enableYtDlp ? (
            <Badge variant="outline" className="px-3 py-1 text-xs border-cyan-500/30 text-cyan-400 bg-cyan-500/5">
              <Wifi className="w-3 h-3 mr-1" />
              yt-dlp Local Enabled
            </Badge>
          ) : (
            <Badge variant="outline" className="px-3 py-1 text-xs border-dark-600 text-muted-foreground bg-dark-800/30">
              <Wifi className="w-3 h-3 mr-1" />
              yt-dlp Disabled
            </Badge>
          )}
          {runtimeConfig.enableCookies ? (
            <Badge variant="outline" className="px-3 py-1 text-xs border-orange-500/30 text-orange-400 bg-orange-500/5">
              <Cookie className="w-3 h-3 mr-1" />
              Cookies Enabled (local-only)
            </Badge>
          ) : (
            <Badge variant="outline" className="px-3 py-1 text-xs border-dark-600 text-muted-foreground bg-dark-800/30">
              <Cookie className="w-3 h-3 mr-1" />
              Cookies Disabled
            </Badge>
          )}
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
                  setError(null);
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

        {/* Input Section (for channel, video, keyword modes) */}
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
                    onKeyDown={(e) => e.key === 'Enter' && handleStartAnalysis()}
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
                <p className="text-muted-foreground mb-3 max-w-md mx-auto">
                  We'll analyze your creator profile to find the best faceless niche opportunities for you.
                </p>
                <p className="text-xs text-muted-foreground mb-6">
                  Fill in your profile below or just click Analyze to start with a default seed.
                </p>
                <Button
                  variant="gradient"
                  size="lg"
                  disabled={isAnalyzing}
                  onClick={handleStartAnalysis}
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

        {/* Quick tips + Demo Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 space-y-4"
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
                    <li>• Analysis runs locally in your browser — your data stays on your device</li>
                    <li>• Results are saved to localStorage and shown on the Dashboard</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo link */}
          <Link to="/results/demo">
          <Button variant="outline" size="sm" className="w-full text-muted-foreground">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Demo Report (pre-built sample)
          </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

