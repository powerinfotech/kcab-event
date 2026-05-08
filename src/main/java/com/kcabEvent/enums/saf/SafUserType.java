package com.kcabEvent.enums.saf;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SafUserType {
    ADMIN("admin", "Admin"),
    ORGANIZATION("organization", "Organization");

    private final String code;
    private final String label;
}
