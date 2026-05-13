import axios from 'axios';
import { ApiResponse } from '@interface/common';
import { GalleryListItem } from '@interface/admin/Gallery';

export const callGetPublicGalleryList = async (galleryYear?: number) => {
  const { data } = await axios.get<ApiResponse<GalleryListItem[]>>('/api/public/gallery/list', {
    params: { galleryYear: galleryYear || undefined },
  });
  return data;
};

export const buildGalleryImageUrl = (filePath?: string | null) => {
  if (!filePath) return '';
  return `/api/public/gallery/image?filePath=${encodeURIComponent(filePath)}`;
};

export const resolveGalleryImageUrl = (image?: { fileUrl?: string | null; filePath?: string | null } | null) => {
  if (!image) return '';
  return image.fileUrl || buildGalleryImageUrl(image.filePath);
};
