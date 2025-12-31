import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { SwaggerExamples } from '../../../common/swagger/swagger-examples';
import { CloudinaryUploadResponseDto, UploadAvatarDto } from '../dto/cloudinary.dto';

export const ApiUploadAvatar = () =>
    applyDecorators(
        ApiOperation({ summary: 'Upload user avatar' }),
        ApiConsumes('multipart/form-data'),
        ApiBody({
            description: 'Avatar image file',
            type: UploadAvatarDto,
        }),
        ApiResponse({
            status: HttpStatus.CREATED,
            description: 'Avatar uploaded successfully',
            type: CloudinaryUploadResponseDto,
            schema: {
                example: SwaggerExamples.Cloudinary.Upload.response,
            },
        }),
        ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request - Invalid file' }),
        ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' }),
    );

export const ApiUploadImage = () =>
    applyDecorators(
        ApiOperation({ summary: 'Upload image' }),
        ApiConsumes('multipart/form-data'),
        ApiBody({
            description: 'Image file',
            type: UploadAvatarDto,
        }),
        ApiResponse({
            status: HttpStatus.CREATED,
            description: 'Image uploaded successfully',
            type: CloudinaryUploadResponseDto,
            schema: {
                example: SwaggerExamples.Cloudinary.Upload.response,
            },
        }),
    );

export const ApiDeleteImage = () =>
    applyDecorators(
        ApiOperation({ summary: 'Delete image by public ID' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Image deleted successfully',
            schema: {
                example: SwaggerExamples.Cloudinary.Delete.response,
            },
        }),
        ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Image not found' }),
    );

export const ApiGetAvatarUrl = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get optimized avatar URL' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Returns optimized avatar URL',
            schema: {
                example: { url: SwaggerExamples.Cloudinary.Upload.response.url },
            },
        }),
    );
