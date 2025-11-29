'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Copy, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CodeDiffViewerProps {
  originalCode: string;
  fixedCode: string;
  language?: string;
  confidence?: number;
  analysis?: string;
}

export function CodeDiffViewer({
  originalCode,
  fixedCode,
  language = 'python',
  confidence = 0,
  analysis,
}: CodeDiffViewerProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="space-y-4">
      {/* Analysis Section */}
      {analysis && (
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Analysis</CardTitle>
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

      {/* Code Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Original Code */}
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-400" />
                <CardTitle className="text-sm font-medium">Original Code</CardTitle>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2"
                onClick={() => copyToClipboard(originalCode, 'Original code')}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-black/30 p-3 rounded-lg overflow-x-auto">
              <code className="text-red-300">{originalCode}</code>
            </pre>
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
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2"
                onClick={() => copyToClipboard(fixedCode, 'Fixed code')}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-black/30 p-3 rounded-lg overflow-x-auto">
              <code className="text-green-300">{fixedCode}</code>
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-100">
              {originalCode.split('\n').length}
            </div>
            <p className="text-xs text-gray-400">Original Lines</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-400">
              {fixedCode.split('\n').length}
            </div>
            <p className="text-xs text-gray-400">Fixed Lines</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-400">
              {Math.abs(originalCode.split('\n').length - fixedCode.split('\n').length)}
            </div>
            <p className="text-xs text-gray-400">Lines Changed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
