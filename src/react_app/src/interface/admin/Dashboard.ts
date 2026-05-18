export interface AdminDashboardUpcomingEvent {
  eventSeq: number;
  title: string;
  eventType: string;
  status: string;
  startAt: string;
  daysUntilEvent: number;
}

export interface AdminDashboardPendingEvent {
  eventSeq: number;
  title: string;
  organizationName: string | null;
  startAt: string | null;
  venueName: string | null;
  maxParticipants: number | null;
  submittedAt: string | null;
}

export type AdminDashboardActivityType =
  | 'side_event_submitted'
  | 'participant_registered'
  | 'org_signup_pending';

export interface AdminDashboardRecentActivity {
  activityType: AdminDashboardActivityType;
  actorName: string;
  targetTitle: string | null;
  activityAt: string;
  referenceSeq: number | null;
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
  pendingSideEvents: AdminDashboardPendingEvent[];
  recentActivities: AdminDashboardRecentActivity[];
}
