import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cloudinaryService, type CloudinaryUploadResponse } from '@/service';
import { toast } from 'sonner';

export const useAvatarUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => cloudinaryService.uploadAvatar(file),
    onSuccess: (data: CloudinaryUploadResponse) => {
      toast.success('Avatar uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['user'] });
      return data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload avatar');
    },
  });
};

export const useImageUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => cloudinaryService.uploadImage(file),
    onSuccess: (data: CloudinaryUploadResponse) => {
      toast.success('Image uploaded successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    },
  });
};
