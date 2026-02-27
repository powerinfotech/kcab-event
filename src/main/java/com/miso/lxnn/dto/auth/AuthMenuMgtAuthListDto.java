package com.miso.lxnn.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthMenuMgtAuthListDto {
    private Integer authSeq;
    private Integer authGrpSeq;
    private String authGrpNm;
    private String authNm;
    private String authExpl;
    private String useYn;
}
