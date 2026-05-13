package com.kcabEvent.domain;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class Refund {
    private Long refundSeq;
    private Long paymentSeq;
    private BigDecimal amount;
    private String currency;
    private String reason;
    private String status;
    private String refundType;
    private String refundRequestId;
    private BigDecimal settleAmount;
    private String pgRefundId;
    private String pgRefundTransactionId;
    private String pgResponseCode;
    private String pgResponseMessage;
    private BigDecimal balanceBefore;
    private BigDecimal balanceAfter;
    private String rawRequest;
    private String rawResponse;
    private String failedReason;
    private Long requestedBy;
    private Long processedBy;
    private LocalDateTime requestedAt;
    private LocalDateTime processedAt;
    private Long createdBy;
    private LocalDateTime createdAt;
    private Long updatedBy;
    private LocalDateTime updatedAt;
}
