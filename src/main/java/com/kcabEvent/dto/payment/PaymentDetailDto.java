package com.kcabEvent.dto.payment;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class PaymentDetailDto {
    private Long paymentSeq;
    private String pgProvider;
    private String pgMid;
    private String pgTransactionId;
    private String pgOrderId;
    private BigDecimal amount;
    private String currency;
    private String paymentMethod;
    private String cardCompany;
    private String cardLast4;
    private String status;
    private LocalDateTime paidAt;
    private String failedReason;
    private String receiptUrl;
    private String rawResponse;
    private String pgResponseCode;
    private String pgResponseMessage;
    private LocalDateTime verifiedAt;
    private LocalDateTime webhookReceivedAt;
    private BigDecimal settleAmount;
    private String settleCurrency;
    private BigDecimal fxRate;
    private String approvalNo;
    private Integer installmentMonths;
    private Long eventPricingSeq;
    private String priceType;
    private BigDecimal originalAmount;
    private String discountCode;
    private BigDecimal discountAmount;
    private BigDecimal refundedAmount;
    private LocalDateTime cancelledAt;
    private String cancelReason;
    private String adminMemo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long eventSeq;
    private String eventTitle;
    private String eventType;
    private LocalDateTime eventStartDt;

    private Long eventParticipantSeq;
    private String participationStatus;

    private Long participantSeq;
    private String payerName;
    private String payerEmail;
    private String payerCountry;
    private String payerOrganization;
    private String payerPosition;

    private List<RefundListDto> refunds = new ArrayList<>();
}
