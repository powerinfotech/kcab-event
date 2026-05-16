export interface EventListItem {
  eventSeq: number;
  slug: string;
  title: string;
  summary: string;
  eventStartDt: string;
  eventEndDt: string;
  location: string;
  status: string;
  useYn: string;
  rgstDateTime: string;
  eventType: string;
  organizationName: string | null;
  maxParticipants: number | null;
  registrationCount: number;
}

export interface EventDetail {
  eventSeq: number;
  slug: string;
  title: string;
  description?: string;
  content: string;
  summary: string;
  eventStartDt: string;
  eventEndDt: string;
  registrationStartDt: string | null;
  registrationEndDt: string | null;
  location: string;
  /** 참가신청 방식: direct=자체 신청 화면, external=외부 URL로 이동 */
  registrationType: RegistrationType;
  /** 참가신청 외부 URL (registrationType=external 일 때만 사용) */
  registrationUrl: string;
  status: string;
  rejectionReason?: string | null;
  useYn: string;
  fileSeq: number | null;
  attachmentFileSeq: number | null;
  eventType: string;
  organizationSeq: number | null;
  organizationName: string | null;
  maxParticipants: number | null;
  isPaid: boolean | null;
  pricingList: EventPricingItem[];
  discountCodes: EventDiscountCodeItem[];
  rgstUserSeq: number;
  rgstDateTime: string;
  uptDateTime: string;
}

export interface EventSaveRequest {
  eventSeq?: number;
  slug?: string;
  title: string;
  description?: string;
  content: string;
  summary: string;
  eventStartDt: string;
  eventEndDt: string;
  registrationStartDt?: string | null;
  registrationEndDt?: string | null;
  location: string;
  /** 참가신청 방식: direct=자체 신청 화면, external=외부 URL로 이동 */
  registrationType: RegistrationType;
  /** 참가신청 외부 URL (registrationType=external 일 때만 사용) */
  registrationUrl: string;
  status: string;
  useYn: string;
  fileSeq?: number | null;
  attachmentFileSeq?: number | null;
  eventType: string;
  organizationSeq?: number | null;
  maxParticipants?: number | null;
  isPaid?: boolean | null;
  pricingList?: EventPricingItem[];
  discountCodes?: EventDiscountCodeItem[];
}

export interface EventPageBlock {
  blockSeq: number;
  sectionSeq: number;
  componentTemplateSeq?: number | null;
  parentBlockSeq?: number | null;
  blockKey?: string | null;
  blockType: string;
  title?: string | null;
  subtitle?: string | null;
  summary?: string | null;
  body?: string | null;
  badgeText?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  venueName?: string | null;
  speakerNames?: string | null;
  organizationName?: string | null;
  buttonLabel?: string | null;
  linkUrl?: string | null;
  linkTarget?: '_self' | '_blank' | string;
  imageFileSeq?: number | null;
  imageUrl?: string | null;
  attachmentFileSeq?: number | null;
  featuredYn?: string | null;
  sortSeq?: number | null;
  useYn?: string | null;
  styleJson?: string | null;
  contentJson?: string | null;
}

export interface EventPageSection {
  sectionSeq: number;
  eventPageSeq: number;
  componentTemplateSeq?: number | null;
  sectionKey: string;
  sectionType: string;
  title?: string | null;
  eyebrow?: string | null;
  subtitle?: string | null;
  body?: string | null;
  anchorId?: string | null;
  navLabel?: string | null;
  showInNavYn?: string | null;
  layoutType?: string | null;
  columnCount?: number | null;
  sortSeq?: number | null;
  useYn?: string | null;
  settingsJson?: string | null;
  blocks: EventPageBlock[];
}

export interface PublicEventPage {
  eventPageSeq: number;
  eventSeq: number;
  languageCode: string;
  urlSlug: string;
  pageStatus: string;
  pageTitle?: string | null;
  pageSubtitle?: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroFileSeq?: number | null;
  heroImageUrl?: string | null;
  themeCode?: string | null;
  themeJson?: string | null;
  settingsJson?: string | null;
  publishedAt?: string | null;
  eventTitle: string;
  eventSummary?: string | null;
  eventStartDt?: string | null;
  eventEndDt?: string | null;
  location?: string | null;
  registrationType?: RegistrationType | string | null;
  registrationUrl?: string | null;
  eventStatus?: string | null;
  eventType?: string | null;
  sections: EventPageSection[];
}

export interface EventPageComponentCategory {
  componentCategorySeq: number;
  categoryCode: string;
  categoryName: string;
  description?: string | null;
  sortSeq?: number | null;
}

export interface EventPageComponentTemplate {
  componentTemplateSeq: number;
  componentCategorySeq: number;
  componentScope: 'section' | 'block' | string;
  templateCode: string;
  componentType: string;
  templateName: string;
  description?: string | null;
  iconName?: string | null;
  previewFileSeq?: number | null;
  defaultTitle?: string | null;
  defaultSubtitle?: string | null;
  formSchemaJson?: string | null;
  defaultSettingsJson?: string | null;
  defaultContentJson?: string | null;
  allowedChildTypes?: string | null;
  sortSeq?: number | null;
}

export interface EventPageComponentCatalog {
  categories: EventPageComponentCategory[];
  templates: EventPageComponentTemplate[];
}

export interface EventPricingItem {
  eventPricingSeq?: number | null;
  eventSeq?: number | null;
  priceType: string;
  priceName: string;
  currencyCode: string;
  amount: number | null;
  salesStartAt?: string | null;
  salesEndAt?: string | null;
  useYn: string;
  sortSeq?: number | null;
  soldCount?: number | null;
  paymentCount?: number | null;
}

export interface EventDiscountCodeItem {
  discountCodeSeq?: number | null;
  eventSeq?: number | null;
  discountCode: string;
  discountType: 'percent' | 'amount' | string;
  discountValue: number | null;
  currencyCode?: string | null;
  appliesToPriceType?: string | null;
  usageLimit?: number | null;
  usedCount?: number | null;
  paymentCount?: number | null;
  validFromAt?: string | null;
  validToAt?: string | null;
  useYn: string;
  sortSeq?: number | null;
}

export interface EventListSearchParam {
  status?: string;
  eventType?: string;
  keyword?: string;
}

export type EventStatus = 'draft' | 'pending_approval' | 'published' | 'rejected' | 'closed' | 'cancelled';

export const EVENT_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  pending_approval: 'Pending Approval',
  published: 'Published',
  rejected: 'Rejected',
  closed: 'Closed',
  cancelled: 'Cancelled',
  UPCOMING: 'Upcoming',
  ONGOING: 'Ongoing',
  ENDED: 'Ended',
};

export const EVENT_STATUS_TONE: Record<string, 'green' | 'yellow' | 'gray' | 'blue' | 'red'> = {
  draft: 'gray',
  pending_approval: 'yellow',
  published: 'green',
  rejected: 'red',
  closed: 'gray',
  cancelled: 'red',
};

export type EventType = 'main' | 'side';

/** 참가신청 방식: direct=자체 신청 화면 / external=외부 URL / none=등록 불필요 */
export type RegistrationType = 'direct' | 'external' | 'none';

export const REGISTRATION_TYPE_LABELS: Record<RegistrationType, string> = {
  direct: 'Direct',
  external: 'External',
  none: 'None (no registration)',
};

export const EVENT_TYPE_LABELS: Record<string, string> = {
  main: 'Official',
  side: 'Side Event',
};

export const EVENT_TYPE_TONE: Record<string, 'blue' | 'orange'> = {
  main: 'blue',
  side: 'orange',
};
