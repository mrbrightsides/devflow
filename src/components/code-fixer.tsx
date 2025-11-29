'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Wand2, Code2, AlertCircle, FileStack, Sparkles, Lightbulb, Shield, GitCompare } from 'lucide-react';
import { toast } from 'sonner';
import { showErrorToast, ErrorCodes } from '@/lib/error-handler';
import { EnhancedCodeDiffViewer } from './enhanced-code-diff-viewer';
import { FixHistory } from './fix-history';
import { MultiFileUploader, type UploadedFile } from './multi-file-uploader';
import { ModelSelector, type ModelConfig } from './model-selector';
import { FeedbackSystem } from './feedback-system';
import { ContextAnalyzer } from './context-analyzer';
import { buggyExamples, type BuggyExample } from '@/lib/buggy-examples';
import { MultipleSuggestions } from './multiple-suggestions';
import { CodeExplanationComponent } from './code-explanation';
import { SecurityScanner } from './security-scanner';
import type { FixSuggestion } from '@/app/api/generate-suggestions/route';
import type { CodeExplanation } from '@/app/api/explain-code/route';
import type { SecurityScanResult } from '@/app/api/scan-security/route';

interface FixResult {
  fixedCode: string;
  confidence: number;
  analysis: string;
  model: string;
  timestamp: string;
}

