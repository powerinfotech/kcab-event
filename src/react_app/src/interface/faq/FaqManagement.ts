import { IudType } from '@interface/common';

export interface FaqItem {
  faqSeq?: number;
  category: string;
  question: string;
  answer: string;
  sortSeq: number;
  useYn: string;
  rgstDateTime?: string;
  iudType?: IudType;
}

export interface FaqSaveRequest {
  faqList: FaqItem[];
}
