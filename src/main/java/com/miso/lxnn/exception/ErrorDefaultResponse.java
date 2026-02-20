package com.miso.lxnn.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public class ErrorDefaultResponse {
    private int code;
    private String message;

    public static ErrorDefaultResponse of(ErrorCode httpStatus) {
        return new ErrorDefaultResponse(httpStatus.getCode(), httpStatus.getMessage());
    }

    public static ErrorDefaultResponse of(ErrorCode httpStatus, String message) {
        return new ErrorDefaultResponse(httpStatus.getCode(), message);
    }

    public static ErrorDefaultResponse of(HttpStatus httpStatus, String message) {
        return new ErrorDefaultResponse(httpStatus.value(), message);
    }
}
