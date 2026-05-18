import { IudType } from '@interface/common';

export type FaqAudience = 'public' | 'organization';

export interface FaqItem {
  faqSeq?: number;
  audience: FaqAudience;
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
