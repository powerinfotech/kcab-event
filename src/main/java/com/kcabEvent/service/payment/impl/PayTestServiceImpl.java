package com.kcabEvent.service.payment.impl;

import com.kcabEvent.dao.PayTestDao;
import com.kcabEvent.domain.Payment;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.paymenttest.PayTestEventOptionDto;
import com.kcabEvent.dto.paymenttest.PayTestParticipantRequestDto;
import com.kcabEvent.dto.paymenttest.PayTestPrepareRequestDto;
import com.kcabEvent.dto.paymenttest.PayTestPrepareResponseDto;
import com.kcabEvent.dto.paymenttest.PayTestPricingOptionDto;
import com.kcabEvent.dto.paymenttest.PayTestResultDto;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.payment.EximbayPaymentClient;
import com.kcabEvent.service.payment.PayTestService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Enumeration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Service("payTestService")
public class PayTestServiceImpl extends EgovAbstractServiceImpl implements PayTestService {

    private static final DateTimeFormatter ORDER_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
    private static final DateTimeFormatter EXIMBAY_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    @Resource(name = "payTestDao")
    private PayTestDao payTestDao;

    private final EximbayPaymentClient eximbayPaymentClient;

    public PayTestServiceImpl(EximbayPaymentClient eximbayPaymentClient) {
        this.eximbayPaymentClient = eximbayPaymentClient;
    }

    @Override
    public List<PayTestEventOptionDto> selectPayTestEvents(LoginUser loginUser) {
        assertAdmin(loginUser);
        List<PayTestEventOptionDto> events = payTestDao.selectPayTestEvents();
        for (PayTestEventOptionDto event : events) {
            event.setPricingList(payTestDao.selectPayTestPricingOptions(event.getEventSeq()));
        }
        return events;
    }

    @Override
    @Transactional
    public PayTestPrepareResponseDto preparePayment(PayTestPrepareRequestDto request, LoginUser loginUser) {
        assertAdmin(loginUser);
        validatePrepareRequest(request);

        PayTestPricingOptionDto pricing = payTestDao.selectPayTestPricingForUpdate(
                request.getEventSeq(),
                request.getEventPricingSeq()
        );
        if (pricing == null) {
            throw new BusinessException("Selected pricing is not available for payment testing.");
        }

        PayTestParticipantRequestDto participant = request.getParticipant();
        participant.setEmail(participant.getEmail().toLowerCase(Locale.ROOT));
        Long participantSeq = payTestDao.upsertParticipant(participant);
        Long eventParticipantSeq = payTestDao.upsertEventParticipant(request.getEventSeq(), participantSeq);

        String orderId = buildOrderId();
        String callbackBaseUrl = normalizeCallbackBaseUrl(request.getCallbackBaseUrl());
        String statusUrl = callbackBaseUrl + "/api/public/pay-test/eximbay/status";
        String returnUrl = callbackBaseUrl + "/api/public/pay-test/eximbay/return?merchant_order_id=" + orderId;
        String lang = normalizeLang(request.getLang());
        String paymentMethod = normalizePaymentMethod(request.getPaymentMethod());
        String payerName = fullName(participant);
        Long userSeq = loginUser.getUserSeq() != null ? loginUser.getUserSeq().longValue() : null;

        Map<String, Object> eximbayRequest = buildEximbayRequest(
                orderId,
                pricing,
                payerName,
                participant.getEmail(),
                statusUrl,
                returnUrl,
                lang,
                paymentMethod
        );
        Map<String, Object> readyResponse = eximbayPaymentClient.ready(eximbayRequest);
        requireSuccess(readyResponse, "Failed to prepare Eximbay payment.");
        eximbayRequest.put("fgkey", readyResponse.get("fgkey"));

        Payment payment = new Payment();
        payment.setPgProvider("eximbay");
        payment.setPgMid(eximbayPaymentClient.getMid());
        payment.setPgOrderId(orderId);
        payment.setAmount(pricing.getAmount());
        payment.setCurrency(pricing.getCurrencyCode());
        payment.setPaymentMethod("card");
        payment.setStatus("pending");
        payment.setRawResponse(eximbayPaymentClient.toJson(Map.of(
                "readyRequest", eximbayRequest,
                "readyResponse", readyResponse
        )));
        payment.setEventSeq(pricing.getEventSeq());
        payment.setEventParticipantSeq(eventParticipantSeq);
        payment.setParticipantSeq(participantSeq);
        payment.setPayerName(payerName);
        payment.setPayerEmail(participant.getEmail());
        payment.setPayerCountry(participant.getCountry());
        payment.setEventPricingSeq(pricing.getEventPricingSeq());
        payment.setOriginalAmount(pricing.getAmount());
        payment.setDiscountAmount(BigDecimal.ZERO);
        payment.setRefundedAmount(BigDecimal.ZERO);
        payment.setCreatedBy(userSeq);
        payment.setUpdatedBy(userSeq);
        payTestDao.insertPendingPayment(payment);

        PayTestPrepareResponseDto response = new PayTestPrepareResponseDto();
        response.setPaymentSeq(payment.getPaymentSeq());
        response.setOrderId(orderId);
        response.setSdkUrl(eximbayPaymentClient.getSdkUrl());
        response.setEximbayRequest(eximbayRequest);
        response.setPayment(payTestDao.selectPayTestResultByOrderId(orderId));
        return response;
    }

