import axios from 'axios';
import { ApiResponse } from '@interface/common';
import {
  NoticeNewsDetail,
  NoticeNewsListItem,
  NoticeNewsPostType,
} from '@interface/admin/NoticeNews';

interface PublicNoticeNewsSearchParams {
  postType?: NoticeNewsPostType | '';
  keyword?: string;
}

const BASE_URL = '/api/public/notice-news';

export const callGetPublicNoticeNewsList = async (params: PublicNoticeNewsSearchParams = {}) => {
  const { data } = await axios.get<ApiResponse<NoticeNewsListItem[]>>(BASE_URL, {
    params: {
      postType: params.postType || undefined,
      keyword: params.keyword || undefined,
    },
  });
  return data;
};

export const callGetPublicNoticeNewsDetail = async (noticeNewsSeq: number) => {
  const { data } = await axios.get<ApiResponse<NoticeNewsDetail>>(`${BASE_URL}/${noticeNewsSeq}`);
  return data;
};
