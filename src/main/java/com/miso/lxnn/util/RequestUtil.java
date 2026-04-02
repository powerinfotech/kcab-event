package com.miso.lxnn.util;


import jakarta.servlet.http.HttpServletRequest;


/**
 * RequestUtil - HTTP 요청 정보 추출 유틸리티
 *
 * <p>클라이언트 IP, OS, 브라우저 정보를 {@link HttpServletRequest}에서 추출하는 정적 메서드 모음.</p>
 *
 * <h3>사용 예시</h3>
 * <pre>
 * // 로그인 로그 기록 시
 * String ip        = RequestUtil.getClientIp(request);       // "192.168.1.10"
 * String userAgent = RequestUtil.getUserAgent(request);      // "Mozilla/5.0 ..."
 * String os        = RequestUtil.getClientOS(userAgent);     // "Windows"
 * String browser   = RequestUtil.getBrowser(userAgent);      // "chrome"
 * </pre>
 */
public class RequestUtil {

    /**
     * 클라이언트의 실제 IP 주소를 반환한다.
     *
     * <p>프록시·로드 밸런서 환경을 고려하여 아래 헤더를 순서대로 확인하고
     * 유효한 첫 번째 값을 반환한다.</p>
     * <ol>
     *   <li>{@code X-Forwarded-For}</li>
     *   <li>{@code Proxy-Client-IP}</li>
     *   <li>{@code WL-Proxy-Client-IP}</li>
     *   <li>{@code HTTP_X_FORWARDED_FOR}</li>
     *   <li>{@code X-Real-IP}</li>
     *   <li>{@code X-RealIP}</li>
     *   <li>{@code REMOTE_ADDR}</li>
     *   <li>{@link HttpServletRequest#getRemoteAddr()} (최종 폴백)</li>
     * </ol>
     *
     * @param request 현재 HTTP 요청
     * @return 클라이언트 IP 문자열 (예: {@code "192.168.1.1"})
     */
    public static String getClientIp(HttpServletRequest request) {
        String clientIp = request.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp)) {
            clientIp = request.getHeader("Proxy-Client-IP");
        }
        if (clientIp == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp)) {
            clientIp = request.getHeader("WL-Proxy-Client-IP");
        }
        if (clientIp == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp)) {
            clientIp = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (clientIp  == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp )) {
            clientIp  = request.getHeader("X-Real-IP");
        }
        if (clientIp  == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp )) {
            clientIp  = request.getHeader("X-RealIP");
        }
        if (clientIp  == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp )) {
            clientIp  = request.getHeader("REMOTE_ADDR");
        }
        if (clientIp == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp)) {
            clientIp = request.getRemoteAddr();
        }
        return clientIp;
    }

    /**
     * User-Agent 문자열에서 클라이언트 운영체제를 추출한다.
     *
     * @param userAgent {@code User-Agent} 헤더 값 ({@code null}이면 {@code "Other"} 반환)
     * @return OS 이름 ({@code "Windows"}, {@code "iPhone"}, {@code "iPad"},
     *         {@code "android"}, {@code "mac"}, {@code "Linux"}, {@code "Other"} 중 하나)
     */
    public static String getClientOS(String userAgent) {
        if (userAgent == null) return "Other";
        String os = "";
        userAgent = userAgent.toLowerCase();
        if (userAgent.contains("windows")) {
            os = "Windows";
        } else if (userAgent.contains("iphone")) {
            os = "iPhone";
        } else if (userAgent.contains("ipad")) {
            os = "iPad";
        } else if (userAgent.contains("android")) {
            os = "android";
        } else if (userAgent.contains("mac")) {
            os = "mac";
        } else if (userAgent.contains("linux")) {
            os = "Linux";
        } else {
            os = "Other";
        }

        return os;
    }


    /**
     * User-Agent 문자열에서 브라우저 종류를 추출한다.
     *
     * @param userAgent {@code User-Agent} 헤더 값 ({@code null}이면 {@code ""} 반환)
     * @return 브라우저 식별자 ({@code "ie"}, {@code "edge"}, {@code "whale"},
     *         {@code "opera"}, {@code "firefox"}, {@code "safari"}, {@code "chrome"}, 또는 {@code ""})
     */
    public static String getBrowser(String userAgent) {
        if (userAgent == null) return "";
        String browser 	 = "";

        if(userAgent.contains("Trident")) {
            browser = "ie";
        } else if(userAgent.contains("Edge")) {
            browser = "edge";
        } else if(userAgent.contains("Whale")) {
            browser = "whale";
        } else if(userAgent.contains("Opera") || userAgent.contains("OPR")) {
            browser = "opera";
        } else if(userAgent.contains("Firefox")) {
            browser = "firefox";
        } else if(userAgent.contains("Safari") && !userAgent.contains("Chrome")) {
            browser = "safari";
        } else if(userAgent.contains("Chrome")) {
            browser = "chrome";
        }

	    return browser;
    }

    /**
     * HTTP 요청에서 {@code User-Agent} 헤더 값을 반환한다.
     *
     * @param request 현재 HTTP 요청
     * @return {@code User-Agent} 문자열, 헤더가 없으면 {@code null}
     */
    public static String getUserAgent(HttpServletRequest request) {
        return request.getHeader("USER-AGENT");
    }
}
