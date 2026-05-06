package com.kcabEvent.exception.custom;

import com.kcabEvent.exception.ErrorCode;
import org.apache.commons.lang3.StringUtils;

/**
 * InValidSessionException - 세션 만료/미인증 예외
 *
 * <p>세션에 로그인 사용자 정보가 없거나 만료된 경우 발생시키는 예외다.
 * {@link com.kcabEvent.config.interceptor.SessionCheckInterceptor}에서 자동으로 발생시키며,
 * {@link com.kcabEvent.exception.GlobalExceptionResolver}가 이를 잡아
 * {@code code: 453} 오류 응답으로 변환한다.</p>
 *
 * <p>프론트엔드의 {@code GlobalAxiosProvider}는 응답 본문의 {@code code: 453}을 감지하여
 * 로그인 페이지({@code "/"})로 자동 리다이렉트한다.</p>
 *
 * <h3>자동 발생 흐름</h3>
 * <pre>
 * HTTP 요청 (/api/**)
 *   → SessionCheckInterceptor.preHandle()
 *   → session.getAttribute("user") == null
 *   → throw new InValidSessionException()
 *   → GlobalExceptionResolver.handleNotValidSessionException()
 *   → { "code": 453, "message": "세션이 유효하지 않습니다." }
 *   → 프론트엔드 GlobalAxiosProvider → location.replace('/')
 * </pre>
 *
 * <h3>수동 발생 예시</h3>
 * <pre>
 * // 세션 사용자 권한 검증 실패 시
 * if (!loginUser.hasRole("ADMIN")) {
 *     throw new InValidSessionException("관리자 권한이 필요합니다.");
 * }
 * </pre>
 */
public class InValidSessionException extends RuntimeException {

    /**
     * {@link ErrorCode#INVALID_SESSION_ERROR}의 기본 메시지로 예외를 생성한다.
     */
    public InValidSessionException() {
        super(ErrorCode.INVALID_SESSION_ERROR.getMessage());
    }

    /**
     * 커스텀 메시지로 예외를 생성한다.
     * 메시지가 비어 있으면 {@link ErrorCode#INVALID_SESSION_ERROR}의 기본 메시지를 사용한다.
     *
     * @param message 사용자에게 표시할 오류 메시지
     */
    public InValidSessionException(String message) {
        super(StringUtils.isNotEmpty(message) ? message : ErrorCode.INVALID_SESSION_ERROR.getMessage());
    }
}
