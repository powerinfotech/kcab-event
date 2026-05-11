package com.kcabEvent.dto.email;

import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class EmailTemplateDetailDto {
    private Long templateSeq;
    private String code;
    private String name;
    private String subject;
    private String bodyHtml;
    private String variables;
    private Boolean isActive;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
