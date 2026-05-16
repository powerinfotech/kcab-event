package com.kcabEvent.domain;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class PaymentIntent {
    private Long paymentIntentSeq;
    private String pgProvider;
    private String pgMid;
    private String pgOrderId;
    private BigDecimal amount;
    private String currency;
    private String paymentMethod;
    private String status;
    private String rawResponse;

    private Long eventSeq;
    private Long eventPricingSeq;
    private BigDecimal originalAmount;
    private BigDecimal discountAmount;
    private BigDecimal refundedAmount;
    private String payerName;
    private String payerEmail;
    private String payerCountry;
    private String firstName;
    private String middleName;
    private String lastName;
    private String organizationName;
    private String position;
    private String failedReason;
    private LocalDateTime completedAt;
    private Long paymentSeq;

    private Long createdBy;
    private LocalDateTime createdAt;
    private Long updatedBy;
    private LocalDateTime updatedAt;
}
