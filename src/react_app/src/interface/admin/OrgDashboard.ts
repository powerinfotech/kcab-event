/** 조직 대시보드 한 행사 카드 데이터 */
export interface OrgDashboardEvent {
  eventSeq: number;
  title: string;
  eventType: string;
  status: string;
  startAt: string | null;
  venueName: string | null;
  maxParticipants: number | null;
  registrationCount: number;
}

/** 조직 대시보드 메트릭 응답 */
export interface OrgDashboardMetrics {
  myEventCount: number;
  pendingApprovalCount: number;
  totalApplicantCount: number;
  myEvents: OrgDashboardEvent[];
}
