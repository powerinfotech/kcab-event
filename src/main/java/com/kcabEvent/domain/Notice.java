package com.kcabEvent.domain;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class Notice {
    private Long noticeSeq;
    private String title;
    private String content;
    private Integer viewCount;
    private String topYn;
    private String useYn;
    private Long fileSeq;
    private Long rgstUserSeq;
    private LocalDateTime rgstDateTime;
    private Long uptUserSeq;
    private LocalDateTime uptDateTime;
}
