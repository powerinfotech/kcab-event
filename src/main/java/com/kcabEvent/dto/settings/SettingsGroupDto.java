package com.kcabEvent.dto.settings;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SettingsGroupDto {
    private Long comGrpCdSeq;
    private String comGrpCd;
    private String comGrpCdNm;
    private String comGrpCdDesc;
    private String ref01;
    private String ref02;
    private String ref03;
    private Integer sortSeq;
    private String iudType;
    private Long updatedBy;
}
