package com.miso.lxnn.exception.custom;


import com.miso.lxnn.exception.ErrorCode;
import com.miso.lxnn.exception.ErrorDetail;
import org.apache.commons.lang3.StringUtils;

import java.util.List;

public class InValidSessionException extends RuntimeException{
    private transient List<ErrorDetail> errorDetails;
    public InValidSessionException() {
        super(ErrorCode.INVALID_SESSION_ERROR.getMessage());
    }
    public InValidSessionException(String message) {
        super(StringUtils.isNotEmpty(message)?message:ErrorCode.INVALID_SESSION_ERROR.getMessage());
    }
}
