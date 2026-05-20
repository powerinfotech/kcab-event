package com.kcabEvent.dto.event;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 할인 코드 사용 내역 팝업에 표시할 결제 참가자 정보.
 */
@Getter
@Setter
public class DiscountCodeUsageDto {
    private String name;
    private String email;
    private String organization;
    private String position;
    private String country;
    private String paymentName;
    private String status;
    private LocalDateTime registeredAt;
}
