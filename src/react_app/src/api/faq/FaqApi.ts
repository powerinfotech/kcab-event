import axios from 'axios';
import { ApiResponse } from '@interface/common';
import { FaqAudience, FaqItem, FaqSaveRequest } from '@interface/faq/FaqManagement';

export interface FaqListSearchParam {
  category?: string;
  audience?: FaqAudience;
  activeOnly?: boolean;
}

export const callGetFaqList = async (param: FaqListSearchParam = {}) => {
  const { data } = await axios.get<ApiResponse<FaqItem[]>>('/api/faq/list', {
    params: param,
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

export const callGetOrganizationFaqList = async (category?: string) => {
  const { data } = await axios.get<ApiResponse<FaqItem[]>>('/api/faq/list', {
    params: { category, audience: 'organization', activeOnly: true },
    headers: { showLoading: false },
  });
  return data;
};
