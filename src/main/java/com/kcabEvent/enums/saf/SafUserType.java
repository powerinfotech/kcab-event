package com.kcabEvent.enums.saf;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SafUserType {
    ADMIN("admin", "관리자"),
    ORGANIZATION("organization", "기관");

    private final String code;
    private final String label;
}
