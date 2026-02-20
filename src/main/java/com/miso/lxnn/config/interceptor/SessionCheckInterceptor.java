package com.miso.lxnn.config.interceptor;

import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.exception.custom.InValidSessionException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j
public class SessionCheckInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        LoginUser user = (LoginUser) request.getSession().getAttribute("user");
        if(user == null)
            throw new InValidSessionException();
        /*일정년도 이후에는 못쓰게 수정
        LocalDate today = LocalDate.now();
        int currentYear = today.getYear();
        if (currentYear > 2025){
            request.getSession().invalidate();
            throw new InValidSessionException();
         }
         */
        return true;
    }

}