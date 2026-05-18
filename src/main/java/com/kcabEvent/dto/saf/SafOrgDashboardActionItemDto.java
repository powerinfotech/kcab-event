package com.kcabEvent.dto.saf;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SafOrgDashboardActionItemDto {
    private String actionType;
    private String severity;
    private Long eventSeq;
    private String title;
    private String description;
    private LocalDateTime dueAt;
}
