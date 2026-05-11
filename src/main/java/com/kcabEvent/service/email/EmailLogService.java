package com.kcabEvent.service.email;

public interface EmailLogService {
    String sendHtmlAndLog(
            String recipientEmail,
            String recipientName,
            String subject,
            String htmlContent,
            String logHtmlContent
    );
}
