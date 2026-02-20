package com.miso.lxnn.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserClass {
    EMPLOYEE("사원" ),
    EXECUTIVE("임원")
    ;

    private final String value;

}
