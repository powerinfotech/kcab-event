package com.kcabEvent.dto.event;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class EventListDto {
    private Long eventSeq;
    private String title;
    private String summary;
    private String thumbnailUrl;
    private LocalDate eventStartDt;
    private LocalDate eventEndDt;
    private String location;
    private String status;
    private String useYn;
    private LocalDateTime rgstDateTime;
}
