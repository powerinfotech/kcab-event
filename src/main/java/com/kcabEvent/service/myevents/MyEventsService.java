package com.kcabEvent.service.myevents;

import com.kcabEvent.dto.participant.MyEventsSessionDto;
import jakarta.servlet.http.HttpSession;

public interface MyEventsService {
    /** 이메일에 등록 행사가 있으면 인증코드 발송, 없으면 BusinessException. */
    void requestCode(String email, HttpSession session);

    /** 인증코드 검증 후 5분 세션 시작 + 내 정보/행사 반환. */
    MyEventsSessionDto verifyAndStart(String email, String code, HttpSession session);

    /** 현재 유효한 세션의 내 정보/행사/남은 시간 반환 (만료 시 BusinessException). */
    MyEventsSessionDto getSession(HttpSession session);

    /** 세션을 5분 더 연장하고 갱신된 정보 반환 (만료 시 BusinessException). */
    MyEventsSessionDto extendSession(HttpSession session);
}
