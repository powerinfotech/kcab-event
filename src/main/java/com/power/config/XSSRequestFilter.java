package com.power.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * XSSRequestFilter - Jakarta Servlet 기반 XSS 입력값 필터
 *
 * <p>HTTP 요청 파라미터에 포함된 XSS 위험 문자를 제거한다.
 * Spring Boot 3.x(Jakarta Servlet)와 호환된다.</p>
 *
 * <p>기존 Lucy XSS Servlet Filter(javax.servlet 기반)를 대체한다.</p>
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class XSSRequestFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        chain.doFilter(new XSSRequestWrapper((HttpServletRequest) request), response);
    }

    /**
     * 요청 파라미터의 XSS 위험 문자를 제거하는 HttpServletRequest 래퍼.
     */
    static class XSSRequestWrapper extends HttpServletRequestWrapper {

        XSSRequestWrapper(HttpServletRequest request) {
            super(request);
        }

        @Override
        public String getParameter(String name) {
            String value = super.getParameter(name);
            return stripXSS(value);
        }

        @Override
        public String[] getParameterValues(String name) {
            String[] values = super.getParameterValues(name);
            if (values == null) return null;
            String[] sanitized = new String[values.length];
            for (int i = 0; i < values.length; i++) {
                sanitized[i] = stripXSS(values[i]);
            }
            return sanitized;
        }

        private static String stripXSS(String value) {
            if (value == null) return null;
            // <script> 태그 제거
            value = value.replaceAll("(?i)<script[^>]*>.*?</script>", "");
            // <iframe>, <object>, <embed>, <form> 태그 제거
            value = value.replaceAll("(?i)<(iframe|object|embed|form)[^>]*>.*?</(iframe|object|embed|form)>", "");
            // 이벤트 핸들러 속성 제거 (on으로 시작하는 속성)
            value = value.replaceAll("(?i)\\bon\\w+\\s*=", "");
            // javascript: 프로토콜 제거
            value = value.replaceAll("(?i)javascript\\s*:", "");
            // vbscript: 프로토콜 제거
            value = value.replaceAll("(?i)vbscript\\s*:", "");
            // expression() 제거 (CSS XSS)
            value = value.replaceAll("(?i)expression\\s*\\(", "");
            return value;
        }
    }
}
