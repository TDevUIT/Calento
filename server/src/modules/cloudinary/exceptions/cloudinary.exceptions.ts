import { BadRequestException, NotFoundException } from '@nestjs/common';

export class CloudinaryUploadException extends BadRequestException {
  constructor(message: string = 'Failed to upload file to Cloudinary') {
    super(message);
  }
}

export class CloudinaryDeleteException extends BadRequestException {
  constructor(message: string = 'Failed to delete file from Cloudinary') {
    super(message);
  }
}

export class InvalidFileException extends BadRequestException {
  constructor(message: string = 'Invalid file provided') {
    super(message);
  }
}

export class FileSizeException extends BadRequestException {
  constructor(maxSize: number = 5) {
    super(`File size exceeds ${maxSize}MB limit`);
  }
}

export class InvalidFileTypeException extends BadRequestException {
  constructor(allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp']) {
    super(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }
}

export class CloudinaryConfigException extends BadRequestException {
  constructor(message: string = 'Cloudinary configuration error') {
    super(message);
  }
}

export class ImageNotFoundException extends NotFoundException {
  constructor(publicId: string) {
    super(`Image with public ID '${publicId}' not found`);
  }
}
