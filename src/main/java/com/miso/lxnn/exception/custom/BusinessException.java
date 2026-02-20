package com.miso.lxnn.exception.custom;


import com.miso.lxnn.exception.ErrorCode;
import com.miso.lxnn.exception.ErrorDetail;
import org.apache.commons.lang3.StringUtils;

import java.util.List;

public class BusinessException extends RuntimeException{
    private transient List<ErrorDetail> errorDetails;
    public BusinessException() {
        super(ErrorCode.BUSINESS_ERROR.getMessage());
    }
    public BusinessException(String message) {
        super(StringUtils.isNotEmpty(message)?message:ErrorCode.BUSINESS_ERROR.getMessage());
    }
}
