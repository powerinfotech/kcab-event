package com.kcabEvent.enums.saf;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SafUserType {
    SUPER_ADMIN("super_admin", "슈퍼관리자"),
    ORG_ADMIN("org_admin", "기관관리자"),
    PARTICIPANT("participant", "참가자");

    private final String code;
    private final String label;
}
