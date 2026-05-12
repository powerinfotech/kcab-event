package com.kcabEvent.dto.noticenews;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class NoticeNewsDetailDto {
    private Long noticeNewsSeq;
    private String postType;
    private String title;
    private String content;
    private LocalDate postDate;
    private Integer viewCount;
    private String topYn;
    private LocalDate topStartDate;
    private LocalDate topEndDate;
    private String useYn;
    private Long fileSeq;
    private Long rgstUserSeq;
    private String rgstUserName;
    private LocalDateTime rgstDateTime;
    private Long uptUserSeq;
    private String uptUserName;
    private LocalDateTime uptDateTime;
}
