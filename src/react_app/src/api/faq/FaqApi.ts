import axios from 'axios';
import { ApiResponse } from '@interface/common';
import { FaqItem, FaqSaveRequest } from '@interface/faq/FaqManagement';

export const callGetFaqList = async (category?: string) => {
  const { data } = await axios.get<ApiResponse<FaqItem[]>>('/api/faq/list', {
    params: { category },
  });
  return data;
};

export const callSaveFaq = async (saveDto: FaqSaveRequest) => {
  const { data } = await axios.post<ApiResponse<void>>('/api/faq/save', saveDto);
  return data;
};

export const callGetPublicFaqList = async (category?: string) => {
  const { data } = await axios.get<ApiResponse<FaqItem[]>>('/api/public/faq/list', {
    params: { category },
    headers: { showLoading: false },
  });
  return data;
};
