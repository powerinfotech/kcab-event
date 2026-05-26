package com.kcabEvent.dto.email;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailTemplatePreviewSendDto {
    private String recipientEmail;
    private String recipientName;
    private String subject;
    private String bodyHtml;
    private String topImageSrc;
}
