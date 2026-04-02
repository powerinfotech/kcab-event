package com.power.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * ErrorDefaultResponse - 기본 오류 응답 DTO
 *
 * <p>커스텀 예외({@link com.power.exception.custom.BusinessException},
 * {@link com.power.exception.custom.ValidationException},
 * {@link com.power.exception.custom.InValidSessionException}) 발생 시
 * {@link GlobalExceptionResolver}가 이 객체를 JSON으로 응답한다.</p>
 *
 * <h3>JSON 응답 구조</h3>
 * <pre>
 * {
 *   "code": 400,
 *   "message": "실행중 오류가 발생했습니다."
 * }
 * </pre>
 *
 * <h3>팩토리 메서드</h3>
 * <pre>
 * // ErrorCode 기본 메시지 사용
 * ErrorDefaultResponse.of(ErrorCode.BUSINESS_ERROR)
 * // → { "code": 400, "message": "실행중 오류가 발생했습니다." }
 *
 * // ErrorCode + 커스텀 메시지
 * ErrorDefaultResponse.of(ErrorCode.BUSINESS_ERROR, "사용자 ID가 중복되었습니다.")
 * // → { "code": 400, "message": "사용자 ID가 중복되었습니다." }
 *
 * // HttpStatus + 커스텀 메시지 (예: 500 에러)
 * ErrorDefaultResponse.of(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage())
 * // → { "code": 500, "message": "..." }
 * </pre>
 */
@AllArgsConstructor
@Getter
public class ErrorDefaultResponse {

    /** 프론트엔드가 오류 유형을 식별하는 커스텀 코드 ({@link ErrorCode#getCode()} 또는 HTTP 상태 코드) */
    private int code;

    /** 사용자에게 표시할 오류 메시지 */
    private String message;

    /**
     * {@link ErrorCode}의 기본 코드와 메시지로 응답 객체를 생성한다.
     *
     * @param errorCode 오류 코드 열거형
     * @return 오류 응답 객체
     */
    public static ErrorDefaultResponse of(ErrorCode errorCode) {
        return new ErrorDefaultResponse(errorCode.getCode(), errorCode.getMessage());
    }

    /**
     * {@link ErrorCode}의 코드와 커스텀 메시지로 응답 객체를 생성한다.
     *
     * @param errorCode 오류 코드 열거형 (코드값만 사용)
     * @param message   커스텀 오류 메시지
     * @return 오류 응답 객체
     */
    public static ErrorDefaultResponse of(ErrorCode errorCode, String message) {
        return new ErrorDefaultResponse(errorCode.getCode(), message);
    }

    /**
     * Spring {@link HttpStatus}의 코드와 커스텀 메시지로 응답 객체를 생성한다.
     *
     * @param httpStatus HTTP 상태 (예: {@link HttpStatus#INTERNAL_SERVER_ERROR})
     * @param message    커스텀 오류 메시지
     * @return 오류 응답 객체
     */
    public static ErrorDefaultResponse of(HttpStatus httpStatus, String message) {
        return new ErrorDefaultResponse(httpStatus.value(), message);
    }
}
