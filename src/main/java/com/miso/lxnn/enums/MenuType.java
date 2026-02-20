package com.miso.lxnn.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MenuType {
    D("디렉토리"),
    V("화면")
    ;

    private final String value;
}
