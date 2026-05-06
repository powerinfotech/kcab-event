package com.kcabEvent.enums.saf;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SafUserStatus {
    ACTIVE("active", "활성"),
    PENDING("pending", "승인대기"),
    SUSPENDED("suspended", "정지"),
    WITHDRAWN("withdrawn", "탈퇴");

    private final String code;
    private final String label;
}
