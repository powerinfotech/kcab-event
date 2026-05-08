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
}

export interface EventDetail {
  eventSeq: number;
  title: string;
  content: string;
  summary: string;
  thumbnailUrl: string;
  eventStartDt: string;
  eventEndDt: string;
  location: string;
  registrationUrl: string;
  status: string;
  useYn: string;
  fileSeq: number | null;
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
  location: string;
  registrationUrl: string;
  status: string;
  useYn: string;
  fileSeq?: number | null;
}

export type EventStatus = 'UPCOMING' | 'ONGOING' | 'ENDED';

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  UPCOMING: 'Upcoming',
  ONGOING: 'Ongoing',
  ENDED: 'Ended',
};
