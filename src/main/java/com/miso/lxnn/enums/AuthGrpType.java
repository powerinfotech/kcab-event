package com.miso.lxnn.enums;


import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AuthGrpType {
    ROLE("역할")
    ;

    private final String value;
}
