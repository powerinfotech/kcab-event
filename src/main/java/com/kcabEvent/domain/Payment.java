package com.kcabEvent.domain;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class Payment {
    private Long paymentSeq;
    private String pgProvider;
    private String pgMid;
    private String pgTransactionId;
    private String pgOrderId;
    private BigDecimal amount;
    private String currency;
    private String paymentMethod;
    private String cardCompany;
    private String cardLast4;
    private String status;
    private LocalDateTime paidAt;
    private String failedReason;
    private String receiptUrl;
    private String rawResponse;
    private String pgResponseCode;
    private String pgResponseMessage;
    private LocalDateTime verifiedAt;
    private LocalDateTime webhookReceivedAt;

    private Long eventSeq;
    private Long eventParticipantSeq;
    private Long participantSeq;
    private String payerName;
    private String payerEmail;
    private String payerCountry;
    private BigDecimal settleAmount;
    private String settleCurrency;
    private BigDecimal fxRate;
    private String approvalNo;
    private Integer installmentMonths;
    private Long eventPricingSeq;
    private BigDecimal originalAmount;
    private Long discountCodeSeq;
    private BigDecimal discountAmount;
    private BigDecimal refundedAmount;
    private LocalDateTime cancelledAt;
    private String cancelReason;
    private String adminMemo;

    private Long createdBy;
    private LocalDateTime createdAt;
    private Long updatedBy;
    private LocalDateTime updatedAt;
}
