package com.kcabEvent.dto.page;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class PageDetailDto {
    private Long pageSeq;
    private String pageNm;
    private String pageUrl;
    private String pageTitle;
    private String pageDesc;
    private String useYn;
    private Integer sortSeq;
    private LocalDateTime rgstDateTime;
    private LocalDateTime uptDateTime;
    private List<SectionDto> sections;
}
