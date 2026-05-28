package com.kcabEvent.dto.paymenttest;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PayTestDiscountValidationRequestDto {
    private Long eventSeq;
    private Long eventPricingSeq;
    private String discountCode;
}
