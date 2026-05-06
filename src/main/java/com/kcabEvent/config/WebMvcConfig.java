package com.kcabEvent.config;

import com.kcabEvent.config.interceptor.LogInterceptor;
import com.kcabEvent.config.interceptor.SessionCheckInterceptor;
import com.kcabEvent.util.formatter.LocalDateFormatter;
import com.kcabEvent.util.formatter.LocalDateTimeFormatter;
import com.kcabEvent.util.formatter.LocalTimeFormatter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

/**
 * WebMvcConfig - Spring MVC 웹 레이어 전역 설정
 *
 * <h3>설정 항목</h3>
 *
 * <h4>1. View Controller (SPA 라우팅 지원)</h4>
 * <p>Next.js(React) SPA의 클라이언트 사이드 라우팅을 지원하기 위해
 * {@code /api}로 시작하지 않는 모든 URL 요청을 {@code /}(index.html)로 포워딩한다.</p>
 * <pre>
 * /dashboard         → forward:/
 * /user/management   → forward:/
 * /api/users         → 포워딩 없음 (API 요청으로 처리)
 * </pre>
 *
 * <h4>2. CORS 설정</h4>
 * <ul>
 *   <li>대상: {@code /api/**}</li>
 *   <li>허용 Origin: 모든 출처 ({@code *})</li>
 *   <li>허용 메서드: OPTIONS, GET, POST, PUT, DELETE</li>
 *   <li>Preflight 캐시: 300초</li>
 * </ul>
 *
 * <h4>3. 인터셉터 등록 (실행 순서)</h4>
 * <ol>
 *   <li>{@link SessionCheckInterceptor} (order=1): 세션 유효성 검사
 *       — 로그인/로그아웃 등 인증 불필요 경로는 제외</li>
 *   <li>{@link LogInterceptor} (order=2): 요청/응답 UUID 기반 로그 기록</li>
 * </ol>
 *
 * <h4>4. Formatter 등록</h4>
 * <ul>
 *   <li>{@code @RequestParam} / {@code @ModelAttribute}의 날짜 문자열 자동 변환</li>
 *   <li>{@link LocalDateFormatter}: {@code "yyyy-MM-dd"} ↔ {@link java.time.LocalDate}</li>
 *   <li>{@link LocalDateTimeFormatter}: {@code "yyyy-MM-dd HH:mm:ss"} ↔ {@link java.time.LocalDateTime}</li>
 * </ul>
 *
 * <h4>5. ArgumentResolver 등록</h4>
 * <ul>
 *   <li>{@link LoginUserArgumentResolver}: {@code @KcabEventSession LoginUser} 파라미터 자동 주입</li>
 * </ul>
 */
@RequiredArgsConstructor
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final LoginUserArgumentResolver loginUserArgumentResolver;

    @Value("${cors.allowed-origins:*}")
    private String allowedOrigins;

    /**
     * SPA(Single Page Application) 클라이언트 라우팅 지원을 위한 View Controller 등록.
     *
     * <p>{@code /api}로 시작하지 않는 URL은 모두 {@code /}로 포워딩하여
     * Next.js 클라이언트가 라우팅을 처리하도록 한다.</p>
     */
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Spring Boot 3.x PathPatternParser 호환: /** 뒤에 추가 패턴 불가
        // SPA 라우팅은 Next.js가 static export로 처리하므로 단순 패턴만 등록
        registry.addViewController("/{spring:[\\w\\-]+}").setViewName("forward:/");
        registry.addViewController("/{path1:[\\w\\-]+}/{path2:[\\w\\-]+}").setViewName("forward:/");
        registry.addViewController("/{path1:[\\w\\-]+}/{path2:[\\w\\-]+}/{path3:[\\w\\-]+}").setViewName("forward:/");
    }

    /**
     * CORS 정책 설정.
     *
     * <p>{@code /api/**} 경로에 대해 모든 출처의 요청을 허용한다.
     * 운영 환경에서는 보안을 위해 {@code allowedOrigins}를 특정 도메인으로 제한하는 것을 권장한다.</p>
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins.split(","))
                .allowedHeaders("*")
                .allowedMethods("OPTIONS", "GET", "POST", "PUT", "DELETE")
                .maxAge(300);
    }

    /**
     * 인터셉터 등록.
     *
     * <ul>
     *   <li>order=1: {@link SessionCheckInterceptor} — 세션 검사
     *       (로그인·로그아웃·비밀번호 찾기 경로 제외)</li>
     *   <li>order=2: {@link LogInterceptor} — 요청/응답 로그</li>
     * </ul>
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SessionCheckInterceptor())
                .order(1)
                .addPathPatterns("/api/**")
                .excludePathPatterns(
                        "/api/common/login-info",
                        "/api/login",
                        "/api/logout",
                        "/api/public/**",
                        "/css/**",
                        "/images/**",
                        "/js/**",
                        "/api/find-user/**"
                );

        registry.addInterceptor(new LogInterceptor())
                .order(2)
                .addPathPatterns("/api/**")
                .excludePathPatterns("/css/**", "/images/**", "/js/**");
    }

    /**
     * {@code @RequestParam}, {@code @ModelAttribute} 날짜 타입 자동 변환 Formatter 등록.
     */
    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addFormatter(new LocalDateFormatter());
        registry.addFormatter(new LocalDateTimeFormatter());
        registry.addFormatter(new LocalTimeFormatter());
    }

    /**
     * {@code @KcabEventSession LoginUser} 파라미터 자동 주입을 위한 ArgumentResolver 등록.
     */
    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolverList) {
        resolverList.add(loginUserArgumentResolver);
    }
}
