package com.miso.lxnn.exception.custom;


import com.miso.lxnn.exception.ErrorCode;
import org.apache.commons.lang3.StringUtils;

public class ValidationException extends RuntimeException{
    public ValidationException() {
        super(ErrorCode.INVALID_PARAMETER_ERROR.getMessage());
    }
    public ValidationException(String message) {
        super(StringUtils.isNotEmpty(message)?message:ErrorCode.INVALID_PARAMETER_ERROR.getMessage());
    }

}
