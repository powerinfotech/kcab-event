package com.miso.lxnn.config.filter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class ContingencyFilter implements Filter {

    @Value("${system.under-construction}")
    private Boolean isUnderConstruction;
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        if(isUnderConstruction && !request.getRequestURI().equals("/under-construction")) {
            HttpServletResponse response = (HttpServletResponse) servletResponse;
            response.sendRedirect("/under-construction");
        }

        filterChain.doFilter(servletRequest, servletResponse);
    }
}
