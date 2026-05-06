package com.kcabEvent.dto.event;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EventSaveDto {
    private Long eventSeq;

    @NotBlank(message = "행사명을 입력해주세요.")
    private String title;

    private String content;
    private String summary;
    private String thumbnailUrl;
    private LocalDate eventStartDt;
    private LocalDate eventEndDt;
    private String location;
    private String registrationUrl;
    private String status;
    private String useYn;
    private Long fileSeq;
}
