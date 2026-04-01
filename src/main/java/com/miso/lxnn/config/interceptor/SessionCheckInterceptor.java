package com.miso.lxnn.config.interceptor;

import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.exception.custom.InValidSessionException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * SessionCheckInterceptor - 세션 유효성 검사 인터셉터
 *
 * <p>API 요청 시 세션에 로그인 사용자 정보({@code "user"})가 존재하는지 확인한다.
 * 세션이 없거나 만료된 경우 {@link InValidSessionException}을 던져 인증 오류로 처리한다.</p>
 *
 * <p>{@link com.miso.lxnn.config.WebMvcConfig#addInterceptors}에서 order=1로 등록되어
 * 가장 먼저 실행된다.</p>
 *
 * <h3>적용 경로</h3>
 * <ul>
 *   <li>포함: {@code /api/**}</li>
 *   <li>제외: {@code /api/common/login-info}, {@code /api/login}, {@code /api/logout},
 *       {@code /css/**}, {@code /images/**}, {@code /js/**}, {@code /api/find-user/**}</li>
 * </ul>
 *
 * <h3>예외 처리</h3>
 * <p>{@link InValidSessionException}은 전역 예외 핸들러(@ExceptionHandler 또는 @ControllerAdvice)에서
 * 클라이언트에게 세션 만료 에러 응답({@code INVALID_SESSION_ERROR})으로 변환된다.
 * 프론트엔드의 {@code GlobalAxiosProvider}는 이 에러코드를 감지하여 로그인 페이지로 리다이렉트한다.</p>
 *
 * <h3>세션 저장 구조</h3>
 * <pre>
 * HttpSession session = request.getSession();
 * session.setAttribute("user", loginUser);  // 로그인 성공 시 저장
 * session.invalidate();                      // 로그아웃 시 제거
 * </pre>
 */
@Slf4j
public class SessionCheckInterceptor implements HandlerInterceptor {

    /**
     * 요청 처리 전 세션에서 로그인 사용자 정보를 확인한다.
     *
     * @param request  HTTP 요청
     * @param response HTTP 응답
     * @param handler  처리할 핸들러
     * @return {@code true}: 세션 유효, 요청 처리 계속
     * @throws InValidSessionException 세션에 사용자 정보가 없는 경우
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {

        LoginUser user = (LoginUser) request.getSession().getAttribute("user");
        if (user == null) {
            throw new InValidSessionException();
        }
        return true;
    }
}
