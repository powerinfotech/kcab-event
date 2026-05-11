package com.kcabEvent.dto.email;

import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class EmailTemplateListDto {
    private Long templateSeq;
    private String code;
    private String name;
    private String subject;
    private Boolean isActive;
    private OffsetDateTime updatedAt;
}
