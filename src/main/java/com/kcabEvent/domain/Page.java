package com.kcabEvent.domain;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class Page {
    private Long pageSeq;
    private String pageNm;
    private String pageUrl;
    private String pageTitle;
    private String pageDesc;
    private String useYn;
    private Integer sortSeq;
    private Long rgstUserSeq;
    private LocalDateTime rgstDateTime;
    private Long uptUserSeq;
    private LocalDateTime uptDateTime;
}
