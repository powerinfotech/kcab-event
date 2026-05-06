package com.kcabEvent.dto.notice;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class NoticeListDto {
    private Long noticeSeq;
    private String title;
    private Integer viewCount;
    private String topYn;
    private String useYn;
    private String rgstUserName;
    private LocalDateTime rgstDateTime;
}
