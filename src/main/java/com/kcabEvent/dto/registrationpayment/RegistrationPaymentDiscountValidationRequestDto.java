package com.kcabEvent.dto.registrationpayment;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegistrationPaymentDiscountValidationRequestDto {
    private Long eventSeq;
    private Long eventPricingSeq;
    private String discountCode;
}
