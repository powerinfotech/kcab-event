package com.kcabEvent.dto.payment;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class RefundListDto {
    private Long refundSeq;
    private Long paymentSeq;
    private BigDecimal amount;
    private String currency;
    private BigDecimal settleAmount;
    private String reason;
    private String status;
    private String refundType;
    private String refundRequestId;
    private String pgRefundId;
    private String pgRefundTransactionId;
    private String pgResponseCode;
    private String pgResponseMessage;
    private BigDecimal balanceBefore;
    private BigDecimal balanceAfter;
    private String failedReason;
    private LocalDateTime requestedAt;
    private LocalDateTime processedAt;
    private String requestedByName;
    private String processedByName;
}
