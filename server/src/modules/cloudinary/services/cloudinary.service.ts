import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { Readable } from 'stream';
import {
  CloudinaryUploadResult,
  CloudinaryDeleteResult,
  CloudinaryUploadOptions,
  CloudinaryTransformation,
} from '../interfaces/cloudinary.interface';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private readonly uploadPreset: string;

  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });

    this.uploadPreset =
      this.configService.get<string>('CLOUDINARY_UPLOAD_PRESET') || '';
    this.logger.log('Cloudinary service initialized');
  }

  async uploadAvatar(
    file: any,
    userId: string,
  ): Promise<CloudinaryUploadResult> {
    try {
      this.logger.log(`Uploading avatar for user: ${userId}`);

      this.validateImageFile(file);

      const options: CloudinaryUploadOptions = {
        folder: `tempra/avatars`,
        public_id: `user_${userId}_${Date.now()}`,
        overwrite: true,
        unique_filename: false,
        resource_type: 'image',
        upload_preset: this.uploadPreset,
        transformation: {
          width: 500,
          height: 500,
          crop: 'fill',
          gravity: 'face',
          quality: 'auto',
          fetch_format: 'auto',
          radius: 'max',
        },
      };

      const result = await this.uploadStream(file.buffer, options);

      this.logger.log(`Avatar uploaded successfully: ${result.public_id}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to upload avatar: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Avatar upload failed: ${error.message}`);
    }
  }

  async uploadImage(
    file: any,
    options?: CloudinaryUploadOptions,
  ): Promise<CloudinaryUploadResult> {
    try {
      this.validateImageFile(file);

      const defaultOptions: CloudinaryUploadOptions = {
        folder: 'tempra/images',
        resource_type: 'image',
        upload_preset: this.uploadPreset,
      };

      const uploadOptions = { ...defaultOptions, ...options };
      const result = await this.uploadStream(file.buffer, uploadOptions);

      this.logger.log(`Image uploaded successfully: ${result.public_id}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to upload image: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Image upload failed: ${error.message}`);
    }
  }

  async deleteImage(publicId: string): Promise<CloudinaryDeleteResult> {
    try {
      this.logger.log(`Deleting image: ${publicId}`);
      const result = await cloudinary.uploader.destroy(publicId);
      this.logger.log(`Image deleted successfully: ${publicId}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to delete image: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Image deletion failed: ${error.message}`);
    }
  }

  async deleteAvatarByUserId(userId: string): Promise<void> {
    try {
      const result = await cloudinary.api.delete_resources_by_prefix(
        `tempra/avatars/user_${userId}_`,
      );
      this.logger.log(`Deleted avatars for user: ${userId}`, result);
    } catch (error) {
      this.logger.error(
        `Failed to delete user avatars: ${error.message}`,
        error.stack,
      );
    }
  }

  getOptimizedUrl(
    publicId: string,
    transformation?: CloudinaryTransformation,
  ): string {
    return cloudinary.url(publicId, {
      secure: true,
      ...transformation,
    });
  }

  getAvatarUrl(publicId: string, size: number = 500): string {
    return this.getOptimizedUrl(publicId, {
      width: size,
      height: size,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto',
      fetch_format: 'auto',
      radius: 'max',
    });
  }

  private uploadStream(
    buffer: Buffer,
    options: CloudinaryUploadOptions,
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as unknown as CloudinaryUploadResult);
          }
        },
      );

      const readableStream = Readable.from(buffer);
      readableStream.pipe(uploadStream);
    });
  }

  private validateImageFile(file: any): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed',
      );
    }
  }

  extractPublicId(url: string): string | null {
    try {
      const matches = url.match(/\/v\d+\/(.+)\.[a-z]+$/);
      if (matches && matches[1]) {
        return matches[1];
      }
      throw new Error('Invalid Cloudinary URL format');
    } catch (error) {
      this.logger.error(`Failed to extract public ID from URL: ${url}`);
      return null;
    }
  }
}
