import { HttpException, HttpStatus } from '@nestjs/common';

export class BlogNotFoundException extends HttpException {
  constructor(message?: string) {
    super(message || 'Blog post not found', HttpStatus.NOT_FOUND);
  }
}

export class BlogCreationFailedException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'Failed to create blog post',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class BlogUpdateFailedException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'Failed to update blog post',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class BlogCategoryNotFoundException extends HttpException {
  constructor(message?: string) {
    super(message || 'Blog category not found', HttpStatus.NOT_FOUND);
  }
}

export class BlogTagNotFoundException extends HttpException {
  constructor(message?: string) {
    super(message || 'Blog tag not found', HttpStatus.NOT_FOUND);
  }
}

export class UnauthorizedBlogAccessException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'Unauthorized to access this blog post',
      HttpStatus.FORBIDDEN,
    );
  }
}

export class DuplicateBlogSlugException extends HttpException {
  constructor(slug: string) {
    super(`Blog post with slug '${slug}' already exists`, HttpStatus.CONFLICT);
  }
}
