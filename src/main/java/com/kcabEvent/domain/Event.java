package com.kcabEvent.domain;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class Event {
    private Long eventSeq;
    private String title;
    private String content;
    private String summary;
    private String thumbnailUrl;
    private LocalDate eventStartDt;
    private LocalDate eventEndDt;
    private String location;
    private String registrationUrl;
    private String status;
    private String useYn;
    private Long fileSeq;
    private Long rgstUserSeq;
    private LocalDateTime rgstDateTime;
    private Long uptUserSeq;
    private LocalDateTime uptDateTime;
}
