'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bug, TrendingUp } from 'lucide-react';
import type { BugTypeStatistic } from '@/lib/analytics';
import { getBugTypeColor } from '@/lib/analytics';

interface BugStatisticsChartProps {
  statistics: BugTypeStatistic[];
  totalFixes: number;
  detailed?: boolean;
}

export function BugStatisticsChart({ statistics, totalFixes, detailed = false }: BugStatisticsChartProps) {
  if (statistics.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bug className="h-5 w-5 text-purple-400" />
            Bug Statistics
          </CardTitle>
          <CardDescription>Most common bug types detected</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-500 text-sm">No bug data yet</p>
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...statistics.map(s => s.count));

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Bug className="h-5 w-5 text-purple-400" />
          Bug Statistics
        </CardTitle>
        <CardDescription>
          {statistics.length} bug type{statistics.length !== 1 ? 's' : ''} detected across {totalFixes} fixes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statistics.map((stat, index) => {
            const barWidth = (stat.count / maxCount) * 100;
            const color = getBugTypeColor(stat.type);

            return (
              <div key={stat.type} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-300 truncate">
                      {index + 1}. {stat.type}
                    </span>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {stat.count}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 shrink-0 ml-2">
                    <span>{stat.percentage.toFixed(1)}%</span>
                    {detailed && (
                      <span className="text-green-400">
                        {(stat.avgConfidence * 100).toFixed(0)}% conf
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 ease-out rounded-full"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>

                {detailed && stat.avgConfidence > 0 && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 ml-1">
                    <TrendingUp className="h-3 w-3" />
                    Average confidence: {(stat.avgConfidence * 100).toFixed(1)}%
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {detailed && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">
                  {statistics[0]?.type || 'N/A'}
                </div>
                <div className="text-xs text-gray-500 mt-1">Most Common</div>
              </div>
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <div className="text-2xl font-bold text-green-400">
                  {statistics.reduce((max, s) => s.avgConfidence > max ? s.avgConfidence : max, 0).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">Highest Confidence</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
