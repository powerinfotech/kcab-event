package com.kcabEvent.dto.email;

import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class EmailLogDetailDto {
    private Long emailLogSeq;
    private Long templateSeq;
    private Long registrationSeq;
    private String recipientEmail;
    private String recipientName;
    private String subject;
    private String bodyHtml;
    private String provider;
    private String providerMessageId;
    private String status;
    private String errorMessage;
    private Integer retryCount;
    private OffsetDateTime sentAt;
    private OffsetDateTime openedAt;
    private OffsetDateTime createdAt;
}
