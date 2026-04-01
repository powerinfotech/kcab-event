package com.miso.lxnn.config.filter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * ContingencyFilter - 시스템 점검 중 리다이렉트 필터
 *
 * <p>application.yml의 {@code system.under-construction} 속성이 {@code true}이면
 * {@code /under-construction} 페이지를 제외한 모든 요청을 점검 페이지로 리다이렉트한다.</p>
 *
 * <h3>동작 방식</h3>
 * <ol>
 *   <li>점검 모드({@code isUnderConstruction=true})이고 요청 URI가 {@code /under-construction}이 아니면
 *       {@code 302 Redirect → /under-construction}</li>
 *   <li>그 외의 경우 필터 체인을 정상 통과</li>
 * </ol>
 *
 * <h3>application.yml 설정</h3>
 * <pre>
 * system:
 *   under-construction: false   # 정상 운영
 *   # under-construction: true  # 점검 모드 활성화
 * </pre>
 *
 * <h3>주의사항</h3>
 * <ul>
 *   <li>리다이렉트 대상인 {@code /under-construction}은 {@link SessionCheckInterceptor} 제외 목록에
 *       추가하거나 인증이 필요 없는 경로로 설정해야 무한 리다이렉트가 발생하지 않는다.</li>
 *   <li>정적 리소스(CSS, JS, 이미지)도 리다이렉트 대상에 포함될 수 있으므로,
 *       필요 시 {@code /under-construction} 페이지의 정적 리소스 경로도 예외 처리한다.</li>
 * </ul>
 */
@Component
public class ContingencyFilter implements Filter {

    @Value("${system.under-construction}")
    private Boolean isUnderConstruction;

    /**
     * 점검 모드 여부에 따라 요청을 점검 페이지로 리다이렉트하거나 필터 체인을 통과시킨다.
     *
     * @param servletRequest  HTTP 요청
     * @param servletResponse HTTP 응답
     * @param filterChain     다음 필터 체인
     * @throws IOException      리다이렉트 또는 체인 처리 중 I/O 오류
     * @throws ServletException 필터 처리 중 서블릿 오류
     */
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;

        if (isUnderConstruction && !request.getRequestURI().equals("/under-construction")) {
            HttpServletResponse response = (HttpServletResponse) servletResponse;
            response.sendRedirect("/under-construction");
            return; // 리다이렉트 후 필터 체인 진행 중단
        }

        filterChain.doFilter(servletRequest, servletResponse);
    }
}
