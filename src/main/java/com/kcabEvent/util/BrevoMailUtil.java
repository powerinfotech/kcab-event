package com.kcabEvent.util;

import com.kcabEvent.exception.custom.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Slf4j
@Component
public class BrevoMailUtil {

    private final RestClient restClient = RestClient.builder().build();

    @Value("${brevo.api.key:}")
    private String apiKey;

    @Value("${brevo.api.url:https://api.brevo.com/v3/smtp/email}")
    private String apiUrl;

    @Value("${brevo.sender.name:KCAB International}")
    private String senderName;

    @Value("${brevo.sender.email:international@kcab.or.kr}")
    private String senderEmail;

    public String sendHtmlEmail(String recipientEmail, String subject, String htmlContent) {
        if (!StringUtils.hasText(apiKey)) {
            log.warn("[BrevoMailUtil] Brevo API key is not configured. recipient={}", recipientEmail);
            throw new BusinessException("Email service is not configured.");
        }
        if (!StringUtils.hasText(recipientEmail)) {
            throw new BusinessException("Recipient email is required.");
        }

        Map<String, Object> body = buildEmailApiBody(recipientEmail, subject, htmlContent);
        log.info("[BrevoMailUtil] Sending email. recipient={}, subject={}", recipientEmail, subject);

        try {
            Map<?, ?> response = restClient.post()
                    .uri(apiUrl)
                    .header("api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            String messageId = response == null ? "" : Objects.toString(response.get("messageId"), "");
            if (!StringUtils.hasText(messageId)) {
                log.warn("[BrevoMailUtil] Brevo response has no messageId. recipient={}", recipientEmail);
                throw new BusinessException("Failed to send verification email.");
            }
            log.info("[BrevoMailUtil] Email sent. recipient={}", recipientEmail);
            return messageId;
        } catch (RestClientResponseException e) {
            String responseBody = Objects.toString(e.getResponseBodyAsString(), "");
            log.error(
                    "[BrevoMailUtil] Failed to send email. recipient={}, subject={}, status={}, response={}",
                    recipientEmail,
                    subject,
                    e.getStatusCode(),
                    abbreviate(responseBody),
                    e
            );
            if (responseBody.contains("unrecognised IP address")) {
                throw new BusinessException("Brevo authorized IP setting is required.");
            }
            throw new BusinessException("Failed to send verification email.");
        } catch (RestClientException e) {
            log.error("[BrevoMailUtil] Failed to send email. recipient={}, subject={}", recipientEmail, subject, e);
            throw new BusinessException("Failed to send verification email.");
        }
    }

    private Map<String, Object> buildEmailApiBody(String recipientEmail, String subject, String htmlContent) {
        Map<String, Object> body = new HashMap<>();

        Map<String, Object> sender = new HashMap<>();
        sender.put("name", senderName);
        sender.put("email", senderEmail);
        body.put("sender", sender);

        Map<String, Object> recipient = new HashMap<>();
        recipient.put("email", recipientEmail);
        body.put("to", Arrays.asList(recipient));

        body.put("subject", subject);
        body.put("htmlContent", htmlContent);

        return body;
    }

    private String abbreviate(String value) {
        if (value == null || value.length() <= 500) {
            return value;
        }
        return value.substring(0, 500) + "...";
    }
}
