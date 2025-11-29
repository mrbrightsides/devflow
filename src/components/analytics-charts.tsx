'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Time series data for fixes over time
const timeSeriesData = [
  { time: '00:00', fixes: 12, success: 11, failed: 1 },
  { time: '04:00', fixes: 8, success: 7, failed: 1 },
  { time: '08:00', fixes: 45, success: 39, failed: 6 },
  { time: '12:00', fixes: 67, success: 58, failed: 9 },
  { time: '16:00', fixes: 52, success: 46, failed: 6 },
  { time: '20:00', fixes: 38, success: 34, failed: 4 },
];

// Error type distribution
const errorDistribution = [
  { name: 'ZeroDivisionError', value: 42, color: '#ef4444' },
  { name: 'TypeError', value: 28, color: '#f97316' },
  { name: 'SyntaxError', value: 18, color: '#eab308' },
  { name: 'Other', value: 12, color: '#6366f1' },
];

// Weekly comparison data
const weeklyData = [
  { day: 'Mon', thisWeek: 234, lastWeek: 198 },
  { day: 'Tue', thisWeek: 198, lastWeek: 223 },
  { day: 'Wed', thisWeek: 267, lastWeek: 189 },
  { day: 'Thu', thisWeek: 245, lastWeek: 234 },
  { day: 'Fri', thisWeek: 289, lastWeek: 267 },
  { day: 'Sat', thisWeek: 156, lastWeek: 178 },
  { day: 'Sun', thisWeek: 178, lastWeek: 145 },
];

export function TimeSeriesChart() {
  const maxValue = Math.max(...timeSeriesData.map(d => d.fixes));
  
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Fixes Over Time</CardTitle>
        <CardDescription>Hourly fix activity for today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeSeriesData.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{item.time}</span>
                <span className="text-white font-medium">{item.fixes} fixes</span>
              </div>
              <div className="flex gap-1 h-2">
                <div 
                  className="bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${(item.success / maxValue) * 100}%` }}
                />
                <div 
                  className="bg-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${(item.failed / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
          
          {/* Legend */}
          <div className="flex gap-4 pt-4 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-xs text-slate-400">Successful</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-xs text-slate-400">Failed</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ErrorDistributionChart() {
  const total = errorDistribution.reduce((acc, curr) => acc + curr.value, 0);
  let currentAngle = 0;
  
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Error Distribution</CardTitle>
        <CardDescription>Breakdown by error type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          {/* Simple pie chart using divs */}
          <div className="relative w-48 h-48 mb-6">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {errorDistribution.map((item, index) => {
                const percentage = item.value / total;
                const angle = percentage * 360;
                const startAngle = currentAngle;
                const endAngle = currentAngle + angle;
                
                // Convert to radians
                const startRad = (startAngle - 90) * (Math.PI / 180);
                const endRad = (endAngle - 90) * (Math.PI / 180);
                
                // Calculate coordinates
                const x1 = 50 + 40 * Math.cos(startRad);
                const y1 = 50 + 40 * Math.sin(startRad);
                const x2 = 50 + 40 * Math.cos(endRad);
                const y2 = 50 + 40 * Math.sin(endRad);
                
                const largeArc = angle > 180 ? 1 : 0;
                
                const pathData = [
                  `M 50 50`,
                  `L ${x1} ${y1}`,
                  `A 40 40 0 ${largeArc} 1 ${x2} ${y2}`,
                  `Z`
                ].join(' ');
                
                currentAngle += angle;
                
                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={item.color}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                );
              })}
              {/* Center hole */}
              <circle cx="50" cy="50" r="25" fill="#1e293b" />
            </svg>
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {errorDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-slate-300">{item.name}</span>
                <span className="text-sm text-slate-500 ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function WeeklyComparisonChart() {
  const maxValue = Math.max(
    ...weeklyData.map(d => Math.max(d.thisWeek, d.lastWeek))
  );
  
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Weekly Comparison</CardTitle>
        <CardDescription>This week vs last week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {weeklyData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="text-sm text-slate-400 font-medium">{item.day}</div>
              <div className="flex gap-2">
                {/* This Week Bar */}
                <div className="flex-1 space-y-1">
                  <div 
                    className="bg-blue-500 rounded h-6 transition-all duration-500 flex items-center justify-end px-2"
                    style={{ width: `${(item.thisWeek / maxValue) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">{item.thisWeek}</span>
                  </div>
                </div>
                
                {/* Last Week Bar */}
                <div className="flex-1 space-y-1">
                  <div 
                    className="bg-indigo-500 rounded h-6 transition-all duration-500 flex items-center justify-end px-2"
                    style={{ width: `${(item.lastWeek / maxValue) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">{item.lastWeek}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Legend */}
          <div className="flex gap-4 pt-4 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span className="text-xs text-slate-400">This Week</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded" />
              <span className="text-xs text-slate-400">Last Week</span>
            </div>
          </div>
          
          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
            <div>
              <p className="text-xs text-slate-400 mb-1">This Week Total</p>
              <p className="text-2xl font-bold text-white">1,567</p>
              <p className="text-xs text-green-400 mt-1">+8.4% vs last week</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Last Week Total</p>
              <p className="text-2xl font-bold text-white">1,434</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
