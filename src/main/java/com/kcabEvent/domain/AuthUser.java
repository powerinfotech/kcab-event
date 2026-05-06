package com.kcabEvent.domain;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AuthUser {
    private Integer authUserSeq;
    private Integer authGrpSeq;
    private Integer authSeq;
    private Integer userSeq;
    private String strDt;
    private String endDt;
    private String useYn;
    private Integer rgstUserSeq;
    private LocalDateTime rgstDateTime;
    private Integer uptUserSeq;
    private LocalDateTime uptDateTime;
}
