package com.kcabEvent.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class EmailLog {
    private Long emailLogSeq;
    private Long templateSeq;
    private String recipientEmail;
    private String recipientName;
    private String subject;
    private String bodyHtml;
    private String status;
    private String errorMessage;
    private Integer retryCount;

    @Builder
    public EmailLog(
            Long templateSeq,
            String recipientEmail,
            String recipientName,
            String subject,
            String bodyHtml,
            String status
    ) {
        this.templateSeq = templateSeq;
        this.recipientEmail = recipientEmail;
        this.recipientName = recipientName;
        this.subject = subject;
        this.bodyHtml = bodyHtml;
        this.status = status;
    }
}
