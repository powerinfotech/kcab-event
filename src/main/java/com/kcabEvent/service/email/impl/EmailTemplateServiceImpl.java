package com.kcabEvent.service.email.impl;

import com.kcabEvent.dao.EmailTemplateDao;
import com.kcabEvent.dto.email.EmailTemplateDetailDto;
import com.kcabEvent.dto.email.EmailTemplateListDto;
import com.kcabEvent.dto.email.EmailTemplatePreviewSendDto;
import com.kcabEvent.dto.email.EmailTemplateSaveDto;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.email.EmailLogService;
import com.kcabEvent.service.email.EmailTemplateService;
import com.kcabEvent.util.EmailHtmlLayout;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;

@Service("emailTemplateService")
public class EmailTemplateServiceImpl extends EgovAbstractServiceImpl implements EmailTemplateService {

    private static final List<DefaultTemplate> DEFAULT_TEMPLATES = List.of(
            new DefaultTemplate(
                    "signup_approval",
                    "Member Sign-up Approval",
                    "[KCAB International] Your administrator account has been approved",
                    """
                            <p>Hello {{user_name}},</p>
                            <p>Your administrator account for {{organization_name}} has been approved.</p>
                            <p>You can now sign in to the KCAB International Admin Console.</p>
                            <p><a href="{{login_url}}">Go to Admin Console</a></p>
                            """,
                    variables("user_name", "organization_name", "login_url")
            ),
            new DefaultTemplate(
                    "password_reset",
                    "Password Reset Verification",
                    "[KCAB International] Password reset verification code",
                    """
                            <p>Hello {{user_name}},</p>
                            <p>Please use the verification code below to reset your password.</p>
                            <p style="font-size:28px;font-weight:700;color:#1f5b95;letter-spacing:3px;">{{reset_code}}</p>
                            <p><strong>Never share this verification code with anyone else.</strong><br>This code will expire in {{expire_minutes}} minutes.</p>
                            """,
                    variables("user_name", "reset_code", "expire_minutes")
            ),
            new DefaultTemplate(
                    "side_event_participation_confirm",
                    "Side Event Participation Confirmation",
                    "[KCAB International] Registration confirmed for {{event_name}}",
                    """
                            <p>Hello {{participant_name}},</p>
                            <p>Your registration for the side event <strong>{{event_name}}</strong> has been confirmed.</p>
                            <p>Date and time: {{event_date}} {{event_time}}<br>Venue: {{venue}}</p>
                            <p>You can review your registration here: <a href="{{my_page_url}}">{{my_page_url}}</a></p>
                            """,
                    variables("participant_name", "event_name", "event_date", "event_time", "venue", "my_page_url")
            ),
            new DefaultTemplate(
                    "official_event_participation_confirm",
                    "Official Event Participation Confirmation",
                    "[KCAB International] Registration confirmed for {{event_name}}",
                    """
                            <p>Hello {{participant_name}},</p>
                            <p>Your registration for the official event <strong>{{event_name}}</strong> has been confirmed.</p>
                            <p>Date and time: {{event_date}} {{event_time}}<br>Venue: {{venue}}</p>
                            <p>Payment amount: {{amount}}</p>
                            <p>You can review your registration here: <a href="{{my_page_url}}">{{my_page_url}}</a></p>
                            """,
                    variables("participant_name", "event_name", "event_date", "event_time", "venue", "amount", "my_page_url")
            ),
            new DefaultTemplate(
                    "side_event_approved",
                    "Side Event Approval",
                    "[KCAB International] Your side event has been approved",
                    """
                            <p>Hello {{user_name}},</p>
                            <p>Your side event <strong>{{event_name}}</strong> has been approved.</p>
                            <p>Approved schedule: {{event_date}} {{event_time}}<br>Venue: {{venue}}</p>
                            <p>{{approval_comment}}</p>
                            """,
                    variables("user_name", "event_name", "event_date", "event_time", "venue", "approval_comment")
            ),
            new DefaultTemplate(
                    "side_event_rejected",
                    "Side Event Rejection",
                    "[KCAB International] Your side event request has not been approved",
                    """
                            <p>Hello {{user_name}},</p>
                            <p>Your side event request for <strong>{{event_name}}</strong> has not been approved.</p>
                            <p>Reason: {{rejection_reason}}</p>
                            <p>Please contact KCAB International if you need further assistance.</p>
                            """,
                    variables("user_name", "event_name", "rejection_reason")
            ),
            new DefaultTemplate(
                    "reminder",
                    "Reminder",
                    "[KCAB International] Reminder: {{event_name}}",
                    """
                            <p>Hello {{participant_name}},</p>
                            <p>This is a reminder for <strong>{{event_name}}</strong>.</p>
                            <p>Date and time: {{event_date}} {{event_time}}<br>Venue: {{venue}}</p>
                            <p>We look forward to seeing you.</p>
                            """,
                    variables("participant_name", "event_name", "event_date", "event_time", "venue")
            ),
            new DefaultTemplate(
                    "cancellation_notice",
                    "Cancellation Notice",
                    "[KCAB International] Cancellation notice for {{event_name}}",
                    """
                            <p>Hello {{participant_name}},</p>
                            <p>We regret to inform you that <strong>{{event_name}}</strong> has been cancelled.</p>
                            <p>Reason: {{cancel_reason}}</p>
                            <p>If payment was made, refund information will be provided separately.</p>
                            """,
                    variables("participant_name", "event_name", "cancel_reason")
            )
    );

    @Resource(name = "emailTemplateDao")
    private EmailTemplateDao emailTemplateDao;

    @Autowired
    private EmailLogService emailLogService;

