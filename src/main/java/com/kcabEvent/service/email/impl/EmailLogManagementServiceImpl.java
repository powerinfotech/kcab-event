package com.kcabEvent.service.email.impl;

import com.kcabEvent.dao.EmailLogDao;
import com.kcabEvent.dto.email.EmailLogDetailDto;
import com.kcabEvent.dto.email.EmailLogListDto;
import com.kcabEvent.dto.email.EmailLogResendRequestDto;
import com.kcabEvent.dto.email.EmailLogResendResultDto;
import com.kcabEvent.dto.email.EmailLogSearchDto;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.email.EmailLogManagementService;
import com.kcabEvent.util.BrevoMailUtil;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Slf4j
@Service("emailLogManagementService")
public class EmailLogManagementServiceImpl extends EgovAbstractServiceImpl implements EmailLogManagementService {

    private static final int ERROR_MESSAGE_MAX_LENGTH = 4000;

    @Resource(name = "emailLogDao")
    private EmailLogDao emailLogDao;

    @Autowired
    private BrevoMailUtil brevoMailUtil;

    @Override
    public List<EmailLogListDto> selectEmailLogList(EmailLogSearchDto searchDto) {
        EmailLogSearchDto safeSearchDto = searchDto == null ? new EmailLogSearchDto() : searchDto;
        Integer limit = safeSearchDto.getLimit();
        if (limit == null) {
            safeSearchDto.setLimit(100);
        } else if (limit < 1) {
            safeSearchDto.setLimit(1);
        } else if (limit > 500) {
            safeSearchDto.setLimit(500);
        }
        return emailLogDao.selectEmailLogList(safeSearchDto);
    }

    @Override
    public EmailLogDetailDto selectEmailLogDetail(Long emailLogSeq) {
        EmailLogDetailDto detail = emailLogDao.selectEmailLogDetail(emailLogSeq);
        if (detail == null) {
            throw new BusinessException("Email log was not found.");
        }
        return detail;
    }

    @Override
    @Transactional("transactionManager")
    public EmailLogResendResultDto resendEmailLogs(EmailLogResendRequestDto requestDto) {
        List<Long> emailLogSeqs = requestDto == null ? null : requestDto.getEmailLogSeqs();
        if (emailLogSeqs == null || emailLogSeqs.isEmpty()) {
            throw new BusinessException("Please select email logs to resend.");
        }

        int successCount = 0;
        int failedCount = 0;

        for (Long emailLogSeq : emailLogSeqs) {
            if (emailLogSeq == null) {
                failedCount++;
                continue;
            }

            EmailLogDetailDto detail = emailLogDao.selectEmailLogDetail(emailLogSeq);
            if (detail == null) {
                failedCount++;
                continue;
            }

            try {
                validateResendTarget(detail);
                brevoMailUtil.sendHtmlEmail(
                        detail.getRecipientEmail(),
                        detail.getSubject(),
                        detail.getBodyHtml()
                );
                emailLogDao.updateEmailLogResent(emailLogSeq);
                successCount++;
            } catch (RuntimeException e) {
                failedCount++;
                log.warn("Failed to resend email log. emailLogSeq={}", emailLogSeq, e);
                emailLogDao.updateEmailLogResendFailed(emailLogSeq, abbreviate(e.getMessage()));
            }
        }

        return new EmailLogResendResultDto(emailLogSeqs.size(), successCount, failedCount);
    }

    private void validateResendTarget(EmailLogDetailDto detail) {
        if (!StringUtils.hasText(detail.getRecipientEmail())) {
            throw new BusinessException("Recipient email is required.");
        }
        if (!StringUtils.hasText(detail.getSubject())) {
            throw new BusinessException("Subject is required.");
        }
        if (!StringUtils.hasText(detail.getBodyHtml())) {
            throw new BusinessException("Body is required.");
        }
    }

    private String abbreviate(String message) {
        if (message == null || message.length() <= ERROR_MESSAGE_MAX_LENGTH) {
            return message;
        }
        return message.substring(0, ERROR_MESSAGE_MAX_LENGTH);
    }
}
