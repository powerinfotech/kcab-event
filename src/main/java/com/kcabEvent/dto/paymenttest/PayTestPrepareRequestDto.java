package com.kcabEvent.dto.paymenttest;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PayTestPrepareRequestDto {
    private Long eventSeq;
    private Long eventPricingSeq;
    private PayTestParticipantRequestDto participant;
    private String paymentMethod;
    private String lang;
    private String callbackBaseUrl;
}
