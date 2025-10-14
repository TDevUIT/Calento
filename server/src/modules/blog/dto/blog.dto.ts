import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsISO8601,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsUrl,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { BlogPostStatus } from '../interfaces/blog.interface';

export class CreateBlogPostDto {
  @ApiProperty({
    description: 'Blog post title',
    example: 'How AI Scheduling Transforms Productivity',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'URL-friendly slug',
    example: 'how-ai-scheduling-transforms-productivity',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @ApiPropertyOptional({
    description: 'Short excerpt/summary',
    example:
      'Discover how AI-powered scheduling can boost your productivity...',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  excerpt?: string;

  @ApiProperty({
    description: 'Full blog post content (HTML/Markdown)',
    example: "<p>In today's fast-paced world...</p>",
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'Featured image URL',
    example: 'https://example.com/images/ai-scheduling.jpg',
  })
  @IsString()
  @IsOptional()
  @IsUrl()
  featured_image?: string;

  @ApiPropertyOptional({
    description: 'Alt text for featured image',
    example: 'AI scheduling dashboard illustration',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  alt_text?: string;

  @ApiPropertyOptional({
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  category_id?: string;

  @ApiProperty({
    description: 'Blog post status',
    enum: BlogPostStatus,
    example: BlogPostStatus.DRAFT,
    default: BlogPostStatus.DRAFT,
  })
  @IsEnum(BlogPostStatus)
  @IsOptional()
  status?: BlogPostStatus;

  @ApiProperty({
    description: 'Whether this post is featured',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  is_featured?: boolean;

  @ApiPropertyOptional({
    description: 'Published date in ISO 8601 format',
    example: '2024-01-15T10:00:00Z',
  })
  @IsISO8601()
  @IsOptional()
  published_at?: string;

  @ApiPropertyOptional({
    description: 'Estimated reading time in minutes',
    example: 5,
  })
  @IsNumber()
  @IsOptional()
  reading_time?: number;

  @ApiPropertyOptional({
    description: 'SEO title (max 60 chars)',
    example: 'AI Scheduling Guide | Calento Blog',
    maxLength: 60,
  })
  @IsString()
  @IsOptional()
  @MaxLength(60)
  seo_title?: string;

  @ApiPropertyOptional({
    description: 'SEO meta description (max 160 chars)',
    example: 'Learn how AI scheduling can transform your productivity...',
    maxLength: 160,
  })
  @IsString()
  @IsOptional()
  @MaxLength(160)
  seo_description?: string;

  @ApiPropertyOptional({
    description: 'SEO keywords (comma-separated)',
    example: 'ai scheduling, productivity, calendar management',
  })
  @IsString()
  @IsOptional()
  seo_keywords?: string;

  @ApiPropertyOptional({
    description: 'Array of tag IDs to associate with post',
    example: ['tag-id-1', 'tag-id-2'],
  })
  @IsArray()
  @IsOptional()
  tag_ids?: string[];
}

export class UpdateBlogPostDto extends PartialType(CreateBlogPostDto) {}

export class BlogPostQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  category_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by tag ID',
    example: 'tag-id-1',
  })
  @IsString()
  @IsOptional()
  tag_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: BlogPostStatus,
    example: BlogPostStatus.PUBLISHED,
  })
  @IsEnum(BlogPostStatus)
  @IsOptional()
  status?: BlogPostStatus;

  @ApiPropertyOptional({
    description: 'Filter by featured posts',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_featured?: boolean;

  @ApiPropertyOptional({
    description: 'Search term for title and content',
    example: 'AI scheduling',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    default: 1,
  })
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 10,
    default: 10,
  })
  @IsNumber()
  @IsOptional()
  limit?: number;
}

export class CreateBlogCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Product Updates',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'URL-friendly slug',
    example: 'product-updates',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  slug: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Latest product features and updates',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Hex color code',
    example: '#10b981',
    default: '#6366f1',
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 1,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  sort_order?: number;
}

export class UpdateBlogCategoryDto extends PartialType(CreateBlogCategoryDto) {
  @ApiPropertyOptional({
    description: 'Whether category is active',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class CreateBlogTagDto {
  @ApiProperty({
    description: 'Tag name',
    example: 'AI Scheduling',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'URL-friendly slug',
    example: 'ai-scheduling',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  slug: string;
}

export class UpdateBlogTagDto extends PartialType(CreateBlogTagDto) {}

export class CreateBlogCommentDto {
  @ApiProperty({
    description: 'Comment author name',
    example: 'John Doe',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  author_name: string;

  @ApiProperty({
    description: 'Comment author email',
    example: 'john@example.com',
  })
  @IsString()
  @IsNotEmpty()
  author_email: string;

  @ApiPropertyOptional({
    description: 'Author website',
    example: 'https://johndoe.com',
  })
  @IsString()
  @IsOptional()
  @IsUrl()
  author_website?: string;

  @ApiProperty({
    description: 'Comment content',
    example: 'Great article! Very helpful insights.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  content: string;

  @ApiPropertyOptional({
    description: 'Parent comment ID for nested replies',
    example: 'parent-comment-id',
  })
  @IsString()
  @IsOptional()
  parent_id?: string;
}

export class BlogPostResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  excerpt?: string;

  @ApiProperty()
  content: string;

  @ApiPropertyOptional()
  featured_image?: string;

  @ApiPropertyOptional()
  alt_text?: string;

  @ApiProperty()
  author_id: string;

  @ApiPropertyOptional()
  category_id?: string;

  @ApiProperty({ enum: BlogPostStatus })
  status: BlogPostStatus;

  @ApiProperty()
  is_featured: boolean;

  @ApiPropertyOptional()
  published_at?: Date;

  @ApiProperty()
  views_count: number;

  @ApiPropertyOptional()
  reading_time?: number;

  @ApiPropertyOptional()
  seo_title?: string;

  @ApiPropertyOptional()
  seo_description?: string;

  @ApiPropertyOptional()
  seo_keywords?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
