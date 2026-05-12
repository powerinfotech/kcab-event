package com.kcabEvent.dto.noticenews;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class NoticeNewsSaveDto {
    private Long noticeNewsSeq;

    @NotBlank(message = "Post type is required.")
    private String postType;

    @NotBlank(message = "Title is required.")
    private String title;

    private String content;

    @NotNull(message = "Post date is required.")
    private LocalDate postDate;

    private String topYn;
    private LocalDate topStartDate;
    private LocalDate topEndDate;
    private String useYn;
    private Long fileSeq;
}
