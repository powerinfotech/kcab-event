package com.kcabEvent.exception.custom;

import com.kcabEvent.exception.ErrorCode;
import org.apache.commons.lang3.StringUtils;

/**
 * ValidationException - 입력값 검증 실패 예외
 *
 * <p>서비스 레이어에서 입력값이 비즈니스 규칙에 맞지 않을 때 수동으로 발생시키는 예외다.
 * {@link com.kcabEvent.exception.GlobalExceptionResolver}가 이를 잡아
 * {@code code: 452} 오류 응답으로 변환한다.</p>
 *
 * <p>{@code @Valid} 어노테이션 기반 자동 검증 실패는 {@code MethodArgumentNotValidException}으로
 * 처리되므로, 이 예외는 코드에서 직접 판단해야 하는 검증 로직에 사용한다.</p>
 *
 * <h3>사용 예시</h3>
 * <pre>
 * // 기본 메시지 사용
 * throw new ValidationException();
 * // → { "code": 452, "message": "입력값이 올바르지 않습니다." }
 *
 * // 커스텀 메시지 사용
 * throw new ValidationException("시작일은 종료일보다 이전이어야 합니다.");
 * // → { "code": 452, "message": "시작일은 종료일보다 이전이어야 합니다." }
 *
 * // 서비스 레이어 활용 패턴
 * if (request.getStartDt().isAfter(request.getEndDt())) {
 *     throw new ValidationException("시작일은 종료일보다 이전이어야 합니다.");
 * }
 *
 * if (CollectionUtils.isEmpty(request.getMenuSeqList())) {
 *     throw new ValidationException("메뉴를 하나 이상 선택해주세요.");
 * }
 * </pre>
 */
public class ValidationException extends RuntimeException {

    /**
     * {@link ErrorCode#INVALID_PARAMETER_ERROR}의 기본 메시지로 예외를 생성한다.
     */
    public ValidationException() {
        super(ErrorCode.INVALID_PARAMETER_ERROR.getMessage());
    }

    /**
     * 커스텀 메시지로 예외를 생성한다.
     * 메시지가 비어 있으면 {@link ErrorCode#INVALID_PARAMETER_ERROR}의 기본 메시지를 사용한다.
     *
     * @param message 사용자에게 표시할 검증 오류 메시지
     */
    public ValidationException(String message) {
        super(StringUtils.isNotEmpty(message) ? message : ErrorCode.INVALID_PARAMETER_ERROR.getMessage());
    }
}
