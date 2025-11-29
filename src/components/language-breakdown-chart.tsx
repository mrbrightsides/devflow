'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code2, Award } from 'lucide-react';
import type { LanguageStatistic } from '@/lib/analytics';
import { getLanguageColor } from '@/lib/analytics';

interface LanguageBreakdownChartProps {
  languages: LanguageStatistic[];
  totalFixes: number;
  detailed?: boolean;
}

export function LanguageBreakdownChart({ languages, totalFixes, detailed = false }: LanguageBreakdownChartProps) {
  if (languages.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Code2 className="h-5 w-5 text-green-400" />
            Language Breakdown
          </CardTitle>
          <CardDescription>Which languages you analyze most</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-500 text-sm">No language data yet</p>
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...languages.map(l => l.count));

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Code2 className="h-5 w-5 text-green-400" />
          Language Breakdown
        </CardTitle>
        <CardDescription>
          {languages.length} language{languages.length !== 1 ? 's' : ''} across {totalFixes} fixes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {languages.map((lang, index) => {
            const barWidth = (lang.count / maxCount) * 100;
            const color = getLanguageColor(lang.language);

            return (
              <div key={lang.language} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-medium text-gray-300 capitalize truncate">
                      {lang.language}
                    </span>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {lang.count}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 shrink-0 ml-2">
                    <span>{lang.percentage.toFixed(1)}%</span>
                    {detailed && (
                      <span className="text-green-400">
                        {lang.successRate.toFixed(0)}% success
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

                {detailed && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 ml-1">
                    <Award className="h-3 w-3" />
                    Success rate: {lang.successRate.toFixed(1)}%
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pie Chart Visualization */}
        {!detailed && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-center justify-center gap-2 h-32">
              {languages.map((lang) => {
                const color = getLanguageColor(lang.language);
                const size = Math.max(40, (lang.percentage / 100) * 120);
                
                return (
                  <div
                    key={lang.language}
                    className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
                    style={{ width: `${size}px` }}
                  >
                    <div
                      className="rounded-full aspect-square flex items-center justify-center shadow-lg"
                      style={{
                        backgroundColor: color,
                        width: `${size}px`,
                        height: `${size}px`,
                      }}
                    >
                      <span className="text-white font-bold text-sm">
                        {lang.percentage.toFixed(0)}%
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 capitalize">
                      {lang.language}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {detailed && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <div className="text-2xl font-bold text-green-400 capitalize">
                  {languages[0]?.language || 'N/A'}
                </div>
                <div className="text-xs text-gray-500 mt-1">Most Used</div>
              </div>
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">
                  {languages.reduce((max, l) => l.successRate > max ? l.successRate : max, 0).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">Best Success Rate</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
