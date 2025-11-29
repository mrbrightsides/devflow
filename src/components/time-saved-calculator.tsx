'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Zap, TrendingUp, Award } from 'lucide-react';
import type { TimeSavedMetrics } from '@/lib/analytics';
import { formatDuration } from '@/lib/analytics';

interface TimeSavedCalculatorProps {
  timeSaved: TimeSavedMetrics;
}

export function TimeSavedCalculator({ timeSaved }: TimeSavedCalculatorProps) {
  const getProductivityColor = (gain: number): string => {
    if (gain >= 80) return 'text-green-400';
    if (gain >= 60) return 'text-blue-400';
    return 'text-yellow-400';
  };

  const getProductivityLabel = (gain: number): string => {
    if (gain >= 80) return 'Outstanding';
    if (gain >= 60) return 'Excellent';
    return 'Good';
  };

  return (
    <Card className="bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30 border-blue-500/30 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Clock className="h-6 w-6 text-blue-400" />
              Time Saved with AI
            </CardTitle>
            <CardDescription className="text-gray-300">
              Productivity gains from automated debugging
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className={`${getProductivityColor(timeSaved.productivityGain)} border-current text-lg px-4 py-2`}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            {getProductivityLabel(timeSaved.productivityGain)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Total Time Saved */}
          <div className="col-span-1 md:col-span-2 p-6 bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Zap className="h-8 w-8 text-blue-400" />
              <Badge variant="outline" className="text-blue-400 border-blue-500/30">
                Total
              </Badge>
            </div>
            <div className="text-4xl font-bold text-blue-400 mb-1">
              {formatDuration(timeSaved.totalTimeSavedMinutes)}
            </div>
            <div className="text-sm text-gray-400">Time Saved</div>
            <div className="text-xs text-gray-500 mt-2">
              {timeSaved.totalTimeSavedHours.toFixed(1)} hours total
            </div>
          </div>

          {/* Avg Time Per Fix */}
          <div className="p-6 bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-6 w-6 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {formatDuration(timeSaved.avgTimePerFix)}
            </div>
            <div className="text-sm text-gray-400">Per Fix</div>
          </div>

          {/* Productivity Gain */}
          <div className="p-6 bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Award className="h-6 w-6 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400 mb-1">
              {timeSaved.productivityGain.toFixed(0)}%
            </div>
            <div className="text-sm text-gray-400">Faster</div>
          </div>
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Manual Time */}
          <div className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-400">Manual Debugging</span>
              <Badge variant="outline" className="text-xs text-red-400 border-red-500/30">
                Slow
              </Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-red-400">
                {formatDuration(timeSaved.estimatedManualTime)}
              </span>
              <span className="text-xs text-gray-500">estimated</span>
            </div>
          </div>

          {/* AI Time */}
          <div className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-400">With AI Assistant</span>
              <Badge variant="outline" className="text-xs text-green-400 border-green-500/30">
                Fast
              </Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-green-400">
                {formatDuration(timeSaved.estimatedManualTime - timeSaved.totalTimeSavedMinutes)}
              </span>
              <span className="text-xs text-gray-500">actual</span>
            </div>
          </div>
        </div>

        {/* Progress Visualization */}
        <div className="mt-6 p-4 bg-gray-900/30 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Productivity Boost</span>
            <span className="text-sm font-medium text-green-400">
              {timeSaved.productivityGain.toFixed(1)}% improvement
            </span>
          </div>
          <div className="relative h-3 bg-gray-900 rounded-full overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-green-600 via-blue-500 to-purple-500 transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(timeSaved.productivityGain, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            You&apos;re {timeSaved.productivityGain.toFixed(0)}% more productive with AI-powered debugging
          </p>
        </div>

        {/* Fun Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/20">
            <div className="text-lg font-bold text-blue-400">
              ☕ {Math.floor(timeSaved.totalTimeSavedMinutes / 5)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Coffee breaks</div>
          </div>
          <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-500/20">
            <div className="text-lg font-bold text-purple-400">
              🎮 {Math.floor(timeSaved.totalTimeSavedMinutes / 30)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Game sessions</div>
          </div>
          <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/20">
            <div className="text-lg font-bold text-green-400">
              📚 {Math.floor(timeSaved.totalTimeSavedMinutes / 15)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Learning breaks</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
