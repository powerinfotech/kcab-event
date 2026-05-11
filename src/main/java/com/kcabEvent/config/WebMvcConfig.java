package com.kcabEvent.config;

import com.kcabEvent.config.interceptor.LogInterceptor;
import com.kcabEvent.config.interceptor.SessionCheckInterceptor;
import com.kcabEvent.util.formatter.LocalDateFormatter;
import com.kcabEvent.util.formatter.LocalDateTimeFormatter;
import com.kcabEvent.util.formatter.LocalTimeFormatter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;
import java.util.List;

/**
 * WebMvcConfig - Spring MVC 웹 레이어 전역 설정
 *
 * <h3>설정 항목</h3>
 *
 * <h4>1. Static Resource Handler (Next.js static export 지원)</h4>
 * <p>Next.js의 static export 산출물을 서빙한다. 요청 경로에 대해
 * (원본 → {@code .html} → {@code /index.html}) 순으로 탐색하고,
 * 모두 없으면 루트 {@code index.html}로 fallback 한다.
 * {@code /api/**}, {@code /_next/**}는 fallback 대상에서 제외한다.</p>
 * <pre>
 * /login             → /login.html (Next.js export)
 * /admin/login       → /admin/login.html
 * /dashboard         → /index.html (SPA 클라이언트 라우팅 fallback)
 * /api/users         → controller 처리 (fallback 없음)
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
     * Next.js static export 라우팅 지원.
     *
     * <p>요청 경로에 대해 다음 순서로 정적 리소스를 탐색하고, 모두 없으면
     * {@code index.html}로 fallback 한다. {@code /api}로 시작하는 경로는
     * controller가 처리하므로 fallback 대상에서 제외한다.</p>
     * <ol>
     *   <li>{@code /login} → {@code /login} (원본 경로)</li>
     *   <li>{@code /login} → {@code /login.html} (Next.js static export)</li>
     *   <li>{@code /login} → {@code /login/index.html} (디렉토리 export)</li>
     *   <li>모두 없으면 {@code /index.html}로 fallback (SPA 클라이언트 라우팅)</li>
     * </ol>
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource resource = location.createRelative(resourcePath);
                        if (resource.isReadable()) {
                            return resource;
                        }
                        Resource html = location.createRelative(resourcePath + ".html");
                        if (html.isReadable()) {
                            return html;
                        }
                        Resource dirIndex = location.createRelative(resourcePath + "/index.html");
                        if (dirIndex.isReadable()) {
                            return dirIndex;
                        }
                        if (resourcePath.startsWith("api/") || resourcePath.startsWith("_next/")) {
                            return null;
                        }
                        Resource indexHtml = location.createRelative("index.html");
                        return indexHtml.isReadable() ? indexHtml : null;
                    }
                });
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
                        "/api/find-user/**",
                        "/api/password-reset/**"
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
