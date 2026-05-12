import axios from 'axios';
import { ApiResponse } from '@interface/common';
import {
  GalleryDetail,
  GalleryListItem,
  GallerySavePayload,
  GallerySearchParams,
} from '@interface/admin/Gallery';

const BASE_URL = '/api/admin/gallery';

export const callGetGalleryList = async (params: GallerySearchParams = {}) => {
  const { data } = await axios.get<ApiResponse<GalleryListItem[]>>(BASE_URL, {
    params: {
      galleryYear: params.galleryYear || undefined,
      useYn: params.useYn || undefined,
      keyword: params.keyword || undefined,
    },
  });
  return data;
};

export const callGetGalleryDetail = async (gallerySeq: number) => {
  const { data } = await axios.get<ApiResponse<GalleryDetail>>(`${BASE_URL}/${gallerySeq}`);
  return data;
};

export const callCreateGallery = async (payload: GallerySavePayload) => {
  const { data } = await axios.post<ApiResponse<number>>(BASE_URL, payload);
  return data;
};

export const callUpdateGallery = async (gallerySeq: number, payload: GallerySavePayload) => {
  const { data } = await axios.put<ApiResponse<number>>(`${BASE_URL}/${gallerySeq}`, payload);
  return data;
};

export const callDeleteGallery = async (gallerySeq: number) => {
  const { data } = await axios.delete<ApiResponse<void>>(`${BASE_URL}/${gallerySeq}`);
  return data;
};
