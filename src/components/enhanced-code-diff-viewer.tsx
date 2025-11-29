'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Copy, XCircle, Download, Maximize2, GitCompare } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedCodeDiffViewerProps {
  originalCode: string;
  fixedCode: string;
  language?: string;
  confidence?: number;
  analysis?: string;
  fileName?: string;
}

interface DiffLine {
  lineNumber: number;
  content: string;
  type: 'added' | 'removed' | 'unchanged';
}

export function EnhancedCodeDiffViewer({
  originalCode,
  fixedCode,
  language = 'python',
  confidence = 0,
  analysis,
  fileName = 'fixed-code',
}: EnhancedCodeDiffViewerProps) {
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (error) {
      toast.error('Failed to copy to clipboard', {
        description: 'Please try again or copy manually',
      });
    }
  };

  const downloadFile = (code: string, prefix: string) => {
    try {
      const extension = getFileExtension(language);
      const filename = `${prefix}-${fileName}.${extension}`;
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${filename}!`);
    } catch (error) {
      toast.error('Failed to download file', {
        description: 'Please try again',
      });
    }
  };

  const getFileExtension = (lang: string): string => {
    const extensions: Record<string, string> = {
      python: 'py',
      javascript: 'js',
      typescript: 'ts',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      ruby: 'rb',
      go: 'go',
      rust: 'rs',
      php: 'php',
      text: 'txt',
    };
    return extensions[lang] || 'txt';
  };

  const generateDiff = (): DiffLine[] => {
    const originalLines = originalCode.split('\n');
    const fixedLines = fixedCode.split('\n');
    const diff: DiffLine[] = [];

    const maxLength = Math.max(originalLines.length, fixedLines.length);

    for (let i = 0; i < maxLength; i++) {
      const origLine = originalLines[i];
      const fixLine = fixedLines[i];

      if (origLine === fixLine) {
        diff.push({
          lineNumber: i + 1,
          content: origLine || '',
          type: 'unchanged',
        });
      } else {
        if (origLine !== undefined) {
          diff.push({
            lineNumber: i + 1,
            content: origLine,
            type: 'removed',
          });
        }
        if (fixLine !== undefined) {
          diff.push({
            lineNumber: i + 1,
            content: fixLine,
            type: 'added',
          });
        }
      }
    }

    return diff;
  };

  const diff = generateDiff();
  const stats = {
    added: diff.filter((d) => d.type === 'added').length,
    removed: diff.filter((d) => d.type === 'removed').length,
    unchanged: diff.filter((d) => d.type === 'unchanged').length,
  };

  return (
    <div className="space-y-4">
      {/* Analysis Section */}
      {analysis && (
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <GitCompare className="h-4 w-4 text-blue-400" />
                Analysis
              </CardTitle>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                {(confidence * 100).toFixed(0)}% confidence
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">{analysis}</p>
          </CardContent>
        </Card>
      )}

      {/* View Mode Tabs */}
      <div className="flex items-center justify-between">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'split' | 'unified')}>
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="split" className="data-[state=active]:bg-blue-600">
              Split View
            </TabsTrigger>
            <TabsTrigger value="unified" className="data-[state=active]:bg-blue-600">
              Unified View
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-gray-700 hover:bg-gray-800"
            onClick={() => downloadFile(fixedCode, 'fixed')}
          >
            <Download className="h-3 w-3 mr-2" />
            Download Fixed
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-gray-700 hover:bg-gray-800"
            onClick={() => copyToClipboard(fixedCode, 'Fixed code')}
          >
            <Copy className="h-3 w-3 mr-2" />
            Copy Fixed
          </Button>
        </div>
      </div>

      {/* Split View */}
      {viewMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Original Code */}
          <Card className="border-red-500/20 bg-red-500/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-400" />
                  <CardTitle className="text-sm font-medium">Original Code</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2"
                    onClick={() => downloadFile(originalCode, 'original')}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2"
                    onClick={() => copyToClipboard(originalCode, 'Original code')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-black/30 rounded-lg overflow-hidden">
                <pre className="text-xs p-3 overflow-x-auto max-h-[500px] overflow-y-auto">
                  {originalCode.split('\n').map((line, idx) => (
                    <div key={idx} className="flex hover:bg-red-500/10">
                      <span className="text-gray-600 select-none pr-4 text-right" style={{ minWidth: '3rem' }}>
                        {idx + 1}
                      </span>
                      <code className="text-red-300 flex-1">{line || ' '}</code>
                    </div>
                  ))}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Fixed Code */}
          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <CardTitle className="text-sm font-medium">Fixed Code</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2"
                    onClick={() => downloadFile(fixedCode, 'fixed')}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2"
                    onClick={() => copyToClipboard(fixedCode, 'Fixed code')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-black/30 rounded-lg overflow-hidden">
                <pre className="text-xs p-3 overflow-x-auto max-h-[500px] overflow-y-auto">
                  {fixedCode.split('\n').map((line, idx) => (
                    <div key={idx} className="flex hover:bg-green-500/10">
                      <span className="text-gray-600 select-none pr-4 text-right" style={{ minWidth: '3rem' }}>
                        {idx + 1}
                      </span>
                      <code className="text-green-300 flex-1">{line || ' '}</code>
                    </div>
                  ))}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Unified View */}
      {viewMode === 'unified' && (
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <GitCompare className="h-4 w-4 text-blue-400" />
                Unified Diff
              </CardTitle>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-green-500/20 border border-green-500/50 rounded"></span>
                  <span className="text-gray-400">+{stats.added}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-red-500/20 border border-red-500/50 rounded"></span>
                  <span className="text-gray-400">-{stats.removed}</span>
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-black/30 rounded-lg overflow-hidden">
              <pre className="text-xs p-3 overflow-x-auto max-h-[500px] overflow-y-auto">
                {diff.map((line, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      line.type === 'added'
                        ? 'bg-green-500/10 hover:bg-green-500/20'
                        : line.type === 'removed'
                        ? 'bg-red-500/10 hover:bg-red-500/20'
                        : 'hover:bg-gray-700/30'
                    }`}
                  >
                    <span
                      className={`${
                        line.type === 'added'
                          ? 'text-green-400'
                          : line.type === 'removed'
                          ? 'text-red-400'
                          : 'text-gray-600'
                      } select-none pr-2 text-center`}
                      style={{ minWidth: '2rem' }}
                    >
                      {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                    </span>
                    <span className="text-gray-600 select-none pr-4 text-right" style={{ minWidth: '3rem' }}>
                      {line.lineNumber}
                    </span>
                    <code
                      className={`${
                        line.type === 'added'
                          ? 'text-green-300'
                          : line.type === 'removed'
                          ? 'text-red-300'
                          : 'text-gray-300'
                      } flex-1`}
                    >
                      {line.content || ' '}
                    </code>
                  </div>
                ))}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-100">{originalCode.split('\n').length}</div>
            <p className="text-xs text-gray-400">Original Lines</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-400">{fixedCode.split('\n').length}</div>
            <p className="text-xs text-gray-400">Fixed Lines</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-400">+{stats.added}</div>
            <p className="text-xs text-gray-400">Lines Added</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-400">-{stats.removed}</div>
            <p className="text-xs text-gray-400">Lines Removed</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-400">{stats.unchanged}</div>
            <p className="text-xs text-gray-400">Unchanged</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
