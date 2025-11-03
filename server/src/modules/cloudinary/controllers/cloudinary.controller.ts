import {
  Controller,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CloudinaryService } from '../services/cloudinary.service';
import {
  CloudinaryUploadResponseDto,
  UploadAvatarDto,
} from '../dto/cloudinary.dto';
import { SuccessResponseDto } from '../../../common/dto/base-response.dto';

@ApiTags('Cloudinary')
@Controller('cloudinary')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload/avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload user avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Avatar image file',
    type: UploadAvatarDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Avatar uploaded successfully',
    type: CloudinaryUploadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid file' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async uploadAvatar(
    @UploadedFile() file: any,
    @Request() req: any,
  ): Promise<SuccessResponseDto<CloudinaryUploadResponseDto>> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const userId = req.user.userId || req.user.id;
    const result = await this.cloudinaryService.uploadAvatar(file, userId);

    const response: CloudinaryUploadResponseDto = {
      public_id: result.public_id,
      url: result.url,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };

    return new SuccessResponseDto('Avatar uploaded successfully', response);
  }

  @Post('upload/image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file',
    type: UploadAvatarDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    type: CloudinaryUploadResponseDto,
  })
  async uploadImage(
    @UploadedFile() file: any,
    @Request() req: any,
  ): Promise<SuccessResponseDto<CloudinaryUploadResponseDto>> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const result = await this.cloudinaryService.uploadImage(file);

    const response: CloudinaryUploadResponseDto = {
      public_id: result.public_id,
      url: result.url,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };

    return new SuccessResponseDto('Image uploaded successfully', response);
  }

  @Delete('image/:publicId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete image by public ID' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async deleteImage(
    @Param('publicId') publicId: string,
  ): Promise<SuccessResponseDto<null>> {
    const decodedPublicId = decodeURIComponent(publicId);
    await this.cloudinaryService.deleteImage(decodedPublicId);

    return new SuccessResponseDto('Image deleted successfully', null);
  }

  @Get('avatar/:publicId')
  @ApiOperation({ summary: 'Get optimized avatar URL' })
  @ApiResponse({
    status: 200,
    description: 'Returns optimized avatar URL',
  })
  async getAvatarUrl(
    @Param('publicId') publicId: string,
  ): Promise<SuccessResponseDto<{ url: string }>> {
    const decodedPublicId = decodeURIComponent(publicId);
    const url = this.cloudinaryService.getAvatarUrl(decodedPublicId);

    return new SuccessResponseDto('Avatar URL generated', { url });
  }
}
