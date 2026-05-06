package com.kcabEvent.dto.page;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PageSaveDto {
    private Long pageSeq;

    @NotBlank(message = "페이지 이름을 입력해주세요.")
    private String pageNm;

    @NotBlank(message = "페이지 URL을 입력해주세요.")
    private String pageUrl;

    private String pageTitle;
    private String pageDesc;
    private String useYn;
    private Integer sortSeq;

    private List<SectionDto> sections;
}
