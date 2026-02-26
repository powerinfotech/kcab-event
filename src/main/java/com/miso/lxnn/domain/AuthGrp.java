package com.miso.lxnn.domain;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AuthGrp {
    private Integer authGrpSeq;
    private String authGrpNm;
    private String authGrpExpl;
    private String useYn;
    private Integer rgstUserSeq;
    private LocalDateTime rgstDateTime;
    private Integer uptUserSeq;
    private LocalDateTime uptDateTime;
}
