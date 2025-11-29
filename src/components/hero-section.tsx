'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 blur-3xl"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge variant="outline" className="mb-6 border-blue-500 text-blue-400 px-4 py-2">
              <Sparkles className="w-3 h-3 mr-2" />
              Galuxium Nexus V1 2025 Submission
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Autonomous Debugging
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              That Never Sleeps
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            DevFlow.AI continuously monitors your codebase, detects bugs, generates patches, 
            runs tests, and commits fixes — completely automatically.
          </motion.p>

          {/* Stats */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div>
              <div className="text-3xl font-bold text-blue-400">40-60%</div>
              <div className="text-slate-400 text-sm">Time Saved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">24/7</div>
              <div className="text-slate-400 text-sm">Monitoring</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400">85%+</div>
              <div className="text-slate-400 text-sm">Fix Success Rate</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                document.getElementById('demo-video')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'center'
                });
              }}
            >
              <Zap className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
            <Button size="lg" variant="outline" className="border-slate-600 text-slate-900 bg-white hover:bg-slate-100" asChild>
              <a href="https://github.com/mrbrightsides/devflow" target="_blank" rel="noopener noreferrer">
                View Documentation
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
          </motion.div>

          {/* Code Preview */}
          <motion.div 
            className="mt-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-left shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-slate-400 text-sm ml-4">terminal</span>
              </div>
              <pre className="text-sm overflow-x-auto">
                <code>
                  <span className="text-blue-400">$</span> <span className="text-white">python main.py --watch</span>{'\n'}
                  <span className="text-green-400">🔍 Monitoring: ./your-project</span>{'\n'}
                  <span className="text-yellow-400">🔧 Change detected: calculator.py</span>{'\n'}
                  <span className="text-red-400">❌ Error: ZeroDivisionError at line 42</span>{'\n'}
                  <span className="text-purple-400">🤖 Generating patch... (confidence: 92%)</span>{'\n'}
                  <span className="text-green-400">✅ Patch applied successfully</span>{'\n'}
                  <span className="text-blue-400">🧪 Running tests... All passed!</span>{'\n'}
                  <span className="text-green-400">📝 Committed: [DevFlow] fix: handle zero division</span>{'\n'}
                  <span className="text-white">✨ Fix completed in 3.2s</span>
                </code>
              </pre>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
