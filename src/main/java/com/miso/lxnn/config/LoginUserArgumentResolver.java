package com.miso.lxnn.config;

import com.miso.lxnn.annotation.MisoSession;
import com.miso.lxnn.dto.common.LoginUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import javax.servlet.http.HttpSession;

/**
 * LoginUserArgumentResolver - {@code @MisoSession} 어노테이션 기반 로그인 사용자 주입 리졸버
 *
 * <p>Controller 메서드 파라미터에 {@link MisoSession} 어노테이션이 붙은 {@link LoginUser} 타입이
 * 있으면 현재 세션에서 사용자 정보를 자동으로 꺼내 주입한다.</p>
 *
 * <p>{@link WebMvcConfig#addArgumentResolvers}에서 등록된다.</p>
 *
 * <h3>사용 방법</h3>
 * <pre>
 * {@code @RestController}
 * public class UserController {
 *
 *     // 세션 사용자 정보를 파라미터로 직접 받음
 *     {@code @GetMapping("/api/my-info")}
 *     public ResponseEntity<?> getMyInfo({@code @MisoSession} LoginUser loginUser) {
 *         return ResponseEntity.ok(loginUser);
 *     }
 * }
 * </pre>
 *
 * <h3>동작 조건</h3>
 * <ul>
 *   <li>파라미터에 {@code @MisoSession} 어노테이션이 있어야 한다.</li>
 *   <li>파라미터 타입이 {@link LoginUser} 또는 그 하위 타입이어야 한다.</li>
 *   <li>세션에 "user" 키로 저장된 {@link LoginUser} 객체를 반환한다.</li>
 *   <li>세션이 없거나 만료된 경우 {@code null}이 반환된다 (SessionCheckInterceptor가 사전 차단).</li>
 * </ul>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class LoginUserArgumentResolver implements HandlerMethodArgumentResolver {

    private final HttpSession httpSession;

    /**
     * 이 리졸버가 처리할 수 있는 파라미터인지 여부를 반환한다.
     *
     * @param parameter Controller 메서드의 파라미터 정보
     * @return {@code @MisoSession} 어노테이션과 {@link LoginUser} 타입을 모두 만족하면 {@code true}
     */
    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        boolean hasLoginUserAnnotation = parameter.hasParameterAnnotation(MisoSession.class);
        boolean isUserType = LoginUser.class.isAssignableFrom(parameter.getParameterType());
        return hasLoginUserAnnotation && isUserType;
    }

    /**
     * 세션에서 로그인 사용자 정보를 꺼내 반환한다.
     *
     * @param parameter     파라미터 정보
     * @param mavContainer  ModelAndView 컨테이너
     * @param webRequest    현재 웹 요청
     * @param binderFactory 데이터 바인딩 팩토리
     * @return 세션의 "user" 속성값 ({@link LoginUser}), 없으면 {@code null}
     */
    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
        return httpSession.getAttribute("user");
    }
}
