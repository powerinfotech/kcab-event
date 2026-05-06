package com.kcabEvent.dto.page;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PageListDto {
    private Long pageSeq;
    private String pageNm;
    private String pageUrl;
    private String pageTitle;
    private String useYn;
    private Integer sortSeq;
    private Integer sectionCount;
    private LocalDateTime rgstDateTime;
    private LocalDateTime uptDateTime;
}
