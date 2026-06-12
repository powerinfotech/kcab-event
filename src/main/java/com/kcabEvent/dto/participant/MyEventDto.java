package com.kcabEvent.dto.participant;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** 공개 "My Events": 이메일 인증한 참가자가 본인이 등록한 행사 1건을 본다. */
@Getter
@Setter
public class MyEventDto {
    private Long eventParticipantSeq;
    private Long eventSeq;
    private String eventTitle;
    private String slug;
    private String eventType;
    private LocalDateTime eventStartDt;
    private LocalDateTime eventEndDt;
    private String location;
    private String participantTypeName;
    /** event_participants.status (registered / cancelled 등) */
    private String participationStatus;
    private LocalDateTime registeredAt;
    private LocalDateTime cancelledAt;
    private String paymentStatus;
    private BigDecimal paymentAmount;
    private String paymentCurrency;
    private LocalDateTime paidAt;
}
