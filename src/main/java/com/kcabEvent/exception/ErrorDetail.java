package com.kcabEvent.exception;

import lombok.Data;

/**
 * ErrorDetail - 필드 단위 검증 오류 상세 정보 DTO
 *
 * <p>입력값 검증 실패 시 어떤 객체의 어떤 필드에서 어떤 오류가 발생했는지
 * 구체적인 정보를 담는다. {@link ErrorValidDetailResponse#getFieldErrorList()}의 원소 타입으로 사용한다.</p>
 *
 * <h3>필드 설명</h3>
 * <ul>
 *   <li>{@code errorObjectName} - 검증 실패가 발생한 객체 이름 (예: {@code "userSaveRequest"})</li>
 *   <li>{@code errorFieldName}  - 검증 실패가 발생한 필드 이름 (예: {@code "userId"})</li>
 *   <li>{@code errorMessage}    - 검증 실패 메시지 (예: {@code "사용자 ID는 필수입니다."})</li>
 * </ul>
 *
 * <h3>사용 예시 (Controller / ExceptionHandler)</h3>
 * <pre>
 * // BindingResult에서 ErrorDetail 목록 생성
 * List&lt;ErrorDetail&gt; errorDetails = bindingResult.getFieldErrors().stream()
 *     .map(fe -> {
 *         ErrorDetail detail = new ErrorDetail();
 *         detail.setErrorObjectName(fe.getObjectName());
 *         detail.setErrorFieldName(fe.getField());
 *         detail.setErrorMessage(fe.getDefaultMessage());
 *         return detail;
 *     })
 *     .collect(Collectors.toList());
 *
 * // ErrorValidDetailResponse에 담아 응답
 * return ErrorValidDetailResponse.of(ErrorCode.INVALID_PARAMETER_ERROR, "입력값을 확인해주세요.", errorDetails);
 * </pre>
 *
 * <h3>JSON 응답 예시</h3>
 * <pre>
 * {
 *   "code": 452,
 *   "message": "입력값이 올바르지 않습니다.",
 *   "fieldErrorList": [
 *     {
 *       "errorObjectName": "userSaveRequest",
 *       "errorFieldName": "userId",
 *       "errorMessage": "사용자 ID는 필수입니다."
 *     },
 *     {
 *       "errorObjectName": "userSaveRequest",
 *       "errorFieldName": "email",
 *       "errorMessage": "올바른 이메일 형식이 아닙니다."
 *     }
 *   ]
 * }
 * </pre>
 */
@Data
public class ErrorDetail {

    /** 검증 실패가 발생한 객체(DTO) 이름 */
    private String errorObjectName;

    /** 검증 실패가 발생한 필드 이름 */
    private String errorFieldName;

    /** 검증 실패 메시지 */
    private String errorMessage;
}
