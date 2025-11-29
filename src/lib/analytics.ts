import type { FixHistoryItem } from '@/components/fix-history';

export interface BugTypeStatistic {
  type: string;
  count: number;
  percentage: number;
  avgConfidence: number;
}

export interface LanguageStatistic {
  language: string;
  count: number;
  percentage: number;
  successRate: number;
}

export interface SuccessMetrics {
  totalFixes: number;
  successRate: number;
  avgConfidence: number;
  highConfidenceFixes: number;
  mediumConfidenceFixes: number;
  lowConfidenceFixes: number;
}

export interface TimeSavedMetrics {
  totalTimeSavedMinutes: number;
  totalTimeSavedHours: number;
  avgTimePerFix: number;
  estimatedManualTime: number;
  productivityGain: number;
}

export interface AnalyticsData {
  bugStatistics: BugTypeStatistic[];
  languageBreakdown: LanguageStatistic[];
  successMetrics: SuccessMetrics;
  timeSaved: TimeSavedMetrics;
  totalFixes: number;
  recentActivity: FixHistoryItem[];
}

// Time estimates for manual debugging (in minutes)
const MANUAL_DEBUG_TIME: Record<string, number> = {
  'Syntax Error': 5,
  'Type Error': 10,
  'Reference Error': 8,
  'Index Error': 7,
  'Division Error': 5,
  'Null Reference': 12,
  'Import Error': 15,
  'File Error': 10,
  'Logic Error': 20,
  'Runtime Error': 15,
  'Unknown': 10,
};

const DEFAULT_MANUAL_TIME = 10; // minutes

export function calculateAnalytics(history: FixHistoryItem[]): AnalyticsData {
  if (history.length === 0) {
    return {
      bugStatistics: [],
      languageBreakdown: [],
      successMetrics: {
        totalFixes: 0,
        successRate: 0,
        avgConfidence: 0,
        highConfidenceFixes: 0,
        mediumConfidenceFixes: 0,
        lowConfidenceFixes: 0,
      },
      timeSaved: {
        totalTimeSavedMinutes: 0,
        totalTimeSavedHours: 0,
        avgTimePerFix: 0,
        estimatedManualTime: 0,
        productivityGain: 0,
      },
      totalFixes: 0,
      recentActivity: [],
    };
  }

  const totalFixes = history.length;
  
  // Bug Statistics
  const bugTypeCounts = new Map<string, { count: number; totalConfidence: number }>();
  history.forEach(item => {
    const bugType = item.errorType || 'Unknown';
    const current = bugTypeCounts.get(bugType) || { count: 0, totalConfidence: 0 };
    bugTypeCounts.set(bugType, {
      count: current.count + 1,
      totalConfidence: current.totalConfidence + item.confidence,
    });
  });

  const bugStatistics: BugTypeStatistic[] = Array.from(bugTypeCounts.entries())
    .map(([type, data]) => ({
      type,
      count: data.count,
      percentage: (data.count / totalFixes) * 100,
      avgConfidence: data.totalConfidence / data.count,
    }))
    .sort((a, b) => b.count - a.count);

  // Language Breakdown
  const languageCounts = new Map<string, { count: number; totalConfidence: number }>();
  history.forEach(item => {
    const lang = item.language || 'unknown';
    const current = languageCounts.get(lang) || { count: 0, totalConfidence: 0 };
    languageCounts.set(lang, {
      count: current.count + 1,
      totalConfidence: current.totalConfidence + item.confidence,
    });
  });

  const languageBreakdown: LanguageStatistic[] = Array.from(languageCounts.entries())
    .map(([language, data]) => ({
      language,
      count: data.count,
      percentage: (data.count / totalFixes) * 100,
      successRate: (data.totalConfidence / data.count) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  // Success Metrics
  const totalConfidence = history.reduce((sum, item) => sum + item.confidence, 0);
  const avgConfidence = totalConfidence / totalFixes;
  
  const highConfidenceFixes = history.filter(item => item.confidence >= 0.8).length;
  const mediumConfidenceFixes = history.filter(item => item.confidence >= 0.5 && item.confidence < 0.8).length;
  const lowConfidenceFixes = history.filter(item => item.confidence < 0.5).length;
  
  const successRate = (history.filter(item => item.confidence >= 0.7).length / totalFixes) * 100;

  const successMetrics: SuccessMetrics = {
    totalFixes,
    successRate,
    avgConfidence,
    highConfidenceFixes,
    mediumConfidenceFixes,
    lowConfidenceFixes,
  };

  // Time Saved Calculation
  let totalManualTimeMinutes = 0;
  let totalAITimeMinutes = 0;

  history.forEach(item => {
    const errorType = item.errorType || 'Unknown';
    const manualTime = MANUAL_DEBUG_TIME[errorType] || DEFAULT_MANUAL_TIME;
    totalManualTimeMinutes += manualTime;
    
    // AI time estimate: 1-2 minutes per fix
    const aiTime = 1.5;
    totalAITimeMinutes += aiTime;
  });

  const totalTimeSavedMinutes = totalManualTimeMinutes - totalAITimeMinutes;
  const totalTimeSavedHours = totalTimeSavedMinutes / 60;
  const avgTimePerFix = totalTimeSavedMinutes / totalFixes;
  const productivityGain = ((totalManualTimeMinutes - totalAITimeMinutes) / totalManualTimeMinutes) * 100;

  const timeSaved: TimeSavedMetrics = {
    totalTimeSavedMinutes,
    totalTimeSavedHours,
    avgTimePerFix,
    estimatedManualTime: totalManualTimeMinutes,
    productivityGain,
  };

  // Recent Activity (last 5)
  const recentActivity = history.slice(0, 5);

  return {
    bugStatistics,
    languageBreakdown,
    successMetrics,
    timeSaved,
    totalFixes,
    recentActivity,
  };
}

export function getBugTypeColor(type: string): string {
  const colorMap: Record<string, string> = {
    'Syntax Error': '#ef4444',
    'Type Error': '#f97316',
    'Reference Error': '#f59e0b',
    'Index Error': '#eab308',
    'Division Error': '#84cc16',
    'Null Reference': '#22c55e',
    'Import Error': '#10b981',
    'File Error': '#14b8a6',
    'Logic Error': '#06b6d4',
    'Runtime Error': '#0ea5e9',
    'Unknown': '#6b7280',
  };
  return colorMap[type] || '#6b7280';
}

export function getLanguageColor(language: string): string {
  const colorMap: Record<string, string> = {
    'python': '#3776ab',
    'javascript': '#f7df1e',
    'typescript': '#3178c6',
    'java': '#007396',
    'cpp': '#00599c',
    'c': '#a8b9cc',
    'ruby': '#cc342d',
    'go': '#00add8',
    'rust': '#000000',
    'php': '#777bb4',
    'multi': '#8b5cf6',
    'unknown': '#6b7280',
  };
  return colorMap[language.toLowerCase()] || '#6b7280';
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export function getConfidenceLevel(confidence: number): {
  label: string;
  color: string;
} {
  if (confidence >= 0.8) {
    return { label: 'High', color: 'text-green-400' };
  } else if (confidence >= 0.5) {
    return { label: 'Medium', color: 'text-yellow-400' };
  } else {
    return { label: 'Low', color: 'text-red-400' };
  }
}
