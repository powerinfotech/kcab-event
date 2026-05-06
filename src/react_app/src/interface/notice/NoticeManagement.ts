export interface NoticeListItem {
  noticeSeq: number;
  title: string;
  viewCount: number;
  topYn: string;
  useYn: string;
  rgstUserName: string;
  rgstDateTime: string;
}

export interface NoticeDetail {
  noticeSeq: number;
  title: string;
  content: string;
  viewCount: number;
  topYn: string;
  useYn: string;
  fileSeq: number | null;
  rgstUserSeq: number;
  rgstDateTime: string;
  uptDateTime: string;
}

export interface NoticeSaveRequest {
  noticeSeq?: number;
  title: string;
  content: string;
  topYn: string;
  useYn: string;
  fileSeq?: number | null;
}
