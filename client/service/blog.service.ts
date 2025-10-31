import { api, getErrorMessage } from '../config/axios';
import {
  BlogPost,
  BlogPostWithRelations,
  BlogPostListItem,
  PopularBlogPost,
  RelatedBlogPost,
  CreateBlogPostRequest,
  UpdateBlogPostRequest,
  BlogPostQueryParams,
  PaginatedBlogResponse,
} from '../interface/blog.interface';
import { API_ROUTES } from '../constants/routes';

export type {
  BlogPost,
  BlogPostWithRelations,
  CreateBlogPostRequest,
  UpdateBlogPostRequest,
} from '../interface/blog.interface';

export const getBlogPosts = async (
  params?: BlogPostQueryParams
): Promise<PaginatedBlogResponse<BlogPostListItem>> => {
  try {
    const response = await api.get<any>(
      API_ROUTES.BLOG_POSTS,
      { params }
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getPublishedPosts = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedBlogResponse<BlogPostListItem>> => {
  try {
    const response = await api.get<any>(
      API_ROUTES.BLOG_PUBLISHED,
      { params: { page, limit } }
    );
    
    const data = response.data?.data || response.data;
    
    if (data && typeof data === 'object' && 'data' in data) {
      return data;
    }
    
    return {
      success: true,
      data: Array.isArray(data) ? data : [],
      meta: {
        page: page,
        limit: limit,
        total: 0,
        totalPages: 0
      }
    };
  } catch (error) {
    console.error('Blog service error:', error);
    return {
      success: false,
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 }
    };
  }
};

export const getFeaturedPosts = async (
  limit: number = 3
): Promise<{ success: boolean; data: BlogPostListItem[] }> => {
  try {
    const response = await api.get<any>(
      API_ROUTES.BLOG_FEATURED,
      { params: { limit } }
    );
    const responseData = response.data?.data || response.data;
    if (Array.isArray(responseData)) {
      return { success: true, data: responseData };
    }
    return { success: true, data: [] };
  } catch (error) {
    console.error('Featured posts error:', error);
    return { success: false, data: [] };
  }
};

export const getPopularPosts = async (
  limit: number = 5
): Promise<{ success: boolean; data: PopularBlogPost[] }> => {
  try {
    const response = await api.get<any>(
      API_ROUTES.BLOG_POPULAR,
      { params: { limit } }
    );
    const responseData = response.data?.data || response.data;
    if (Array.isArray(responseData)) {
      return { success: true, data: responseData };
    }
    return { success: true, data: [] };
  } catch (error) {
    console.error('Popular posts error:', error);
    return { success: false, data: [] };
  }
};

export const getBlogPostById = async (
  id: string
): Promise<{ success: boolean; data: BlogPostWithRelations }> => {
  try {
    const response = await api.get<{ success: boolean; data: BlogPostWithRelations }>(
      API_ROUTES.BLOG_DETAIL(id)
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getBlogPostBySlug = async (
  slug: string
): Promise<{ success: boolean; data: BlogPostWithRelations }> => {
  try {
    const response = await api.get<{ success: boolean; data: BlogPostWithRelations }>(
      API_ROUTES.BLOG_BY_SLUG(slug)
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const searchBlogPosts = async (
  searchTerm: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedBlogResponse<BlogPostListItem>> => {
  try {
    const response = await api.get<PaginatedBlogResponse<BlogPostListItem>>(
      API_ROUTES.BLOG_SEARCH,
      { params: { q: searchTerm, page, limit } }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getBlogPostsByCategory = async (
  categoryId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedBlogResponse<BlogPostListItem>> => {
  try {
    const response = await api.get<PaginatedBlogResponse<BlogPostListItem>>(
      API_ROUTES.BLOG_BY_CATEGORY(categoryId),
      { params: { page, limit } }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getBlogPostsByTag = async (
  tagId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedBlogResponse<BlogPostListItem>> => {
  try {
    const response = await api.get<PaginatedBlogResponse<BlogPostListItem>>(
      API_ROUTES.BLOG_BY_TAG(tagId),
      { params: { page, limit } }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getBlogPostsByAuthor = async (
  authorId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedBlogResponse<BlogPostListItem>> => {
  try {
    const response = await api.get<PaginatedBlogResponse<BlogPostListItem>>(
      API_ROUTES.BLOG_BY_AUTHOR(authorId),
      { params: { page, limit } }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getRelatedPosts = async (
  id: string,
  limit: number = 3
): Promise<{ success: boolean; data: RelatedBlogPost[] }> => {
  try {
    const response = await api.get<{ success: boolean; data: RelatedBlogPost[] }>(
      API_ROUTES.BLOG_RELATED(id),
      { params: { limit } }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createBlogPost = async (
  data: CreateBlogPostRequest
): Promise<{ success: boolean; data: BlogPost }> => {
  try {
    const response = await api.post<{ success: boolean; data: BlogPost }>(
      API_ROUTES.BLOG_CREATE,
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateBlogPost = async (
  id: string,
  data: UpdateBlogPostRequest
): Promise<{ success: boolean; data: BlogPost }> => {
  try {
    const response = await api.put<{ success: boolean; data: BlogPost }>(
      API_ROUTES.BLOG_UPDATE(id),
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    await api.delete(API_ROUTES.BLOG_DELETE(id));
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const publishPost = async (
  id: string
): Promise<{ success: boolean; data: BlogPost }> => {
  try {
    const response = await api.post<{ success: boolean; data: BlogPost }>(
      API_ROUTES.BLOG_PUBLISH(id)
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const unpublishPost = async (
  id: string
): Promise<{ success: boolean; data: BlogPost }> => {
  try {
    const response = await api.post<{ success: boolean; data: BlogPost }>(
      API_ROUTES.BLOG_UNPUBLISH(id)
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const blogService = {
  getBlogPosts,
  getPublishedPosts,
  getFeaturedPosts,
  getPopularPosts,
  getBlogPostById,
  getBlogPostBySlug,
  searchBlogPosts,
  getBlogPostsByCategory,
  getBlogPostsByTag,
  getBlogPostsByAuthor,
  getRelatedPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  publishPost,
  unpublishPost,
};
