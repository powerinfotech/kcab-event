import { IudType } from '@interface/common';

export type PopupStatus = 'published' | 'hidden';

export interface PopupItem {
  popupSeq?: number;
  title: string;
  content: string;
  status: PopupStatus;
  sortSeq: number;
  startAt?: string | null;
  endAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  iudType?: IudType;
}

export interface PopupSaveRequest {
  popupList: PopupItem[];
}
