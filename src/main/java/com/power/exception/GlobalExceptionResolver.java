package com.power.exception;

import com.power.exception.custom.BusinessException;
import com.power.exception.custom.InValidSessionException;
import com.power.exception.custom.ValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * GlobalExceptionResolver - 전역 예외 처리 핸들러
 *
 * <p>{@code @RestControllerAdvice}로 애플리케이션 전체 Controller에서 발생하는 예외를
 * 일괄 처리하여 클라이언트에게 일관된 JSON 오류 응답을 반환한다.</p>
 *
 * <h3>처리 예외 및 응답 구조</h3>
 * <table border="1">
 *   <tr><th>예외</th><th>HTTP 상태</th><th>응답 code</th><th>설명</th></tr>
 *   <tr><td>{@link InValidSessionException}</td><td>200</td><td>453</td>
 *       <td>세션 만료 — 프론트엔드가 code로 감지 후 리다이렉트</td></tr>
 *   <tr><td>{@link ValidationException}</td><td>200</td><td>452</td>
 *       <td>수동 입력값 검증 실패</td></tr>
 *   <tr><td>{@link BusinessException}</td><td>200</td><td>400</td>
 *       <td>비즈니스 로직 오류</td></tr>
 *   <tr><td>{@link MethodArgumentNotValidException}</td><td>200</td><td>452</td>
 *       <td>{@code @Valid} 어노테이션 검증 실패</td></tr>
 *   <tr><td>{@link MissingServletRequestParameterException}</td><td>200</td><td>452</td>
 *       <td>필수 요청 파라미터 누락</td></tr>
 *   <tr><td>{@link RuntimeException}</td><td>500</td><td>500</td>
 *       <td>처리되지 않은 런타임 예외</td></tr>
 *   <tr><td>{@link Exception}</td><td>500</td><td>500</td>
 *       <td>처리되지 않은 체크 예외</td></tr>
 * </table>
 *
 * <h3>HTTP 상태 코드 설계 의도</h3>
 * <p>커스텀 예외({@link InValidSessionException}, {@link ValidationException}, {@link BusinessException})는
 * HTTP 200으로 응답한다. 프론트엔드의 {@code GlobalAxiosProvider}가 HTTP 상태가 아닌
 * 응답 본문의 {@code code} 필드 값으로 오류 유형을 판별하기 때문이다.</p>
 *
 * <h3>서비스 레이어 사용 예시</h3>
 * <pre>
 * // 비즈니스 로직 오류
 * if (userDao.existsById(userId)) {
 *     throw new BusinessException("이미 존재하는 사용자 ID입니다.");
 * }
 *
 * // 입력값 검증 오류
 * if (StringUtils.isBlank(request.getUserName())) {
 *     throw new ValidationException("사용자명은 필수입니다.");
 * }
 * </pre>
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionResolver {

    /**
     * 처리되지 않은 체크 예외를 처리한다.
     *
     * <p>500 Internal Server Error를 반환하며 스택 트레이스를 로그에 기록한다.</p>
     *
     * @param e 발생한 예외
     * @return 500 오류 응답
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDefaultResponse> handleException(Exception e) {
        log.error("[Exception] 처리되지 않은 예외 발생", e);
        ErrorDefaultResponse err = ErrorDefaultResponse.of(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        return new ResponseEntity<>(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * 처리되지 않은 런타임 예외를 처리한다.
     *
     * <p>특정 핸들러({@link BusinessException}, {@link ValidationException} 등)가
     * 먼저 매칭되므로 그 외의 런타임 예외가 이 핸들러에 도달한다.</p>
     *
     * @param e 발생한 런타임 예외
     * @return 500 오류 응답
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorDefaultResponse> handleRuntimeException(RuntimeException e) {
        log.error("[RuntimeException] 처리되지 않은 런타임 예외 발생", e);
        ErrorDefaultResponse err = ErrorDefaultResponse.of(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        return new ResponseEntity<>(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * 세션 만료/미인증 예외를 처리한다.
     *
     * <p>HTTP 200으로 응답하며, 프론트엔드 {@code GlobalAxiosProvider}가
     * {@code code: 453}을 감지하여 로그인 페이지({@code "/"})로 리다이렉트한다.</p>
     *
     * @param e 세션 예외
     * @return {@code code: 453} 오류 응답
     */
    @ExceptionHandler(InValidSessionException.class)
    public ErrorDefaultResponse handleNotValidSessionException(InValidSessionException e) {
        return ErrorDefaultResponse.of(ErrorCode.INVALID_SESSION_ERROR, e.getMessage());
    }

    /**
     * 수동 입력값 검증 실패 예외를 처리한다.
     *
     * <p>서비스 레이어에서 {@code throw new ValidationException("메시지")}로 발생시킨다.</p>
     *
     * @param e 검증 예외
     * @return {@code code: 452} 오류 응답
     */
    @ExceptionHandler(ValidationException.class)
    public ErrorDefaultResponse handleValidationException(ValidationException e) {
        return ErrorDefaultResponse.of(ErrorCode.INVALID_PARAMETER_ERROR, e.getMessage());
    }

    /**
     * 비즈니스 로직 오류 예외를 처리한다.
     *
     * <p>서비스 레이어에서 {@code throw new BusinessException("메시지")}로 발생시킨다.</p>
     *
     * @param e 비즈니스 예외
     * @return {@code code: 400} 오류 응답
     */
    @ExceptionHandler(BusinessException.class)
    public ErrorDefaultResponse handleBusinessException(BusinessException e) {
        return ErrorDefaultResponse.of(ErrorCode.BUSINESS_ERROR, e.getMessage());
    }

    /**
     * {@code @Valid} 어노테이션 검증 실패 예외를 처리한다.
     *
     * <p>Controller 파라미터의 {@code @Valid} 검증 실패 시 Spring이 자동으로 발생시킨다.</p>
     *
     * @param e 메서드 인자 검증 예외
     * @return {@code code: 452} 오류 응답 (기본 메시지 사용)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ErrorDefaultResponse handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        return ErrorDefaultResponse.of(ErrorCode.INVALID_PARAMETER_ERROR);
    }

    /**
     * 필수 요청 파라미터 누락 예외를 처리한다.
     *
     * <p>{@code @RequestParam(required = true)} 파라미터가 요청에 없을 때 Spring이 자동으로 발생시킨다.</p>
     *
     * @param e 요청 파라미터 누락 예외
     * @return {@code code: 452} 오류 응답 (기본 메시지 사용)
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ErrorDefaultResponse handleMissingServletRequestParameterException(MissingServletRequestParameterException e) {
        return ErrorDefaultResponse.of(ErrorCode.INVALID_PARAMETER_ERROR);
    }
}
