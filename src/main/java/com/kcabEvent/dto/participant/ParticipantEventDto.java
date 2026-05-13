package com.kcabEvent.dto.participant;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ParticipantEventDto {
    private Long eventParticipantSeq;
    private Long eventSeq;
    private String eventTitle;
    private String eventType;
    private String paymentName;
    private String paymentStatus;
    private String status;
    private LocalDateTime registeredAt;
    private LocalDateTime cancelledAt;
    private String cancelReason;
}
