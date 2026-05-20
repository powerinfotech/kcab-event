package com.kcabEvent.domain;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class Popup {
    private Long popupSeq;
    private String title;
    private String content;
    private String status;
    private Integer sortSeq;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private Long createdBy;
    private LocalDateTime createdAt;
    private Long updatedBy;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
