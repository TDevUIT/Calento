import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerExamples } from '../../common/swagger/swagger-examples';
import { BlogPostResponseDto } from './dto/blog.dto';

export const ApiCreateBlogPost = () =>
    applyDecorators(
        ApiOperation({ summary: 'Create a new blog post' }),
        ApiResponse({
            status: HttpStatus.CREATED,
            description: 'Blog post created successfully',
            type: BlogPostResponseDto,
            schema: {
                example: SwaggerExamples.Blog.Post.response,
            },
        }),
        ApiResponse({
            status: HttpStatus.UNAUTHORIZED,
            description: 'Unauthorized',
        }),
    );

export const ApiUpdateBlogPost = () =>
    applyDecorators(
        ApiOperation({ summary: 'Update a blog post' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Blog post updated successfully',
            type: BlogPostResponseDto,
            schema: {
                example: SwaggerExamples.Blog.Post.response,
            },
        }),
        ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: 'Blog post not found',
        }),
        ApiResponse({
            status: HttpStatus.FORBIDDEN,
            description: 'Forbidden - Not the author',
        }),
    );

export const ApiDeleteBlogPost = () =>
    applyDecorators(
        HttpCode(HttpStatus.NO_CONTENT),
        ApiOperation({ summary: 'Delete a blog post' }),
        ApiResponse({
            status: HttpStatus.NO_CONTENT,
            description: 'Blog post deleted successfully',
        }),
        ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: 'Blog post not found',
        }),
        ApiResponse({
            status: HttpStatus.FORBIDDEN,
            description: 'Forbidden - Not the author',
        }),
    );

export const ApiGetPublishedPosts = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get published blog posts for landing page' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Published blog posts retrieved',
            schema: {
                example: SwaggerExamples.Blog.List.response,
            },
        }),
    );

export const ApiGetFeaturedPosts = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get featured blog posts' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Featured blog posts retrieved',
            schema: {
                example: SwaggerExamples.Blog.List.response,
            },
        }),
    );

export const ApiGetPopularPosts = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get popular blog posts' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Popular blog posts retrieved',
            schema: {
                example: SwaggerExamples.Blog.List.response,
            },
        }),
    );

export const ApiSearchBlogPosts = () =>
    applyDecorators(
        ApiOperation({ summary: 'Search blog posts' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Search results',
            schema: {
                example: SwaggerExamples.Blog.List.response,
            },
        }),
    );

export const ApiGetBlogPostsByCategory = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get blog posts by category' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Blog posts by category retrieved',
            schema: {
                example: SwaggerExamples.Blog.List.response,
            },
        }),
    );

export const ApiGetBlogPostsByTag = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get blog posts by tag' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Blog posts by tag retrieved',
            schema: {
                example: SwaggerExamples.Blog.List.response,
            },
        }),
    );

export const ApiGetBlogPostsByAuthor = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get blog posts by author' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Blog posts by author retrieved',
            schema: {
                example: SwaggerExamples.Blog.List.response,
            },
        }),
    );

export const ApiGetBlogPostBySlug = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get blog post by slug' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Blog post found',
            schema: {
                example: SwaggerExamples.Blog.Post.response,
            },
        }),
        ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: 'Blog post not found',
        }),
    );

export const ApiGetRelatedPosts = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get related blog posts' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Related posts retrieved',
            schema: {
                example: SwaggerExamples.Blog.List.response,
            },
        }),
    );

export const ApiGetBlogPostById = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get blog post by ID' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Blog post found',
            type: BlogPostResponseDto,
            schema: {
                example: SwaggerExamples.Blog.Post.response,
            },
        }),
        ApiResponse({
            status: HttpStatus.NOT_FOUND,
            description: 'Blog post not found',
        }),
    );

export const ApiGetBlogPosts = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get all blog posts with filters' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Blog posts retrieved successfully',
            schema: {
                example: SwaggerExamples.Blog.List.response,
            },
        }),
    );

export const ApiPublishPost = () =>
    applyDecorators(
        ApiOperation({ summary: 'Publish a blog post' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Blog post published',
            schema: {
                example: SwaggerExamples.Blog.Post.response,
            },
        }),
    );

export const ApiUnpublishPost = () =>
    applyDecorators(
        ApiOperation({ summary: 'Unpublish a blog post' }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'Blog post unpublished',
            schema: {
                example: SwaggerExamples.Blog.Post.response,
            },
        }),
    );
