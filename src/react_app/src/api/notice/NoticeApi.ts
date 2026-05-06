import axios from 'axios';
import { ApiResponse } from '@interface/common';
import { NoticeListItem, NoticeDetail, NoticeSaveRequest } from '@interface/notice/NoticeManagement';

export const callGetNoticeList = async (searchText?: string) => {
  const { data } = await axios.get<ApiResponse<NoticeListItem[]>>('/api/notice/list', {
    params: { searchText },
  });
  return data;
};

export const callGetNoticeDetail = async (noticeSeq: number) => {
  const { data } = await axios.get<ApiResponse<NoticeDetail>>('/api/notice/detail', {
    params: { noticeSeq },
  });
  return data;
};

export const callSaveNotice = async (saveDto: NoticeSaveRequest) => {
  const { data } = await axios.post<ApiResponse<void>>('/api/notice/save', saveDto);
  return data;
};

export const callDeleteNotice = async (noticeSeq: number) => {
  const { data } = await axios.post<ApiResponse<void>>('/api/notice/delete', null, {
    params: { noticeSeq },
  });
  return data;
};

export const callGetPublicNoticeList = async (searchText?: string) => {
  const { data } = await axios.get<ApiResponse<NoticeListItem[]>>('/api/public/notice/list', {
    params: { searchText },
    headers: { showLoading: false },
  });
  return data;
};

export const callGetPublicNoticeDetail = async (noticeSeq: number) => {
  const { data } = await axios.get<ApiResponse<NoticeDetail>>('/api/public/notice/detail', {
    params: { noticeSeq },
    headers: { showLoading: false },
  });
  return data;
};
