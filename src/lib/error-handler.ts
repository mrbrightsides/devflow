import { toast } from 'sonner';

export interface AppError {
  code: string;
  message: string;
  description?: string;
  action?: string;
}

export const ErrorCodes = {
  // Network Errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  
  // API Errors
  API_KEY_MISSING: 'API_KEY_MISSING',
  API_RATE_LIMIT: 'API_RATE_LIMIT',
  API_INVALID_RESPONSE: 'API_INVALID_RESPONSE',
  
  // Validation Errors
  VALIDATION_EMPTY_CODE: 'VALIDATION_EMPTY_CODE',
  VALIDATION_NO_FILES: 'VALIDATION_NO_FILES',
  VALIDATION_FILE_TOO_LARGE: 'VALIDATION_FILE_TOO_LARGE',
  VALIDATION_INVALID_LANGUAGE: 'VALIDATION_INVALID_LANGUAGE',
  
  // Processing Errors
  PROCESSING_FAILED: 'PROCESSING_FAILED',
  PARSING_FAILED: 'PARSING_FAILED',
  
  // Storage Errors
  STORAGE_FULL: 'STORAGE_FULL',
  STORAGE_CORRUPTED: 'STORAGE_CORRUPTED',
  
  // Unknown
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export const ErrorMessages: Record<string, AppError> = {
  [ErrorCodes.NETWORK_ERROR]: {
    code: ErrorCodes.NETWORK_ERROR,
    message: 'Network connection failed',
    description: 'Please check your internet connection and try again',
    action: 'Retry',
  },
  [ErrorCodes.TIMEOUT_ERROR]: {
    code: ErrorCodes.TIMEOUT_ERROR,
    message: 'Request timed out',
    description: 'The request took too long. Please try again',
    action: 'Retry',
  },
  [ErrorCodes.API_KEY_MISSING]: {
    code: ErrorCodes.API_KEY_MISSING,
    message: 'API key not configured',
    description: 'OpenAI API key is missing. Please contact support',
    action: 'Contact Support',
  },
  [ErrorCodes.API_RATE_LIMIT]: {
    code: ErrorCodes.API_RATE_LIMIT,
    message: 'Rate limit exceeded',
    description: 'Too many requests. Please wait a moment and try again',
    action: 'Wait',
  },
  [ErrorCodes.API_INVALID_RESPONSE]: {
    code: ErrorCodes.API_INVALID_RESPONSE,
    message: 'Invalid API response',
    description: 'Received unexpected response from AI service',
    action: 'Retry',
  },
  [ErrorCodes.VALIDATION_EMPTY_CODE]: {
    code: ErrorCodes.VALIDATION_EMPTY_CODE,
    message: 'No code provided',
    description: 'Please enter or paste some code to fix',
    action: 'Add Code',
  },
  [ErrorCodes.VALIDATION_NO_FILES]: {
    code: ErrorCodes.VALIDATION_NO_FILES,
    message: 'No files uploaded',
    description: 'Please upload at least one file to analyze',
    action: 'Upload Files',
  },
  [ErrorCodes.VALIDATION_FILE_TOO_LARGE]: {
    code: ErrorCodes.VALIDATION_FILE_TOO_LARGE,
    message: 'File too large',
    description: 'Please upload files smaller than 1MB',
    action: 'Choose Smaller Files',
  },
  [ErrorCodes.VALIDATION_INVALID_LANGUAGE]: {
    code: ErrorCodes.VALIDATION_INVALID_LANGUAGE,
    message: 'Unsupported language',
    description: 'Please select a supported programming language',
    action: 'Select Language',
  },
  [ErrorCodes.PROCESSING_FAILED]: {
    code: ErrorCodes.PROCESSING_FAILED,
    message: 'Processing failed',
    description: 'Failed to process your request. Please try again',
    action: 'Retry',
  },
  [ErrorCodes.PARSING_FAILED]: {
    code: ErrorCodes.PARSING_FAILED,
    message: 'Failed to parse code',
    description: 'The code format is invalid or corrupted',
    action: 'Check Code',
  },
  [ErrorCodes.STORAGE_FULL]: {
    code: ErrorCodes.STORAGE_FULL,
    message: 'Storage is full',
    description: 'Browser storage is full. Please clear some history',
    action: 'Clear History',
  },
  [ErrorCodes.STORAGE_CORRUPTED]: {
    code: ErrorCodes.STORAGE_CORRUPTED,
    message: 'Storage data corrupted',
    description: 'Local storage data is corrupted. Consider clearing history',
    action: 'Clear History',
  },
  [ErrorCodes.UNKNOWN_ERROR]: {
    code: ErrorCodes.UNKNOWN_ERROR,
    message: 'An unexpected error occurred',
    description: 'Something went wrong. Please try again',
    action: 'Retry',
  },
};

export function handleError(error: unknown, context?: string): AppError {
  console.error(`Error in ${context || 'unknown context'}:`, error);

  // Handle fetch/network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return ErrorMessages[ErrorCodes.NETWORK_ERROR];
  }

  // Handle timeout errors
  if (error instanceof Error && error.message.toLowerCase().includes('timeout')) {
    return ErrorMessages[ErrorCodes.TIMEOUT_ERROR];
  }

  // Handle API errors from response
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const errorCode = (error as { code: string }).code;
    if (errorCode in ErrorMessages) {
      return ErrorMessages[errorCode];
    }
  }

  // Handle generic Error objects
  if (error instanceof Error) {
    // Check for specific error patterns
    if (error.message.includes('rate limit')) {
      return ErrorMessages[ErrorCodes.API_RATE_LIMIT];
    }
    if (error.message.includes('API key')) {
      return ErrorMessages[ErrorCodes.API_KEY_MISSING];
    }
    if (error.message.includes('storage') || error.message.includes('quota')) {
      return ErrorMessages[ErrorCodes.STORAGE_FULL];
    }

    // Return custom error with original message
    return {
      code: ErrorCodes.UNKNOWN_ERROR,
      message: error.message,
      description: 'An unexpected error occurred',
    };
  }

  // Fallback for unknown errors
  return ErrorMessages[ErrorCodes.UNKNOWN_ERROR];
}

export function showErrorToast(error: unknown, context?: string): void {
  const appError = handleError(error, context);
  
  toast.error(appError.message, {
    description: appError.description,
    action: appError.action
      ? {
          label: appError.action,
          onClick: () => {
            // Could implement specific actions here
            console.log('Error action clicked:', appError.action);
          },
        }
      : undefined,
  });
}

export function validateCode(code: string): boolean {
  if (!code || code.trim().length === 0) {
    showErrorToast({ code: ErrorCodes.VALIDATION_EMPTY_CODE }, 'validateCode');
    return false;
  }
  return true;
}

export function validateFiles(files: unknown[]): boolean {
  if (!files || files.length === 0) {
    showErrorToast({ code: ErrorCodes.VALIDATION_NO_FILES }, 'validateFiles');
    return false;
  }
  return true;
}

export function validateLanguage(language: string): boolean {
  const supportedLanguages = ['python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'ruby', 'go', 'rust', 'php'];
  
  if (!supportedLanguages.includes(language.toLowerCase())) {
    showErrorToast({ code: ErrorCodes.VALIDATION_INVALID_LANGUAGE }, 'validateLanguage');
    return false;
  }
  return true;
}
