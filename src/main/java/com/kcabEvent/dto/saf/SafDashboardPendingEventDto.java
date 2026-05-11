package com.kcabEvent.dto.saf;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SafDashboardPendingEventDto {
    private Long eventSeq;
    private String title;
    private String organizationName;
    private LocalDateTime startAt;
    private String venueName;
    private Integer maxParticipants;
    private LocalDateTime submittedAt;
}
