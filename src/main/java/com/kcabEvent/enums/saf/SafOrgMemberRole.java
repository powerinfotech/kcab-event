package com.kcabEvent.enums.saf;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SafOrgMemberRole {
    OWNER("owner", "소유자"),
    MANAGER("manager", "관리자"),
    VIEWER("viewer", "뷰어");

    private final String code;
    private final String label;
}
