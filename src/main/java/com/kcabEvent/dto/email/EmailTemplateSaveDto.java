package com.kcabEvent.dto.email;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailTemplateSaveDto {
    private String subject;
    private String bodyHtml;
    private Boolean isActive;
}
