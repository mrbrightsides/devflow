'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, MessageSquare, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export interface FeedbackData {
  fixId: string;
  rating: 'positive' | 'negative' | null;
  comment: string;
  timestamp: string;
}

interface FeedbackSystemProps {
  fixId: string;
  originalCode: string;
  fixedCode: string;
  model: string;
}

export function FeedbackSystem({ fixId, originalCode, fixedCode, model }: FeedbackSystemProps) {
  const [rating, setRating] = useState<'positive' | 'negative' | null>(null);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleRating = async (newRating: 'positive' | 'negative') => {
    setRating(newRating);
    
    // Auto-submit on thumbs up without comment
    if (newRating === 'positive' && !comment) {
      await submitFeedback(newRating, '');
    }
  };

  const submitFeedback = async (feedbackRating: 'positive' | 'negative', feedbackComment: string) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/save-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fixId,
          rating: feedbackRating,
          comment: feedbackComment,
          model,
          originalCode: originalCode.substring(0, 200), // First 200 chars for context
          fixedCode: fixedCode.substring(0, 200),
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        toast.success('Feedback submitted!', {
          description: 'Thank you for helping improve DevFlow.AI',
        });
      } else {
        toast.error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Feedback error:', error);
      toast.error('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!rating) {
      toast.error('Please select a rating first');
      return;
    }

    await submitFeedback(rating, comment);
  };

  if (submitted) {
    return (
      <Card className="bg-green-500/10 border-green-500/20">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <h4 className="text-lg font-medium text-green-400 mb-1">
              Thank You!
            </h4>
            <p className="text-sm text-gray-400">
              Your feedback helps us improve our AI models
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-400" />
            How was this fix?
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Optional
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rating Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => handleRating('positive')}
            variant={rating === 'positive' ? 'default' : 'outline'}
            className={`flex-1 ${
              rating === 'positive'
                ? 'bg-green-600 hover:bg-green-700'
                : 'border-gray-700 hover:bg-gray-800'
            }`}
            disabled={isSubmitting || submitted}
          >
            <ThumbsUp className="w-4 h-4 mr-2" />
            Helpful
          </Button>
          <Button
            onClick={() => handleRating('negative')}
            variant={rating === 'negative' ? 'default' : 'outline'}
            className={`flex-1 ${
              rating === 'negative'
                ? 'bg-red-600 hover:bg-red-700'
                : 'border-gray-700 hover:bg-gray-800'
            }`}
            disabled={isSubmitting || submitted}
          >
            <ThumbsDown className="w-4 h-4 mr-2" />
            Not Helpful
          </Button>
        </div>

        {/* Comment Section (shown after negative rating or optionally for positive) */}
        {rating && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="text-sm text-gray-400">
              Additional Comments {rating === 'negative' && '(Recommended)'}
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                rating === 'positive'
                  ? 'What did you like about this fix? (optional)'
                  : 'What could be improved? (help us learn)'
              }
              className="min-h-[80px] bg-gray-900 border-gray-700 text-gray-100"
              disabled={isSubmitting}
            />
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || (rating === 'negative' && !comment.trim())}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        )}

        {/* Info Text */}
        <p className="text-xs text-gray-500 text-center">
          Your feedback helps train better AI models for everyone
        </p>
      </CardContent>
    </Card>
  );
}
