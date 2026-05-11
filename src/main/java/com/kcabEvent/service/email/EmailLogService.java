package com.kcabEvent.service.email;

public interface EmailLogService {
    String sendHtmlAndLog(
            String recipientEmail,
            String recipientName,
            String subject,
            String htmlContent,
            String logHtmlContent
    );

    String sendHtmlAndLog(
            Long templateSeq,
            String recipientEmail,
            String recipientName,
            String subject,
            String htmlContent,
            String logHtmlContent
    );
}
