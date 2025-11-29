'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

const steps = [
  { name: 'File Watcher', description: 'Monitors project files', color: 'bg-blue-500' },
  { name: 'Error Detector', description: 'Parses errors & logs', color: 'bg-purple-500' },
  { name: 'Patch Generator', description: 'AI-powered fixes', color: 'bg-pink-500' },
  { name: 'Patch Applier', description: 'Applies changes', color: 'bg-orange-500' },
  { name: 'Test Runner', description: 'Validates fixes', color: 'bg-green-500' },
  { name: 'Git Manager', description: 'Commits changes', color: 'bg-cyan-500' },
  { name: 'Reporter', description: 'Generates reports', color: 'bg-yellow-500' },
];

export function ArchitectureDiagram() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-orange-500 text-orange-400">
            Architecture
          </Badge>
          <h2 className="text-4xl font-bold text-white mb-4">
            Event-Driven Pipeline
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A streamlined pipeline that processes errors from detection to commit in seconds
          </p>
        </div>

        <div className="relative">
          {/* Desktop View */}
          <div className="hidden md:flex items-center justify-between gap-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center flex-1">
                <Card className="bg-slate-800 border-slate-700 hover:bg-slate-700 transition-all duration-300 w-full">
                  <CardContent className="p-4">
                    <div className={`w-2 h-2 ${step.color} rounded-full mb-3`}></div>
                    <h3 className="text-white font-semibold text-sm mb-1">{step.name}</h3>
                    <p className="text-slate-400 text-xs">{step.description}</p>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-slate-600 mx-1 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-3">
            {steps.map((step, index) => (
              <div key={index}>
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`w-3 h-3 ${step.color} rounded-full flex-shrink-0`}></div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-sm">{step.name}</h3>
                      <p className="text-slate-400 text-xs">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div className="w-0.5 h-4 bg-slate-700"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-white mb-6">Built With</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['Python 3.10+', 'OpenAI GPT-4', 'Watchdog', 'GitPython', 'pytest', 'Flask'].map((tech) => (
              <Badge key={tech} variant="outline" className="border-slate-600 text-slate-300 px-4 py-2">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
