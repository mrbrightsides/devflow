'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Code2, 
  GitBranch,
  Copy,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

export interface ActivityDetail {
  id: string;
  timestamp: string;
  file: string;
  errorType: string;
  errorMessage: string;
  status: 'success' | 'failed' | 'pending';
  confidence: number;
  duration: number;
  lineNumber?: number;
  traceback: string;
  originalCode: string;
  fixedCode: string;
  commitHash?: string;
  testsPassed: boolean;
}

interface ActivityDetailModalProps {
  activity: ActivityDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActivityDetailModal({ activity, open, onOpenChange }: ActivityDetailModalProps) {
  if (!activity) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-900 border-slate-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl text-white flex items-center gap-2">
                {activity.status === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                {activity.status === 'failed' && <XCircle className="w-5 h-5 text-red-500" />}
                {activity.errorType}
              </DialogTitle>
              <DialogDescription className="text-slate-400 font-mono text-sm mt-1">
                {activity.file}
                {activity.lineNumber && `:${activity.lineNumber}`}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={
                activity.status === 'success' 
                  ? 'border-green-500 text-green-400' 
                  : 'border-red-500 text-red-400'
              }>
                {activity.confidence}% confidence
              </Badge>
              <Badge variant="outline" className="border-blue-500 text-blue-400">
                <Clock className="w-3 h-3 mr-1" />
                {activity.duration}s
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="error" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="error">Error</TabsTrigger>
            <TabsTrigger value="diff">Code Diff</TabsTrigger>
            <TabsTrigger value="trace">Traceback</TabsTrigger>
            <TabsTrigger value="commit">Commit</TabsTrigger>
          </TabsList>

          <TabsContent value="error" className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-300">Error Message</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(activity.errorMessage, 'Error message')}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-red-400 font-mono text-sm">{activity.errorMessage}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-400 mb-1">Timestamp</p>
                <p className="text-white text-sm">{activity.timestamp}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-400 mb-1">Tests Status</p>
                <div className="flex items-center gap-2">
                  {activity.testsPassed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <p className="text-white text-sm">
                    {activity.testsPassed ? 'All Passed' : 'Failed'}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="diff">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-red-400">Original Code</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(activity.originalCode, 'Original code')}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <ScrollArea className="h-64 bg-slate-950 rounded-lg border border-red-900/50">
                  <pre className="p-4 text-xs text-slate-300 font-mono">
                    {activity.originalCode}
                  </pre>
                </ScrollArea>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-green-400">Fixed Code</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(activity.fixedCode, 'Fixed code')}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <ScrollArea className="h-64 bg-slate-950 rounded-lg border border-green-900/50">
                  <pre className="p-4 text-xs text-slate-300 font-mono">
                    {activity.fixedCode}
                  </pre>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trace">
            <div className="bg-slate-950 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-slate-300">Stack Trace</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(activity.traceback, 'Traceback')}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <ScrollArea className="h-64">
                <pre className="p-4 text-xs text-slate-400 font-mono whitespace-pre-wrap">
                  {activity.traceback}
                </pre>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="commit">
            <div className="space-y-4">
              {activity.commitHash ? (
                <>
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GitBranch className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-sm text-slate-400">Commit Hash</p>
                          <p className="text-white font-mono">{activity.commitHash}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-700"
                        onClick={() => copyToClipboard(activity.commitHash!, 'Commit hash')}
                      >
                        <Copy className="w-3 h-3 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                    <p className="text-sm text-slate-400 mb-2">Commit Message</p>
                    <p className="text-white font-mono text-sm">
                      [DevFlow] fix: {activity.errorType} in {activity.file}
                    </p>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on GitHub
                  </Button>
                </>
              ) : (
                <div className="bg-slate-950 p-8 rounded-lg border border-slate-800 text-center">
                  <XCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No commit created for this fix</p>
                  <p className="text-xs text-slate-500 mt-2">
                    Auto-commit might be disabled or the fix failed
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
