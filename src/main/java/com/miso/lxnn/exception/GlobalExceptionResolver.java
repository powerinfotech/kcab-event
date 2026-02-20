package com.miso.lxnn.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.miso.lxnn.exception.custom.BusinessException;
import com.miso.lxnn.exception.custom.InValidSessionException;
import com.miso.lxnn.exception.custom.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionResolver {
    private final ObjectMapper objectMapper;


    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDefaultResponse> handleException(Exception e) {
        ErrorDefaultResponse err = ErrorDefaultResponse.of(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        e.printStackTrace();
        return new ResponseEntity<>(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }


    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorDefaultResponse> handleRuntimeException(RuntimeException e) {
        ErrorDefaultResponse err = ErrorDefaultResponse.of(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        e.printStackTrace();
        return new ResponseEntity<>(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    @ExceptionHandler(InValidSessionException.class)
    public ErrorDefaultResponse handleNotValidSessionException(InValidSessionException e) {

        return ErrorDefaultResponse.of(ErrorCode.INVALID_SESSION_ERROR, e.getMessage());
    }

    @ExceptionHandler(ValidationException.class)
    public ErrorDefaultResponse handleValidationException(ValidationException e) {
        return ErrorDefaultResponse.of(ErrorCode.INVALID_PARAMETER_ERROR, e.getMessage());
    }

    @ExceptionHandler(BusinessException.class)
    public ErrorDefaultResponse handleBusinessException(BusinessException e) {
        return ErrorDefaultResponse.of(ErrorCode.BUSINESS_ERROR, e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ErrorDefaultResponse handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        return ErrorDefaultResponse.of(ErrorCode.INVALID_PARAMETER_ERROR);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ErrorDefaultResponse handleMissingServletRequestParameterException(MissingServletRequestParameterException e) {
        return ErrorDefaultResponse.of(ErrorCode.INVALID_PARAMETER_ERROR);
    }

}
