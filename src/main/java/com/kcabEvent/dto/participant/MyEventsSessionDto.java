package com.kcabEvent.dto.participant;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/** My Events 인증 세션: 인증 후 5분 창 동안의 내 정보 + 등록 행사 + 남은 시간. */
@Getter
@Setter
public class MyEventsSessionDto {
    private String email;
    /** 세션 만료까지 남은 초 (프론트 카운트다운용) */
    private long expiresInSeconds;
    private MyProfileDto profile;
    private List<MyEventDto> events;
}
