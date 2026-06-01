package com.kcabEvent.dto.registrationpayment;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class RegistrationPaymentPrepareResponseDto {
    private Long paymentSeq;
    private String orderId;
    private String sdkUrl;
    private Map<String, Object> eximbayRequest;
    private RegistrationPaymentResultDto payment;
}
