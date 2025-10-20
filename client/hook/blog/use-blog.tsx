'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { blogService } from '@/service/blog.service';
import {
  BlogPostListItem,
  BlogPostWithRelations,
  PopularBlogPost,
  RelatedBlogPost,
  BlogPostQueryParams,
  PaginatedBlogResponse,
} from '@/interface/blog.interface';
import { BLOG_QUERY_KEYS } from './query-keys';

export const useBlogPosts = (
  params?: BlogPostQueryParams
): UseQueryResult<PaginatedBlogResponse<BlogPostListItem>, Error> => {
  return useQuery({
    queryKey: BLOG_QUERY_KEYS.list(params),
    queryFn: () => blogService.getBlogPosts(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePublishedPosts = (
  page: number = 1,
  limit: number = 10
): UseQueryResult<PaginatedBlogResponse<BlogPostListItem>, Error> => {
  return useQuery({
    queryKey: BLOG_QUERY_KEYS.published(page, limit),
    queryFn: () => blogService.getPublishedPosts(page, limit),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeaturedPosts = (
  limit: number = 3
): UseQueryResult<{ success: boolean; data: BlogPostListItem[] }, Error> => {
  return useQuery({
    queryKey: BLOG_QUERY_KEYS.featured(limit),
    queryFn: () => blogService.getFeaturedPosts(limit),
    staleTime: 10 * 60 * 1000,
  });
};

export const usePopularPosts = (
  limit: number = 5
): UseQueryResult<{ success: boolean; data: PopularBlogPost[] }, Error> => {
  return useQuery({
    queryKey: BLOG_QUERY_KEYS.popular(limit),
    queryFn: () => blogService.getPopularPosts(limit),
    staleTime: 10 * 60 * 1000,
  });
};

export const useBlogPostById = (
  id: string,
  enabled: boolean = true
): UseQueryResult<{ success: boolean; data: BlogPostWithRelations }, Error> => {
  return useQuery({
    queryKey: BLOG_QUERY_KEYS.detail(id),
    queryFn: () => blogService.getBlogPostById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useBlogPostBySlug = (
  slug: string,
  enabled: boolean = true
): UseQueryResult<{ success: boolean; data: BlogPostWithRelations }, Error> => {
  return useQuery({
    queryKey: BLOG_QUERY_KEYS.bySlug(slug),
    queryFn: () => blogService.getBlogPostBySlug(slug),
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchBlogPosts = (
  searchTerm: string,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true
): UseQueryResult<PaginatedBlogResponse<BlogPostListItem>, Error> => {
  return useQuery({
    queryKey: BLOG_QUERY_KEYS.search(searchTerm, page, limit),
    queryFn: () => blogService.searchBlogPosts(searchTerm, page, limit),
    enabled: enabled && !!searchTerm,
    staleTime: 2 * 60 * 1000,
  });
};

export const useBlogPostsByCategory = (
  categoryId: string,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true
): UseQueryResult<PaginatedBlogResponse<BlogPostListItem>, Error> => {
  return useQuery({
    queryKey: BLOG_QUERY_KEYS.byCategory(categoryId, page, limit),
    queryFn: () => blogService.getBlogPostsByCategory(categoryId, page, limit),
    enabled: enabled && !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useBlogPostsByTag = (
  tagId: string,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true
): UseQueryResult<PaginatedBlogResponse<BlogPostListItem>, Error> => {
  return useQuery({
    queryKey: BLOG_QUERY_KEYS.byTag(tagId, page, limit),
    queryFn: () => blogService.getBlogPostsByTag(tagId, page, limit),
    enabled: enabled && !!tagId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useBlogPostsByAuthor = (
  authorId: string,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true
): UseQueryResult<PaginatedBlogResponse<BlogPostListItem>, Error> => {
  return useQuery({
    queryKey: BLOG_QUERY_KEYS.byAuthor(authorId, page, limit),
    queryFn: () => blogService.getBlogPostsByAuthor(authorId, page, limit),
    enabled: enabled && !!authorId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRelatedPosts = (
  id: string,
  limit: number = 3,
  enabled: boolean = true
): UseQueryResult<{ success: boolean; data: RelatedBlogPost[] }, Error> => {
  return useQuery({
    queryKey: BLOG_QUERY_KEYS.related(id, limit),
    queryFn: () => blogService.getRelatedPosts(id, limit),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000,
  });
};
