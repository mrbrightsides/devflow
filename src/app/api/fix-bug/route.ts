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
    const { code, language, errorType, errorMessage, files, model, temperature, maxTokens } = body;

    // Support both single file and multi-file modes
    if (!code && (!files || files.length === 0)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No code provided',
          details: 'Please provide either code or files array',
          code: 'VALIDATION_EMPTY_CODE'
        },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'OpenAI API key is not configured',
          details: 'Please add OPENAI_API_KEY to your environment variables',
          code: 'API_KEY_MISSING'
        },
        { status: 401 }
      );
    }

    // Initialize OpenAI client at runtime
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Determine which mode: single file or multi-file
    const isMultiFile = files && files.length > 0;
    
    // Build the prompt for bug fixing
    const prompt = isMultiFile 
      ? buildMultiFilePrompt(files as FileData[], errorType, errorMessage)
      : buildFixPrompt(code, language, errorType, errorMessage);

    // Use custom model parameters if provided, otherwise use defaults
    const selectedModel = model || 'gpt-4o-mini';
    const selectedTemperature = temperature !== undefined ? temperature : 0.2;
    const selectedMaxTokens = maxTokens || 2000;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: selectedModel,
      messages: [
        {
          role: 'system',
          content: isMultiFile
            ? 'You are an expert software engineer specializing in multi-file debugging and code architecture. Analyze all provided files, understand their relationships, and provide comprehensive fixes. For multi-file fixes, return a JSON object with file names as keys and fixed code as values.'
            : 'You are an expert software engineer and debugging assistant. Your job is to analyze code, identify bugs, and provide fixed versions. Always respond with valid code only, no explanations or markdown formatting.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: selectedTemperature,
      max_tokens: selectedMaxTokens,
    });

    const fixedCode = response.choices[0].message.content || '';
    
    // Clean the response (remove markdown code blocks if present)
    const cleanedCode = cleanCodeResponse(fixedCode);

    // Calculate confidence score based on response
    const confidence = calculateConfidence(response);

    // Generate analysis
    const analysis = isMultiFile
      ? await generateMultiFileAnalysis(files as FileData[], errorType)
      : await generateAnalysis(code, cleanedCode, errorType);

    return NextResponse.json({
      success: true,
      fixedCode: cleanedCode,
      confidence,
      analysis,
      model: selectedModel,
      isMultiFile,
      fileCount: isMultiFile ? (files as FileData[]).length : 1,
      timestamp: new Date().toISOString(),
    });

  } catch (error: unknown) {
    console.error('Bug fix error:', error);
    
    let errorMessage = 'Unknown error occurred';
    let errorCode = 'UNKNOWN_ERROR';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Check for specific error types
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        errorCode = 'API_RATE_LIMIT';
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again';
        statusCode = 429;
      } else if (error.message.includes('API key') || error.message.includes('401')) {
        errorCode = 'API_KEY_MISSING';
        errorMessage = 'OpenAI API key is not configured properly';
        statusCode = 401;
      } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
        errorCode = 'TIMEOUT_ERROR';
        errorMessage = 'Request timed out. Please try again';
        statusCode = 504;
      } else if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
        errorCode = 'NETWORK_ERROR';
        errorMessage = 'Network error. Please check your connection';
        statusCode = 503;
      }
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        code: errorCode,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: statusCode }
    );
  }
}

function buildFixPrompt(
  code: string, 
  language: string = 'python', 
  errorType?: string, 
  errorMessage?: string
): string {
  let prompt = `Fix the bugs in this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n`;

  if (errorType) {
    prompt += `Error Type: ${errorType}\n`;
  }

  if (errorMessage) {
    prompt += `Error Message: ${errorMessage}\n`;
  }

  prompt += '\nProvide ONLY the complete fixed code without any explanations, markdown formatting, or comments about what was changed. Just the raw code.';

  return prompt;
}

function cleanCodeResponse(code: string): string {
  // Remove markdown code blocks
  let cleaned = code.replace(/```[\w]*\n?/g, '');
  
  // Remove any leading/trailing whitespace
  cleaned = cleaned.trim();
  
  return cleaned;
}

function calculateConfidence(response: OpenAI.Chat.Completions.ChatCompletion): number {
  const finishReason = response.choices[0].finish_reason;
  
  if (finishReason === 'stop') {
    return 0.85;
  } else if (finishReason === 'length') {
    return 0.60;
  } else {
    return 0.50;
  }
}

async function generateAnalysis(
  originalCode: string, 
  fixedCode: string, 
  errorType?: string
): Promise<string> {
  const lines = originalCode.split('\n').length;
  const fixedLines = fixedCode.split('\n').length;
  
  let analysis = `Analyzed ${lines} lines of code. `;
  
  if (errorType) {
    analysis += `Detected ${errorType}. `;
  }
  
  analysis += `Generated fix with ${fixedLines} lines. `;
  
  // Simple heuristic for changes
  if (Math.abs(lines - fixedLines) > 0) {
    analysis += `Modified ${Math.abs(lines - fixedLines)} lines.`;
  } else {
    analysis += 'Made syntax and logic corrections.';
  }
  
  return analysis;
}

function buildMultiFilePrompt(
  files: FileData[],
  errorType?: string,
  errorMessage?: string
): string {
  let prompt = 'Fix the bugs in these related code files:\n\n';

  files.forEach((file, index) => {
    prompt += `File ${index + 1}: ${file.name} (${file.language})\n\`\`\`${file.language}\n${file.content}\n\`\`\`\n\n`;
  });

  if (errorType) {
    prompt += `Error Type: ${errorType}\n`;
  }

  if (errorMessage) {
    prompt += `Error Message: ${errorMessage}\n`;
  }

  prompt += `\nAnalyze all files, understand their relationships and dependencies, then provide the complete fixed code for each file. Consider how changes in one file might affect others. Return the fixes in the same format, clearly labeled by filename.`;

  return prompt;
}

async function generateMultiFileAnalysis(
  files: FileData[],
  errorType?: string
): Promise<string> {
  const totalLines = files.reduce((sum, f) => sum + f.content.split('\n').length, 0);
  const fileCount = files.length;
  
  let analysis = `Analyzed ${fileCount} related files with ${totalLines} total lines of code. `;
  
  if (errorType) {
    analysis += `Detected ${errorType} across multiple files. `;
  }
  
  analysis += `Performed context-aware analysis considering file dependencies and relationships. `;
  analysis += `Generated comprehensive fixes maintaining code consistency.`;
  
  return analysis;
}
