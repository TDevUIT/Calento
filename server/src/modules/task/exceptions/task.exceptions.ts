import { HttpException, HttpStatus } from '@nestjs/common';

export class TaskCreationFailedException extends HttpException {
  constructor(message?: string) {
    super(message || 'Failed to create task', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class TaskNotFoundException extends HttpException {
  constructor(taskId?: string) {
    super(
      `Task ${taskId ? `with ID ${taskId}` : ''} not found`,
      HttpStatus.NOT_FOUND,
    );
  }
}

export class TaskValidationException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class TaskUpdateFailedException extends HttpException {
  constructor(message?: string) {
    super(message || 'Failed to update task', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class TaskDeleteFailedException extends HttpException {
  constructor(message?: string) {
    super(message || 'Failed to delete task', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
