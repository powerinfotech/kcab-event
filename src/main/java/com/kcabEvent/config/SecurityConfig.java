package com.kcabEvent.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.*;
import org.springframework.security.config.annotation.web.configuration.*;
import org.springframework.security.config.annotation.web.configurers.*;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.*;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * SecurityConfig - Spring Security 보안 설정
 *
 * <h3>CSRF 보호 (SPA 환경)</h3>
 * <ul>
 *   <li>{@link CookieCsrfTokenRepository}: XSRF-TOKEN 쿠키로 토큰 전달</li>
 *   <li>{@link CsrfTokenRequestAttributeHandler}: 평문 토큰 매칭 (axios 쿠키 연동 호환)</li>
 *   <li>{@link CsrfCookieFilter}: 모든 응답에 XSRF-TOKEN 쿠키 강제 발급
 *       (Spring Security 6.x의 지연 로딩 문제 해결)</li>
 *   <li>{@link CsrfRequireMatcher}: GET/HEAD/TRACE/OPTIONS, Swagger UI 요청은 CSRF 검사 제외</li>
 * </ul>
 *
 * <h3>클라이언트 연동</h3>
 * <p>axios는 {@code withCredentials: true} 설정 시 XSRF-TOKEN 쿠키를 자동으로
 * X-XSRF-TOKEN 헤더에 첨부한다 (axios 기본 동작).</p>
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf(csrf -> csrf
                    .requireCsrfProtectionMatcher(new CsrfRequireMatcher())
                    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                    .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()))
                .addFilterAfter(new CsrfCookieFilter(), BasicAuthenticationFilter.class)
                .formLogin(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> authorize.anyRequest().permitAll());

        return httpSecurity.build();
    }

    /**
     * 모든 응답에 XSRF-TOKEN 쿠키를 강제 발급하는 필터.
     *
     * <p>Spring Security 6.x에서 CSRF 토큰은 지연 로딩되어,
     * 명시적으로 {@code getToken()}을 호출해야 쿠키가 설정된다.
     * SPA는 첫 GET 요청에서 쿠키를 받아야 이후 POST에서 사용할 수 있으므로
     * 이 필터가 필수적이다.</p>
     */
    static class CsrfCookieFilter extends OncePerRequestFilter {
        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                        FilterChain filterChain) throws ServletException, java.io.IOException {
            CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
            if (csrfToken != null) {
                csrfToken.getToken();
            }
            filterChain.doFilter(request, response);
        }
    }
}
