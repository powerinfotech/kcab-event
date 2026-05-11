package com.kcabEvent.dto.saf;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SafDashboardUpcomingEventDto {
    private Long eventSeq;
    private String title;
    private String eventType;
    private String status;
    private LocalDateTime startAt;
    private Integer daysUntilEvent;
}
