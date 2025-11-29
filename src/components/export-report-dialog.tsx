'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Download, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type ExportFormat = 'json' | 'csv' | 'pdf';

export function ExportReportDialog() {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('json');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    to: new Date()
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock report data
    const reportData = {
      generatedAt: new Date().toISOString(),
      dateRange: {
        from: dateRange.from.toISOString(),
        to: dateRange.to.toISOString()
      },
      summary: {
        totalFixes: 1567,
        successfulFixes: 1369,
        failedFixes: 198,
        successRate: 87.3,
        averageFixTime: 3.2,
        totalTimeSaved: 29.4,
        topErrorTypes: [
          { type: 'ZeroDivisionError', count: 658, percentage: 42 },
          { type: 'TypeError', count: 439, percentage: 28 },
          { type: 'SyntaxError', count: 282, percentage: 18 },
          { type: 'Other', count: 188, percentage: 12 }
        ],
        topFixedFiles: [
          { file: 'calculator.py', fixes: 124 },
          { file: 'database.py', fixes: 98 },
          { file: 'api/user.py', fixes: 87 },
          { file: 'utils/helpers.js', fixes: 76 }
        ]
      },
      activities: Array.from({ length: 50 }, (_, i) => ({
        id: `fix-${i}`,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        file: ['calculator.py', 'database.py', 'api/user.py'][Math.floor(Math.random() * 3)],
        errorType: ['ZeroDivisionError', 'TypeError', 'SyntaxError'][Math.floor(Math.random() * 3)],
        status: Math.random() > 0.15 ? 'success' : 'failed',
        confidence: Math.floor(Math.random() * 20) + 80,
        duration: Number((Math.random() * 5 + 1).toFixed(1))
      }))
    };

    // Create download based on format
    let blob: Blob;
    let filename: string;

    switch (format) {
      case 'json':
        blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        filename = `devflow-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
        break;
      
      case 'csv':
        const csvHeader = 'Timestamp,File,Error Type,Status,Confidence,Duration\n';
        const csvRows = reportData.activities
          .map(a => `${a.timestamp},${a.file},${a.errorType},${a.status},${a.confidence},${a.duration}`)
          .join('\n');
        blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
        filename = `devflow-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        break;
      
      case 'pdf':
        // For PDF, we'd use a library like jsPDF in production
        // For now, create a simple text file
        const pdfContent = `DevFlow.AI Report
Generated: ${format(new Date(), 'PPpp')}
Date Range: ${format(dateRange.from, 'PP')} - ${format(dateRange.to, 'PP')}

SUMMARY
Total Fixes: ${reportData.summary.totalFixes}
Success Rate: ${reportData.summary.successRate}%
Avg Fix Time: ${reportData.summary.averageFixTime}s
Time Saved: ${reportData.summary.totalTimeSaved}h

TOP ERROR TYPES
${reportData.summary.topErrorTypes.map(e => `- ${e.type}: ${e.count} (${e.percentage}%)`).join('\n')}

TOP FIXED FILES
${reportData.summary.topFixedFiles.map(f => `- ${f.file}: ${f.fixes} fixes`).join('\n')}
`;
        blob = new Blob([pdfContent], { type: 'text/plain' });
        filename = `devflow-report-${format(new Date(), 'yyyy-MM-dd')}.txt`;
        break;
    }

    // Trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsExporting(false);
    setOpen(false);

    toast.success('Report Exported Successfully', {
      description: `Downloaded as ${filename}`,
      icon: <CheckCircle2 className="w-4 h-4" />
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-slate-700 text-slate-300">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Export Report</DialogTitle>
          <DialogDescription>
            Download your DevFlow activity report in your preferred format
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-slate-300">Export Format</Label>
            <RadioGroup value={format} onValueChange={(value) => setFormat(value as ExportFormat)}>
              <div className="flex items-center space-x-2 p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 cursor-pointer">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="flex-1 cursor-pointer">
                  <p className="font-semibold text-white">JSON</p>
                  <p className="text-xs text-slate-400">Full structured data with all details</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 cursor-pointer">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex-1 cursor-pointer">
                  <p className="font-semibold text-white">CSV</p>
                  <p className="text-xs text-slate-400">Spreadsheet compatible format</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 cursor-pointer">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex-1 cursor-pointer">
                  <p className="font-semibold text-white">PDF</p>
                  <p className="text-xs text-slate-400">Printable document format</p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <Label className="text-slate-300">Date Range</Label>
            <div className="grid grid-cols-2 gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'justify-start text-left font-normal bg-slate-800 border-slate-700',
                      !dateRange.from && 'text-slate-400'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(dateRange.from, 'PP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => date && setDateRange(prev => ({ ...prev, from: date }))}
                    className="rounded-md border-0"
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'justify-start text-left font-normal bg-slate-800 border-slate-700',
                      !dateRange.to && 'text-slate-400'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(dateRange.to, 'PP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => date && setDateRange(prev => ({ ...prev, to: date }))}
                    className="rounded-md border-0"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-slate-700"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
