package com.kcabEvent.service.auth.impl;

import com.kcabEvent.dao.SafUserDao;
import com.kcabEvent.dao.UserDao;
import com.kcabEvent.domain.User;
import com.kcabEvent.domain.saf.SafUser;
import com.kcabEvent.dto.auth.PasswordResetChangePasswordRequestDto;
import com.kcabEvent.dto.auth.PasswordResetSendCodeRequestDto;
import com.kcabEvent.dto.auth.PasswordResetVerifyCodeRequestDto;
import com.kcabEvent.dto.email.EmailTemplateDetailDto;
import com.kcabEvent.enums.saf.SafUserStatus;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.auth.PasswordResetService;
import com.kcabEvent.service.email.EmailLogService;
import com.kcabEvent.service.email.EmailTemplateService;
import com.kcabEvent.util.CryptoUtil;
import com.kcabEvent.util.EmailHtmlLayout;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.util.HtmlUtils;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Locale;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {

    private static final String SESSION_TARGET_TYPE = "passwordResetTargetType";
    private static final String SESSION_TARGET_USER_SEQ = "passwordResetTargetUserSeq";
    private static final String SESSION_CODE = "passwordResetCode";
    private static final String SESSION_EXPIRES_AT = "passwordResetExpiresAt";
    private static final String SESSION_VERIFIED = "passwordResetVerified";
    private static final String PASSWORD_RESET_TEMPLATE_CODE = "password_reset";
    private static final int CODE_EXPIRE_MINUTES = 5;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final EmailLogService emailLogService;
    private final EmailTemplateService emailTemplateService;

    @Resource(name = "userDao")
    private UserDao userDao;

    @Resource(name = "safUserDao")
    private SafUserDao safUserDao;

    @Override
    public void sendVerificationCode(PasswordResetSendCodeRequestDto requestDto, HttpSession session) {
        ResetTarget target = findResetTarget(requestDto.getUserId(), requestDto.getEmail());
        String code = createSixDigitCode();

        EmailTemplateDetailDto template = emailTemplateService.selectTemplateDetail(PASSWORD_RESET_TEMPLATE_CODE);
        if (!Boolean.TRUE.equals(template.getIsActive())) {
            throw new BusinessException("Password reset email template is inactive.");
        }

        Map<String, String> variables = Map.of(
                "user_name", defaultText(target.name(), "there"),
                "reset_code", code,
                "expire_minutes", String.valueOf(CODE_EXPIRE_MINUTES)
        );
        Map<String, String> logVariables = Map.of(
                "user_name", defaultText(target.name(), "there"),
                "reset_code", "******",
                "expire_minutes", String.valueOf(CODE_EXPIRE_MINUTES)
        );

        String subject = renderTemplate(template.getSubject(), variables, false);
        String emailBody = EmailHtmlLayout.wrapTemplateBody(renderTemplate(template.getBodyHtml(), variables, true));
        String logBody = EmailHtmlLayout.wrapTemplateBody(renderTemplate(template.getBodyHtml(), logVariables, true));

        session.setAttribute(SESSION_TARGET_TYPE, target.type());
        session.setAttribute(SESSION_TARGET_USER_SEQ, target.userSeq());
        session.setAttribute(SESSION_CODE, code);
        session.setAttribute(SESSION_EXPIRES_AT, OffsetDateTime.now().plusMinutes(CODE_EXPIRE_MINUTES));
        session.setAttribute(SESSION_VERIFIED, false);

        try {
            emailLogService.sendHtmlAndLog(template.getTemplateSeq(), target.email(), target.name(), subject, emailBody, logBody);
        } catch (RuntimeException e) {
            clearSession(session);
            throw e;
        }
    }

    @Override
    public void verifyCode(PasswordResetVerifyCodeRequestDto requestDto, HttpSession session) {
        String savedCode = (String) session.getAttribute(SESSION_CODE);
        OffsetDateTime expiresAt = (OffsetDateTime) session.getAttribute(SESSION_EXPIRES_AT);

        if (!StringUtils.hasText(savedCode) || expiresAt == null) {
            throw new BusinessException("Please request a verification code first.");
        }
        if (OffsetDateTime.now().isAfter(expiresAt)) {
            clearSession(session);
            throw new BusinessException("Verification code has expired. Please request a new code.");
        }
        if (!savedCode.equals(requestDto.getCode())) {
            throw new BusinessException("Verification code does not match.");
        }

        session.setAttribute(SESSION_VERIFIED, true);
    }

    @Override
    @Transactional
    public void changePassword(PasswordResetChangePasswordRequestDto requestDto, HttpSession session) {
        if (!Boolean.TRUE.equals(session.getAttribute(SESSION_VERIFIED))) {
            throw new BusinessException("Please verify the code first.");
        }
        if (!StringUtils.hasText(requestDto.getPassword())) {
            throw new BusinessException("Please enter a new password.");
        }
        if (!requestDto.getPassword().equals(requestDto.getPasswordConfirm())) {
            throw new BusinessException("Password and Confirm Password do not match.");
        }

        String targetType = (String) session.getAttribute(SESSION_TARGET_TYPE);
        Object targetUserSeq = session.getAttribute(SESSION_TARGET_USER_SEQ);
        if (!StringUtils.hasText(targetType) || targetUserSeq == null) {
            clearSession(session);
            throw new BusinessException("Password reset session is invalid. Please request a new code.");
        }

        String encodedPassword = CryptoUtil.encodePassword(requestDto.getPassword());
        if ("LEGACY".equals(targetType)) {
            User user = new User();
            Integer userSeq = ((Number) targetUserSeq).intValue();
            user.setUserSeq(userSeq);
            user.setPassword(encodedPassword);
            user.setUptUserSeq(userSeq);
            userDao.updatePassword(user);
        } else if ("SAF".equals(targetType)) {
            Long userSeq = ((Number) targetUserSeq).longValue();
            safUserDao.updatePasswordHash(userSeq, encodedPassword, userSeq);
        } else {
            clearSession(session);
            throw new BusinessException("Password reset session is invalid. Please request a new code.");
        }

        clearSession(session);
    }

    private ResetTarget findResetTarget(String userId, String email) {
        String normalizedUserId = userId == null ? "" : userId.trim();
        String normalizedEmail = email == null ? "" : email.trim();
        if (!StringUtils.hasText(normalizedUserId) || !StringUtils.hasText(normalizedEmail)) {
            throw new BusinessException("Please enter your user ID and email.");
        }

        User legacyUser = null;
        try {
            legacyUser = userDao.selectUser(normalizedUserId);
        } catch (DataAccessException e) {
            log.warn("Legacy user lookup failed during password reset: {}", e.getMessage());
        }
        if (legacyUser != null && emailEquals(legacyUser.getEmail(), normalizedEmail)) {
            return new ResetTarget("LEGACY", legacyUser.getUserSeq().longValue(), legacyUser.getEmail(), legacyUser.getUserName());
        }

        SafUser safUser = safUserDao.selectByUserId(normalizedUserId);
        if (safUser != null && emailEquals(safUser.getEmail(), normalizedEmail)) {
            if (!SafUserStatus.ACTIVE.getCode().equals(safUser.getStatus())) {
                throw new BusinessException("You can reset your password after administrator approval.");
            }
            return new ResetTarget("SAF", safUser.getUserSeq(), safUser.getEmail(), safUser.getName());
        }

        throw new BusinessException("No matching account was found.");
    }

    private boolean emailEquals(String storedEmail, String inputEmail) {
        return storedEmail != null
                && inputEmail != null
                && storedEmail.trim().toLowerCase(Locale.ROOT).equals(inputEmail.trim().toLowerCase(Locale.ROOT));
    }

    private String createSixDigitCode() {
        return String.format("%06d", SECURE_RANDOM.nextInt(1_000_000));
    }

    private void clearSession(HttpSession session) {
        session.removeAttribute(SESSION_TARGET_TYPE);
        session.removeAttribute(SESSION_TARGET_USER_SEQ);
        session.removeAttribute(SESSION_CODE);
        session.removeAttribute(SESSION_EXPIRES_AT);
        session.removeAttribute(SESSION_VERIFIED);
    }

    private String renderTemplate(String template, Map<String, String> variables, boolean escapeHtml) {
        String rendered = template == null ? "" : template;
        for (Map.Entry<String, String> entry : variables.entrySet()) {
            String value = entry.getValue() == null ? "" : entry.getValue();
            if (escapeHtml) {
                value = HtmlUtils.htmlEscape(value, StandardCharsets.UTF_8.name());
            }
            rendered = rendered.replace("{{" + entry.getKey() + "}}", value);
        }
        return rendered;
    }

    private String defaultText(String value, String defaultValue) {
        return StringUtils.hasText(value) ? value : defaultValue;
    }

    private record ResetTarget(String type, Long userSeq, String email, String name) {
    }
}
