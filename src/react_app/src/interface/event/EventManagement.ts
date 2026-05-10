export interface EventListItem {
  eventSeq: number;
  title: string;
  summary: string;
  thumbnailUrl: string;
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
  content: string;
  summary: string;
  thumbnailUrl: string;
  eventStartDt: string;
  eventEndDt: string;
  registrationStartDt: string | null;
  registrationEndDt: string | null;
  location: string;
  postalCode: string | null;
  venueAddress: string | null;
  addressDetail: string | null;
  registrationUrl: string;
  status: string;
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
  content: string;
  summary: string;
  thumbnailUrl: string;
  eventStartDt: string;
  eventEndDt: string;
  registrationStartDt?: string | null;
  registrationEndDt?: string | null;
  location: string;
  postalCode?: string | null;
  venueAddress?: string | null;
  addressDetail?: string | null;
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

export type EventStatus = 'draft' | 'pending_approval' | 'published' | 'closed' | 'cancelled';

export const EVENT_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  pending_approval: 'Pending Approval',
  published: 'Published',
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
  closed: 'gray',
  cancelled: 'red',
};

export type EventType = 'main' | 'side';

export const EVENT_TYPE_LABELS: Record<string, string> = {
  main: 'Official',
  side: 'Side Event',
};

export const EVENT_TYPE_TONE: Record<string, 'blue' | 'orange'> = {
  main: 'blue',
  side: 'orange',
};
