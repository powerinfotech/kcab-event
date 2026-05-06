import { IudType } from '@interface/common';

export interface PageListItem {
  pageSeq: number;
  pageNm: string;
  pageUrl: string;
  pageTitle: string;
  useYn: string;
  sortSeq: number;
  sectionCount: number;
  rgstDateTime: string;
  uptDateTime: string;
}

export interface PageDetail {
  pageSeq: number;
  pageNm: string;
  pageUrl: string;
  pageTitle: string;
  pageDesc: string;
  useYn: string;
  sortSeq: number;
  rgstDateTime: string;
  uptDateTime: string;
  sections: PageSection[];
}

export interface PageSection {
  sectionSeq?: number;
  pageSeq?: number;
  sectionType: SectionType;
  sectionData: string;
  sortSeq: number;
  useYn: string;
  iudType?: IudType;
}

export type SectionType =
  | 'HERO'
  | 'TEXT'
  | 'IMAGE'
  | 'IMAGE_SLIDER'
  | 'CARD_LIST'
  | 'SPEAKER_LIST'
  | 'VIDEO'
  | 'MAP'
  | 'BANNER_LIST'
  | 'EVENT_INFO';

export const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  HERO: '히어로 배너',
  TEXT: '텍스트',
  IMAGE: '이미지',
  IMAGE_SLIDER: '이미지 슬라이더',
  CARD_LIST: '카드 목록',
  SPEAKER_LIST: '연사 목록',
  VIDEO: '비디오',
  MAP: '지도',
  BANNER_LIST: '배너 목록',
  EVENT_INFO: '행사 정보',
};

export interface HeroData {
  title: string;
  subtitle: string;
  backgroundImage: string;
  size: 'small' | 'medium' | 'large';
}

export interface TextData {
  title: string;
  content: string;
  size: 'small' | 'medium' | 'large';
}

export interface ImageData {
  imageUrl: string;
  alt: string;
  caption: string;
  size: 'small' | 'medium' | 'large';
}

export interface ImageSliderData {
  images: { imageUrl: string; alt: string; caption: string }[];
  autoPlay: boolean;
}

export interface CardItem {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
}

export interface CardListData {
  title: string;
  cards: CardItem[];
  columns: 2 | 3 | 4;
}

export interface SpeakerItem {
  name: string;
  role: string;
  organization: string;
  imageUrl: string;
}

export interface SpeakerListData {
  title: string;
  speakers: SpeakerItem[];
}

export interface VideoData {
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export interface MapData {
  title: string;
  address: string;
  lat: number;
  lng: number;
  description: string;
}

export interface BannerListData {
  banners: { imageUrl: string; linkUrl: string; alt: string }[];
}

export interface EventInfoData {
  title: string;
  date: string;
  location: string;
  description: string;
  registrationUrl: string;
}

export interface PageSaveRequest {
  pageSeq?: number;
  pageNm: string;
  pageUrl: string;
  pageTitle: string;
  pageDesc: string;
  useYn: string;
  sortSeq: number;
  sections: PageSection[];
}
