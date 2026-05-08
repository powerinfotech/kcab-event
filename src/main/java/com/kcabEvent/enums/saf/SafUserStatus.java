package com.kcabEvent.enums.saf;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SafUserStatus {
    ACTIVE("active", "Active"),
    PENDING("pending", "Pending"),
    SUSPENDED("suspended", "Suspended"),
    WITHDRAWN("withdrawn", "Withdrawn");

    private final String code;
    private final String label;
}
