'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GitBranch, Package, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { UploadedFile } from './multi-file-uploader';

interface ContextAnalysis {
  dependencies: string[];
  imports: string[];
  exports: string[];
  potentialIssues: string[];
  complexity: 'low' | 'medium' | 'high';
}

interface ContextAnalyzerProps {
  files: UploadedFile[];
}

export function ContextAnalyzer({ files }: ContextAnalyzerProps) {
  const [analysis, setAnalysis] = useState<ContextAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  useEffect(() => {
    if (files.length > 0) {
      analyzeContext();
    } else {
      setAnalysis(null);
    }
  }, [files]);

  const analyzeContext = async () => {
    setIsAnalyzing(true);

    try {
      // Analyze all files for imports, exports, and dependencies
      const allImports: string[] = [];
      const allExports: string[] = [];
      const allDeps: string[] = [];
      const issues: string[] = [];

      files.forEach((file) => {
        // Extract imports (simplified regex patterns)
        const importMatches = file.content.match(/import\s+.*?from\s+['"](.+?)['"]/g) || [];
        const requireMatches = file.content.match(/require\s*\(['"](.+?)['"]\)/g) || [];
        
        importMatches.forEach((imp) => {
          const match = imp.match(/from\s+['"](.+?)['"]/);
          if (match) allImports.push(match[1]);
        });

        requireMatches.forEach((req) => {
          const match = req.match(/require\s*\(['"](.+?)['"]\)/);
          if (match) allImports.push(match[1]);
        });

        // Extract exports
        const exportMatches = file.content.match(/export\s+(default\s+)?(class|function|const|let|var)\s+(\w+)/g) || [];
        exportMatches.forEach((exp) => {
          const match = exp.match(/export\s+(?:default\s+)?(?:class|function|const|let|var)\s+(\w+)/);
          if (match) allExports.push(match[1]);
        });

        // Detect potential issues
        if (file.content.includes('TODO') || file.content.includes('FIXME')) {
          issues.push(`${file.name}: Contains TODO/FIXME comments`);
        }
        if (file.content.includes('console.log')) {
          issues.push(`${file.name}: Contains debug console.log statements`);
        }
        if (file.content.match(/catch\s*\(\s*\)\s*\{/)) {
          issues.push(`${file.name}: Empty catch blocks detected`);
        }
      });

      // Find unique dependencies
      const uniqueImports = [...new Set(allImports)];
      uniqueImports.forEach((imp) => {
        if (!imp.startsWith('.') && !imp.startsWith('/')) {
          allDeps.push(imp);
        }
      });

      // Calculate complexity
      const totalLines = files.reduce((sum, f) => sum + f.content.split('\n').length, 0);
      let complexity: 'low' | 'medium' | 'high' = 'low';
      if (totalLines > 500) complexity = 'high';
      else if (totalLines > 200) complexity = 'medium';

      setAnalysis({
        dependencies: [...new Set(allDeps)],
        imports: uniqueImports,
        exports: [...new Set(allExports)],
        potentialIssues: issues,
        complexity,
      });
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!files.length) {
    return null;
  }

  if (isAnalyzing) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <p className="text-sm text-gray-400 text-center">Analyzing code context...</p>
            <Progress value={66} className="h-2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return null;
  }

  const complexityColors = {
    low: 'bg-green-500/20 text-green-400 border-green-500/50',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    high: 'bg-red-500/20 text-red-400 border-red-500/50',
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-blue-400" />
          Context Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Complexity Badge */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Code Complexity</span>
          <Badge className={complexityColors[analysis.complexity]}>
            {analysis.complexity.toUpperCase()}
          </Badge>
        </div>

        {/* Dependencies */}
        {analysis.dependencies.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Package className="w-4 h-4" />
              <span>External Dependencies ({analysis.dependencies.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.dependencies.slice(0, 5).map((dep, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {dep}
                </Badge>
              ))}
              {analysis.dependencies.length > 5 && (
                <Badge variant="outline" className="text-xs text-gray-500">
                  +{analysis.dependencies.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Exports */}
        {analysis.exports.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Exported Functions ({analysis.exports.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.exports.slice(0, 5).map((exp, i) => (
                <Badge key={i} variant="outline" className="text-xs font-mono">
                  {exp}
                </Badge>
              ))}
              {analysis.exports.length > 5 && (
                <Badge variant="outline" className="text-xs text-gray-500">
                  +{analysis.exports.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Potential Issues */}
        {analysis.potentialIssues.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-orange-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Potential Issues ({analysis.potentialIssues.length})</span>
            </div>
            <div className="space-y-1">
              {analysis.potentialIssues.slice(0, 3).map((issue, i) => (
                <p key={i} className="text-xs text-gray-500 pl-6">
                  • {issue}
                </p>
              ))}
              {analysis.potentialIssues.length > 3 && (
                <p className="text-xs text-gray-600 pl-6">
                  ... and {analysis.potentialIssues.length - 3} more
                </p>
              )}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-xs text-blue-400">
            💡 Context analysis helps AI understand file relationships for better fixes
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
