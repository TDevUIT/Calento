import { BaseEntity, StatusEntity } from '../../../common/interfaces/base-entity.interface';

export enum BlogPostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}


export enum BlogCommentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  SPAM = 'spam',
  DELETED = 'deleted',
}

export interface BlogCategory extends BaseEntity, StatusEntity {
  name: string;
  slug: string;
  description?: string;
  color: string; // Hex color code (e.g., #6366f1)
  sort_order: number;
}


export interface BlogTag extends BaseEntity {
  name: string;
  slug: string;
  usage_count: number;
}


export interface BlogPost extends BaseEntity {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  alt_text?: string;
  author_id: string;
  category_id?: string;
  status: BlogPostStatus;
  is_featured: boolean;
  published_at?: Date;
  views_count: number;
  reading_time?: number; // in minutes
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}


export interface BlogPostWithRelations extends BlogPost {
  author?: BlogAuthor;
  category?: BlogCategory;
  tags?: BlogTag[];
  comments_count?: number;
}

export interface BlogAuthor {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
}

export interface BlogPostTag extends BaseEntity {
  post_id: string;
  tag_id: string;
}

export interface BlogComment extends BaseEntity {
  post_id: string;
  author_name: string;
  author_email: string;
  author_website?: string;
  content: string;
  status: BlogCommentStatus;
  parent_id?: string; // For nested comments
  ip_address?: string;
  user_agent?: string;
}


export interface BlogCommentWithReplies extends BlogComment {
  replies?: BlogComment[];
}


export interface BlogView extends BaseEntity {
  post_id: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  viewed_at: Date;
}

export interface BlogPostWithAnalytics extends BlogPost {
  views_count: number;
  comments_count: number;
  avg_reading_time?: number;
  engagement_rate?: number;
}

export interface BlogStatistics {
  total_posts: number;
  published_posts: number;
  draft_posts: number;
  total_views: number;
  total_comments: number;
  total_categories: number;
  total_tags: number;
  most_viewed_posts?: BlogPost[];
  most_commented_posts?: BlogPost[];
  recent_posts?: BlogPost[];
}

export interface PublicBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  alt_text?: string;
  author: {
    name: string;
    avatar_url?: string;
  };
  category?: {
    name: string;
    slug: string;
    color: string;
  };
  tags?: Array<{
    name: string;
    slug: string;
  }>;
  published_at: Date;
  reading_time?: number;
  views_count: number;
  seo_title?: string;
  seo_description?: string;
}


export interface BlogPostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  alt_text?: string;
  author_name: string;
  author_avatar?: string;
  category_name?: string;
  category_slug?: string;
  category_color?: string;
  published_at: Date;
  reading_time?: number;
  views_count: number;
}


export interface BlogSearchFilters {
  category?: string;
  tag?: string;
  status?: BlogPostStatus;
  author_id?: string;
  search?: string;
  is_featured?: boolean;
  published_after?: Date;
  published_before?: Date;
}


export interface PopularBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  views_count: number;
  comments_count: number;
  published_at: Date;
}

export interface RelatedBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  category_name?: string;
  published_at: Date;
  reading_time?: number;
}
