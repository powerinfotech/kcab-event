package com.kcabEvent.service.auth;

import com.kcabEvent.dto.auth.PasswordResetChangePasswordRequestDto;
import com.kcabEvent.dto.auth.PasswordResetSendCodeRequestDto;
import com.kcabEvent.dto.auth.PasswordResetVerifyCodeRequestDto;
import jakarta.servlet.http.HttpSession;

public interface PasswordResetService {
    void sendVerificationCode(PasswordResetSendCodeRequestDto requestDto, HttpSession session);

    void verifyCode(PasswordResetVerifyCodeRequestDto requestDto, HttpSession session);

    void changePassword(PasswordResetChangePasswordRequestDto requestDto, HttpSession session);
}
