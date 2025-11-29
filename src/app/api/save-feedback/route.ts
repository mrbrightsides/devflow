import { NextRequest, NextResponse } from 'next/server';

// In-memory feedback storage (in production, use a database)
const feedbackStore: Array<{
  id: string;
  fixId: string;
  rating: string;
  comment: string;
  model: string;
  timestamp: string;
}> = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fixId, rating, comment, model, timestamp } = body;

    if (!fixId || !rating) {
      return NextResponse.json(
        { error: 'fixId and rating are required' },
        { status: 400 }
      );
    }

    // Store feedback
    const feedback = {
      id: `fb_${Date.now()}`,
      fixId,
      rating,
      comment: comment || '',
      model,
      timestamp: timestamp || new Date().toISOString(),
    };

    feedbackStore.push(feedback);

    // Log feedback for monitoring
    console.log('📊 Feedback received:', {
      fixId,
      rating,
      model,
      hasComment: !!comment,
    });

    return NextResponse.json({
      success: true,
      feedbackId: feedback.id,
      message: 'Feedback saved successfully',
    });
  } catch (error: unknown) {
    console.error('Feedback save error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to save feedback',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return feedback statistics
    const positiveCount = feedbackStore.filter(f => f.rating === 'positive').length;
    const negativeCount = feedbackStore.filter(f => f.rating === 'negative').length;
    const totalCount = feedbackStore.length;

    return NextResponse.json({
      success: true,
      stats: {
        total: totalCount,
        positive: positiveCount,
        negative: negativeCount,
        positiveRate: totalCount > 0 ? (positiveCount / totalCount) * 100 : 0,
      },
      recentFeedback: feedbackStore.slice(-10).reverse(),
    });
  } catch (error: unknown) {
    console.error('Feedback retrieval error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to retrieve feedback',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
