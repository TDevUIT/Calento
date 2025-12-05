'use client';

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { blogService } from '@/service';
import {
  BlogPost,
  CreateBlogPostRequest,
  UpdateBlogPostRequest,
} from '@/interface';
import { BLOG_QUERY_KEYS } from './query-keys';
import { toast } from 'sonner';

export const useCreateBlogPost = (): UseMutationResult<
  { success: boolean; data: BlogPost },
  Error,
  CreateBlogPostRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBlogPostRequest) => blogService.createBlogPost(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ 
        queryKey: BLOG_QUERY_KEYS.all,
        refetchType: 'active'
      });
      toast.success('Blog post created successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to create blog post', {
        description: error.message,
      });
    },
  });
};

export const useUpdateBlogPost = (): UseMutationResult<
  { success: boolean; data: BlogPost },
  Error,
  { id: string; data: UpdateBlogPostRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlogPostRequest }) =>
      blogService.updateBlogPost(id, data),
    onSuccess: (result, variables) => {
      queryClient.setQueryData(
        BLOG_QUERY_KEYS.detail(variables.id),
        { success: true, data: result.data }
      );
      queryClient.invalidateQueries({ 
        queryKey: BLOG_QUERY_KEYS.all,
        refetchType: 'active'
      });
      toast.success('Blog post updated successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to update blog post', {
        description: error.message,
      });
    },
  });
};

export const useDeleteBlogPost = (): UseMutationResult<
  void,
  Error,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogService.deleteBlogPost(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: BLOG_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ 
        queryKey: BLOG_QUERY_KEYS.all,
        refetchType: 'active'
      });
      toast.success('Blog post deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete blog post', {
        description: error.message,
      });
    },
  });
};

export const usePublishPost = (): UseMutationResult<
  { success: boolean; data: BlogPost },
  Error,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogService.publishPost(id),
    onSuccess: (result, id) => {
      queryClient.setQueryData(
        BLOG_QUERY_KEYS.detail(id),
        { success: true, data: result.data }
      );
      queryClient.invalidateQueries({ 
        queryKey: BLOG_QUERY_KEYS.all,
        refetchType: 'active'
      });
      toast.success('Blog post published successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to publish blog post', {
        description: error.message,
      });
    },
  });
};

export const useUnpublishPost = (): UseMutationResult<
  { success: boolean; data: BlogPost },
  Error,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogService.unpublishPost(id),
    onSuccess: (result, id) => {
      queryClient.setQueryData(
        BLOG_QUERY_KEYS.detail(id),
        { success: true, data: result.data }
      );
      queryClient.invalidateQueries({ 
        queryKey: BLOG_QUERY_KEYS.all,
        refetchType: 'active'
      });
      toast.success('Blog post unpublished successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to unpublish blog post', {
        description: error.message,
      });
    },
  });
};
