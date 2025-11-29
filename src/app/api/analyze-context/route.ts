import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface FileData {
  name: string;
  content: string;
  language: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { files } = body as { files: FileData[] };

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { error: 'Files array is required' },
        { status: 400 }
      );
    }

    // Initialize OpenAI client inside the function
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Build context from all files
    const contextPrompt = buildContextPrompt(files);

    // Analyze context with AI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a code analysis expert. Analyze the provided files and identify relationships, dependencies, and potential issues. Return your analysis in a structured format.',
        },
        {
          role: 'user',
          content: contextPrompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const analysisText = response.choices[0].message.content || '';

    return NextResponse.json({
      success: true,
      analysis: analysisText,
      fileCount: files.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error('Context analysis error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to analyze context',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

function buildContextPrompt(files: FileData[]): string {
  let prompt = 'Analyze the following code files and their relationships:\n\n';

  files.forEach((file, index) => {
    prompt += `File ${index + 1}: ${file.name} (${file.language})\n`;
    prompt += '```' + file.language + '\n';
    prompt += file.content.substring(0, 2000); // Limit to 2000 chars per file
    if (file.content.length > 2000) {
      prompt += '\n... (truncated)';
    }
    prompt += '\n```\n\n';
  });

  prompt += `
Please provide:
1. Dependencies between files
2. Shared functions or classes
3. Potential integration issues
4. Code quality concerns
5. Suggestions for improvement

Keep the analysis concise and actionable.
`;

  return prompt;
}
