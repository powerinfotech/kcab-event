package com.kcabEvent.dto.saf;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 조직 대시보드의 행사 카드 한 줄.
 */
@Getter
@Setter
public class SafOrgDashboardEventDto {
    private Long eventSeq;
    private String slug;
    private String title;
    private String eventType;
    private String status;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private LocalDateTime registrationStartAt;
    private LocalDateTime registrationEndAt;
    private String venueName;
    private Integer maxParticipants;
    private Long registrationCount;
    private String pagePublishedYn;
}
