package com.miso.lxnn.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.List;

@AllArgsConstructor
@Getter
public class ErrorValidDetailResponse {
    private int code;
    private String message;
    private List<?> fieldErrorList;

    public static ErrorValidDetailResponse of(ErrorCode httpStatus, String message) {
        return new ErrorValidDetailResponse(httpStatus.getCode(), message, null);
    }

    public static ErrorValidDetailResponse of(HttpStatus httpStatus, String message) {
        return new ErrorValidDetailResponse(httpStatus.value(), message, null);
    }

    public static ErrorValidDetailResponse of(ErrorCode httpStatus, String message, List<?> fieldErrorList) {
        return new ErrorValidDetailResponse(httpStatus.getCode(), message, fieldErrorList);
    }

    public static ErrorValidDetailResponse of(HttpStatus httpStatus, String message, List<?> fieldErrorList) {
        return new ErrorValidDetailResponse(httpStatus.value(), message, fieldErrorList);
    }
}
