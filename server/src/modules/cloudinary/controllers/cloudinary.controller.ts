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
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CloudinaryService } from '../services/cloudinary.service';
import { CloudinaryUploadResponseDto } from '../dto/cloudinary.dto';
import { SuccessResponseDto } from '../../../common/dto/base-response.dto';
import {
  ApiUploadAvatar,
  ApiUploadImage,
  ApiDeleteImage,
  ApiGetAvatarUrl,
} from './cloudinary.swagger';

@ApiTags('Cloudinary')
@Controller('cloudinary')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) { }

  @Post('upload/avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiUploadAvatar()
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
  @ApiUploadImage()
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
  @ApiDeleteImage()
  async deleteImage(
    @Param('publicId') publicId: string,
  ): Promise<SuccessResponseDto<null>> {
    const decodedPublicId = decodeURIComponent(publicId);
    await this.cloudinaryService.deleteImage(decodedPublicId);

    return new SuccessResponseDto('Image deleted successfully', null);
  }

  @Get('avatar/:publicId')
  @ApiGetAvatarUrl()
  async getAvatarUrl(
    @Param('publicId') publicId: string,
  ): Promise<SuccessResponseDto<{ url: string }>> {
    const decodedPublicId = decodeURIComponent(publicId);
    const url = this.cloudinaryService.getAvatarUrl(decodedPublicId);

    return new SuccessResponseDto('Avatar URL generated', { url });
  }
}
