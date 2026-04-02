package com.miso.lxnn.config;

import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.*;
import org.springframework.security.config.annotation.web.configuration.*;
import org.springframework.security.config.annotation.web.configurers.*;
import org.springframework.security.web.*;
import org.springframework.security.web.csrf.*;

/**
 * SecurityConfig - Spring Security 보안 설정
 *
 * <h3>설정 내용</h3>
 * <ul>
 *   <li><b>CSRF 보호</b>: {@link CsrfRequireMatcher}로 조건부 적용
 *     <ul>
 *       <li>GET/HEAD/TRACE/OPTIONS 요청은 CSRF 검사 제외</li>
 *       <li>Swagger UI 요청은 CSRF 검사 제외 (Referer 헤더 기준)</li>
 *       <li>그 외 POST/PUT/DELETE 요청은 CSRF 토큰 검증 필수</li>
 *     </ul>
 *   </li>
 *   <li><b>CSRF 토큰 저장소</b>: {@link CookieCsrfTokenRepository#withHttpOnlyFalse()}
 *     <ul>
 *       <li>XSRF-TOKEN 쿠키로 토큰 전달 (JavaScript에서 읽을 수 있도록 HttpOnly=false)</li>
 *       <li>클라이언트는 X-XSRF-TOKEN 헤더로 토큰을 전송해야 함</li>
 *     </ul>
 *   </li>
 *   <li><b>폼 로그인 비활성화</b>: Spring Security 기본 로그인 페이지 미사용
 *     (커스텀 로그인 API {@code /api/login}으로 대체)</li>
 *   <li><b>인가</b>: 모든 요청 허용 ({@code anyRequest().permitAll()})
 *     — 인증/인가는 {@link com.miso.lxnn.config.interceptor.SessionCheckInterceptor}에서 처리</li>
 * </ul>
 *
 * <h3>클라이언트 CSRF 연동 예시 (axios)</h3>
 * <pre>
 * // axios 요청 시 쿠키에서 토큰을 읽어 헤더에 자동 첨부
 * axios.defaults.withCredentials = true;
 * // GlobalAxiosProvider에서 자동 처리됨 (CookieCsrfTokenRepository와 연동)
 * </pre>
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * HTTP 보안 필터 체인 구성
     *
     * @param httpSecurity Spring Security HTTP 보안 빌더
     * @return 구성된 {@link SecurityFilterChain}
     * @throws Exception 보안 설정 오류 시
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf(csrf -> csrf
                    .requireCsrfProtectionMatcher(new CsrfRequireMatcher())
                    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))
                .formLogin(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> authorize.anyRequest().permitAll());

        return httpSecurity.build();
    }
}
