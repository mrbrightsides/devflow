'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { History, Trash2, Eye, Copy, Download, Clock, FileCode } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export interface FixHistoryItem {
  id: string;
  timestamp: number;
  language: string;
  originalCode: string;
  fixedCode: string;
  model: string;
  confidence: number;
  analysis: string;
  errorType?: string;
}

const MAX_HISTORY_ITEMS = 50;
const STORAGE_KEY = 'devflow-fix-history';

export function FixHistory() {
  const [history, setHistory] = useState<FixHistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FixHistoryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as FixHistoryItem[];
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
      toast.error('Failed to load history', {
        description: 'History data may be corrupted',
      });
    }
  };

  const saveHistory = (newHistory: FixHistoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error('Failed to save history:', error);
      toast.error('Failed to save history', {
        description: 'Storage may be full',
      });
    }
  };

  const addToHistory = (item: Omit<FixHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: FixHistoryItem = {
      ...item,
      id: `fix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    const newHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
    saveHistory(newHistory);
    toast.success('Added to history!', {
      description: `Total: ${newHistory.length} fixes`,
    });
  };

  const deleteItem = (id: string) => {
    const newHistory = history.filter((item) => item.id !== id);
    saveHistory(newHistory);
    toast.success('Deleted from history');
  };

  const clearAllHistory = () => {
    saveHistory([]);
    setSelectedItem(null);
    toast.success('History cleared');
  };

  const viewItem = (item: FixHistoryItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const copyCode = async (code: string, label: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`${label} copied!`);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const downloadCode = (code: string, item: FixHistoryItem, prefix: string) => {
    try {
      const ext = getFileExtension(item.language);
      const filename = `${prefix}-${Date.now()}.${ext}`;
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
      toast.error('Failed to download');
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
      text: 'txt',
    };
    return extensions[lang] || 'txt';
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Expose addToHistory globally for use by CodeFixer
  useEffect(() => {
    (window as typeof window & { addToFixHistory?: typeof addToHistory }).addToFixHistory = addToHistory;
    return () => {
      delete (window as typeof window & { addToFixHistory?: typeof addToHistory }).addToFixHistory;
    };
  }, [history]);

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-5 w-5 text-blue-400" />
              Fix History
            </CardTitle>
            <CardDescription>
              {history.length === 0
                ? 'No fixes yet'
                : `${history.length} fix${history.length !== 1 ? 'es' : ''} saved`}
            </CardDescription>
          </div>
          {history.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllHistory}
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="h-3 w-3 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No fix history yet</p>
            <p className="text-xs mt-1">Your fixed code will appear here</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {history.map((item, index) => (
                <div key={item.id}>
                  <div className="flex items-start justify-between p-3 rounded-lg bg-gray-900/50 hover:bg-gray-900 transition-colors">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {item.language}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
                          {item.model}
                        </Badge>
                        {item.errorType && (
                          <Badge variant="outline" className="text-xs bg-red-500/10 text-red-400 border-red-500/30">
                            {item.errorType}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {formatDate(item.timestamp)}
                        <span className="text-gray-600">•</span>
                        <span>{item.originalCode.split('\n').length} lines</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-green-400">{(item.confidence * 100).toFixed(0)}% confidence</span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">{item.analysis}</p>
                    </div>
                    <div className="flex items-center gap-1 ml-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => viewItem(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                        onClick={() => deleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {index < history.length - 1 && <Separator className="my-3 bg-gray-700" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* View Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-blue-400" />
                Fix Details
              </DialogTitle>
              <DialogDescription>
                {selectedItem && formatDate(selectedItem.timestamp)}
              </DialogDescription>
            </DialogHeader>

            {selectedItem && (
              <div className="space-y-4 mt-4">
                {/* Meta Info */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{selectedItem.language}</Badge>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                    {selectedItem.model}
                  </Badge>
                  <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                    {(selectedItem.confidence * 100).toFixed(0)}% confidence
                  </Badge>
                  {selectedItem.errorType && (
                    <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
                      {selectedItem.errorType}
                    </Badge>
                  )}
                </div>

                {/* Analysis */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400">{selectedItem.analysis}</p>
                  </CardContent>
                </Card>

                {/* Code Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Original */}
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Original Code</CardTitle>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => copyCode(selectedItem.originalCode, 'Original code')}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => downloadCode(selectedItem.originalCode, selectedItem, 'original')}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs bg-black/30 p-3 rounded-lg overflow-x-auto max-h-[300px] overflow-y-auto">
                        <code className="text-red-300">{selectedItem.originalCode}</code>
                      </pre>
                    </CardContent>
                  </Card>

                  {/* Fixed */}
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Fixed Code</CardTitle>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => copyCode(selectedItem.fixedCode, 'Fixed code')}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => downloadCode(selectedItem.fixedCode, selectedItem, 'fixed')}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs bg-black/30 p-3 rounded-lg overflow-x-auto max-h-[300px] overflow-y-auto">
                        <code className="text-green-300">{selectedItem.fixedCode}</code>
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
