package com.miso.lxnn.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserMenuAuthGroupListDto {
    private Integer authGrpSeq;
    private String authGrpCd;
    private String authGrpNm;
    private String authGrpDesc;
    private Boolean useFlag;
}
