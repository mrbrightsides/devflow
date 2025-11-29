'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Lightbulb, 
  AlertTriangle, 
  Bug, 
  Target, 
  Wrench, 
  Shield 
} from 'lucide-react';
import type { CodeExplanation } from '@/app/api/explain-code/route';

interface CodeExplanationProps {
  explanation: CodeExplanation;
}

export function CodeExplanationComponent({ explanation }: CodeExplanationProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'moderate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'complex':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              Code Explanation
            </CardTitle>
            <CardDescription>
              Understanding what went wrong and how to fix it
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className={getSeverityColor(explanation.severity)}>
              {explanation.severity}
            </Badge>
            <Badge variant="outline" className={getComplexityColor(explanation.complexity)}>
              {explanation.complexity}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Alert */}
        <Alert className="bg-blue-500/10 border-blue-500/50">
          <Lightbulb className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-gray-100">
            {explanation.summary}
          </AlertDescription>
        </Alert>

        {/* Bug Type */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Bug className="h-4 w-4 text-red-400" />
            Bug Type
          </h4>
          <p className="text-sm text-gray-400 bg-gray-900/50 p-3 rounded-lg border border-gray-700">
            {explanation.bugType}
          </p>
        </div>

        {/* Root Cause */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Target className="h-4 w-4 text-orange-400" />
            Root Cause
          </h4>
          <p className="text-sm text-gray-400 bg-gray-900/50 p-3 rounded-lg border border-gray-700">
            {explanation.rootCause}
          </p>
        </div>

        {/* Impact */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            Impact
          </h4>
          <p className="text-sm text-gray-400 bg-gray-900/50 p-3 rounded-lg border border-gray-700">
            {explanation.impact}
          </p>
        </div>

        {/* How to Fix */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Wrench className="h-4 w-4 text-green-400" />
            How to Fix
          </h4>
          <div className="text-sm text-gray-400 bg-gray-900/50 p-3 rounded-lg border border-gray-700">
            {explanation.howToFix.split('\n').map((line, idx) => (
              <p key={idx} className="mb-2 last:mb-0">
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Prevention */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-400" />
            Prevention
          </h4>
          <p className="text-sm text-gray-400 bg-gray-900/50 p-3 rounded-lg border border-gray-700">
            {explanation.prevention}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
