package com.miso.lxnn.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    BUSINESS_ERROR(400, "실행중 오류가 발생했습니다."),
    INVALID_PARAMETER_ERROR(452, "입력값이 올바르지 않습니다."),
    INVALID_SESSION_ERROR(453, "세션이 유효하지 않습니다.."),
    ;

    private final int code;
    private final String message;
}
