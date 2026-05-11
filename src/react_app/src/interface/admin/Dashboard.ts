export interface AdminDashboardUpcomingEvent {
  eventSeq: number;
  title: string;
  eventType: string;
  status: string;
  startAt: string;
  daysUntilEvent: number;
}

export interface AdminDashboardMetrics {
  pendingEventApprovalCount: number;
  registeredEventCount: number;
  officialEventCount: number;
  sideEventCount: number;
  totalParticipantCount: number;
  recentParticipantCount: number;
  pendingOrganizationApprovalCount: number;
  upcomingEvents: AdminDashboardUpcomingEvent[];
}