    @Override
    public PayTestResultDto selectResult(String orderId, LoginUser loginUser) {
        assertAdmin(loginUser);
        if (!StringUtils.hasText(orderId)) {
            throw new BusinessException("Order ID is required.");
        }
        PayTestResultDto result = payTestDao.selectPayTestResultByOrderId(orderId.trim());
        if (result == null) {
            throw new BusinessException("Payment test order was not found.");
        }
        return result;
    }

    @Override
    @Transactional
    public String processEximbayStatus(HttpServletRequest request) {
        Map<String, String> params = extractParams(request);
        String orderId = params.get("order_id");
        if (!StringUtils.hasText(orderId)) {
            return "IGNORED";
        }

        Payment current = payTestDao.selectPaymentByOrderIdForUpdate(orderId);
        if (current == null) {
            return "UNKNOWN_ORDER";
        }

        String data = buildVerificationData(request, params);
        Map<String, Object> verifyResponse = eximbayPaymentClient.verify(data);
        boolean verified = "0000".equals(String.valueOf(verifyResponse.get("rescode")));
        boolean callbackSuccess = "0000".equals(params.get("rescode"));

        Payment update = new Payment();
        update.setPgOrderId(orderId);
        update.setPgTransactionId(params.get("transaction_id"));
        update.setAmount(parseAmount(params.get("amount"), current.getAmount()));
        update.setCurrency(defaultText(params.get("currency"), current.getCurrency()));
        update.setPaymentMethod("card");
        update.setCardCompany(cardCompany(params.get("payment_method")));
        update.setCardLast4(params.get("card_number4"));
        update.setStatus(verified && callbackSuccess ? "paid" : "failed");
        update.setPaidAt(verified && callbackSuccess ? parseEximbayDate(params.get("transaction_date")) : null);
        update.setFailedReason(verified && callbackSuccess ? null : defaultText(params.get("resmsg"), String.valueOf(verifyResponse.get("resmsg"))));
        update.setPgResponseCode(params.get("rescode"));
        update.setPgResponseMessage(params.get("resmsg"));
        update.setVerifiedAt(verified ? LocalDateTime.now() : null);
        update.setWebhookReceivedAt(LocalDateTime.now());
        update.setSettleAmount(parseAmount(params.get("base_amount"), null));
        update.setSettleCurrency(params.get("base_currency"));
        update.setFxRate(parseAmount(params.get("base_rate"), null));
        update.setApprovalNo(params.get("auth_code"));
        update.setInstallmentMonths(parseInteger(params.get("installment_months")));
        update.setUpdatedBy(current.getUpdatedBy());
        update.setRawResponse(eximbayPaymentClient.toJson(Map.of(
                "callback", params,
                "verifyResponse", verifyResponse
        )));
        payTestDao.updatePaymentFromCallback(update);
        return "OK";
    }

    private void validatePrepareRequest(PayTestPrepareRequestDto request) {
        if (request == null) {
            throw new BusinessException("Payment test request is required.");
        }
        if (request.getEventSeq() == null || request.getEventPricingSeq() == null) {
            throw new BusinessException("Please select an event and pricing.");
        }
        PayTestParticipantRequestDto participant = request.getParticipant();
        if (participant == null) {
            throw new BusinessException("Participant information is required.");
        }
        if (!StringUtils.hasText(participant.getEmail())
                || !StringUtils.hasText(participant.getFirstName())
                || !StringUtils.hasText(participant.getLastName())) {
            throw new BusinessException("Participant first name, last name, and email are required.");
        }
        String email = participant.getEmail().trim();
        if (!email.contains("@")) {
            throw new BusinessException("Please enter a valid participant email.");
        }
        participant.setEmail(email);
    }

