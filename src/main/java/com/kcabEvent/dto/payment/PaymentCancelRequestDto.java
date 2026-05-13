package com.kcabEvent.dto.payment;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PaymentCancelRequestDto {
    /** void | refund — null이면 paid_at 기준으로 서비스가 자동 판단 */
    private String refundType;
    /** 부분환불은 지원하지 않고, null 또는 전체 금액만 허용 */
    private BigDecimal amount;
    private String reason;
}
