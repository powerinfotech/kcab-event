package com.kcabEvent.dto.participant;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ParticipantEventOptionDto {
    private Long eventSeq;
    private String title;
    private String eventType;
    private LocalDateTime startAt;
}
