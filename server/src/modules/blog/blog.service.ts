import { Injectable, Logger } from '@nestjs/common';
import { BlogRepository } from './repositories/blog.repository';
import {
  BlogPost,
  BlogPostStatus,
  PublicBlogPost,
  BlogPostListItem,
  PopularBlogPost,
  RelatedBlogPost,
} from './interfaces/blog.interface';
import {
  CreateBlogPostDto,
  UpdateBlogPostDto,
  BlogPostQueryDto,
} from './dto/blog.dto';
import {
  PaginatedResult,
  PaginationOptions,
} from '../../common/interfaces/pagination.interface';
import { BlogNotFoundException } from './exceptions/blog.exceptions';
import { MessageService } from '../../common/message/message.service';

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);

  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly messageService: MessageService,
  ) {}

  async createBlogPost(
    dto: CreateBlogPostDto,
    authorId: string,
  ): Promise<BlogPost> {
    this.logger.log(`Creating blog post: ${dto.title} by author: ${authorId}`);

    const blogPostData: Partial<BlogPost> = {
      title: dto.title,
      slug: dto.slug,
      excerpt: dto.excerpt,
      content: dto.content,
      featured_image: dto.featured_image,
      alt_text: dto.alt_text,
      author_id: authorId,
      category_id: dto.category_id,
      status: dto.status || BlogPostStatus.DRAFT,
      is_featured: dto.is_featured || false,
      published_at: dto.published_at ? new Date(dto.published_at) : undefined,
      views_count: 0,
      reading_time: dto.reading_time || this.calculateReadingTime(dto.content),
      seo_title: dto.seo_title || dto.title,
      seo_description: dto.seo_description || dto.excerpt,
      seo_keywords: dto.seo_keywords,
    };

    const createdPost = await this.blogRepository.create(blogPostData);
    this.logger.log(`Blog post created successfully: ${createdPost.id}`);
    return createdPost;
  }

  async updateBlogPost(
    postId: string,
    dto: UpdateBlogPostDto,
    authorId: string,
  ): Promise<BlogPost> {
    this.logger.log(`Updating blog post: ${postId}`);

    const existingPost = await this.blogRepository.findById(postId);
    if (!existingPost) {
      throw new BlogNotFoundException(
        this.messageService.get('error.blog_post_not_found'),
      );
    }

    if (existingPost.author_id !== authorId) {
      throw new BlogNotFoundException(
        this.messageService.get('error.unauthorized'),
      );
    }

    const updateData: Partial<BlogPost> = {
      ...dto,
      published_at: dto.published_at
        ? new Date(dto.published_at)
        : existingPost.published_at,
      reading_time: dto.content
        ? this.calculateReadingTime(dto.content)
        : existingPost.reading_time,
    };

    const updatedPost = await this.blogRepository.update(postId, updateData);
    if (!updatedPost) {
      throw new BlogNotFoundException(
        this.messageService.get('error.blog_post_not_found'),
      );
    }

    this.logger.log(`Blog post updated successfully: ${postId}`);
    return updatedPost;
  }

  async deleteBlogPost(postId: string, authorId: string): Promise<boolean> {
    this.logger.log(`Deleting blog post: ${postId}`);

    const existingPost = await this.blogRepository.findById(postId);
    if (!existingPost) {
      throw new BlogNotFoundException(
        this.messageService.get('error.blog_post_not_found'),
      );
    }

    if (existingPost.author_id !== authorId) {
      throw new BlogNotFoundException(
        this.messageService.get('error.unauthorized'),
      );
    }

    await this.blogRepository.delete(postId);
    this.logger.log(`Blog post deleted successfully: ${postId}`);
    return true;
  }

  async getBlogPostById(postId: string): Promise<BlogPost> {
    const post = await this.blogRepository.findById(postId);

    if (!post) {
      throw new BlogNotFoundException(
        this.messageService.get('error.blog_post_not_found'),
      );
    }

    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<PublicBlogPost> {
    const post = await this.blogRepository.findBySlug(slug);

    if (!post || post.status !== BlogPostStatus.PUBLISHED) {
      throw new BlogNotFoundException(
        this.messageService.get('error.blog_post_not_found'),
      );
    }

    await this.blogRepository.incrementViewCount(post.id);
    return this.transformToPublicPost(post);
  }

  async getBlogPosts(
    query: BlogPostQueryDto,
    options: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<BlogPost>> {
    this.logger.log('Fetching blog posts with filters');
    return await this.blogRepository.findAll(options);
  }

  async getPublishedPosts(
    options: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<BlogPostListItem>> {
    this.logger.log('Fetching published blog posts');
    const result = await this.blogRepository.findByStatus(
      BlogPostStatus.PUBLISHED,
      options,
    );
    const listItems = await Promise.all(
      result.data.map((post) => this.transformToListItem(post)),
    );

    return {
      data: listItems,
      meta: result.meta,
    };
  }

  async getBlogPostsByCategory(
    categoryId: string,
    options: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<BlogPost>> {
    this.logger.log(`Fetching blog posts for category: ${categoryId}`);
    return await this.blogRepository.findByCategory(categoryId, options);
  }

  async getBlogPostsByTag(
    tagId: string,
    options: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<BlogPost>> {
    this.logger.log(`Fetching blog posts for tag: ${tagId}`);
    return await this.blogRepository.findByTag(tagId, options);
  }

  async getBlogPostsByAuthor(
    authorId: string,
    options: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<BlogPost>> {
    this.logger.log(`Fetching blog posts for author: ${authorId}`);
    return await this.blogRepository.findByAuthor(authorId, options);
  }

  async getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    this.logger.log('Fetching featured blog posts');
    return await this.blogRepository.findFeatured(limit);
  }

  async getPopularPosts(limit: number = 5): Promise<PopularBlogPost[]> {
    this.logger.log('Fetching popular blog posts');
    const posts = await this.blogRepository.findPopular(limit);

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      featured_image: post.featured_image,
      views_count: post.views_count,
      comments_count: 0,
      published_at: post.published_at!,
    }));
  }

  async getRelatedPosts(
    postId: string,
    limit: number = 3,
  ): Promise<RelatedBlogPost[]> {
    this.logger.log(`Fetching related posts for: ${postId}`);

    const currentPost = await this.getBlogPostById(postId);
    if (!currentPost.category_id) {
      return [];
    }

    const result = await this.blogRepository.findByCategory(
      currentPost.category_id,
      { limit: limit + 1 },
    );
    const filtered = result.data
      .filter((p) => p.id !== postId && p.status === BlogPostStatus.PUBLISHED)
      .slice(0, limit);

    return filtered.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      featured_image: post.featured_image,
      category_name: undefined,
      published_at: post.published_at!,
      reading_time: post.reading_time,
    }));
  }

  async searchBlogPosts(
    searchTerm: string,
    options: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<BlogPost>> {
    this.logger.log(`Searching blog posts: ${searchTerm}`);
    return await this.blogRepository.searchPosts(searchTerm, options);
  }

  async publishPost(postId: string, authorId: string): Promise<BlogPost> {
    this.logger.log(`Publishing blog post: ${postId}`);

    const post = await this.getBlogPostById(postId);
    if (post.author_id !== authorId) {
      throw new BlogNotFoundException(
        this.messageService.get('error.unauthorized'),
      );
    }

    const updated = await this.blogRepository.update(postId, {
      status: BlogPostStatus.PUBLISHED,
      published_at: new Date(),
    });

    if (!updated) {
      throw new BlogNotFoundException(
        this.messageService.get('error.blog_post_not_found'),
      );
    }

    return updated;
  }

  async unpublishPost(postId: string, authorId: string): Promise<BlogPost> {
    this.logger.log(`Unpublishing blog post: ${postId}`);

    const post = await this.getBlogPostById(postId);
    if (post.author_id !== authorId) {
      throw new BlogNotFoundException(
        this.messageService.get('error.unauthorized'),
      );
    }

    const updated = await this.blogRepository.update(postId, {
      status: BlogPostStatus.DRAFT,
    });

    if (!updated) {
      throw new BlogNotFoundException(
        this.messageService.get('error.blog_post_not_found'),
      );
    }

    return updated;
  }

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  private transformToPublicPost(post: BlogPost): PublicBlogPost {
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featured_image: post.featured_image,
      alt_text: post.alt_text,
      author: {
        name: 'Author',
        avatar_url: undefined,
      },
      category: undefined,
      tags: [],
      published_at: post.published_at!,
      reading_time: post.reading_time,
      views_count: post.views_count,
      seo_title: post.seo_title,
      seo_description: post.seo_description,
    };
  }

  private transformToListItem(post: BlogPost): BlogPostListItem {
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      featured_image: post.featured_image,
      alt_text: post.alt_text,
      author_name: 'Author',
      author_avatar: undefined,
      category_name: undefined,
      category_slug: undefined,
      category_color: undefined,
      published_at: post.published_at!,
      reading_time: post.reading_time,
      views_count: post.views_count,
    };
  }
}
