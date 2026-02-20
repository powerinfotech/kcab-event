package com.miso.lxnn.exception;

import lombok.Data;

@Data
public class ErrorDetail {
    private String errorObjectName;
    private String errorFieldName;
    private String errorMessage;
}
