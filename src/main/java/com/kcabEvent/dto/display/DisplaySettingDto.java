package com.kcabEvent.dto.display;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/** 공개 노출 설정 조회/저장 DTO. availableYears 는 admin 조회 시에만 채운다. */
@Getter
@Setter
public class DisplaySettingDto {
    private Integer editionYear;
    private String showSponsors;
    /** 스폰서 데이터가 있는 연도 목록 (admin 콤보용) */
    private List<Integer> availableYears;
}
