package com.kcabEvent.dto.paymenttest;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class PayTestPrepareResponseDto {
    private Long paymentSeq;
    private String orderId;
    private String sdkUrl;
    private Map<String, Object> eximbayRequest;
    private PayTestResultDto payment;
}
