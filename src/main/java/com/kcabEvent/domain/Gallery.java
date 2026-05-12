package com.kcabEvent.domain;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class Gallery {
    private Long gallerySeq;
    private String title;
    private Integer galleryYear;
    private String description;
    private Long fileSeq;
    private Integer sortSeq;
    private String useYn;
    private Long rgstUserSeq;
    private LocalDateTime rgstDateTime;
    private Long uptUserSeq;
    private LocalDateTime uptDateTime;
}
