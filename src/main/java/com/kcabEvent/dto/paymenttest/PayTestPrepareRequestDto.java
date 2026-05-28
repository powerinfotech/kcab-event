package com.kcabEvent.dto.paymenttest;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PayTestPrepareRequestDto {
    private Long eventSeq;
    private Long eventPricingSeq;
    private PayTestParticipantRequestDto participant;
    private String paymentMethod;
    private List<String> paymentMethods;
    private String discountCode;
    private String lang;
    private String callbackBaseUrl;
}
