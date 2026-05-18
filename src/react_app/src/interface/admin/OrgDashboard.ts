/** 조직 대시보드 한 행사 카드 데이터 */
export interface OrgDashboardEvent {
  eventSeq: number;
  slug: string | null;
  title: string;
  eventType: string;
  status: string;
  startAt: string | null;
  endAt: string | null;
  registrationStartAt: string | null;
  registrationEndAt: string | null;
  venueName: string | null;
  maxParticipants: number | null;
  registrationCount: number;
  pagePublishedYn: string | null;
}

export interface OrgDashboardActionItem {
  actionType: string;
  severity: 'info' | 'warning' | 'danger' | string;
  eventSeq: number;
  title: string;
  description: string;
  dueAt: string | null;
}

export interface OrgDashboardRecentParticipant {
  participantSeq: number;
  eventSeq: number;
  eventTitle: string;
  fullName: string;
  email: string;
  organizationName: string | null;
  position: string | null;
  registeredAt: string | null;
}

/** 조직 대시보드 메트릭 응답 */
export interface OrgDashboardMetrics {
  myEventCount: number;
  pendingApprovalCount: number;
  publishedEventCount: number;
  draftEventCount: number;
  rejectedEventCount: number;
  totalApplicantCount: number;
  totalCapacityCount: number;
  myEvents: OrgDashboardEvent[];
  actionItems: OrgDashboardActionItem[];
  recentParticipants: OrgDashboardRecentParticipant[];
}
