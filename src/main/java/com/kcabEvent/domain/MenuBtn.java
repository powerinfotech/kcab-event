package com.kcabEvent.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MenuBtn {
    private Long menuBtnSeq;
    private Long menuSeq;
    private Long btnSeq;
    private String btnNm;
    private String useYn;
    private Long rgstUserSeq;
    private Long uptUserSeq;
}
