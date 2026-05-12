package com.kcabEvent.domain;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class NoticeNews {
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
    /** 첨부파일 그룹 (event.tb_file.file_seq) */
    private Long fileSeq;
    /** DB: event.notice_news.created_by */
    private Long rgstUserSeq;
    /** DB: event.notice_news.created_at */
    private LocalDateTime rgstDateTime;
    /** DB: event.notice_news.updated_by */
    private Long uptUserSeq;
    /** DB: event.notice_news.updated_at */
    private LocalDateTime uptDateTime;
}
