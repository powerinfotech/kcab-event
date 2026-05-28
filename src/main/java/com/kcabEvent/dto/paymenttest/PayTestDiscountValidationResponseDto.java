package com.kcabEvent.dto.paymenttest;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PayTestDiscountValidationResponseDto {
    private boolean valid;
    private String status;
    private String message;
    private Long discountCodeSeq;
    private String discountCode;
    private String discountType;
    private BigDecimal discountValue;
    private String currencyCode;
    private BigDecimal originalAmount;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private Integer usageLimit;
    private Integer usedCount;
}
