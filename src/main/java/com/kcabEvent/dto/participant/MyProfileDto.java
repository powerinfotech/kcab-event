package com.kcabEvent.dto.participant;

import lombok.Getter;
import lombok.Setter;

/** My Events: 인증한 참가자의 (최신 등록 기준) 프로필 정보. */
@Getter
@Setter
public class MyProfileDto {
    private String email;
    private String fullName;
    private String organizationName;
    private String position;
    private String country;
    private String nationality;
    private String residenceCountry;
    private String phone;
    private Integer totalEventCount;
}
