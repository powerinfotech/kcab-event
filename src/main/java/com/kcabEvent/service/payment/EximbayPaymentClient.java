package com.kcabEvent.service.payment;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kcabEvent.exception.custom.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class EximbayPaymentClient {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${eximbay.api-base-url:https://api-test.eximbay.com}")
    private String apiBaseUrl;

    @Value("${eximbay.sdk-url:https://api-test.eximbay.com/v2/javascriptSDK.js}")
    private String sdkUrl;

    @Value("${eximbay.mid:1849705C64}")
    private String mid;

    @Value("${eximbay.api-key:test_1849705C642C217E0B2D}")
    private String apiKey;

    public EximbayPaymentClient(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder().build();
    }

    public String getMid() {
        return mid;
    }

    public String getSdkUrl() {
        return sdkUrl;
    }

    public Map<String, Object> ready(Map<String, Object> request) {
        return post("/v1/payments/ready", request);
    }

    public Map<String, Object> verify(String data) {
        Map<String, Object> request = new LinkedHashMap<>();
        request.put("data", data);
        return post("/v1/payments/verify", request);
    }

    public Map<String, Object> cancel(String transactionId,
                                      String refundId,
                                      BigDecimal refundAmount,
                                      String reason,
                                      String orderId,
                                      String currency,
                                      BigDecimal originalAmount,
                                      BigDecimal balance) {
        Map<String, Object> request = buildCancelRequest(
                refundId,
                refundAmount,
                reason,
                orderId,
                currency,
                originalAmount,
                balance
        );
        String encodedTransactionId = URLEncoder.encode(transactionId, StandardCharsets.UTF_8);
        return post("/v1/payments/" + encodedTransactionId + "/cancel", request);
    }

    public Map<String, Object> buildCancelRequest(String refundId,
                                                  BigDecimal refundAmount,
                                                  String reason,
                                                  String orderId,
                                                  String currency,
                                                  BigDecimal originalAmount,
                                                  BigDecimal balance) {
        Map<String, Object> refund = new LinkedHashMap<>();
        refund.put("refund_type", "F");
        refund.put("refund_amount", formatAmount(refundAmount));
        refund.put("refund_id", refundId);
        refund.put("reason", reason);

        Map<String, Object> payment = new LinkedHashMap<>();
        payment.put("order_id", orderId);
        payment.put("currency", currency);
        payment.put("amount", formatAmount(originalAmount));
        payment.put("balance", formatAmount(balance));
        payment.put("lang", "EN");

        Map<String, Object> request = new LinkedHashMap<>();
        request.put("mid", mid);
        request.put("refund", refund);
        request.put("payment", payment);
        return request;
    }

    public String toJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception e) {
            throw new BusinessException("Failed to serialize Eximbay payload.");
        }
    }

    public Map<String, Object> fromJsonMap(String value) {
        if (value == null || value.isBlank()) {
            return Map.of();
        }
        try {
            return objectMapper.readValue(value, new TypeReference<>() {});
        } catch (Exception e) {
            throw new BusinessException("Failed to parse Eximbay payload.");
        }
    }

    public String formatAmount(BigDecimal amount) {
        if (amount == null) {
            return "0";
        }
        return amount.stripTrailingZeros().toPlainString();
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> asMap(Object value) {
        if (value instanceof Map<?, ?> map) {
            Map<String, Object> result = new LinkedHashMap<>();
            for (Map.Entry<?, ?> entry : map.entrySet()) {
                if (entry.getKey() != null) {
                    result.put(String.valueOf(entry.getKey()), entry.getValue());
                }
            }
            return result;
        }
        return Map.of();
    }

    private Map<String, Object> post(String path, Map<String, Object> request) {
        try {
            Map<String, Object> response = restClient.post()
                    .uri(apiBaseUrl + path)
                    .header("Authorization", authorizationHeader())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(new ParameterizedTypeReference<>() {});
            return response != null ? response : Map.of();
        } catch (RestClientResponseException e) {
            throw new BusinessException(resolveErrorMessage(e.getResponseBodyAsString(), e.getMessage()));
        } catch (RuntimeException e) {
            if (e instanceof BusinessException) {
                throw e;
            }
            throw new BusinessException("Failed to call Eximbay API: " + e.getMessage());
        }
    }

    private String authorizationHeader() {
        String token = Base64.getEncoder().encodeToString((apiKey + ":").getBytes(StandardCharsets.UTF_8));
        return "Basic " + token;
    }

    private String resolveErrorMessage(String responseBody, String fallback) {
        if (responseBody == null || responseBody.isBlank()) {
            return "Eximbay API request failed: " + fallback;
        }
        try {
            Map<String, Object> body = objectMapper.readValue(responseBody, new TypeReference<>() {});
            Object resmsg = body.get("resmsg");
            Object rescode = body.get("rescode");
            if (resmsg != null) {
                return "Eximbay API request failed"
                        + (rescode != null ? " (" + rescode + ")" : "")
                        + ": " + resmsg;
            }
        } catch (Exception ignored) {
            // Use raw body below.
        }
        return "Eximbay API request failed: " + responseBody;
    }
}
