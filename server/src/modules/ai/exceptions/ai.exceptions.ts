import { HttpException, HttpStatus } from '@nestjs/common';

export class AIServiceException extends HttpException {
  constructor(message: string, details?: any) {
    super(
      {
        message: message || 'AI service error occurred',
        error: 'AIServiceError',
        details,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class GeminiAPIException extends HttpException {
  constructor(message: string, details?: any) {
    super(
      {
        message: message || 'Gemini API error',
        error: 'GeminiAPIError',
        details,
      },
      HttpStatus.BAD_GATEWAY,
    );
  }
}

export class ConversationNotFoundException extends HttpException {
  constructor(conversationId: string) {
    super(
      {
        message: `Conversation with ID ${conversationId} not found`,
        error: 'ConversationNotFound',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class FunctionExecutionException extends HttpException {
  constructor(functionName: string, details?: any) {
    super(
      {
        message: `Failed to execute function: ${functionName}`,
        error: 'FunctionExecutionError',
        details,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class InvalidFunctionCallException extends HttpException {
  constructor(functionName: string) {
    super(
      {
        message: `Invalid or unknown function: ${functionName}`,
        error: 'InvalidFunctionCall',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class AIContextException extends HttpException {
  constructor(message: string) {
    super(
      {
        message: message || 'Failed to build AI context',
        error: 'AIContextError',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
