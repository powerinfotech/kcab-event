package com.kcabEvent.dto.payment;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PaymentEventOptionDto {
    private Long eventSeq;
    private String title;
    private String eventType;
    private LocalDateTime startAt;
}
