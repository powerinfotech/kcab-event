package com.kcabEvent.dto.saf;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SafDashboardMetricsDto {
    private Long pendingEventApprovalCount;
    private Long registeredEventCount;
    private Long officialEventCount;
    private Long sideEventCount;
    private Long totalParticipantCount;
    private Long recentParticipantCount;
    private Long pendingOrganizationApprovalCount;
    private List<SafDashboardUpcomingEventDto> upcomingEvents = List.of();
}
