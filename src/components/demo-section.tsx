'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export function DemoSection() {
  const VIDEO_URL = 'https://www.youtube.com/embed/9tMnq7SSAes?si=upPm9AMINyYnTj_X';
  
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="demo-video" className="py-20 px-4 bg-slate-900/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-red-500 text-red-400">
            Demo Video
          </Badge>
          <h2 className="text-4xl font-bold text-white mb-4">
            Watch DevFlow in Action
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            See how DevFlow autonomously detects, patches, tests, and commits fixes in real-time
          </p>
        </div>

        <Card className="bg-slate-800 border-slate-700 overflow-hidden">
          <CardContent className="p-0">
            {/* Video Player or Placeholder */}
            <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-slate-800">
              {VIDEO_URL ? (
                // Video Embed (YouTube/Loom/etc)
                <>
                  <iframe
                    src={VIDEO_URL}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 left-4 flex gap-2 z-10">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </>
              ) : (
                // Placeholder when no video
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-blue-700 transition-colors cursor-pointer">
                      <Play className="w-10 h-10 text-white ml-1" />
                    </div>
                    <p className="text-slate-400">Demo Video Coming Soon</p>
                    <p className="text-slate-500 text-sm mt-2">2-5 minute walkthrough</p>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>

                  {/* Video details */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-semibold mb-1">DevFlow.AI - Complete Walkthrough</h3>
                          <p className="text-slate-400 text-sm">Live demonstration of autonomous debugging</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-slate-600 text-slate-900 bg-white hover:bg-slate-100">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Full Screen
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Video highlights */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-blue-400 font-semibold mb-2">00:00 - 01:30</div>
              <h3 className="text-white font-semibold mb-1">Problem Statement</h3>
              <p className="text-slate-400 text-sm">
                Understanding the debugging problem and why DevFlow matters
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-purple-400 font-semibold mb-2">01:30 - 04:00</div>
              <h3 className="text-white font-semibold mb-1">Live Demo</h3>
              <p className="text-slate-400 text-sm">
                Watch DevFlow detect, patch, test, and commit fixes automatically
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-green-400 font-semibold mb-2">04:00 - 05:00</div>
              <h3 className="text-white font-semibold mb-1">Impact & Future</h3>
              <p className="text-slate-400 text-sm">
                Scalability, real-world impact, and roadmap for the future
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
