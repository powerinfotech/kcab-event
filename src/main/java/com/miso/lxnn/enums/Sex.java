package com.miso.lxnn.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Sex {
    MAN("남성", "M"),
    WOMAN("여성", "F")
    ;

    private final String value;
    private final String temp;

}
