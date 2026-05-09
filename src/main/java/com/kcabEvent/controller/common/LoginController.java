package com.kcabEvent.controller.common;

import com.kcabEvent.dto.common.LoginRequestDto;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.service.common.LoginService;
import com.kcabEvent.validator.CustomValidator;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

/**
 * 기존 사용자와 SAF 사용자의 로그인/로그아웃 요청을 처리한다.
 */
@Controller
public class LoginController {
    @Resource(name = "loginService")
    private LoginService loginService;

    @Resource(name ="customValidator")
    private CustomValidator customValidator;


    /**
     * 인증 정보를 검증하고 로그인 사용자 세션을 생성한다.
     */
    @PostMapping("/api/login")
    public @ResponseBody ApiResponse<Void> login(HttpServletRequest request, @Valid @RequestBody LoginRequestDto loginInfo, BindingResult bindingResult) {
        customValidator.validate(loginInfo, bindingResult);
        loginService.login(loginInfo, request);
        return ApiResponse.ok();
    }


    /**
     * 현재 인증 세션을 무효화한다.
     */
    @PostMapping("/api/logout")
    public @ResponseBody ApiResponse<Void> logout() {
        loginService.logout();
        return ApiResponse.ok();
    }

}
