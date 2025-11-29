'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import type { SuccessMetrics as SuccessMetricsType } from '@/lib/analytics';

interface SuccessMetricsProps {
  metrics: SuccessMetricsType;
  detailed?: boolean;
}

export function SuccessMetrics({ metrics, detailed = false }: SuccessMetricsProps) {
  const getSuccessRateColor = (rate: number): string => {
    if (rate >= 80) return 'text-green-400';
    if (rate >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getSuccessRateLabel = (rate: number): string => {
    if (rate >= 80) return 'Excellent';
    if (rate >= 60) return 'Good';
    return 'Fair';
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-400" />
          Success Metrics
        </CardTitle>
        <CardDescription>Fix success rate and confidence tracking</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Overall Success Rate */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Overall Success Rate</span>
            <Badge variant="outline" className={getSuccessRateColor(metrics.successRate)}>
              {getSuccessRateLabel(metrics.successRate)}
            </Badge>
          </div>
          <div className="relative">
            <div className="h-4 bg-gray-900 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ease-out rounded-full ${
                  metrics.successRate >= 80
                    ? 'bg-gradient-to-r from-green-600 to-green-400'
                    : metrics.successRate >= 60
                    ? 'bg-gradient-to-r from-yellow-600 to-yellow-400'
                    : 'bg-gradient-to-r from-orange-600 to-orange-400'
                }`}
                style={{ width: `${metrics.successRate}%` }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white drop-shadow-md">
                {metrics.successRate.toFixed(1)}%
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Based on fixes with 70%+ confidence
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 text-center">
            <div className="text-2xl font-bold text-blue-400">{metrics.totalFixes}</div>
            <div className="text-xs text-gray-500 mt-1">Total Fixes</div>
          </div>
          
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 text-center">
            <div className="text-2xl font-bold text-green-400">
              {(metrics.avgConfidence * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">Avg Confidence</div>
          </div>
          
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 text-center">
            <div className="text-2xl font-bold text-green-400">{metrics.highConfidenceFixes}</div>
            <div className="text-xs text-gray-500 mt-1">High Confidence</div>
          </div>
          
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 text-center">
            <div className="text-2xl font-bold text-yellow-400">{metrics.mediumConfidenceFixes}</div>
            <div className="text-xs text-gray-500 mt-1">Medium Confidence</div>
          </div>
        </div>

        {/* Confidence Breakdown */}
        {detailed && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Confidence Breakdown</h4>
            
            {/* High Confidence */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-300">High (≥80%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs text-green-400 border-green-500/30">
                    {metrics.highConfidenceFixes}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {((metrics.highConfidenceFixes / metrics.totalFixes) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{
                    width: `${(metrics.highConfidenceFixes / metrics.totalFixes) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Medium Confidence */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">Medium (50-80%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-500/30">
                    {metrics.mediumConfidenceFixes}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {((metrics.mediumConfidenceFixes / metrics.totalFixes) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 transition-all duration-500"
                  style={{
                    width: `${(metrics.mediumConfidenceFixes / metrics.totalFixes) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Low Confidence */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-gray-300">Low (&lt;50%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs text-red-400 border-red-500/30">
                    {metrics.lowConfidenceFixes}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {((metrics.lowConfidenceFixes / metrics.totalFixes) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-500"
                  style={{
                    width: `${(metrics.lowConfidenceFixes / metrics.totalFixes) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        {!detailed && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-gray-400">High Confidence Fixes</span>
              </div>
              <span className="font-medium text-green-400">
                {metrics.highConfidenceFixes} / {metrics.totalFixes}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
