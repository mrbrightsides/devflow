'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Zap, 
  TestTube, 
  GitBranch, 
  FileSearch, 
  Shield,
  Clock,
  TrendingUp,
  Sparkles,
  Brain
} from 'lucide-react';

const features = [
  {
    icon: Eye,
    title: 'Real-Time Monitoring',
    description: 'Watches your codebase 24/7 using intelligent file system monitoring. Detects changes instantly.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  {
    icon: Brain,
    title: 'AI-Powered Patching',
    description: 'Uses GPT-4 to understand errors and generate context-aware patches with high accuracy.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20'
  },
  {
    icon: TestTube,
    title: 'Automated Testing',
    description: 'Runs your test suite after every patch to ensure fixes don\'t break existing functionality.',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20'
  },
  {
    icon: GitBranch,
    title: 'Git Integration',
    description: 'Automatically commits fixes with semantic messages and manages branches intelligently.',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20'
  },
  {
    icon: Shield,
    title: 'Safety First',
    description: 'Rollback on test failures, confidence scoring, and human-in-the-loop for critical files.',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20'
  },
  {
    icon: FileSearch,
    title: 'Error Detection',
    description: 'Parses syntax errors, test failures, and build errors with detailed traceback analysis.',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20'
  },
  {
    icon: Clock,
    title: 'Daily Reports',
    description: 'Comprehensive reports showing all fixes, success rates, and time saved.',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20'
  },
  {
    icon: TrendingUp,
    title: 'Continuous Learning',
    description: 'Improves over time by learning from successful patches and team patterns.',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20'
  }
];

export function FeaturesGrid() {
  return (
    <section className="py-20 px-4 bg-slate-900/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-blue-500 text-blue-400">
            Features
          </Badge>
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything You Need for Autonomous Debugging
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            DevFlow.AI combines cutting-edge AI with robust engineering practices to deliver a complete autonomous debugging solution.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className={`bg-slate-800/50 border ${feature.borderColor} hover:bg-slate-800 transition-all duration-300 hover:scale-105`}
              >
                <CardHeader>
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-500/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <CardTitle className="text-white">Multi-Language</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm">
                Support for Python, JavaScript, TypeScript, and more languages coming soon.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-500/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                <CardTitle className="text-white">Lightning Fast</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm">
                Average fix time of 3-5 seconds. Handles multiple files simultaneously.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-500/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                <CardTitle className="text-white">Production Ready</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm">
                Battle-tested safety features ensure your code remains stable and secure.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
