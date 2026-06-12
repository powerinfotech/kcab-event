package com.kcabEvent.domain;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/** 공개 사이트 노출 설정 (단일 행, setting_id=1). */
@Getter
@Setter
public class PublicDisplaySetting {
    private Integer settingId;
    /** 공개로 보여줄 연도 (전역 1개) */
    private Integer editionYear;
    /** 스폰서 메뉴/페이지 노출 Y/N */
    private String showSponsors;
    private Long uptUserSeq;
    private LocalDateTime uptDateTime;
}
