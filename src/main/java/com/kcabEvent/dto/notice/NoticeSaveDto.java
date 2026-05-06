package com.kcabEvent.dto.notice;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoticeSaveDto {
    private Long noticeSeq;

    @NotBlank(message = "제목을 입력해주세요.")
    private String title;

    private String content;
    private String topYn;
    private String useYn;
    private Long fileSeq;
}
