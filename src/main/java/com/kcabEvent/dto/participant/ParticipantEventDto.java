package com.kcabEvent.dto.participant;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class ParticipantEventDto {
    private Long eventParticipantSeq;
    private Long eventSeq;
    private String eventTitle;
    private String eventType;
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
    private String status;
    private LocalDateTime registeredAt;
    private LocalDateTime cancelledAt;
    private String cancelReason;
}
