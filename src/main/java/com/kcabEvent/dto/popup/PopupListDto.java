package com.kcabEvent.dto.popup;

import com.kcabEvent.enums.IudType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PopupListDto {
    private Long popupSeq;
    private String title;
    private String content;
    private String status;
    private Integer sortSeq;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private IudType iudType;
}
