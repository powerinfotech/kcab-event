export interface ParticipantEventItem {
  eventParticipantSeq: number;
  eventSeq: number;
  eventTitle: string;
  eventType: string;
  participantTypeCd?: string | null;
  participantTypeName?: string | null;
  paymentName?: string | null;
  paymentSeq?: number | null;
  paymentStatus?: string | null;
  paymentAmount?: string | number | null;
  paymentCurrency?: string | null;
  paymentMethod?: string | null;
  paymentOrderId?: string | null;
  paymentTransactionId?: string | null;
  paymentRefundedAmount?: string | number | null;
  paymentPaidAt?: string | null;
  paymentCancelledAt?: string | null;
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
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  nationality?: string | null;
  residenceCountry?: string | null;
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

export interface ParticipantTypeOption {
  value: string;
  label: string;
  sortSeq?: number | null;
}

export interface ParticipantEventTypeSaveItem {
  eventParticipantSeq: number;
  participantTypeCd?: string | null;
}

export interface ParticipantListSearchParam {
  keyword?: string;
  eventSeqs?: number[];
  statuses?: string[];
}
