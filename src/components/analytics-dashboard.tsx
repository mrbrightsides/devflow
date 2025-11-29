'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, PieChart, TrendingUp, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FixHistoryItem } from './fix-history';
import { calculateAnalytics, type AnalyticsData } from '@/lib/analytics';
import { BugStatisticsChart } from './bug-statistics-chart';
import { LanguageBreakdownChart } from './language-breakdown-chart';
import { SuccessMetrics } from './success-metrics';
import { TimeSavedCalculator } from './time-saved-calculator';

const STORAGE_KEY = 'devflow-fix-history';

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadAnalytics();
    
    // Set up storage listener for real-time updates
    const handleStorageChange = () => {
      loadAnalytics();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Poll for changes every 5 seconds
    const interval = setInterval(() => {
      loadAnalytics();
    }, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const loadAnalytics = () => {
    try {
      setIsLoading(true);
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const history = JSON.parse(stored) as FixHistoryItem[];
        const analyticsData = calculateAnalytics(history);
        setAnalytics(analyticsData);
        setLastUpdate(new Date());
      } else {
        setAnalytics(calculateAnalytics([]));
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
      setAnalytics(calculateAnalytics([]));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadAnalytics();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <RefreshCw className="h-12 w-12 mx-auto text-blue-400 animate-spin" />
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics || analytics.totalFixes === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="py-16">
          <div className="text-center space-y-4">
            <BarChart3 className="h-16 w-16 mx-auto text-gray-600" />
            <div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Data Yet</h3>
              <p className="text-gray-500 text-sm">
                Start fixing bugs to see analytics and insights
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Analytics & Insights</h2>
          <p className="text-sm text-gray-400">
            Track your debugging patterns and productivity gains
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">
            Updated {lastUpdate.toLocaleTimeString()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="border-gray-700 hover:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Time Saved - Featured Card */}
      <TimeSavedCalculator timeSaved={analytics.timeSaved} />

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-gray-800/50 border border-gray-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="bugs" className="data-[state=active]:bg-purple-600">
            <BarChart3 className="w-4 h-4 mr-2" />
            Bug Types
          </TabsTrigger>
          <TabsTrigger value="languages" className="data-[state=active]:bg-green-600">
            <PieChart className="w-4 h-4 mr-2" />
            Languages
          </TabsTrigger>
          <TabsTrigger value="success" className="data-[state=active]:bg-orange-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            Success Rate
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BugStatisticsChart statistics={analytics.bugStatistics} totalFixes={analytics.totalFixes} />
            <LanguageBreakdownChart languages={analytics.languageBreakdown} totalFixes={analytics.totalFixes} />
          </div>
          <SuccessMetrics metrics={analytics.successMetrics} />
        </TabsContent>

        {/* Bug Types Tab */}
        <TabsContent value="bugs" className="space-y-6 mt-6">
          <BugStatisticsChart statistics={analytics.bugStatistics} totalFixes={analytics.totalFixes} detailed />
        </TabsContent>

        {/* Languages Tab */}
        <TabsContent value="languages" className="space-y-6 mt-6">
          <LanguageBreakdownChart languages={analytics.languageBreakdown} totalFixes={analytics.totalFixes} detailed />
        </TabsContent>

        {/* Success Rate Tab */}
        <TabsContent value="success" className="space-y-6 mt-6">
          <SuccessMetrics metrics={analytics.successMetrics} detailed />
        </TabsContent>
      </Tabs>
    </div>
  );
}
