export interface CloudinaryUploadResult {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder?: string;
  original_filename: string;
}

export interface CloudinaryDeleteResult {
  result: string;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  public_id?: string;
  transformation?: CloudinaryTransformation;
  tags?: string[];
  overwrite?: boolean;
  unique_filename?: boolean;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  upload_preset?: string;
}

export interface CloudinaryTransformation {
  width?: number;
  height?: number;
  crop?: 'fill' | 'scale' | 'fit' | 'limit' | 'pad' | 'crop';
  quality?: 'auto' | number;
  fetch_format?: 'auto' | 'jpg' | 'png' | 'webp';
  gravity?: 'face' | 'faces' | 'center' | 'auto';
  radius?: number | 'max';
  effect?: string;
}
