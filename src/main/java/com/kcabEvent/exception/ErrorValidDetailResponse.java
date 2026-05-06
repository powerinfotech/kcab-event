package com.kcabEvent.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.List;

/**
 * ErrorValidDetailResponse - 필드 단위 검증 오류 목록을 포함하는 오류 응답 DTO
 *
 * <p>{@link ErrorDefaultResponse}의 확장형으로, 입력값 검증 실패 시
 * 어느 필드에서 어떤 오류가 발생했는지 {@link ErrorDetail} 목록을 함께 응답한다.</p>
 *
 * <p>현재 {@link GlobalExceptionResolver}는 {@link ErrorDefaultResponse}를 사용하지만,
 * 필드별 상세 오류 정보가 필요한 경우 이 클래스를 사용해 응답을 구성할 수 있다.</p>
 *
 * <h3>JSON 응답 구조</h3>
 * <pre>
 * {
 *   "code": 452,
 *   "message": "입력값을 확인해주세요.",
 *   "fieldErrorList": [
 *     { "errorObjectName": "userSaveRequest", "errorFieldName": "userId", "errorMessage": "필수 입력 항목입니다." },
 *     { "errorObjectName": "userSaveRequest", "errorFieldName": "email",  "errorMessage": "이메일 형식이 올바르지 않습니다." }
 *   ]
 * }
 * </pre>
 *
 * <h3>사용 예시 (ExceptionHandler)</h3>
 * <pre>
 * {@code @ExceptionHandler(MethodArgumentNotValidException.class)}
 * public ErrorValidDetailResponse handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
 *     List&lt;ErrorDetail&gt; errorDetails = e.getBindingResult().getFieldErrors().stream()
 *         .map(fe -> {
 *             ErrorDetail detail = new ErrorDetail();
 *             detail.setErrorObjectName(fe.getObjectName());
 *             detail.setErrorFieldName(fe.getField());
 *             detail.setErrorMessage(fe.getDefaultMessage());
 *             return detail;
 *         })
 *         .collect(Collectors.toList());
 *
 *     return ErrorValidDetailResponse.of(ErrorCode.INVALID_PARAMETER_ERROR, "입력값을 확인해주세요.", errorDetails);
 * }
 * </pre>
 */
@AllArgsConstructor
@Getter
public class ErrorValidDetailResponse {

    /** 프론트엔드가 오류 유형을 식별하는 커스텀 코드 */
    private int code;

    /** 사용자에게 표시할 오류 메시지 */
    private String message;

    /** 필드 단위 검증 오류 목록 (없으면 {@code null}) */
    private List<?> fieldErrorList;

    /**
     * {@link ErrorCode}의 코드와 커스텀 메시지로 응답 객체를 생성한다. (fieldErrorList = null)
     *
     * @param errorCode 오류 코드 열거형
     * @param message   커스텀 오류 메시지
     * @return 오류 응답 객체
     */
    public static ErrorValidDetailResponse of(ErrorCode errorCode, String message) {
        return new ErrorValidDetailResponse(errorCode.getCode(), message, null);
    }

    /**
     * {@link HttpStatus}의 코드와 커스텀 메시지로 응답 객체를 생성한다. (fieldErrorList = null)
     *
     * @param httpStatus HTTP 상태
     * @param message    커스텀 오류 메시지
     * @return 오류 응답 객체
     */
    public static ErrorValidDetailResponse of(HttpStatus httpStatus, String message) {
        return new ErrorValidDetailResponse(httpStatus.value(), message, null);
    }

    /**
     * {@link ErrorCode}의 코드, 커스텀 메시지, 필드 오류 목록으로 응답 객체를 생성한다.
     *
     * @param errorCode     오류 코드 열거형
     * @param message       커스텀 오류 메시지
     * @param fieldErrorList 필드 단위 오류 목록 ({@link ErrorDetail} 리스트)
     * @return 필드 오류 목록을 포함한 오류 응답 객체
     */
    public static ErrorValidDetailResponse of(ErrorCode errorCode, String message, List<?> fieldErrorList) {
        return new ErrorValidDetailResponse(errorCode.getCode(), message, fieldErrorList);
    }

    /**
     * {@link HttpStatus}의 코드, 커스텀 메시지, 필드 오류 목록으로 응답 객체를 생성한다.
     *
     * @param httpStatus     HTTP 상태
     * @param message        커스텀 오류 메시지
     * @param fieldErrorList 필드 단위 오류 목록 ({@link ErrorDetail} 리스트)
     * @return 필드 오류 목록을 포함한 오류 응답 객체
     */
    public static ErrorValidDetailResponse of(HttpStatus httpStatus, String message, List<?> fieldErrorList) {
        return new ErrorValidDetailResponse(httpStatus.value(), message, fieldErrorList);
    }
}
