package com.kcabEvent.config;

import org.springframework.security.web.util.matcher.RequestMatcher;

import jakarta.servlet.http.HttpServletRequest;
import java.util.regex.Pattern;

/**
 * CsrfRequireMatcher - CSRF 보호 적용 여부를 판단하는 커스텀 매처
 *
 * <p>Spring Security의 기본 CSRF 매처를 대체하여 두 가지 예외 조건을 추가로 적용한다.</p>
 *
 * <h3>CSRF 검사를 건너뛰는 조건 (matches → false)</h3>
 * <ol>
 *   <li>안전한 HTTP 메서드 요청: GET, HEAD, TRACE, OPTIONS</li>
 *   <li>Swagger UI에서 발생한 요청: Referer 헤더에 "/swagger-ui" 포함</li>
 * </ol>
 *
 * <h3>CSRF 검사를 수행하는 조건 (matches → true)</h3>
 * <ul>
 *   <li>POST, PUT, DELETE, PATCH 등 상태 변경 요청 중 Swagger UI가 아닌 출처</li>
 * </ul>
 *
 * <h3>사용 위치</h3>
 * <pre>
 * // SecurityConfig.java
 * httpSecurity.csrf()
 *     .requireCsrfProtectionMatcher(new CsrfRequireMatcher())
 *     .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
 * </pre>
 */
public class CsrfRequireMatcher implements RequestMatcher {

	/** 상태 변경이 없는 안전한 HTTP 메서드 — CSRF 검사 불필요 */
	private static final Pattern ALLOWED_METHODS = Pattern.compile("^(GET|HEAD|TRACE|OPTIONS)$");

	/**
	 * 요청에 CSRF 보호를 적용할지 여부를 반환한다.
	 *
	 * @param request 현재 HTTP 요청
	 * @return {@code true}이면 CSRF 토큰 검증 수행, {@code false}이면 건너뜀
	 */
	@Override
	public boolean matches(HttpServletRequest request) {
		// 안전한 메서드(GET 등)는 CSRF 검사 불필요
		if (ALLOWED_METHODS.matcher(request.getMethod()).matches())
			return false;

		// Swagger UI에서 온 요청은 CSRF 검사 제외 (개발/테스트 편의)
		final String referer = request.getHeader("Referer");
		return referer == null || !referer.contains("/swagger-ui");
	}
}
