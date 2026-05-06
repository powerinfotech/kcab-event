package com.kcabEvent.enums.saf;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SafOrgStatus {
    PENDING("pending", "승인대기"),
    APPROVED("approved", "승인"),
    REJECTED("rejected", "반려"),
    SUSPENDED("suspended", "정지");

    private final String code;
    private final String label;
}
