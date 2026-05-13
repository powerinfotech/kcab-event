package com.kcabEvent.service.email.impl;

import com.kcabEvent.dao.EmailLogDao;
import com.kcabEvent.domain.EmailLog;
import com.kcabEvent.service.email.EmailLogService;
import com.kcabEvent.util.BrevoMailUtil;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailLogServiceImpl implements EmailLogService {

    private static final int ERROR_MESSAGE_MAX_LENGTH = 4000;

    private final BrevoMailUtil brevoMailUtil;

    @Resource(name = "emailLogDao")
    private EmailLogDao emailLogDao;

    @Override
    public String sendHtmlAndLog(
            String recipientEmail,
            String recipientName,
            String subject,
            String htmlContent,
            String logHtmlContent
    ) {
        return sendHtmlAndLog(null, recipientEmail, recipientName, subject, htmlContent, logHtmlContent);
    }

    @Override
    public String sendHtmlAndLog(
            Long templateSeq,
            String recipientEmail,
            String recipientName,
            String subject,
            String htmlContent,
            String logHtmlContent
    ) {
        EmailLog emailLog = EmailLog.builder()
                .templateSeq(templateSeq)
                .recipientEmail(recipientEmail)
                .recipientName(recipientName)
                .subject(subject)
                .bodyHtml(logHtmlContent != null ? logHtmlContent : htmlContent)
                .status("queued")
                .build();

        emailLogDao.insertEmailLog(emailLog);

        try {
            String messageId = brevoMailUtil.sendHtmlEmail(recipientEmail, subject, htmlContent);
            emailLogDao.updateEmailLogSent(emailLog.getEmailLogSeq());
            return messageId;
        } catch (RuntimeException e) {
            markFailed(emailLog.getEmailLogSeq(), e);
            throw e;
        }
    }

    private void markFailed(Long emailLogSeq, RuntimeException cause) {
        try {
            emailLogDao.updateEmailLogFailed(emailLogSeq, abbreviate(cause.getMessage()));
        } catch (RuntimeException logException) {
            log.warn("Failed to update email log status. emailLogSeq={}", emailLogSeq, logException);
        }
    }

    private String abbreviate(String message) {
        if (message == null || message.length() <= ERROR_MESSAGE_MAX_LENGTH) {
            return message;
        }
        return message.substring(0, ERROR_MESSAGE_MAX_LENGTH);
    }
}
