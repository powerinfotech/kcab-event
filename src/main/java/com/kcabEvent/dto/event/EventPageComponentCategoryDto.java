package com.kcabEvent.dto.event;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventPageComponentCategoryDto {
    private Long componentCategorySeq;
    private String categoryCode;
    private String categoryName;
    private String description;
    private Integer sortSeq;
}
