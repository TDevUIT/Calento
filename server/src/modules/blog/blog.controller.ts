import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import {
  CreateBlogPostDto,
  UpdateBlogPostDto,
  BlogPostQueryDto,
} from './dto/blog.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PaginationOptions } from '../../common/interfaces/pagination.interface';
import {
  ApiCreateBlogPost,
  ApiUpdateBlogPost,
  ApiDeleteBlogPost,
  ApiGetPublishedPosts,
  ApiGetFeaturedPosts,
  ApiGetPopularPosts,
  ApiSearchBlogPosts,
  ApiGetBlogPostsByCategory,
  ApiGetBlogPostsByTag,
  ApiGetBlogPostsByAuthor,
  ApiGetBlogPostBySlug,
  ApiGetRelatedPosts,
  ApiGetBlogPostById,
  ApiGetBlogPosts,
  ApiPublishPost,
  ApiUnpublishPost,
} from './blog.swagger';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreateBlogPost()
  async createBlogPost(@Body() dto: CreateBlogPostDto, @Request() req: any) {
    const authorId = req.user.id;
    return await this.blogService.createBlogPost(dto, authorId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUpdateBlogPost()
  async updateBlogPost(
    @Param('id') id: string,
    @Body() dto: UpdateBlogPostDto,
    @Request() req: any,
  ) {
    const authorId = req.user.id;
    return await this.blogService.updateBlogPost(id, dto, authorId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiDeleteBlogPost()
  async deleteBlogPost(@Param('id') id: string, @Request() req: any) {
    const authorId = req.user.id;
    return await this.blogService.deleteBlogPost(id, authorId);
  }

  @Get('public/published')
  @ApiGetPublishedPosts()
  async getPublishedPosts(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const options: Partial<PaginationOptions> = {
      page: page || 1,
      limit: limit || 10,
    };
    return await this.blogService.getPublishedPosts(options);
  }

  @Get('public/featured')
  @ApiGetFeaturedPosts()
  async getFeaturedPosts(@Query('limit') limit?: number) {
    return await this.blogService.getFeaturedPosts(limit || 3);
  }

  @Get('public/popular')
  @ApiGetPopularPosts()
  async getPopularPosts(@Query('limit') limit?: number) {
    return await this.blogService.getPopularPosts(limit || 5);
  }

  @Get('search')
  @ApiSearchBlogPosts()
  async searchBlogPosts(
    @Query('q') searchTerm: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const options: Partial<PaginationOptions> = {
      page: page || 1,
      limit: limit || 10,
    };
    return await this.blogService.searchBlogPosts(searchTerm, options);
  }

  @Get('category/:categoryId')
  @ApiGetBlogPostsByCategory()
  async getBlogPostsByCategory(
    @Param('categoryId') categoryId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const options: Partial<PaginationOptions> = {
      page: page || 1,
      limit: limit || 10,
    };
    return await this.blogService.getBlogPostsByCategory(categoryId, options);
  }

  @Get('tag/:tagId')
  @ApiGetBlogPostsByTag()
  async getBlogPostsByTag(
    @Param('tagId') tagId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const options: Partial<PaginationOptions> = {
      page: page || 1,
      limit: limit || 10,
    };
    return await this.blogService.getBlogPostsByTag(tagId, options);
  }

  @Get('author/:authorId')
  @ApiGetBlogPostsByAuthor()
  async getBlogPostsByAuthor(
    @Param('authorId') authorId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const options: Partial<PaginationOptions> = {
      page: page || 1,
      limit: limit || 10,
    };
    return await this.blogService.getBlogPostsByAuthor(authorId, options);
  }

  @Get('slug/:slug')
  @ApiGetBlogPostBySlug()
  async getBlogPostBySlug(@Param('slug') slug: string) {
    return await this.blogService.getBlogPostBySlug(slug);
  }

  @Get(':id/related')
  @ApiGetRelatedPosts()
  async getRelatedPosts(
    @Param('id') id: string,
    @Query('limit') limit?: number,
  ) {
    return await this.blogService.getRelatedPosts(id, limit || 3);
  }

  @Get(':id')
  @ApiGetBlogPostById()
  async getBlogPostById(@Param('id') id: string) {
    return await this.blogService.getBlogPostById(id);
  }

  @Get()
  @ApiGetBlogPosts()
  async getBlogPosts(
    @Query() query: BlogPostQueryDto,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const options: Partial<PaginationOptions> = {
      page: page || 1,
      limit: limit || 10,
    };
    return await this.blogService.getBlogPosts(query, options);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiPublishPost()
  async publishPost(@Param('id') id: string, @Request() req: any) {
    const authorId = req.user.id;
    return await this.blogService.publishPost(id, authorId);
  }

  @Post(':id/unpublish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUnpublishPost()
  async unpublishPost(@Param('id') id: string, @Request() req: any) {
    const authorId = req.user.id;
    return await this.blogService.unpublishPost(id, authorId);
  }
}
