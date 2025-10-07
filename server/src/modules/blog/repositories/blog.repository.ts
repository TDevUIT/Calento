import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { DatabaseService } from '../../../database/database.service';
import { PaginationService } from '../../../common/services/pagination.service';
import { MessageService } from '../../../common/message/message.service';
import { BlogPost, BlogPostStatus } from '../interfaces/blog.interface';
import { PaginatedResult, PaginationOptions } from '../../../common/interfaces/pagination.interface';
import { BlogNotFoundException } from '../exceptions/blog.exceptions';

@Injectable()
export class BlogRepository extends BaseRepository<BlogPost> {
    constructor(
        databaseService: DatabaseService,
        paginationService: PaginationService,
        messageService: MessageService,
    ) {
        super(databaseService, paginationService, messageService, 'blog_posts');
    }

    protected getAllowedSortFields(): string[] {
        return [
            'id',
            'title',
            'slug',
            'status',
            'is_featured',
            'published_at',
            'views_count',
            'reading_time',
            'created_at',
            'updated_at',
        ];
    }

    async findBySlug(slug: string): Promise<BlogPost | null> {
        const query = `SELECT * FROM ${this.tableName} WHERE slug = $1 LIMIT 1`;
        
        try {
            const result = await this.databaseService.query<BlogPost>(query, [slug]);
            return result.rows[0] || null;
        } catch (error) {
            this.logger.error(`Failed to find blog post by slug ${slug}:`, error);
            throw new BlogNotFoundException(this.messageService.get('error.blog_post_not_found'));
        }
    }

    async findByCategory(
        categoryId: string,
        options: Partial<PaginationOptions>
    ): Promise<PaginatedResult<BlogPost>> {
        const whereCondition = 'category_id = $1';
        const whereParams = [categoryId];
        
        try {
            return await this.search(whereCondition, whereParams, options);
        } catch (error) {
            this.logger.error(`Failed to find posts by category ${categoryId}:`, error);
            throw new BlogNotFoundException(this.messageService.get('error.internal_server_error'));
        }
    }

    async findByAuthor(
        authorId: string,
        options: Partial<PaginationOptions>
    ): Promise<PaginatedResult<BlogPost>> {
        const whereCondition = 'author_id = $1';
        const whereParams = [authorId];
        
        try {
            return await this.search(whereCondition, whereParams, options);
        } catch (error) {
            this.logger.error(`Failed to find posts by author ${authorId}:`, error);
            throw new BlogNotFoundException(this.messageService.get('error.internal_server_error'));
        }
    }

    async findByStatus(
        status: BlogPostStatus,
        options: Partial<PaginationOptions>
    ): Promise<PaginatedResult<BlogPost>> {
        const whereCondition = 'status = $1';
        const whereParams = [status];
        
        try {
            return await this.search(whereCondition, whereParams, options);
        } catch (error) {
            this.logger.error(`Failed to find posts by status ${status}:`, error);
            throw new BlogNotFoundException(this.messageService.get('error.internal_server_error'));
        }
    }

    async findFeatured(limit: number = 3): Promise<BlogPost[]> {
        const query = `
            SELECT * FROM ${this.tableName}
            WHERE is_featured = true AND status = $1
            ORDER BY published_at DESC
            LIMIT $2
        `;
        
        try {
            const result = await this.databaseService.query<BlogPost>(query, [BlogPostStatus.PUBLISHED, limit]);
            return result.rows;
        } catch (error) {
            this.logger.error('Failed to find featured posts:', error);
            throw new BlogNotFoundException(this.messageService.get('error.internal_server_error'));
        }
    }

    async findPopular(limit: number = 5): Promise<BlogPost[]> {
        const query = `
            SELECT * FROM ${this.tableName}
            WHERE status = $1
            ORDER BY views_count DESC, published_at DESC
            LIMIT $2
        `;
        
        try {
            const result = await this.databaseService.query<BlogPost>(query, [BlogPostStatus.PUBLISHED, limit]);
            return result.rows;
        } catch (error) {
            this.logger.error('Failed to find popular posts:', error);
            throw new BlogNotFoundException(this.messageService.get('error.internal_server_error'));
        }
    }

    async findByTag(
        tagId: string,
        options: Partial<PaginationOptions>
    ): Promise<PaginatedResult<BlogPost>> {
        const query = `
            SELECT bp.* FROM ${this.tableName} bp
            INNER JOIN blog_post_tags bpt ON bp.id = bpt.post_id
            WHERE bpt.tag_id = $1
            ORDER BY bp.published_at DESC
        `;
        
        try {
            const result = await this.databaseService.query<BlogPost>(query, [tagId]);
            const page = options.page || 1;
            const limit = options.limit || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            return {
                data: result.rows.slice(startIndex, endIndex),
                meta: {
                    page,
                    limit,
                    total: result.rows.length,
                    totalPages: Math.ceil(result.rows.length / limit),
                    hasNextPage: endIndex < result.rows.length,
                    hasPreviousPage: page > 1,
                }
            };
        } catch (error) {
            this.logger.error(`Failed to find posts by tag ${tagId}:`, error);
            throw new BlogNotFoundException(this.messageService.get('error.internal_server_error'));
        }
    }

    async searchPosts(
        searchTerm: string,
        options: Partial<PaginationOptions>
    ): Promise<PaginatedResult<BlogPost>> {
        const searchPattern = `%${searchTerm}%`;
        const whereCondition = `
            status = $1 AND (
                title ILIKE $2 OR 
                content ILIKE $2 OR 
                excerpt ILIKE $2
            )
        `;
        const whereParams = [BlogPostStatus.PUBLISHED, searchPattern];
        
        try {
            return await this.search(whereCondition, whereParams, options);
        } catch (error) {
            this.logger.error('Failed to search posts:', error);
            throw new BlogNotFoundException(this.messageService.get('error.internal_server_error'));
        }
    }

    async incrementViewCount(postId: string): Promise<void> {
        const query = `
            UPDATE ${this.tableName}
            SET views_count = views_count + 1
            WHERE id = $1
        `;
        
        try {
            await this.databaseService.query(query, [postId]);
        } catch (error) {
            this.logger.error(`Failed to increment view count for post ${postId}:`, error);
        }
    }
}
