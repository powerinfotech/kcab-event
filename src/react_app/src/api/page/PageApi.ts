import axios from 'axios';
import { ApiResponse } from '@interface/common';
import { PageListItem, PageDetail, PageSaveRequest } from '@interface/page/PageManagement';

export const callGetPageList = async () => {
  const { data } = await axios.get<ApiResponse<PageListItem[]>>('/api/page/list');
  return data;
};

export const callGetPageDetail = async (pageSeq: number) => {
  const { data } = await axios.get<ApiResponse<PageDetail>>('/api/page/detail', {
    params: { pageSeq },
  });
  return data;
};

export const callSavePage = async (saveDto: PageSaveRequest) => {
  const { data } = await axios.post<ApiResponse<void>>('/api/page/save', saveDto);
  return data;
};

export const callDeletePage = async (pageSeq: number) => {
  const { data } = await axios.post<ApiResponse<void>>('/api/page/delete', null, {
    params: { pageSeq },
  });
  return data;
};

export const callGetPublicPageList = async () => {
  const { data } = await axios.get<ApiResponse<PageListItem[]>>('/api/public/page/list', {
    headers: { showLoading: false },
  });
  return data;
};

export const callGetPublicPageDetail = async (pageUrl: string) => {
  const { data } = await axios.get<ApiResponse<PageDetail>>('/api/public/page/detail', {
    params: { pageUrl },
    headers: { showLoading: false },
  });
  return data;
};
