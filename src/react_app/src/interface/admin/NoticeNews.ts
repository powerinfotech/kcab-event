export type NoticeNewsPostType = 'NEWS' | 'NOTICE';

export interface NoticeNewsListItem {
  noticeNewsSeq: number;
  postType: NoticeNewsPostType;
  title: string;
  postDate: string;
  viewCount: number;
  topYn: string;
  topStartDate?: string | null;
  topEndDate?: string | null;
  useYn: string;
  fileSeq: number | null;
  attachmentCount: number;
  rgstUserName?: string | null;
  rgstDateTime?: string | null;
  uptDateTime?: string | null;
}

export interface NoticeNewsDetail {
  noticeNewsSeq: number;
  postType: NoticeNewsPostType;
  title: string;
  content: string | null;
  postDate: string;
  viewCount: number;
  topYn: string;
  topStartDate?: string | null;
  topEndDate?: string | null;
  useYn: string;
  fileSeq: number | null;
  rgstUserSeq?: number | null;
  rgstUserName?: string | null;
  rgstDateTime?: string | null;
  uptUserSeq?: number | null;
  uptUserName?: string | null;
  uptDateTime?: string | null;
}

export interface NoticeNewsSavePayload {
  postType: NoticeNewsPostType;
  title: string;
  content: string;
  postDate: string;
  topYn: string;
  topStartDate?: string | null;
  topEndDate?: string | null;
  useYn: string;
  fileSeq: number | null;
}

export interface NoticeNewsSearchParams {
  postType?: NoticeNewsPostType | '';
  useYn?: string;
  keyword?: string;
}

export const NOTICE_NEWS_POST_TYPE_LABEL: Record<NoticeNewsPostType, string> = {
  NEWS: 'News',
  NOTICE: 'Notice',
};

export const NOTICE_NEWS_POST_TYPE_TONE: Record<NoticeNewsPostType, 'blue' | 'green'> = {
  NEWS: 'blue',
  NOTICE: 'green',
};
