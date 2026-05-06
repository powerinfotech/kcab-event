package com.kcabEvent.config.interceptor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.UUID;

/**
 * LogInterceptor - API 요청/응답 UUID 기반 로그 인터셉터
 *
 * <p>모든 API 요청에 UUID를 부여하여 요청 시작({@code preHandle})과
 * 완료({@code afterCompletion})를 추적 가능한 형태로 로깅한다.</p>
 *
 * <p>{@link com.kcabEvent.config.WebMvcConfig#addInterceptors}에서 order=2로 등록된다
 * ({@link SessionCheckInterceptor} 다음에 실행).</p>
 *
 * <h3>로그 출력 예시</h3>
 * <pre>
 * ----------new REQUEST------------
 * REQUEST [/api/users][com.kcabEvent.controller.UserController#getUsers()] | uuid : [a1b2c3d4-...]
 * postHandler [null]
 * RESPONSE [/api/users][com.kcabEvent.controller.UserController#getUsers()] | uuid : [a1b2c3d4-...]
 * </pre>
 *
 * <h3>UUID 흐름</h3>
 * <ol>
 *   <li>{@code preHandle}: UUID 생성 → {@code request} 속성에 저장</li>
 *   <li>{@code afterCompletion}: {@code request} 속성에서 UUID 조회 → 응답 로그 출력</li>
 * </ol>
 *
 * <h3>적용 경로</h3>
 * <ul>
 *   <li>포함: {@code /api/**}</li>
 *   <li>제외: {@code /css/**}, {@code /images/**}, {@code /js/**}</li>
 * </ul>
 */
@Slf4j
public class LogInterceptor implements HandlerInterceptor {

    /** request 속성에 UUID를 저장할 때 사용하는 키 */
    public static final String LOG_ID = "logId";

    /**
     * 요청 처리 전: UUID를 생성하여 요청 정보를 로깅한다.
     *
     * @param request  HTTP 요청
     * @param response HTTP 응답
     * @param handler  처리할 핸들러 (Controller 메서드 또는 정적 리소스 핸들러)
     * @return {@code true} (항상 요청 처리 계속)
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {

        String requestURI = request.getRequestURI();
        String uuid = UUID.randomUUID().toString();

        // afterCompletion에서 사용하기 위해 request 속성에 저장
        request.setAttribute(LOG_ID, uuid);

        log.info("----------new REQUEST------------");
        log.info("REQUEST [{}][{}] | uuid : [{}]", requestURI, handler, uuid);

        return true;
    }

    /**
     * 핸들러 실행 후 (뷰 렌더링 전): 핸들러 실행 완료 시점을 로깅한다.
     *
     * @param request      HTTP 요청
     * @param response     HTTP 응답
     * @param handler      처리한 핸들러
     * @param modelAndView 핸들러가 반환한 ModelAndView (REST API는 {@code null})
     */
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
                           ModelAndView modelAndView) throws Exception {
        log.info("postHandler [{}]", modelAndView);
    }

    /**
     * 요청 처리 완료 후: UUID를 이용하여 요청과 응답을 매핑한 완료 로그를 출력한다.
     * 예외 발생 시 에러 로그도 함께 출력한다.
     *
     * @param request  HTTP 요청
     * @param response HTTP 응답
     * @param handler  처리한 핸들러
     * @param ex       처리 중 발생한 예외 (없으면 {@code null})
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
            throws Exception {

        String requestURI = request.getRequestURI();
        String uuid = (String) request.getAttribute(LOG_ID);

        log.info("RESPONSE [{}][{}] | uuid : [{}]", requestURI, handler, uuid);

        if (ex != null) {
            log.error("afterCompletion error!!", ex);
        }
    }
}
