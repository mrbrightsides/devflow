'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Code2, 
  GitBranch, 
  TestTube, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Sparkles,
  Github,
  Play
} from 'lucide-react';
import Link from 'next/link';
import { HeroSection } from '@/components/hero-section';
import { FeaturesGrid } from '@/components/features-grid';
import { EnhancedLiveActivityFeed } from '@/components/enhanced-live-activity-feed';
import { StatsSection } from '@/components/stats-section';
import { ArchitectureDiagram } from '@/components/architecture-diagram';
import { DemoSection } from '@/components/demo-section';
import { MobileNav } from '@/components/mobile-nav';
import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { useAddMiniApp } from "@/hooks/useAddMiniApp";
import { useQuickAuth } from "@/hooks/useQuickAuth";
import { useIsInFarcaster } from "@/hooks/useIsInFarcaster";

export default function Home() {
    const { addMiniApp } = useAddMiniApp();
    const isInFarcaster = useIsInFarcaster()
    useQuickAuth(isInFarcaster)
    useEffect(() => {
      const tryAddMiniApp = async () => {
        try {
          await addMiniApp()
        } catch (error) {
          console.error('Failed to add mini app:', error)
        }

      }

    

      tryAddMiniApp()
    }, [addMiniApp])
    useEffect(() => {
      const initializeFarcaster = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 100))
          
          if (document.readyState !== 'complete') {
            await new Promise<void>(resolve => {
              if (document.readyState === 'complete') {
                resolve()
              } else {
                window.addEventListener('load', () => resolve(), { once: true })
              }

            })
          }

    

          await sdk.actions.ready()
          console.log('Farcaster SDK initialized successfully - app fully loaded')
        } catch (error) {
          console.error('Failed to initialize Farcaster SDK:', error)
          
          setTimeout(async () => {
            try {
              await sdk.actions.ready()
              console.log('Farcaster SDK initialized on retry')
            } catch (retryError) {
              console.error('Farcaster SDK retry failed:', retryError)
            }

          }, 1000)
        }

      }

    

      initializeFarcaster()
    }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">DevFlow.AI</span>
            <Badge variant="outline" className="ml-2 border-blue-500 text-blue-400">
              v1.0
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <MobileNav />
            <Link href="/dashboard" className="hidden md:block">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                <Activity className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="hidden md:flex border-slate-600 text-slate-900 bg-white hover:bg-slate-100"
              asChild
            >
              <a href="https://github.com/mrbrightsides" target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Features Grid */}
      <FeaturesGrid />

      {/* Architecture Diagram */}
      <ArchitectureDiagram />

      {/* Live Activity Feed */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-purple-500 text-purple-400">
              Live Demo
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              See DevFlow in Action
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Watch how DevFlow autonomously detects, fixes, tests, and commits code changes in real-time
            </p>
          </div>
          
          <EnhancedLiveActivityFeed />
        </div>
      </section>

      {/* Demo Video Section */}
      <DemoSection />

      {/* How It Works */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-green-500 text-green-400">
              Getting Started
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              Start in Minutes
            </h2>
          </div>

          <Tabs defaultValue="install" className="max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800">
              <TabsTrigger value="install">Install</TabsTrigger>
              <TabsTrigger value="config">Configure</TabsTrigger>
              <TabsTrigger value="run">Run</TabsTrigger>
            </TabsList>
            
            <TabsContent value="install" className="space-y-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Installation</CardTitle>
                  <CardDescription>Set up DevFlow.AI in your project</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto">
                    <code className="text-green-400 text-sm">
{`# Clone the repository
git clone https://github.com/mrbrightsides/devflow.git
cd devflow

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Add your OpenAI API key to .env`}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="config" className="space-y-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Configuration</CardTitle>
                  <CardDescription>Customize DevFlow for your workflow</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto">
                    <code className="text-blue-400 text-sm">
{`# config.yaml
devflow:
  project_path: "./your-project"
  
  llm:
    model: "gpt-4-turbo-preview"
    temperature: 0.2
  
  git:
    auto_commit: true
    auto_push: false
  
  safety:
    rollback_on_failure: true`}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="run" className="space-y-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Run DevFlow</CardTitle>
                  <CardDescription>Start the autonomous agent</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto">
                    <code className="text-purple-400 text-sm">
{`# Watch mode (continuous monitoring)
python main.py --project ./your-project --watch

# Single file check
python main.py --file ./path/to/file.py

# View dashboard
# Open http://localhost:5000 in your browser`}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-500/50">
            <CardContent className="pt-12 pb-12">
              <Sparkles className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-white mb-4">
                Stop Debugging. Start Building.
              </h2>
              <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                Join the future of autonomous software development. Let DevFlow handle the bugs while you focus on creating amazing features.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/dashboard">
                    <Play className="w-5 h-5 mr-2" />
                    Try Demo
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-slate-600 text-slate-900 bg-white hover:bg-slate-100"
                  asChild
                >
                  <a href="https://github.com/mrbrightsides" target="_blank" rel="noopener noreferrer">
                    <Github className="w-5 h-5 mr-2" />
                    View on GitHub
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded"></div>
              <span className="text-slate-400">DevFlow.AI</span>
            </div>
            <p className="text-slate-500 text-sm">
              Built for Galuxium Nexus V1 2025 - Fix the Future of Software Development
            </p>
            <div className="flex items-center gap-4 text-slate-400 text-sm">
              <a href="https://github.com/mrbrightsides/devflow" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Docs</a>
              <a href="https://github.com/mrbrightsides" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
              <a href="http://discordapp.com/users/khudri_61362" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
