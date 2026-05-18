package com.kcabEvent.dto.saf;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SafDashboardRecentActivityDto {
    private String activityType;
    private String actorName;
    private String targetTitle;
    private LocalDateTime activityAt;
    private Long referenceSeq;
}
