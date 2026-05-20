package com.kcabEvent.service.saf.impl;

import com.kcabEvent.dto.saf.SafEmailVerificationSendRequestDto;
import com.kcabEvent.dto.saf.SafEmailVerificationVerifyRequestDto;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.email.EmailLogService;
import com.kcabEvent.service.saf.SafEmailVerificationService;
import com.kcabEvent.service.saf.SafSignupService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Locale;

@Slf4j
@Service("safEmailVerificationService")
@RequiredArgsConstructor
public class SafEmailVerificationServiceImpl implements SafEmailVerificationService {

    private static final String SESSION_EMAIL = "safSignupEmailVerifyEmail";
    private static final String SESSION_CODE = "safSignupEmailVerifyCode";
    private static final String SESSION_EXPIRES_AT = "safSignupEmailVerifyExpiresAt";
    private static final String SESSION_VERIFIED = "safSignupEmailVerifyVerified";
    private static final String PURPOSE_SIGNUP = "signup";
    private static final String PURPOSE_CONTACT_EMAIL = "contact-email";
    private static final int CODE_EXPIRE_MINUTES = 10;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final EmailLogService emailLogService;

    @Resource(name = "safSignupService")
    private SafSignupService safSignupService;

    @Override
    public void sendCode(SafEmailVerificationSendRequestDto requestDto, HttpSession session) {
        String email = normalize(requestDto.getEmail());
        String purpose = normalizePurpose(requestDto.getPurpose());
        if (!StringUtils.hasText(email)) {
            throw new BusinessException("Please enter an email address.");
        }
        if (shouldCheckDuplicateEmail(purpose) && safSignupService.existsByEmail(email)) {
            throw new BusinessException("This email is already registered.");
        }

        String code = createSixDigitCode();
        session.setAttribute(sessionKey(SESSION_EMAIL, purpose), email);
        session.setAttribute(sessionKey(SESSION_CODE, purpose), code);
        session.setAttribute(sessionKey(SESSION_EXPIRES_AT, purpose), OffsetDateTime.now().plusMinutes(CODE_EXPIRE_MINUTES));
        session.setAttribute(sessionKey(SESSION_VERIFIED, purpose), false);

        String subject = "[KCAB International] Email verification code";
        String emailBody = buildEmail(code);
        String logBody = buildEmail("******");

        try {
            emailLogService.sendHtmlAndLog(email, null, subject, emailBody, logBody);
        } catch (RuntimeException e) {
            clear(session, purpose);
            throw e;
        }
    }

    @Override
    public void verifyCode(SafEmailVerificationVerifyRequestDto requestDto, HttpSession session) {
        String email = normalize(requestDto.getEmail());
        String purpose = normalizePurpose(requestDto.getPurpose());
        String savedEmail = (String) session.getAttribute(sessionKey(SESSION_EMAIL, purpose));
        String savedCode = (String) session.getAttribute(sessionKey(SESSION_CODE, purpose));
        OffsetDateTime expiresAt = (OffsetDateTime) session.getAttribute(sessionKey(SESSION_EXPIRES_AT, purpose));

        if (!StringUtils.hasText(savedCode) || expiresAt == null || !StringUtils.hasText(savedEmail)) {
            throw new BusinessException("Please request a verification code first.");
        }
        if (!savedEmail.equals(email)) {
            throw new BusinessException("Email address does not match the one you requested the code for.");
        }
        if (OffsetDateTime.now().isAfter(expiresAt)) {
            clear(session, purpose);
            throw new BusinessException("Verification code has expired. Please request a new code.");
        }
        if (!savedCode.equals(requestDto.getCode())) {
            throw new BusinessException("Verification code does not match.");
        }

        session.setAttribute(sessionKey(SESSION_VERIFIED, purpose), true);
    }

    @Override
    public boolean isVerifiedForEmail(String email, HttpSession session) {
        return isVerifiedForEmail(email, session, PURPOSE_SIGNUP);
    }

