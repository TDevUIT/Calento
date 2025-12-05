import { BlogPostQueryParams } from '@/interface';

export const BLOG_QUERY_KEYS = {
  all: ['blog'] as const,
  
  lists: () => [...BLOG_QUERY_KEYS.all, 'list'] as const,
  list: (params?: BlogPostQueryParams) => [...BLOG_QUERY_KEYS.lists(), params] as const,
  
  published: (page?: number, limit?: number) => 
    [...BLOG_QUERY_KEYS.all, 'published', page, limit] as const,
  
  featured: (limit?: number) => 
    [...BLOG_QUERY_KEYS.all, 'featured', limit] as const,
  
  popular: (limit?: number) => 
    [...BLOG_QUERY_KEYS.all, 'popular', limit] as const,
  
  details: () => [...BLOG_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...BLOG_QUERY_KEYS.details(), id] as const,
  
  bySlug: (slug: string) => [...BLOG_QUERY_KEYS.all, 'slug', slug] as const,
  
  search: (searchTerm: string, page?: number, limit?: number) => 
    [...BLOG_QUERY_KEYS.all, 'search', searchTerm, page, limit] as const,
  
  byCategory: (categoryId: string, page?: number, limit?: number) => 
    [...BLOG_QUERY_KEYS.all, 'category', categoryId, page, limit] as const,
  
  byTag: (tagId: string, page?: number, limit?: number) => 
    [...BLOG_QUERY_KEYS.all, 'tag', tagId, page, limit] as const,
  
  byAuthor: (authorId: string, page?: number, limit?: number) => 
    [...BLOG_QUERY_KEYS.all, 'author', authorId, page, limit] as const,
  
  related: (id: string, limit?: number) => 
    [...BLOG_QUERY_KEYS.all, 'related', id, limit] as const,
} as const;
