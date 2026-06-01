package com.kcabEvent.dto.registrationpayment;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RegistrationPaymentPrepareRequestDto {
    private Long eventSeq;
    private Long eventPricingSeq;
    private RegistrationPaymentParticipantRequestDto participant;
    private String paymentMethod;
    private List<String> paymentMethods;
    private String discountCode;
    private String lang;
    private String callbackBaseUrl;
}
