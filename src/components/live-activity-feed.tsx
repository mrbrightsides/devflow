'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, XCircle, Clock, Zap, GitCommit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Activity {
  id: string;
  timestamp: string;
  type: 'detection' | 'patch' | 'test' | 'commit';
  status: 'success' | 'error' | 'pending';
  file: string;
  message: string;
  confidence?: number;
  duration?: number;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 5000).toISOString(),
    type: 'detection',
    status: 'success',
    file: 'calculator.py',
    message: 'Detected ZeroDivisionError at line 42',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 4000).toISOString(),
    type: 'patch',
    status: 'success',
    file: 'calculator.py',
    message: 'Generated patch with 92% confidence',
    confidence: 92,
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 3000).toISOString(),
    type: 'test',
    status: 'success',
    file: 'test_calculator.py',
    message: 'All 12 tests passed',
    duration: 1.8,
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 2000).toISOString(),
    type: 'commit',
    status: 'success',
    file: 'calculator.py',
    message: '[DevFlow] fix: handle zero division in divide function',
  },
];

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newActivity: Activity = generateRandomActivity();
      setActivities((prev) => [newActivity, ...prev].slice(0, 20));
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  const generateRandomActivity = (): Activity => {
    const types: Activity['type'][] = ['detection', 'patch', 'test', 'commit'];
    const files = ['api/user.py', 'models/database.py', 'utils/helpers.js', 'components/Button.tsx'];
    const messages = {
      detection: [
        'Detected TypeError in function call',
        'Found SyntaxError at line 156',
        'Detected undefined variable reference',
      ],
      patch: [
        'Generated patch with 88% confidence',
        'Applied fix for type mismatch',
        'Corrected import statement',
      ],
      test: [
        'All 24 tests passed',
        '18/18 tests successful',
        'Test suite completed',
      ],
      commit: [
        '[DevFlow] fix: resolve type error',
        '[DevFlow] fix: correct syntax error',
        '[DevFlow] fix: add missing import',
      ],
    };

    const type = types[Math.floor(Math.random() * types.length)];
    const status: Activity['status'] = Math.random() > 0.1 ? 'success' : 'error';

    return {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type,
      status,
      file: files[Math.floor(Math.random() * files.length)],
      message: messages[type][Math.floor(Math.random() * messages[type].length)],
      confidence: type === 'patch' ? Math.floor(Math.random() * 20) + 80 : undefined,
      duration: type === 'test' ? Math.random() * 3 + 1 : undefined,
    };
  };

  const getIcon = (type: Activity['type'], status: Activity['status']) => {
    if (status === 'error') return <XCircle className="w-5 h-5 text-red-400" />;
    if (status === 'pending') return <Clock className="w-5 h-5 text-yellow-400" />;

    switch (type) {
      case 'detection':
        return <Zap className="w-5 h-5 text-blue-400" />;
      case 'patch':
        return <CheckCircle2 className="w-5 h-5 text-purple-400" />;
      case 'test':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'commit':
        return <GitCommit className="w-5 h-5 text-orange-400" />;
    }
  };

  const getTypeLabel = (type: Activity['type']) => {
    const labels = {
      detection: 'Error Detected',
      patch: 'Patch Applied',
      test: 'Tests Passed',
      commit: 'Committed',
    };
    return labels[type];
  };

  const getTypeBadgeColor = (type: Activity['type']) => {
    const colors = {
      detection: 'border-blue-500 text-blue-400',
      patch: 'border-purple-500 text-purple-400',
      test: 'border-green-500 text-green-400',
      commit: 'border-orange-500 text-orange-400',
    };
    return colors[type];
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`}></div>
            Live Activity Feed
          </CardTitle>
          <button
            onClick={() => setIsLive(!isLive)}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            {isLive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <AnimatePresence>
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="mb-4 last:mb-0"
              >
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-900 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getIcon(activity.type, activity.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={`text-xs ${getTypeBadgeColor(activity.type)}`}>
                          {getTypeLabel(activity.type)}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-white mb-1">{activity.message}</p>
                      <p className="text-xs text-slate-400 font-mono">{activity.file}</p>
                      {activity.confidence && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-800 rounded-full h-1.5">
                              <div
                                className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${activity.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-slate-400">{activity.confidence}%</span>
                          </div>
                        </div>
                      )}
                      {activity.duration && (
                        <p className="text-xs text-slate-500 mt-1">
                          Duration: {activity.duration.toFixed(2)}s
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
