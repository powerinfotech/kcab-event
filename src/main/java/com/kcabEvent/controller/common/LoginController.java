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

@Controller
public class LoginController {
    @Resource(name = "loginService")
    private LoginService loginService;

    @Resource(name ="customValidator")
    private CustomValidator customValidator;


    @PostMapping("/api/login")
    public @ResponseBody ApiResponse<Void> login(HttpServletRequest request, @Valid @RequestBody LoginRequestDto loginInfo, BindingResult bindingResult) {
        customValidator.validate(loginInfo, bindingResult);
        loginService.login(loginInfo, request);
        return ApiResponse.ok();
    }


    @PostMapping("/api/logout")
    public @ResponseBody ApiResponse<Void> logout() {
        loginService.logout();
        return ApiResponse.ok();
    }

}
