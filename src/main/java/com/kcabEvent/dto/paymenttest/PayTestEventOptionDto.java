package com.kcabEvent.dto.paymenttest;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class PayTestEventOptionDto {
    private Long eventSeq;
    private String title;
    private String eventType;
    private LocalDateTime eventStartDt;
    private LocalDateTime eventEndDt;
    private String location;
    private List<PayTestPricingOptionDto> pricingList = new ArrayList<>();
}
