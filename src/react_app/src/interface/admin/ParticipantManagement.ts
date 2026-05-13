export interface ParticipantEventItem {
  eventParticipantSeq: number;
  eventSeq: number;
  eventTitle: string;
  eventType: string;
  paymentName?: string | null;
  paymentStatus?: string | null;
  status: string;
  registeredAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
}

export interface ParticipantListItem {
  participantSeq: number;
  email: string;
  fullName: string;
  organizationName: string | null;
  position: string | null;
  country: string | null;
  eventCount: number;
  statusSummary: string;
  latestRegisteredAt: string | null;
  events: ParticipantEventItem[];
}

export interface ParticipantEventOption {
  eventSeq: number;
  title: string;
  eventType: string;
  startAt: string | null;
}

export interface ParticipantListSearchParam {
  keyword?: string;
  eventSeqs?: number[];
  statuses?: string[];
}
