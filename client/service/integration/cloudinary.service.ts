import { api } from "@/config";

export interface CloudinaryUploadResponse {
  public_id: string;
  url: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export const cloudinaryService = {
  async uploadAvatar(file: File): Promise<CloudinaryUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post('/cloudinary/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data.data;
  },

  async uploadImage(file: File): Promise<CloudinaryUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post('/cloudinary/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data.data;
  },

  async deleteImage(publicId: string): Promise<void> {
    await api.delete(`/cloudinary/image/${encodeURIComponent(publicId)}`);
  },

  async getAvatarUrl(publicId: string): Promise<string> {
    const { data } = await api.get(`/cloudinary/avatar/${encodeURIComponent(publicId)}`);
    return data.data.url;
  },
};

