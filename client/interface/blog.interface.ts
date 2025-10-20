export enum BlogPostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  usage_count: number;
}

export interface BlogAuthor {
  id: string;
  name: string;
  avatar_url?: string;
  bio?: string;
}

export interface BlogPost {
  id: string;
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
  published_at?: string;
  views_count: number;
  reading_time?: number;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPostWithRelations extends BlogPost {
  author?: BlogAuthor;
  category?: BlogCategory;
  tags?: BlogTag[];
  comments_count?: number;
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
  published_at: string;
  reading_time?: number;
  views_count: number;
}

export interface PopularBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  views_count: number;
  comments_count: number;
  published_at: string;
}

export interface RelatedBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  category_name?: string;
  published_at: string;
  reading_time?: number;
}

export interface CreateBlogPostRequest {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  alt_text?: string;
  category_id?: string;
  tag_ids?: string[];
  status?: BlogPostStatus;
  is_featured?: boolean;
  published_at?: string;
  reading_time?: number;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

export interface UpdateBlogPostRequest extends Partial<CreateBlogPostRequest> {}

export interface BlogPostQueryParams {
  page?: number;
  limit?: number;
  status?: BlogPostStatus;
  category_id?: string;
  author_id?: string;
  is_featured?: boolean;
  search?: string;
}

export interface PaginatedBlogResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
