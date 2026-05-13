package com.kcabEvent.dto.event;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class EventDiscountCodeDto {
    private Long discountCodeSeq;
    private Long eventSeq;
    private String discountCode;
    private String discountType;
    private BigDecimal discountValue;
    private String currencyCode;
    private String appliesToPriceType;
    private Integer usageLimit;
    private Integer usedCount;
    private LocalDateTime validFromAt;
    private LocalDateTime validToAt;
    private String useYn;
    private Integer sortSeq;
}
