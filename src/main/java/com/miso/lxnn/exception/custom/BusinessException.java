package com.miso.lxnn.exception.custom;

import com.miso.lxnn.exception.ErrorCode;
import org.apache.commons.lang3.StringUtils;

/**
 * BusinessException - 비즈니스 로직 오류 예외
 *
 * <p>애플리케이션 비즈니스 규칙 위반 시 서비스 레이어에서 발생시키는 예외다.
 * {@link com.miso.lxnn.exception.GlobalExceptionResolver}가 이 예외를 잡아
 * {@code code: 400} 오류 응답으로 변환한다.</p>
 *
 * <h3>사용 예시</h3>
 * <pre>
 * // 기본 메시지 사용
 * throw new BusinessException();
 * // → { "code": 400, "message": "실행중 오류가 발생했습니다." }
 *
 * // 커스텀 메시지 사용
 * throw new BusinessException("이미 존재하는 사용자 ID입니다.");
 * // → { "code": 400, "message": "이미 존재하는 사용자 ID입니다." }
 *
 * // 서비스 레이어 활용 패턴
 * if (userDao.existsByUserId(request.getUserId())) {
 *     throw new BusinessException("이미 사용 중인 아이디입니다.");
 * }
 *
 * if (!targetUser.getDeptSeq().equals(loginUser.getDeptSeq())) {
 *     throw new BusinessException("다른 부서의 사용자는 수정할 수 없습니다.");
 * }
 * </pre>
 */
public class BusinessException extends RuntimeException {

    /**
     * {@link ErrorCode#BUSINESS_ERROR}의 기본 메시지로 예외를 생성한다.
     */
    public BusinessException() {
        super(ErrorCode.BUSINESS_ERROR.getMessage());
    }

    /**
     * 커스텀 메시지로 예외를 생성한다.
     * 메시지가 비어 있으면 {@link ErrorCode#BUSINESS_ERROR}의 기본 메시지를 사용한다.
     *
     * @param message 사용자에게 표시할 오류 메시지
     */
    public BusinessException(String message) {
        super(StringUtils.isNotEmpty(message) ? message : ErrorCode.BUSINESS_ERROR.getMessage());
    }
}