    @Override
    public boolean isVerifiedForEmail(String email, HttpSession session, String purpose) {
        String normalized = normalize(email);
        String normalizedPurpose = normalizePurpose(purpose);
        String savedEmail = (String) session.getAttribute(sessionKey(SESSION_EMAIL, normalizedPurpose));
        OffsetDateTime expiresAt = (OffsetDateTime) session.getAttribute(sessionKey(SESSION_EXPIRES_AT, normalizedPurpose));
        Boolean verified = (Boolean) session.getAttribute(sessionKey(SESSION_VERIFIED, normalizedPurpose));

        return Boolean.TRUE.equals(verified)
                && StringUtils.hasText(savedEmail)
                && savedEmail.equals(normalized)
                && expiresAt != null
                && !OffsetDateTime.now().isAfter(expiresAt);
    }

    @Override
    public void clear(HttpSession session) {
        clear(session, PURPOSE_SIGNUP);
        clear(session, "profile-email");
        clear(session, PURPOSE_CONTACT_EMAIL);
    }

    @Override
    public void clear(HttpSession session, String purpose) {
        String normalizedPurpose = normalizePurpose(purpose);
        session.removeAttribute(sessionKey(SESSION_EMAIL, normalizedPurpose));
        session.removeAttribute(sessionKey(SESSION_CODE, normalizedPurpose));
        session.removeAttribute(sessionKey(SESSION_EXPIRES_AT, normalizedPurpose));
        session.removeAttribute(sessionKey(SESSION_VERIFIED, normalizedPurpose));
    }

    private String normalize(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizePurpose(String purpose) {
        if (!StringUtils.hasText(purpose)) {
            return PURPOSE_SIGNUP;
        }
        String normalized = purpose.trim().toLowerCase(Locale.ROOT);
        if (!"profile-email".equals(normalized) && !PURPOSE_CONTACT_EMAIL.equals(normalized)) {
            return PURPOSE_SIGNUP;
        }
        return normalized;
    }

    private String sessionKey(String baseKey, String purpose) {
        return PURPOSE_SIGNUP.equals(purpose) ? baseKey : baseKey + ":" + purpose;
    }

    private boolean shouldCheckDuplicateEmail(String purpose) {
        return !PURPOSE_CONTACT_EMAIL.equals(purpose);
    }

    private String createSixDigitCode() {
        return String.format("%06d", SECURE_RANDOM.nextInt(1_000_000));
    }

    private String buildEmail(String code) {
        return """
                <html>
                <head><meta charset="UTF-8"></head>
                <body style="margin:0;padding:0;background:#ffffff;font-family:Arial,'Segoe UI',sans-serif;">
                  <div style="width:500px;padding:40px 20px;">
                    <div style="width:400px;border:1px solid #eeeeee;border-radius:8px;padding:32px 24px;">
                      <div style="font-size:20px;font-weight:700;color:#333;padding-bottom:14px;border-bottom:2px solid #f0f0f0;">
                        KCAB INTERNATIONAL
                      </div>
                      <div style="font-size:15px;color:#444;line-height:1.6;padding:24px 0 18px;">
                        Hello,<br>
                        Please use the verification code below to complete your email verification.
                      </div>
                      <div style="display:inline-block;background:#f8f9fa;border:1px solid #eeeeee;border-radius:6px;padding:15px 30px;font-size:28px;font-weight:700;color:#007BFF;letter-spacing:3px;">
                        %s
                      </div>
                      <div style="margin-top:24px;padding-top:18px;border-top:1px solid #f0f0f0;font-size:13px;line-height:1.5;">
                        <strong style="color:#d9534f;">Never share this verification code with anyone else.</strong><br>
                        <span style="color:#999;">This code will expire in %d minutes.</span>
                      </div>
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(code, CODE_EXPIRE_MINUTES);
    }
}