    @Override
    @Transactional("transactionManager")
    public List<EmailTemplateListDto> selectTemplateList() {
        ensureDefaultTemplates();
        return emailTemplateDao.selectEmailTemplateList(templateCodes());
    }

    @Override
    @Transactional("transactionManager")
    public EmailTemplateDetailDto selectTemplateDetail(String code) {
        ensureDefaultTemplates();
        EmailTemplateDetailDto detail = emailTemplateDao.selectEmailTemplateDetail(code);
        if (detail == null) {
            throw new BusinessException("Email template was not found.");
        }
        return detail;
    }

    @Override
    @Transactional("transactionManager")
    public void updateTemplate(String code, EmailTemplateSaveDto saveDto) {
        if (!StringUtils.hasText(saveDto.getSubject())) {
            throw new BusinessException("Subject is required.");
        }
        if (!StringUtils.hasText(saveDto.getBodyHtml())) {
            throw new BusinessException("Body is required.");
        }

        saveDto.setSubject(saveDto.getSubject().trim());
        saveDto.setBodyHtml(sanitizeEditableHtml(saveDto.getBodyHtml()));
        if (saveDto.getIsActive() == null) {
            saveDto.setIsActive(true);
        }

        int updatedCount = emailTemplateDao.updateEmailTemplate(code, saveDto);
        if (updatedCount == 0) {
            throw new BusinessException("Email template was not found.");
        }
    }

    @Override
    @Transactional("transactionManager")
    public void sendPreviewEmail(String code, EmailTemplatePreviewSendDto sendDto) {
        if (sendDto == null) {
            throw new BusinessException("Email content is required.");
        }
        if (!StringUtils.hasText(sendDto.getRecipientEmail())) {
            throw new BusinessException("Recipient email is required.");
        }
        if (!StringUtils.hasText(sendDto.getSubject())) {
            throw new BusinessException("Subject is required.");
        }
        if (!StringUtils.hasText(sendDto.getBodyHtml())) {
            throw new BusinessException("Body is required.");
        }

        EmailTemplateDetailDto detail = selectTemplateDetail(code);
        String subject = sendDto.getSubject().trim();
        String bodyHtml = EmailHtmlLayout.wrapTemplateBody(sanitizeEditableHtml(sendDto.getBodyHtml()));

        emailLogService.sendHtmlAndLog(
                detail.getTemplateSeq(),
                sendDto.getRecipientEmail().trim(),
                StringUtils.hasText(sendDto.getRecipientName()) ? sendDto.getRecipientName().trim() : null,
                subject,
                bodyHtml,
                bodyHtml
        );
    }

    private void ensureDefaultTemplates() {
        DEFAULT_TEMPLATES.forEach(template -> emailTemplateDao.insertDefaultTemplateIfMissing(
                template.code(),
                template.name(),
                template.subject(),
                template.bodyHtml(),
                template.variables()
        ));
    }

    private List<String> templateCodes() {
        return DEFAULT_TEMPLATES.stream().map(DefaultTemplate::code).toList();
    }

    private String sanitizeEditableHtml(String html) {
        return html
                .replaceAll("(?is)<\\s*(script|iframe|object|embed|form|input|button|textarea|select)[^>]*>.*?<\\s*/\\s*\\1\\s*>", "")
                .replaceAll("(?is)<\\s*(script|iframe|object|embed|form|input|button|textarea|select)[^>]*/\\s*>", "")
                .replaceAll("(?i)\\s+on[a-z]+\\s*=\\s*\"[^\"]*\"", "")
                .replaceAll("(?i)\\s+on[a-z]+\\s*=\\s*'[^']*'", "")
                .replaceAll("(?i)javascript:", "");
    }

    private static String variables(String... keys) {
        return "[" + Arrays.stream(keys)
                .map(key -> """
                        {"key":"{{%s}}","description":"%s","sample":"%s"}\
                        """.formatted(key, labelFor(key), sampleFor(key)))
                .reduce((left, right) -> left + "," + right)
                .orElse("") + "]";
    }

    private static String labelFor(String key) {
        return switch (key) {
            case "user_name" -> "Administrator name";
            case "organization_name" -> "Organization name";
            case "login_url" -> "Admin console URL";
            case "reset_code" -> "Password reset verification code";
            case "expire_minutes" -> "Verification code expiration minutes";
            case "participant_name" -> "Participant name";
            case "event_name" -> "Event name";
            case "event_date" -> "Event date";
            case "event_time" -> "Event time";
            case "venue" -> "Venue";
            case "my_page_url" -> "My page URL";
            case "amount" -> "Payment amount";
            case "approval_comment" -> "Approval comment";
            case "rejection_reason" -> "Rejection reason";
            case "cancel_reason" -> "Cancellation reason";
            default -> key;
        };
    }

    private static String sampleFor(String key) {
        return switch (key) {
            case "user_name" -> "Alex Kim";
            case "organization_name" -> "ABC Law";
            case "login_url" -> "https://saf.kcabinternational.or.kr/admin";
            case "reset_code" -> "123456";
            case "expire_minutes" -> "5";
            case "participant_name" -> "Jordan Lee";
            case "event_name" -> "Seoul ADR Conference 2026";
            case "event_date" -> "September 10, 2026";
            case "event_time" -> "10:00 AM";
            case "venue" -> "Conrad Seoul";
            case "my_page_url" -> "https://saf.kcabinternational.or.kr/my-page";
            case "amount" -> "USD 200";
            case "approval_comment" -> "Your event page is ready to be published.";
            case "rejection_reason" -> "The requested schedule overlaps with another program.";
            case "cancel_reason" -> "The program has been cancelled by the host.";
            default -> "{{" + key + "}}";
        };
    }

    private record DefaultTemplate(String code, String name, String subject, String bodyHtml, String variables) {
    }
}
