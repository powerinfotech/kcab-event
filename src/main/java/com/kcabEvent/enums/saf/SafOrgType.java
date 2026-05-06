package com.kcabEvent.enums.saf;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SafOrgType {
    LAW_FIRM("law_firm", "로펌"),
    PARTNER("partner", "파트너기관"),
    ACADEMIC("academic", "학술기관"),
    OTHER("other", "기타");

    private final String code;
    private final String label;
}