export function CodeFixer() {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('python');
  const [errorType, setErrorType] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isFixing, setIsFixing] = useState<boolean>(false);
  const [fixResult, setFixResult] = useState<FixResult | null>(null);
  const [selectedExample, setSelectedExample] = useState<string>('');
  const [mode, setMode] = useState<'single' | 'multi'>('single');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    model: 'gpt-4o-mini',
    temperature: 0.2,
    maxTokens: 2000,
  });
  const [suggestions, setSuggestions] = useState<FixSuggestion[] | null>(null);
  const [explanation, setExplanation] = useState<CodeExplanation | null>(null);
  const [securityResult, setSecurityResult] = useState<SecurityScanResult | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(false);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState<boolean>(false);
  const [isLoadingSecurity, setIsLoadingSecurity] = useState<boolean>(false);

  const handleFixBug = async () => {
    // Validation based on mode
    if (mode === 'single' && !code.trim()) {
      showErrorToast({ code: ErrorCodes.VALIDATION_EMPTY_CODE }, 'handleFixBug');
      return;
    }
    
    if (mode === 'multi' && uploadedFiles.length === 0) {
      showErrorToast({ code: ErrorCodes.VALIDATION_NO_FILES }, 'handleFixBug');
      return;
    }

    setIsFixing(true);
    setFixResult(null);

    try {
      const requestBody = mode === 'multi'
        ? {
            files: uploadedFiles.map(f => ({
              name: f.name,
              content: f.content,
              language: f.language,
            })),
            errorType: errorType || undefined,
            errorMessage: errorMessage || undefined,
            model: modelConfig.model,
            temperature: modelConfig.temperature,
            maxTokens: modelConfig.maxTokens,
          }
        : {
            code,
            language,
            errorType: errorType || undefined,
            errorMessage: errorMessage || undefined,
            model: modelConfig.model,
            temperature: modelConfig.temperature,
            maxTokens: modelConfig.maxTokens,
          };

      const response = await fetch('/api/fix-bug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        const resultData: FixResult = {
          fixedCode: data.fixedCode,
          confidence: data.confidence,
          analysis: data.analysis,
          model: data.model,
          timestamp: data.timestamp,
        };
        setFixResult(resultData);
        
        // Add to history
        if (typeof window !== 'undefined' && (window as typeof window & { addToFixHistory?: (item: { language: string; originalCode: string; fixedCode: string; model: string; confidence: number; analysis: string; errorType?: string }) => void }).addToFixHistory) {
          (window as typeof window & { addToFixHistory: (item: { language: string; originalCode: string; fixedCode: string; model: string; confidence: number; analysis: string; errorType?: string }) => void }).addToFixHistory({
            language: mode === 'single' ? language : 'multi',
            originalCode: mode === 'single' ? code : uploadedFiles.map(f => f.content).join('\n\n---\n\n'),
            fixedCode: data.fixedCode,
            model: data.model,
            confidence: data.confidence,
            analysis: data.analysis,
            errorType: errorType || undefined,
          });
        }
        
        const successMessage = mode === 'multi'
          ? `Fixed ${data.fileCount} files successfully!`
          : 'Code fixed successfully!';
        
        toast.success(successMessage, {
          description: `${data.model} • Confidence: ${(data.confidence * 100).toFixed(0)}%`,
        });
      } else {
        throw new Error(data.error || 'Failed to fix code');
      }
    } catch (error) {
      console.error('Fix bug error:', error);
      showErrorToast(error, 'handleFixBug');
    } finally {
      setIsFixing(false);
    }
  };

  const loadExample = (exampleId: string) => {
    const example = buggyExamples.find((ex: BuggyExample) => ex.id === exampleId);
    if (example) {
      setCode(example.code);
      setLanguage(example.language);
      setErrorType(example.errorType);
      setErrorMessage(example.description);
      setSelectedExample(exampleId);
      setFixResult(null);
      toast.success('Example loaded!', {
        description: example.title,
      });
    }
  };

  const clearAll = () => {
    setCode('');
    setErrorType('');
    setErrorMessage('');
    setFixResult(null);
    setSelectedExample('');
    setSuggestions(null);
    setExplanation(null);
    setSecurityResult(null);
  };

  const handleGenerateSuggestions = async () => {
    if (!code.trim() && mode === 'single') {
      showErrorToast({ code: ErrorCodes.VALIDATION_EMPTY_CODE }, 'handleGenerateSuggestions');
      return;
    }

    setIsLoadingSuggestions(true);
    setSuggestions(null);

    try {
      const response = await fetch('/api/generate-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: mode === 'single' ? code : uploadedFiles.map(f => f.content).join('\n\n'),
          language: mode === 'single' ? language : 'multi',
          errorType: errorType || undefined,
          errorMessage: errorMessage || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSuggestions(data.suggestions);
        toast.success('Generated multiple fix suggestions!', {
          description: `${data.count} different approaches available`,
        });
      } else {
        throw new Error(data.error || 'Failed to generate suggestions');
      }
    } catch (error) {
      console.error('Generate suggestions error:', error);
      showErrorToast(error, 'handleGenerateSuggestions');
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleExplainCode = async () => {
    if (!code.trim() && mode === 'single') {
      showErrorToast({ code: ErrorCodes.VALIDATION_EMPTY_CODE }, 'handleExplainCode');
      return;
    }

    setIsLoadingExplanation(true);
    setExplanation(null);

    try {
      const response = await fetch('/api/explain-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: mode === 'single' ? code : uploadedFiles.map(f => f.content).join('\n\n'),
          language: mode === 'single' ? language : 'multi',
          errorType: errorType || undefined,
          errorMessage: errorMessage || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setExplanation(data.explanation);
        toast.success('Code explained successfully!', {
          description: 'Understanding the bug and how to fix it',
        });
      } else {
        throw new Error(data.error || 'Failed to explain code');
      }
    } catch (error) {
      console.error('Explain code error:', error);
      showErrorToast(error, 'handleExplainCode');
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  const handleSecurityScan = async () => {
    if (!code.trim() && mode === 'single') {
      showErrorToast({ code: ErrorCodes.VALIDATION_EMPTY_CODE }, 'handleSecurityScan');
      return;
    }

    setIsLoadingSecurity(true);
    setSecurityResult(null);

    try {
      const response = await fetch('/api/scan-security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: mode === 'single' ? code : uploadedFiles.map(f => f.content).join('\n\n'),
          language: mode === 'single' ? language : 'multi',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSecurityResult(data.result);
        toast.success('Security scan completed!', {
          description: data.result.safe ? 'No vulnerabilities found' : `Found ${data.result.totalIssues} issues`,
        });
      } else {
        throw new Error(data.error || 'Failed to scan security');
      }
    } catch (error) {
      console.error('Security scan error:', error);
      showErrorToast(error, 'handleSecurityScan');
    } finally {
      setIsLoadingSecurity(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2 flex items-center gap-2">
            AI Code Fixer
            <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 border-purple-500/50">
              <Sparkles className="w-3 h-3 mr-1" />
              Phase 2
            </Badge>
          </h2>
          <p className="text-sm text-gray-400">
            Enhanced with multi-file support, custom AI models, and context-aware analysis
          </p>
        </div>
      </div>

      {/* Mode Selector */}
      <Tabs value={mode} onValueChange={(v) => setMode(v as 'single' | 'multi')} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-800/50 border border-gray-700">
          <TabsTrigger value="single" className="data-[state=active]:bg-blue-600">
            <Code2 className="w-4 h-4 mr-2" />
            Single File
          </TabsTrigger>
          <TabsTrigger value="multi" className="data-[state=active]:bg-purple-600">
            <FileStack className="w-4 h-4 mr-2" />
            Multi-File
          </TabsTrigger>
        </TabsList>

        {/* Single File Mode */}
        <TabsContent value="single" className="space-y-6 mt-6">

          {/* Input Section */}
          <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Code2 className="h-5 w-5 text-blue-400" />
                Input Code
              </CardTitle>
              <CardDescription>Enter your buggy code or select an example</CardDescription>
            </div>
            <Select value={selectedExample} onValueChange={loadExample}>
              <SelectTrigger className="w-[200px] bg-gray-900 border-gray-700">
                <SelectValue placeholder="Load example..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="div-by-zero">Division by Zero</SelectItem>
                <SelectItem value="syntax-error">Syntax Error</SelectItem>
                <SelectItem value="type-error">Type Mismatch</SelectItem>
                <SelectItem value="index-error">Index Error</SelectItem>
                <SelectItem value="undefined-var">Undefined Variable</SelectItem>
                <SelectItem value="infinite-loop">Infinite Loop</SelectItem>
                <SelectItem value="null-reference">Null Reference</SelectItem>
                <SelectItem value="file-not-found">File Not Found</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-gray-900 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Error Type (Optional)</label>
              <input
                type="text"
                value={errorType}
                onChange={(e) => setErrorType(e.target.value)}
                placeholder="e.g., SyntaxError, TypeError"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Error Message (Optional)</label>
            <input
              type="text"
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              placeholder="e.g., division by zero"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Your Code</label>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your buggy code here..."
              className="min-h-[300px] font-mono text-sm bg-gray-900 border-gray-700 text-gray-100"
            />
          </div>
          </CardContent>
        </Card>
        </TabsContent>

        {/* Multi-File Mode */}
        <TabsContent value="multi" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <MultiFileUploader
                onFilesChange={setUploadedFiles}
                maxFiles={5}
              />

              {uploadedFiles.length > 0 && (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Error Details (Optional)</CardTitle>
                    <CardDescription>
                      Provide error information to help AI diagnose the issue
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Error Type</label>
                      <input
                        type="text"
                        value={errorType}
                        onChange={(e) => setErrorType(e.target.value)}
                        placeholder="e.g., ImportError, ReferenceError"
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Error Message</label>
                      <input
                        type="text"
                        value={errorMessage}
                        onChange={(e) => setErrorMessage(e.target.value)}
                        placeholder="e.g., module not found"
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <ContextAnalyzer files={uploadedFiles} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Model Configuration */}
      <ModelSelector
        config={modelConfig}
        onChange={setModelConfig}
      />

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Primary Fix Button */}
        <div className="flex gap-3">
          <Button
            onClick={handleFixBug}
            disabled={isFixing || (mode === 'single' && !code.trim()) || (mode === 'multi' && uploadedFiles.length === 0)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isFixing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing with {modelConfig.model}...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                {mode === 'multi' ? `Fix ${uploadedFiles.length} Files` : 'Fix Bug with AI'}
              </>
            )}
          </Button>
          <Button
            onClick={clearAll}
            variant="outline"
            className="border-gray-700 hover:bg-gray-800"
          >
            Clear
          </Button>
        </div>

        {/* Enhanced AI Features - Option 3 */}
        <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <CardTitle className="text-sm">Enhanced AI Features</CardTitle>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 text-xs">
                Option 3
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Get multiple solutions, detailed explanations, and security analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Button
              onClick={handleGenerateSuggestions}
              disabled={isLoadingSuggestions || (mode === 'single' && !code.trim()) || (mode === 'multi' && uploadedFiles.length === 0)}
              variant="outline"
              className="border-purple-500/50 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300"
              size="sm"
            >
              {isLoadingSuggestions ? (
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              ) : (
                <GitCompare className="mr-2 h-3 w-3" />
              )}
              Multiple Suggestions
            </Button>
            <Button
              onClick={handleExplainCode}
              disabled={isLoadingExplanation || (mode === 'single' && !code.trim()) || (mode === 'multi' && uploadedFiles.length === 0)}
              variant="outline"
              className="border-yellow-500/50 hover:bg-yellow-500/20 text-yellow-400 hover:text-yellow-300"
              size="sm"
            >
              {isLoadingExplanation ? (
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              ) : (
                <Lightbulb className="mr-2 h-3 w-3" />
              )}
              Explain Bug
            </Button>
            <Button
              onClick={handleSecurityScan}
              disabled={isLoadingSecurity || (mode === 'single' && !code.trim()) || (mode === 'multi' && uploadedFiles.length === 0)}
              variant="outline"
              className="border-green-500/50 hover:bg-green-500/20 text-green-400 hover:text-green-300"
              size="sm"
            >
              {isLoadingSecurity ? (
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              ) : (
                <Shield className="mr-2 h-3 w-3" />
              )}
              Security Scan
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Result Section */}
      {fixResult && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-100">Result</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                Fixed Successfully
              </Badge>
              <Badge variant="outline" className="text-xs">
                {fixResult.model}
              </Badge>
            </div>
          </div>

          <EnhancedCodeDiffViewer
            originalCode={mode === 'single' ? code : uploadedFiles.map(f => f.content).join('\n\n---\n\n')}
            fixedCode={fixResult.fixedCode}
            language={mode === 'single' ? language : 'text'}
            confidence={fixResult.confidence}
            analysis={fixResult.analysis}
            fileName={mode === 'single' ? 'code' : 'multi-file'}
          />

          {/* Feedback System */}
          <FeedbackSystem
            fixId={`fix_${Date.now()}`}
            originalCode={mode === 'single' ? code : uploadedFiles.map(f => f.content).join('\n')}
            fixedCode={fixResult.fixedCode}
            model={fixResult.model}
          />
        </div>
      )}

      {/* Option 3 Results */}
      {suggestions && (
        <MultipleSuggestions
          suggestions={suggestions}
          language={mode === 'single' ? language : 'multi'}
          onSelectSuggestion={(suggestion) => {
            if (mode === 'single') {
              setCode(suggestion.code);
            }
            toast.success('Applied suggestion!', {
              description: suggestion.title,
            });
          }}
        />
      )}

      {explanation && (
        <CodeExplanationComponent explanation={explanation} />
      )}

      {securityResult && (
        <SecurityScanner result={securityResult} />
      )}

      {/* Fix History */}
      <FixHistory />
    </div>
  );
}
