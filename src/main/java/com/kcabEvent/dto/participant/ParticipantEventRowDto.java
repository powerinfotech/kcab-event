package com.kcabEvent.dto.participant;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class ParticipantEventRowDto {
    private Long participantSeq;
    private String email;
    private String fullName;
    private String organizationName;
    private String position;
    private String country;
    private Integer totalEventCount;
    private Long eventParticipantSeq;
    private Long eventSeq;
    private String eventTitle;
    private String eventType;
    private String participantTypeCd;
    private String participantTypeName;
    private String paymentName;
    private Long paymentSeq;
    private String paymentStatus;
    private BigDecimal paymentAmount;
    private String paymentCurrency;
    private String paymentMethod;
    private String paymentOrderId;
    private String paymentTransactionId;
    private BigDecimal paymentRefundedAmount;
    private LocalDateTime paymentPaidAt;
    private LocalDateTime paymentCancelledAt;
    private String participationStatus;
    private LocalDateTime registeredAt;
    private LocalDateTime cancelledAt;
    private String cancelReason;
}