    private Map<String, Object> buildEximbayRequest(String orderId,
                                                    PayTestPricingOptionDto pricing,
                                                    String payerName,
                                                    String email,
                                                    String statusUrl,
                                                    String returnUrl,
                                                    String lang,
                                                    String paymentMethod) {
        Map<String, Object> payment = new LinkedHashMap<>();
        payment.put("transaction_type", "PAYMENT");
        payment.put("order_id", orderId);
        payment.put("currency", pricing.getCurrencyCode());
        payment.put("amount", eximbayPaymentClient.formatAmount(pricing.getAmount()));
        payment.put("lang", lang);
        payment.put("payment_method", paymentMethod);

        Map<String, Object> merchant = new LinkedHashMap<>();
        merchant.put("mid", eximbayPaymentClient.getMid());

        Map<String, Object> buyer = new LinkedHashMap<>();
        buyer.put("name", payerName);
        buyer.put("email", email);

        Map<String, Object> url = new LinkedHashMap<>();
        url.put("return_url", returnUrl);
        url.put("status_url", statusUrl);

        Map<String, Object> otherParam = new LinkedHashMap<>();
        otherParam.put("param1", "KCAB_PAY_TEST");

        Map<String, Object> request = new LinkedHashMap<>();
        request.put("payment", payment);
        request.put("merchant", merchant);
        request.put("buyer", buyer);
        request.put("url", url);
        request.put("other_param", otherParam);
        return request;
    }

    private void requireSuccess(Map<String, Object> response, String message) {
        if (!"0000".equals(String.valueOf(response.get("rescode")))) {
            throw new BusinessException(message + " " + response.getOrDefault("resmsg", ""));
        }
    }

    private String buildOrderId() {
        String random = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));
        return "KCAB" + LocalDateTime.now().format(ORDER_FORMATTER) + random;
    }

    private String normalizeCallbackBaseUrl(String value) {
        if (!StringUtils.hasText(value)) {
            throw new BusinessException("Callback base URL is required for Eximbay testing.");
        }
        String text = value.trim().replaceAll("/+$", "");
        if (!text.startsWith("http://") && !text.startsWith("https://")) {
            throw new BusinessException("Callback base URL must start with http:// or https://.");
        }
        return text;
    }

    private String normalizeLang(String lang) {
        if (!StringUtils.hasText(lang)) {
            return "EN";
        }
        String value = lang.trim().toUpperCase(Locale.ROOT);
        return value.length() > 2 ? value.substring(0, 2) : value;
    }

    private String normalizePaymentMethod(String paymentMethod) {
        if (!StringUtils.hasText(paymentMethod)) {
            return "P000";
        }
        String value = paymentMethod.trim().toUpperCase(Locale.ROOT);
        return "P000".equals(value) ? value : "P000";
    }

    private String fullName(PayTestParticipantRequestDto participant) {
        return java.util.stream.Stream.of(participant.getFirstName(), participant.getMiddleName(), participant.getLastName())
                .filter(StringUtils::hasText)
                .map(String::trim)
                .reduce((left, right) -> left + " " + right)
                .orElse(participant.getEmail());
    }

    private Map<String, String> extractParams(HttpServletRequest request) {
        Map<String, String> params = new LinkedHashMap<>();
        Enumeration<String> names = request.getParameterNames();
        while (names.hasMoreElements()) {
            String name = names.nextElement();
            params.put(name, request.getParameter(name));
        }
        return params;
    }

    private String buildVerificationData(HttpServletRequest request, Map<String, String> params) {
        String rawQuery = request.getQueryString();
        if (StringUtils.hasText(rawQuery)) {
            return rawQuery;
        }
        return params.entrySet().stream()
                .filter(entry -> entry.getKey() != null && entry.getValue() != null)
                .map(entry -> encode(entry.getKey()) + "=" + encode(entry.getValue()))
                .reduce((left, right) -> left + "&" + right)
                .orElse("");
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private BigDecimal parseAmount(String value, BigDecimal defaultValue) {
        if (!StringUtils.hasText(value)) {
            return defaultValue;
        }
        try {
            return new BigDecimal(value.trim());
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    private Integer parseInteger(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        try {
            return Integer.valueOf(value.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private LocalDateTime parseEximbayDate(String value) {
        if (!StringUtils.hasText(value)) {
            return LocalDateTime.now();
        }
        try {
            return LocalDateTime.parse(value.trim(), EXIMBAY_DATE_FORMATTER);
        } catch (RuntimeException e) {
            return LocalDateTime.now();
        }
    }

    private String cardCompany(String paymentMethod) {
        if (!StringUtils.hasText(paymentMethod)) {
            return "Eximbay";
        }
        return switch (paymentMethod) {
            case "P101" -> "VISA";
            case "P102" -> "MasterCard";
            case "P103" -> "AMEX";
            case "P104" -> "JCB";
            case "P106" -> "Diners";
            case "P107" -> "Discover";
            case "P109" -> "UnionPay";
            default -> "Eximbay";
        };
    }

    private String defaultText(String value, String defaultValue) {
        return StringUtils.hasText(value) ? value : defaultValue;
    }

    private void assertAdmin(LoginUser loginUser) {
        if (loginUser == null || !"Y".equals(loginUser.getAdmYn())) {
            throw new BusinessException("Only administrators can use Pay Test.");
        }
        if (loginUser.getUserSeq() == null) {
            throw new BusinessException("Login session is invalid.");
        }
    }
}
