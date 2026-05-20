package com.kcabEvent.service.saf;

import com.kcabEvent.dto.saf.SafEmailVerificationSendRequestDto;
import com.kcabEvent.dto.saf.SafEmailVerificationVerifyRequestDto;
import jakarta.servlet.http.HttpSession;

/**
 * SAF 회원가입용 이메일 인증 코드 발송/검증을 정의한다.
 */
public interface SafEmailVerificationService {

    void sendCode(SafEmailVerificationSendRequestDto requestDto, HttpSession session);

    void verifyCode(SafEmailVerificationVerifyRequestDto requestDto, HttpSession session);

    boolean isVerifiedForEmail(String email, HttpSession session);

    boolean isVerifiedForEmail(String email, HttpSession session, String purpose);

    void clear(HttpSession session);

    void clear(HttpSession session, String purpose);
}
