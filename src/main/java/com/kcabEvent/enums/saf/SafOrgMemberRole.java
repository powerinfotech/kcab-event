package com.kcabEvent.enums.saf;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SafOrgMemberRole {
    OWNER("owner", "Owner"),
    MANAGER("manager", "Manager"),
    VIEWER("viewer", "Viewer");

    private final String code;
    private final String label;
}
