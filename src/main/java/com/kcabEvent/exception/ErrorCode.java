package com.kcabEvent.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * ErrorCode - 애플리케이션 공통 오류 코드 열거형
 *
 * <p>API 응답 본문의 {@code code} 필드 값으로 사용한다.
 * HTTP 상태 코드와는 별개로 프론트엔드가 비즈니스 오류 유형을 식별하는 데 사용된다.</p>
 *
 * <p>{@code @JsonFormat(shape = OBJECT)}로 직렬화되어 JSON 응답에 {@code code}와 {@code message}
 * 필드를 포함하는 객체 형태로 출력된다.</p>
 *
 * <h3>오류 코드 정의</h3>
 * <table border="1">
 *   <tr><th>코드</th><th>값</th><th>설명</th><th>발생 예외</th></tr>
 *   <tr><td>BUSINESS_ERROR</td><td>400</td><td>비즈니스 로직 오류</td>
 *       <td>{@link com.kcabEvent.exception.custom.BusinessException}</td></tr>
 *   <tr><td>INVALID_PARAMETER_ERROR</td><td>452</td><td>입력값 검증 실패</td>
 *       <td>{@link com.kcabEvent.exception.custom.ValidationException},
 *           {@code MethodArgumentNotValidException}</td></tr>
 *   <tr><td>INVALID_SESSION_ERROR</td><td>453</td><td>세션 만료/미인증</td>
 *       <td>{@link com.kcabEvent.exception.custom.InValidSessionException}</td></tr>
 * </table>
 *
 * <h3>프론트엔드 연동</h3>
 * <p>프론트엔드의 {@code GlobalAxiosProvider}는 응답 본문의 {@code code} 값을 확인하여
 * 오류 유형별로 다르게 처리한다.</p>
 * <pre>
 * // GlobalAxiosProvider.tsx
 * if (res.data.code === ErrorCode.INVALID_SESSION_ERROR) location.replace('/');
 * if (res.data.code === ErrorCode.BUSINESS_ERROR) message.error(res.data.message);
 * </pre>
 *
 * <h3>JSON 직렬화 결과 예시</h3>
 * <pre>
 * {
 *   "code": 453,
 *   "message": "세션이 유효하지 않습니다."
 * }
 * </pre>
 */
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    /** 비즈니스 로직 처리 중 오류 발생 (예: 중복 데이터, 상태 불일치) */
    BUSINESS_ERROR(400, "실행중 오류가 발생했습니다."),

    /** 요청 파라미터 또는 요청 본문 검증 실패 */
    INVALID_PARAMETER_ERROR(452, "입력값이 올바르지 않습니다."),

    /** 세션 미존재 또는 만료 — 프론트엔드에서 로그인 페이지로 리다이렉트 */
    INVALID_SESSION_ERROR(453, "세션이 유효하지 않습니다."),
    ;

    /** 프론트엔드가 오류 유형을 식별하는 데 사용하는 커스텀 코드 */
    private final int code;

    /** 사용자에게 표시할 기본 오류 메시지 */
    private final String message;
}
