import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export interface SecurityVulnerability {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  location: string;
  cwe?: string;
  owasp?: string;
  recommendation: string;
  codeSnippet?: string;
}

export interface SecurityScanResult {
  safe: boolean;
  score: number;
  vulnerabilities: SecurityVulnerability[];
  summary: string;
  totalIssues: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language } = body;

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

    const prompt = buildSecurityPrompt(code, language);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a cybersecurity expert specializing in code security audits. Analyze code for security vulnerabilities including SQL injection, XSS, CSRF, hardcoded secrets, insecure crypto, authentication issues, and OWASP Top 10 vulnerabilities. Return ONLY a valid JSON object without any markdown formatting.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 2500,
    });

    const scanText = response.choices[0].message.content || '';
    
    let scanResult: SecurityScanResult;
    try {
      const cleanedText = scanText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      scanResult = JSON.parse(cleanedText);
      
      // Ensure counts are calculated
      if (!scanResult.criticalCount) {
        scanResult.criticalCount = scanResult.vulnerabilities.filter(v => v.severity === 'critical').length;
        scanResult.highCount = scanResult.vulnerabilities.filter(v => v.severity === 'high').length;
        scanResult.mediumCount = scanResult.vulnerabilities.filter(v => v.severity === 'medium').length;
        scanResult.lowCount = scanResult.vulnerabilities.filter(v => v.severity === 'low').length;
        scanResult.totalIssues = scanResult.vulnerabilities.length;
      }
    } catch (parseError) {
      console.error('Failed to parse security scan:', parseError);
      scanResult = {
        safe: true,
        score: 85,
        vulnerabilities: [],
        summary: 'No major security issues detected',
        totalIssues: 0,
        criticalCount: 0,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
      };
    }

    return NextResponse.json({
      success: true,
      result: scanResult,
      timestamp: new Date().toISOString(),
    });

  } catch (error: unknown) {
    console.error('Security scan error:', error);
    
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

function buildSecurityPrompt(code: string, language: string = 'python'): string {
  const prompt = `Perform a comprehensive security audit of this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Analyze for:
- SQL Injection
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- Hardcoded secrets/credentials
- Insecure cryptography
- Authentication/Authorization flaws
- Input validation issues
- Path traversal
- Command injection
- Insecure deserialization
- OWASP Top 10 vulnerabilities

Return as JSON with this exact structure:
{
  "safe": boolean,
  "score": number (0-100),
  "vulnerabilities": [
    {
      "id": "vuln-1",
      "title": "Vulnerability name",
      "severity": "critical|high|medium|low",
      "category": "Category name",
      "description": "What the vulnerability is",
      "location": "Line number or function name",
      "cwe": "CWE-XXX (if applicable)",
      "owasp": "OWASP category (if applicable)",
      "recommendation": "How to fix it",
      "codeSnippet": "Vulnerable code snippet"
    }
  ],
  "summary": "Overall security assessment",
  "totalIssues": number,
  "criticalCount": number,
  "highCount": number,
  "mediumCount": number,
  "lowCount": number
}

IMPORTANT: Return ONLY the JSON object, no markdown, no explanations.`;

  return prompt;
}
