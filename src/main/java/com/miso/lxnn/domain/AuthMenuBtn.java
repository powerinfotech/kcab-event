package com.miso.lxnn.domain;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AuthMenuBtn {
    private Long authMenuBtnSeq;
    private Integer authGrpSeq;
    private Integer authSeq;
    private Integer menuSeq;
    private Long btnSeq;
    private String useYn;
    private Integer rgstUserSeq;
    private LocalDateTime rgstDateTime;
    private Integer uptUserSeq;
    private LocalDateTime uptDateTime;
}
