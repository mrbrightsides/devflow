'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowDown
} from 'lucide-react';
import { ActivityDetailModal, type ActivityDetail } from './activity-detail-modal';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 10;

// Mock activity data generator
const generateActivity = (): ActivityDetail => {
  const errorTypes = ['ZeroDivisionError', 'TypeError', 'SyntaxError', 'AttributeError', 'KeyError'];
  const files = ['calculator.py', 'database.py', 'api/user.py', 'utils/helpers.js', 'models/user.ts'];
  const status: ('success' | 'failed')[] = ['success', 'success', 'success', 'success', 'failed'];
  
  const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
  const file = files[Math.floor(Math.random() * files.length)];
  const activityStatus = status[Math.floor(Math.random() * status.length)];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toLocaleTimeString(),
    file,
    errorType,
    errorMessage: `Invalid operation in ${file}`,
    status: activityStatus,
    confidence: Math.floor(Math.random() * 20) + 80,
    duration: Number((Math.random() * 5 + 1).toFixed(1)),
    lineNumber: Math.floor(Math.random() * 100) + 1,
    traceback: `Traceback (most recent call last):
  File "${file}", line ${Math.floor(Math.random() * 100)}, in <module>
    result = calculate()
  File "${file}", line ${Math.floor(Math.random() * 100)}, in calculate
    return x / y
${errorType}: division by zero`,
    originalCode: `def calculate(x, y):
    # BUG: No zero check
    return x / y

result = calculate(10, 0)
print(result)`,
    fixedCode: `def calculate(x, y):
    # Fixed: Added zero division check
    if y == 0:
        raise ValueError("Cannot divide by zero")
    return x / y

result = calculate(10, 0)
print(result)`,
    commitHash: activityStatus === 'success' ? Math.random().toString(36).substr(2, 7) : undefined,
    testsPassed: activityStatus === 'success'
  };
};

export function EnhancedLiveActivityFeed() {
  const [activities, setActivities] = useState<ActivityDetail[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityDetail[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<ActivityDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize with some activities
  useEffect(() => {
    const initial = Array.from({ length: 15 }, generateActivity);
    setActivities(initial);
    setFilteredActivities(initial);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = generateActivity();
      setActivities(prev => [newActivity, ...prev]);
      
      // Show toast notification
      toast(
        newActivity.status === 'success' ? 'Fix Applied Successfully' : 'Fix Failed',
        {
          description: `${newActivity.errorType} in ${newActivity.file}`,
          icon: newActivity.status === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />
        }
      );
    }, 8000); // New activity every 8 seconds

    return () => clearInterval(interval);
  }, []);

  // Filter activities
  useEffect(() => {
    let filtered = activities;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(activity =>
        activity.file.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.errorType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.errorMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(activity => activity.status === statusFilter);
    }

    setFilteredActivities(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [activities, searchQuery, statusFilter]);

  // Auto-scroll to top when new activity arrives
  useEffect(() => {
    if (isAutoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activities, isAutoScroll]);

  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleActivityClick = (activity: ActivityDetail) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                Live Activity Feed
                <Badge variant="outline" className="border-green-500 text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Live
                </Badge>
              </CardTitle>
              <CardDescription>
                Real-time monitoring of fixes and errors
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700"
              onClick={() => setIsAutoScroll(!isAutoScroll)}
            >
              <ArrowDown className={`w-4 h-4 mr-2 ${isAutoScroll ? 'animate-bounce' : ''}`} />
              {isAutoScroll ? 'Auto-scroll ON' : 'Auto-scroll OFF'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by file, error type, or message..."
                className="pl-10 bg-slate-900 border-slate-700 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: 'all' | 'success' | 'failed') => setStatusFilter(value)}>
              <SelectTrigger className="w-40 bg-slate-900 border-slate-700">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success Only</SelectItem>
                <SelectItem value="failed">Failed Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Activity List */}
          <div ref={scrollRef} className="space-y-3 max-h-96 overflow-y-auto">
            {paginatedActivities.map((activity, index) => (
              <div
                key={activity.id}
                className="bg-slate-900 p-4 rounded-lg border border-slate-700 hover:border-slate-600 cursor-pointer transition-all animate-in fade-in slide-in-from-top-2 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleActivityClick(activity)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {activity.status === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      )}
                      <span className="text-white font-semibold">{activity.errorType}</span>
                      <Badge 
                        variant="outline" 
                        className={activity.status === 'success' ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}
                      >
                        {activity.confidence}%
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-sm font-mono mb-2">{activity.file}</p>
                    <p className="text-slate-500 text-sm">{activity.errorMessage}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <span className="text-xs text-slate-500">{activity.timestamp}</span>
                    <Badge variant="outline" className="border-blue-500 text-blue-400 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {activity.duration}s
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
              <p className="text-sm text-slate-400">
                Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredActivities.length)} of {filteredActivities.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-700"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-slate-400">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-700"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ActivityDetailModal
        activity={selectedActivity}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
