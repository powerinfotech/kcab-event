package com.kcabEvent.domain;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class Auth {
    private Integer authSeq;
    private Integer authGrpSeq;
    private String authNm;
    private String authExpl;
    private String useYn;
    private Integer rgstUserSeq;
    private LocalDateTime rgstDateTime;
    private Integer uptUserSeq;
    private LocalDateTime uptDateTime;
}
