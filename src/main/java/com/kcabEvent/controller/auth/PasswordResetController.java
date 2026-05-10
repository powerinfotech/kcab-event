package com.kcabEvent.controller.auth;

import com.kcabEvent.dto.auth.PasswordResetChangePasswordRequestDto;
import com.kcabEvent.dto.auth.PasswordResetSendCodeRequestDto;
import com.kcabEvent.dto.auth.PasswordResetVerifyCodeRequestDto;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.service.auth.PasswordResetService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/password-reset")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @PostMapping("/send-code")
    public ApiResponse<Void> sendCode(
            @Valid @RequestBody PasswordResetSendCodeRequestDto requestDto,
            HttpSession session
    ) {
        passwordResetService.sendVerificationCode(requestDto, session);
        return ApiResponse.ok();
    }

    @PostMapping("/verify-code")
    public ApiResponse<Void> verifyCode(
            @Valid @RequestBody PasswordResetVerifyCodeRequestDto requestDto,
            HttpSession session
    ) {
        passwordResetService.verifyCode(requestDto, session);
        return ApiResponse.ok();
    }

    @PostMapping("/change-password")
    public ApiResponse<Void> changePassword(
            @Valid @RequestBody PasswordResetChangePasswordRequestDto requestDto,
            HttpSession session
    ) {
        passwordResetService.changePassword(requestDto, session);
        return ApiResponse.ok();
    }
}
