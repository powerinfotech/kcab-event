export interface EventListItem {
  eventSeq: number;
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
  rgstUserSeq: number;
  rgstDateTime: string;
  uptDateTime: string;
}

export interface EventSaveRequest {
  eventSeq?: number;
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
