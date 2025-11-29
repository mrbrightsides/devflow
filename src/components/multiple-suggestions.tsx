'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, XCircle, Star, Code2, Copy, Download } from 'lucide-react';
import { toast } from 'sonner';
import type { FixSuggestion } from '@/app/api/generate-suggestions/route';

interface MultipleSuggestionsProps {
  suggestions: FixSuggestion[];
  language: string;
  onSelectSuggestion?: (suggestion: FixSuggestion) => void;
}

export function MultipleSuggestions({ suggestions, language, onSelectSuggestion }: MultipleSuggestionsProps) {
  const [selectedId, setSelectedId] = useState<string>(suggestions[0]?.id || '');

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Code copied to clipboard!');
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy code');
    }
  };

  const handleDownload = (code: string, suggestionTitle: string) => {
    try {
      const extension = getFileExtension(language);
      const filename = `${suggestionTitle.toLowerCase().replace(/\s+/g, '-')}.${extension}`;
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${filename}`);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download file');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'hard':
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
              <Code2 className="h-5 w-5 text-purple-400" />
              Multiple Fix Suggestions
            </CardTitle>
            <CardDescription>
              {suggestions.length} different approaches to fix your code
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/50">
            {suggestions.length} Solutions
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedId} onValueChange={setSelectedId}>
          <TabsList className="grid w-full grid-cols-3 bg-gray-900/50">
            {suggestions.map((suggestion) => (
              <TabsTrigger
                key={suggestion.id}
                value={suggestion.id}
                className="relative data-[state=active]:bg-purple-600"
              >
                {suggestion.recommended && (
                  <Star className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400 fill-yellow-400" />
                )}
                {suggestion.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {suggestions.map((suggestion) => (
            <TabsContent key={suggestion.id} value={suggestion.id} className="space-y-4 mt-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                    {suggestion.title}
                    {suggestion.recommended && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                        <Star className="w-3 h-3 mr-1" />
                        Recommended
                      </Badge>
                    )}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{suggestion.description}</p>
                </div>
                <Badge variant="outline" className={getDifficultyColor(suggestion.difficulty)}>
                  {suggestion.difficulty}
                </Badge>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Pros
                  </h4>
                  <ul className="space-y-1">
                    {suggestion.pros.map((pro, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-red-400 flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    Cons
                  </h4>
                  <ul className="space-y-1">
                    {suggestion.cons.map((con, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Code */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-300">Fixed Code</h4>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(suggestion.code)}
                      className="h-7 text-xs"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownload(suggestion.code, suggestion.title)}
                      className="h-7 text-xs"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto max-h-[400px]">
                  <code className="text-sm text-gray-100 font-mono">{suggestion.code}</code>
                </pre>
              </div>

              {/* Action Button */}
              {onSelectSuggestion && (
                <Button
                  onClick={() => onSelectSuggestion(suggestion)}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Use This Solution
                </Button>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

function getFileExtension(language: string): string {
  const extensions: Record<string, string> = {
    python: 'py',
    javascript: 'js',
    typescript: 'ts',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    csharp: 'cs',
    go: 'go',
    rust: 'rs',
    php: 'php',
    ruby: 'rb',
    swift: 'swift',
    kotlin: 'kt',
  };
  return extensions[language.toLowerCase()] || 'txt';
}
