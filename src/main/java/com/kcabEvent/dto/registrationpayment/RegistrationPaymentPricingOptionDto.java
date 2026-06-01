package com.kcabEvent.dto.registrationpayment;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class RegistrationPaymentPricingOptionDto {
    private Long eventPricingSeq;
    private Long eventSeq;
    private String priceType;
    private String priceName;
    private String currencyCode;
    private BigDecimal amount;
    private LocalDateTime salesStartAt;
    private LocalDateTime salesEndAt;
    private Integer soldCount;
}
