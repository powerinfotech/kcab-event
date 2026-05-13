package com.kcabEvent.dto.email;

import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class EmailLogListDto {
    private Long emailLogSeq;
    private Long templateSeq;
    private String templateCode;
    private String templateName;
    private String recipientEmail;
    private String recipientName;
    private String subject;
    private String status;
    private String errorMessage;
    private Integer retryCount;
    private OffsetDateTime sentAt;
    private OffsetDateTime openedAt;
    private OffsetDateTime createdAt;
}
