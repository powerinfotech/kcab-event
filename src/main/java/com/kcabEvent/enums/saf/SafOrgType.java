package com.kcabEvent.enums.saf;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SafOrgType {
    LAW_FIRM("law_firm", "Law Firm"),
    PARTNER("partner", "Partner Organization"),
    ACADEMIC("academic", "Academic Institution"),
    OTHER("other", "Other");

    private final String code;
    private final String label;
}
