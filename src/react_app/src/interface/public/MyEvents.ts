export interface MyProfile {
  email?: string | null;
  fullName?: string | null;
  organizationName?: string | null;
  position?: string | null;
  country?: string | null;
  nationality?: string | null;
  residenceCountry?: string | null;
  phone?: string | null;
  totalEventCount?: number | null;
}

export interface MyEventsSession {
  email: string;
  expiresInSeconds: number;
  profile?: MyProfile | null;
  events?: MyEvent[] | null;
}

export interface MyEvent {
  eventParticipantSeq: number;
  eventSeq: number;
  eventTitle: string;
  slug?: string | null;
  eventType?: string | null;
  eventStartDt?: string | null;
  eventEndDt?: string | null;
  location?: string | null;
  participantTypeName?: string | null;
  participationStatus?: string | null;
  registeredAt?: string | null;
  cancelledAt?: string | null;
  paymentStatus?: string | null;
  paymentAmount?: number | null;
  paymentCurrency?: string | null;
  paidAt?: string | null;
}
