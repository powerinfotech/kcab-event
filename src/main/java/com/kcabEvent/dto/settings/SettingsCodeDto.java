package com.kcabEvent.dto.settings;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SettingsCodeDto {
    private Long comCdSeq;
    private Long comGrpCdSeq;
    private String comGrpCd;
    private String comCd;
    private String comCdNm;
    private String comCdDesc;
    private String refval01;
    private String refval02;
    private String refval03;
    private Integer sortSeq;
    private Long organizationCount;
    private Long currentEventCount;
    private String iudType;
    private Long updatedBy;
}
