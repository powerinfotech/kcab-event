package com.kcabEvent.domain;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PageSection {
    private Long sectionSeq;
    private Long pageSeq;
    private String sectionType;
    private String sectionData;
    private Integer sortSeq;
    private String useYn;
    private Long rgstUserSeq;
    private LocalDateTime rgstDateTime;
    private Long uptUserSeq;
    private LocalDateTime uptDateTime;
}
