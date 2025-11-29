'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, CheckCircle2, Clock, TrendingUp, AlertCircle, Search, Filter, ArrowLeft, Code2, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { CodeFixer } from '@/components/code-fixer';
import { AnalyticsDashboard } from '@/components/analytics-dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

function StatCard({ title, value, change, icon, trend }: StatCardProps) {
  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        <div className="text-blue-400">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <p className={`text-xs mt-1 ${
          trend === 'up' ? 'text-green-400' : 'text-red-400'
        }`}>
          {change}
        </p>
      </CardContent>
    </Card>
  );
}

interface ActivityItem {
  id: string;
  type: string;
  file: string;
  message: string;
  time: string;
  status: 'success' | 'failed';
}

const mockActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'SyntaxError',
    file: 'src/utils/helpers.py',
    message: 'Missing closing parenthesis',
    time: '2 min ago',
    status: 'success'
  },
  {
    id: '2',
    type: 'TypeError',
    file: 'src/api/routes.py',
    message: 'Cannot read property of undefined',
    time: '5 min ago',
    status: 'success'
  },
  {
    id: '3',
    type: 'TestFailure',
    file: 'tests/test_api.py',
    message: 'Assertion failed in test_user_login',
    time: '8 min ago',
    status: 'failed'
  },
  {
    id: '4',
    type: 'ReferenceError',
    file: 'src/models/user.py',
    message: 'Variable not defined',
    time: '12 min ago',
    status: 'success'
  },
  {
    id: '5',
    type: 'SyntaxError',
    file: 'src/services/auth.py',
    message: 'Invalid syntax near line 45',
    time: '15 min ago',
    status: 'success'
  },
];

const errorBreakdown = [
  { type: 'SyntaxError', count: 89, color: 'bg-red-500' },
  { type: 'TypeError', count: 67, color: 'bg-orange-500' },
  { type: 'ReferenceError', count: 45, color: 'bg-yellow-500' },
  { type: 'TestFailure', count: 46, color: 'bg-blue-500' },
];

const topFiles = [
  { file: 'src/utils/helpers.py', fixes: 23 },
  { file: 'src/api/routes.py', fixes: 18 },
  { file: 'src/models/user.py', fixes: 15 },
  { file: 'tests/test_api.py', fixes: 12 },
  { file: 'src/services/auth.py', fixes: 9 },
];

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivity);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: ['SyntaxError', 'TypeError', 'ReferenceError', 'TestFailure'][Math.floor(Math.random() * 4)],
        file: ['src/utils/helpers.py', 'src/api/routes.py', 'src/models/user.py'][Math.floor(Math.random() * 3)],
        message: 'Auto-fixed by DevFlow.AI',
        time: 'Just now',
        status: Math.random() > 0.2 ? 'success' : 'failed'
      };
      
      setActivities(prev => [newActivity, ...prev].slice(0, 10));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">DevFlow.AI</h1>
                <p className="text-xs text-gray-400">Live Monitoring</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>System Active</span>
              </div>
              <div className="text-sm text-gray-400">{currentTime}</div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Fixes"
            value="247"
            change="+23 today"
            icon={<CheckCircle2 className="w-5 h-5" />}
            trend="up"
          />
          <StatCard
            title="Success Rate"
            value="87.3%"
            change="+2.1% vs last week"
            icon={<TrendingUp className="w-5 h-5" />}
            trend="up"
          />
          <StatCard
            title="Avg Fix Time"
            value="3.2s"
            change="-0.4s improvement"
            icon={<Clock className="w-5 h-5" />}
            trend="up"
          />
          <StatCard
            title="Time Saved"
            value="18.5h"
            change="This week"
            icon={<Activity className="w-5 h-5" />}
            trend="up"
          />
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="monitor" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="monitor" className="data-[state=active]:bg-blue-600">
              <Activity className="w-4 h-4 mr-2" />
              Monitor
            </TabsTrigger>
            <TabsTrigger value="fixer" className="data-[state=active]:bg-purple-600">
              <Code2 className="w-4 h-4 mr-2" />
              AI Fixer
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-green-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Monitor Tab */}
          <TabsContent value="monitor" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Activity Feed */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Live Activity Feed
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-gray-700">
                      <Search className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-700">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                {activities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="p-4 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-all cursor-pointer animate-in fade-in slide-in-from-top-2 duration-300"
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className={activity.status === 'success' ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}
                          >
                            {activity.status === 'success' ? 'Fixed' : 'Failed'}
                          </Badge>
                          <span className="text-sm font-medium text-orange-400">{activity.type}</span>
                        </div>
                        <p className="text-sm text-gray-300 mb-1">{activity.file}</p>
                        <p className="text-xs text-gray-500">{activity.message}</p>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            {/* Error Breakdown */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                  Error Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {errorBreakdown.map((item) => (
                  <div key={item.type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400">{item.type}</span>
                      <span className="text-sm font-medium text-white">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${(item.count / 247) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Fixed Files */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Top Fixed Files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {topFiles.map((item, index) => (
                  <div
                    key={item.file}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <span className="text-sm text-gray-300 truncate">{item.file}</span>
                    </div>
                    <span className="text-sm font-medium text-blue-400">{item.fixes}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">File Watcher</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">LLM Client</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Git Manager</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                    Ready
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Test Runner</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                    Ready
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
            </div>
          </TabsContent>

          {/* AI Fixer Tab */}
          <TabsContent value="fixer" className="space-y-0">
            <CodeFixer />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-0">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
