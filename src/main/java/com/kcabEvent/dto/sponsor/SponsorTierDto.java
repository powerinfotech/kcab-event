package com.kcabEvent.dto.sponsor;

import lombok.Getter;
import lombok.Setter;

/** SPONSOR_TIER 공통코드 옵션 (드롭다운용) */
@Getter
@Setter
public class SponsorTierDto {
    private String code;
    private String name;
    private Integer sortSeq;
}
