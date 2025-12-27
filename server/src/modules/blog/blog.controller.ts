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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BlogService } from './blog.service';
import {
  CreateBlogPostDto,
  UpdateBlogPostDto,
  BlogPostQueryDto,
  BlogPostResponseDto,
} from './dto/blog.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PaginationOptions } from '../../common/interfaces/pagination.interface';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({
    status: 201,
    description: 'Blog post created successfully',
    type: BlogPostResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createBlogPost(@Body() dto: CreateBlogPostDto, @Request() req: any) {
    const authorId = req.user.id;
    return await this.blogService.createBlogPost(dto, authorId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a blog post' })
  @ApiResponse({
    status: 200,
    description: 'Blog post updated successfully',
    type: BlogPostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the author' })
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a blog post' })
  @ApiResponse({ status: 204, description: 'Blog post deleted successfully' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the author' })
  async deleteBlogPost(@Param('id') id: string, @Request() req: any) {
    const authorId = req.user.id;
    return await this.blogService.deleteBlogPost(id, authorId);
  }

  @Get('public/published')
  @ApiOperation({ summary: 'Get published blog posts for landing page' })
  @ApiResponse({ status: 200, description: 'Published blog posts retrieved' })
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
  @ApiOperation({ summary: 'Get featured blog posts' })
  @ApiResponse({ status: 200, description: 'Featured blog posts retrieved' })
  async getFeaturedPosts(@Query('limit') limit?: number) {
    return await this.blogService.getFeaturedPosts(limit || 3);
  }

  @Get('public/popular')
  @ApiOperation({ summary: 'Get popular blog posts' })
  @ApiResponse({ status: 200, description: 'Popular blog posts retrieved' })
  async getPopularPosts(@Query('limit') limit?: number) {
    return await this.blogService.getPopularPosts(limit || 5);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search blog posts' })
  @ApiResponse({ status: 200, description: 'Search results' })
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
  @ApiOperation({ summary: 'Get blog posts by category' })
  @ApiResponse({ status: 200, description: 'Blog posts by category retrieved' })
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
  @ApiOperation({ summary: 'Get blog posts by tag' })
  @ApiResponse({ status: 200, description: 'Blog posts by tag retrieved' })
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
  @ApiOperation({ summary: 'Get blog posts by author' })
  @ApiResponse({ status: 200, description: 'Blog posts by author retrieved' })
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
  @ApiOperation({ summary: 'Get blog post by slug' })
  @ApiResponse({ status: 200, description: 'Blog post found' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  async getBlogPostBySlug(@Param('slug') slug: string) {
    return await this.blogService.getBlogPostBySlug(slug);
  }

  @Get(':id/related')
  @ApiOperation({ summary: 'Get related blog posts' })
  @ApiResponse({ status: 200, description: 'Related posts retrieved' })
  async getRelatedPosts(
    @Param('id') id: string,
    @Query('limit') limit?: number,
  ) {
    return await this.blogService.getRelatedPosts(id, limit || 3);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get blog post by ID' })
  @ApiResponse({
    status: 200,
    description: 'Blog post found',
    type: BlogPostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  async getBlogPostById(@Param('id') id: string) {
    return await this.blogService.getBlogPostById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blog posts with filters' })
  @ApiResponse({
    status: 200,
    description: 'Blog posts retrieved successfully',
  })
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
  @ApiOperation({ summary: 'Publish a blog post' })
  @ApiResponse({ status: 200, description: 'Blog post published' })
  async publishPost(@Param('id') id: string, @Request() req: any) {
    const authorId = req.user.id;
    return await this.blogService.publishPost(id, authorId);
  }

  @Post(':id/unpublish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unpublish a blog post' })
  @ApiResponse({ status: 200, description: 'Blog post unpublished' })
  async unpublishPost(@Param('id') id: string, @Request() req: any) {
    const authorId = req.user.id;
    return await this.blogService.unpublishPost(id, authorId);
  }
}
