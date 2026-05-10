package com.kcabEvent.dto.event;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class EventListDto {
    private Long eventSeq;
    private String title;
    private String summary;
    private String thumbnailUrl;
    private LocalDateTime eventStartDt;
    private LocalDateTime eventEndDt;
    private String location;
    private String status;
    private String useYn;
    private LocalDateTime rgstDateTime;

    /** 행사 유형 (main = 오피셜, side = 부대행사) */
    private String eventType;
    /** 주최 기관명 (events.organization_seq → organizations.name) */
    private String organizationName;
    /** 정원 (events.max_participants) */
    private Integer maxParticipants;
    /** 신청자 수 (registrations 테이블 count) */
    private Integer registrationCount;
}
