import axios from 'axios';
import { ApiResponse } from '@interface/common';
import {
  NoticeNewsDetail,
  NoticeNewsListItem,
  NoticeNewsSavePayload,
  NoticeNewsSearchParams,
} from '@interface/admin/NoticeNews';

const BASE_URL = '/api/admin/notice-news';

export const callGetNoticeNewsList = async (params: NoticeNewsSearchParams = {}) => {
  const { data } = await axios.get<ApiResponse<NoticeNewsListItem[]>>(BASE_URL, {
    params: {
      postType: params.postType || undefined,
      useYn: params.useYn || undefined,
      keyword: params.keyword || undefined,
    },
  });
  return data;
};

export const callGetNoticeNewsDetail = async (noticeNewsSeq: number) => {
  const { data } = await axios.get<ApiResponse<NoticeNewsDetail>>(`${BASE_URL}/${noticeNewsSeq}`);
  return data;
};

export const callCreateNoticeNews = async (payload: NoticeNewsSavePayload) => {
  const { data } = await axios.post<ApiResponse<number>>(BASE_URL, payload);
  return data;
};

export const callUpdateNoticeNews = async (noticeNewsSeq: number, payload: NoticeNewsSavePayload) => {
  const { data } = await axios.put<ApiResponse<number>>(`${BASE_URL}/${noticeNewsSeq}`, payload);
  return data;
};

export const callDeleteNoticeNews = async (noticeNewsSeq: number) => {
  const { data } = await axios.delete<ApiResponse<void>>(`${BASE_URL}/${noticeNewsSeq}`);
  return data;
};
