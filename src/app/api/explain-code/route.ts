import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export interface CodeExplanation {
  summary: string;
  bugType: string;
  rootCause: string;
  impact: string;
  howToFix: string;
  prevention: string;
  complexity: 'simple' | 'moderate' | 'complex';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language, errorType, errorMessage } = body;

    if (!code) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No code provided',
          code: 'VALIDATION_EMPTY_CODE'
        },
        { status: 400 }
      );
    }

    // Initialize OpenAI client at runtime
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });

    const prompt = buildExplanationPrompt(code, language, errorType, errorMessage);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert software engineering teacher who explains bugs in simple, easy-to-understand terms. Analyze the code and explain what's wrong, why it's wrong, and how to fix it. Return ONLY a valid JSON object without any markdown formatting. The object must have: summary, bugType, rootCause, impact, howToFix, prevention, complexity (simple/moderate/complex), and severity (low/medium/high/critical).`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.4,
      max_tokens: 1500,
    });

    const explanationText = response.choices[0].message.content || '';
    
    let explanation: CodeExplanation;
    try {
      const cleanedText = explanationText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      explanation = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse explanation:', parseError);
      explanation = {
        summary: explanationText,
        bugType: errorType || 'Unknown',
        rootCause: 'Could not parse detailed explanation',
        impact: 'May cause runtime errors',
        howToFix: 'Review the code carefully',
        prevention: 'Follow best practices',
        complexity: 'moderate',
        severity: 'medium',
      };
    }

    return NextResponse.json({
      success: true,
      explanation,
      timestamp: new Date().toISOString(),
    });

  } catch (error: unknown) {
    console.error('Explain code error:', error);
    
    let errorMessage = 'Unknown error occurred';
    let errorCode = 'UNKNOWN_ERROR';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        errorCode = 'API_RATE_LIMIT';
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again';
        statusCode = 429;
      }
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        code: errorCode,
      },
      { status: statusCode }
    );
  }
}

function buildExplanationPrompt(
  code: string,
  language: string = 'python',
  errorType?: string,
  errorMessage?: string
): string {
  let prompt = `Explain what's wrong with this ${language} code in simple terms:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n`;

  if (errorType) {
    prompt += `Error Type: ${errorType}\n`;
  }

  if (errorMessage) {
    prompt += `Error Message: ${errorMessage}\n`;
  }

  prompt += `\nProvide a clear explanation in JSON format:
{
  "summary": "One-sentence summary of the bug",
  "bugType": "Type of bug (e.g., SyntaxError, LogicError)",
  "rootCause": "What causes this bug in simple terms",
  "impact": "What problems this bug causes",
  "howToFix": "How to fix it in simple steps",
  "prevention": "How to prevent similar bugs in future",
  "complexity": "simple|moderate|complex",
  "severity": "low|medium|high|critical"
}

IMPORTANT: Return ONLY the JSON object, no markdown, no explanations.`;

  return prompt;
}
