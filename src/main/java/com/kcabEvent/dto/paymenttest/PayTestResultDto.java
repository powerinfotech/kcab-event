package com.kcabEvent.dto.paymenttest;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class PayTestResultDto {
    private Long paymentSeq;
    private String orderId;
    private String status;
    private BigDecimal amount;
    private String currency;
    private String eventTitle;
    private String priceName;
    private String pgTransactionId;
    private String pgResponseCode;
    private String pgResponseMessage;
    private String failedReason;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
}
