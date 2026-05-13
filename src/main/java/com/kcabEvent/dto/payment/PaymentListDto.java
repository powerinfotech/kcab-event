package com.kcabEvent.dto.payment;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class PaymentListDto {
    private Long paymentSeq;
    private String pgProvider;
    private String pgOrderId;
    private String pgTransactionId;
    private BigDecimal amount;
    private String currency;
    private BigDecimal originalAmount;
    private String discountCode;
    private BigDecimal discountAmount;
    private BigDecimal settleAmount;
    private String settleCurrency;
    private String paymentMethod;
    private String cardCompany;
    private String cardLast4;
    private String status;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
    private LocalDateTime cancelledAt;
    private BigDecimal refundedAmount;
    private Integer refundCount;

    private Long eventSeq;
    private String eventTitle;
    private String eventType;

    private Long participantSeq;
    private Long eventParticipantSeq;
    private String payerName;
    private String payerEmail;
    private String payerCountry;
}
