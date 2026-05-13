package com.kcabEvent.dto.payment;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class PaymentSearchDto {
    private String keyword;
    private List<Long> eventSeqs;
    private List<String> statuses;
    private List<String> pgProviders;
    private List<String> paymentMethods;
    private List<String> currencies;
    private LocalDateTime fromDate;
    private LocalDateTime toDate;
    private BigDecimal minAmount;
    private BigDecimal maxAmount;
    private Long organizationSeq;
}
