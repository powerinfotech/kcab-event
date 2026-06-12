package com.kcabEvent.service.myevents.impl;

import com.kcabEvent.dao.ParticipantDao;
import com.kcabEvent.dto.participant.MyEventsSessionDto;
import com.kcabEvent.dto.saf.SafEmailVerificationSendRequestDto;
import com.kcabEvent.dto.saf.SafEmailVerificationVerifyRequestDto;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.myevents.MyEventsService;
import com.kcabEvent.service.saf.SafEmailVerificationService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.OffsetDateTime;

@Service("myEventsService")
public class MyEventsServiceImpl implements MyEventsService {

    /** SafEmailVerificationService 의 purpose 키 (코드 세션 격리용) */
    private static final String PURPOSE = "my-events";

    /** 인증 후 유효 세션(분) */
    private static final int SESSION_MINUTES = 5;
    private static final String SESSION_EMAIL = "myEventsSessionEmail";
    private static final String SESSION_EXPIRES_AT = "myEventsSessionExpiresAt";

    @Resource(name = "participantDao")
    private ParticipantDao participantDao;

    @Resource(name = "safEmailVerificationService")
    private SafEmailVerificationService safEmailVerificationService;

    @Override
    public void requestCode(String email, HttpSession session) {
        String normalized = normalize(email);
        if (normalized.isEmpty()) {
            throw new BusinessException("Please enter an email address.");
        }
        if (!participantDao.existsByEmail(normalized)) {
            throw new BusinessException("We couldn't find any event registrations for this email address.");
        }
        SafEmailVerificationSendRequestDto dto = new SafEmailVerificationSendRequestDto();
        dto.setEmail(normalized);
        dto.setPurpose(PURPOSE);
        safEmailVerificationService.sendCode(dto, session);
    }

    @Override
    public MyEventsSessionDto verifyAndStart(String email, String code, HttpSession session) {
        String normalized = normalize(email);
        SafEmailVerificationVerifyRequestDto dto = new SafEmailVerificationVerifyRequestDto();
        dto.setEmail(normalized);
        dto.setCode(code == null ? "" : code.trim());
        dto.setPurpose(PURPOSE);
        safEmailVerificationService.verifyCode(dto, session); // 코드 불일치/만료 시 BusinessException

        OffsetDateTime expiresAt = OffsetDateTime.now().plusMinutes(SESSION_MINUTES);
        session.setAttribute(SESSION_EMAIL, normalized);
        session.setAttribute(SESSION_EXPIRES_AT, expiresAt);
        safEmailVerificationService.clear(session, PURPOSE); // 1회성 코드 정리
        return buildSession(normalized, expiresAt);
    }

    @Override
    public MyEventsSessionDto getSession(HttpSession session) {
        // 복원용: 유효 세션이 없으면 (조용히) null 반환 — 첫 방문 시 에러 토스트 방지.
        String email = (String) session.getAttribute(SESSION_EMAIL);
        OffsetDateTime expiresAt = currentExpiry(session);
        if (email == null || expiresAt == null || OffsetDateTime.now().isAfter(expiresAt)) {
            clearSession(session);
            return null;
        }
        return buildSession(email, expiresAt);
    }

    @Override
    public MyEventsSessionDto extendSession(HttpSession session) {
        String email = requireValidSession(session);
        OffsetDateTime expiresAt = OffsetDateTime.now().plusMinutes(SESSION_MINUTES);
        session.setAttribute(SESSION_EXPIRES_AT, expiresAt);
        return buildSession(email, expiresAt);
    }

    /** 세션이 유효하면 이메일 반환, 아니면 정리 후 예외. */
    private String requireValidSession(HttpSession session) {
        String email = (String) session.getAttribute(SESSION_EMAIL);
        OffsetDateTime expiresAt = currentExpiry(session);
        if (email == null || expiresAt == null || OffsetDateTime.now().isAfter(expiresAt)) {
            clearSession(session);
            throw new BusinessException("Your session has expired. Please verify your email again.");
        }
        return email;
    }

    private OffsetDateTime currentExpiry(HttpSession session) {
        Object value = session.getAttribute(SESSION_EXPIRES_AT);
        return value instanceof OffsetDateTime ? (OffsetDateTime) value : null;
    }

    private MyEventsSessionDto buildSession(String email, OffsetDateTime expiresAt) {
        MyEventsSessionDto dto = new MyEventsSessionDto();
        dto.setEmail(email);
        long remaining = expiresAt == null ? 0 : Duration.between(OffsetDateTime.now(), expiresAt).getSeconds();
        dto.setExpiresInSeconds(Math.max(0, remaining));
        dto.setProfile(participantDao.selectMyProfile(email));
        dto.setEvents(participantDao.selectMyEvents(email));
        return dto;
    }

    private void clearSession(HttpSession session) {
        session.removeAttribute(SESSION_EMAIL);
        session.removeAttribute(SESSION_EXPIRES_AT);
    }

    private String normalize(String email) {
        return email == null ? "" : email.trim();
    }
}
