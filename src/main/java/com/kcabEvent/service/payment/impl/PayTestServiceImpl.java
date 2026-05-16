package com.kcabEvent.service.payment.impl;

import com.kcabEvent.dao.PayTestDao;
import com.kcabEvent.domain.Payment;
import com.kcabEvent.domain.PaymentIntent;
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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;

@Service("payTestService")
public class PayTestServiceImpl extends EgovAbstractServiceImpl implements PayTestService {

    private static final DateTimeFormatter ORDER_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
    private static final DateTimeFormatter EXIMBAY_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
    private static final Set<String> ALLOWED_PAYMENT_METHODS = Set.of("P000", "P001", "P302", "P015");
    private static final Set<String> KOREAN_LOCAL_PAYMENT_METHODS = Set.of("P302", "P015");
    private static final Set<String> CARD_PAYMENT_METHODS = Set.of(
            "P000", "P101", "P102", "P103", "P104", "P106", "P107", "P108", "P109",
            "P110", "P111", "P112", "P113", "P114", "P115", "P116", "P117", "P119",
            "P120", "P121", "P122", "P123", "P124", "P125", "P126", "P127", "P128",
            "P129", "P130"
    );

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

        String orderId = buildOrderId();
        String callbackBaseUrl = normalizeCallbackBaseUrl(request.getCallbackBaseUrl());
        String statusUrl = callbackBaseUrl + "/api/public/pay-test/eximbay/status";
        String returnUrl = callbackBaseUrl + "/api/public/pay-test/eximbay/return?merchant_order_id=" + orderId;
        String lang = normalizeLang(request.getLang());
        List<String> paymentMethods = normalizePaymentMethods(request);
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
                paymentMethods
        );
        Map<String, Object> readyResponse = eximbayPaymentClient.ready(eximbayRequest);
        requireSuccess(readyResponse, "Failed to prepare Eximbay payment.");
        eximbayRequest.put("fgkey", readyResponse.get("fgkey"));

        PaymentIntent intent = new PaymentIntent();
        intent.setPgProvider("eximbay");
        intent.setPgMid(eximbayPaymentClient.getMid());
        intent.setPgOrderId(orderId);
        intent.setAmount(pricing.getAmount());
        intent.setCurrency(pricing.getCurrencyCode());
        intent.setPaymentMethod(requestedPaymentMethodLabel(paymentMethods));
        intent.setStatus("ready");
        intent.setRawResponse(eximbayPaymentClient.toJson(Map.of(
                "readyRequest", eximbayRequest,
                "readyResponse", readyResponse
        )));
        intent.setEventSeq(pricing.getEventSeq());
        intent.setEventPricingSeq(pricing.getEventPricingSeq());
        intent.setOriginalAmount(pricing.getAmount());
        intent.setDiscountAmount(BigDecimal.ZERO);
        intent.setRefundedAmount(BigDecimal.ZERO);
        intent.setPayerName(payerName);
        intent.setPayerEmail(participant.getEmail());
        intent.setPayerCountry(participant.getCountry());
        intent.setFirstName(participant.getFirstName());
        intent.setMiddleName(participant.getMiddleName());
        intent.setLastName(participant.getLastName());
        intent.setOrganizationName(participant.getOrganizationName());
        intent.setPosition(participant.getPosition());
        intent.setCreatedBy(userSeq);
        intent.setUpdatedBy(userSeq);
        payTestDao.insertPaymentIntent(intent);

        PayTestPrepareResponseDto response = new PayTestPrepareResponseDto();
        response.setPaymentSeq(null);
        response.setOrderId(orderId);
        response.setSdkUrl(eximbayPaymentClient.getSdkUrl());
        response.setEximbayRequest(eximbayRequest);
        response.setPayment(payTestDao.selectPayTestIntentResultByOrderId(orderId));
        return response;
    }

    @Override
    public PayTestResultDto selectResult(String orderId, LoginUser loginUser) {
        assertAdmin(loginUser);
        if (!StringUtils.hasText(orderId)) {
            throw new BusinessException("Order ID is required.");
        }
        String trimmedOrderId = orderId.trim();
        PayTestResultDto result = payTestDao.selectPayTestResultByOrderId(trimmedOrderId);
        if (result == null) {
            result = payTestDao.selectPayTestIntentResultByOrderId(trimmedOrderId);
        }
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
        PaymentIntent intent = current == null ? payTestDao.selectPaymentIntentByOrderIdForUpdate(orderId) : null;
        if (current == null && intent == null) {
            return "UNKNOWN_ORDER";
        }

        String data = buildVerificationData(request, params);
        Map<String, Object> verifyResponse = eximbayPaymentClient.verify(data);
        boolean verified = "0000".equals(String.valueOf(verifyResponse.get("rescode")));
        boolean callbackSuccess = "0000".equals(params.get("rescode"));
        boolean success = verified && callbackSuccess;

        if (current != null) {
            Payment update = buildPaymentUpdateFromCallback(current, params, verifyResponse, success);
            payTestDao.updatePaymentFromCallback(update);
            return "OK";
        }

        if (!success) {
            PaymentIntent failedIntent = buildPaymentIntentStatusUpdate(intent, null, params, verifyResponse, "failed");
            payTestDao.updatePaymentIntentStatus(failedIntent);
            return "OK";
        }

        PayTestParticipantRequestDto participant = buildParticipantRequest(intent);
        Long participantSeq = payTestDao.upsertParticipant(participant);
        Long eventParticipantSeq = payTestDao.upsertEventParticipant(intent.getEventSeq(), participantSeq);
        Payment payment = buildPaymentFromIntent(intent, eventParticipantSeq, participantSeq, params, verifyResponse);
        Payment existingPayment = payTestDao.selectPaymentByRegistrationForUpdate(
                payment.getEventSeq(),
                payment.getEventPricingSeq(),
                payment.getParticipantSeq()
        );
        if (existingPayment == null) {
            payTestDao.insertPayment(payment);
        } else {
            payment.setPaymentSeq(existingPayment.getPaymentSeq());
            payTestDao.updatePaymentFromCallbackBySeq(payment);
        }

        PaymentIntent paidIntent = buildPaymentIntentStatusUpdate(intent, payment.getPaymentSeq(), params, verifyResponse, "paid");
        payTestDao.updatePaymentIntentStatus(paidIntent);
        return "OK";
    }

    private Payment buildPaymentUpdateFromCallback(Payment current,
                                                   Map<String, String> params,
                                                   Map<String, Object> verifyResponse,
                                                   boolean success) {
        Payment update = new Payment();
        update.setPgOrderId(current.getPgOrderId());
        applyCallbackFields(update, current.getAmount(), current.getCurrency(), current.getPaymentMethod(), params, verifyResponse, success);
        update.setUpdatedBy(current.getUpdatedBy());
        return update;
    }

    private PaymentIntent buildPaymentIntentStatusUpdate(PaymentIntent current,
                                                         Long paymentSeq,
                                                         Map<String, String> params,
                                                         Map<String, Object> verifyResponse,
                                                         String status) {
        PaymentIntent update = new PaymentIntent();
        update.setPaymentIntentSeq(current.getPaymentIntentSeq());
        update.setStatus(status);
        update.setFailedReason("paid".equals(status) ? null : defaultText(params.get("resmsg"), responseText(verifyResponse, "resmsg")));
        update.setRawResponse(eximbayPaymentClient.toJson(Map.of(
                "callback", params,
                "verifyResponse", verifyResponse
        )));
        update.setCompletedAt(LocalDateTime.now());
        update.setPaymentSeq(paymentSeq);
        update.setUpdatedBy(current.getUpdatedBy());
        return update;
    }

    private PayTestParticipantRequestDto buildParticipantRequest(PaymentIntent intent) {
        PayTestParticipantRequestDto participant = new PayTestParticipantRequestDto();
        participant.setEmail(intent.getPayerEmail().toLowerCase(Locale.ROOT));
        participant.setFirstName(intent.getFirstName());
        participant.setMiddleName(intent.getMiddleName());
        participant.setLastName(intent.getLastName());
        participant.setOrganizationName(intent.getOrganizationName());
        participant.setPosition(intent.getPosition());
        participant.setCountry(intent.getPayerCountry());
        return participant;
    }

    private Payment buildPaymentFromIntent(PaymentIntent intent,
                                           Long eventParticipantSeq,
                                           Long participantSeq,
                                           Map<String, String> params,
                                           Map<String, Object> verifyResponse) {
        Payment payment = new Payment();
        payment.setPgProvider(intent.getPgProvider());
        payment.setPgMid(intent.getPgMid());
        payment.setPgOrderId(intent.getPgOrderId());
        payment.setEventSeq(intent.getEventSeq());
        payment.setEventParticipantSeq(eventParticipantSeq);
        payment.setParticipantSeq(participantSeq);
        payment.setPayerName(intent.getPayerName());
        payment.setPayerEmail(intent.getPayerEmail());
        payment.setPayerCountry(intent.getPayerCountry());
        payment.setEventPricingSeq(intent.getEventPricingSeq());
        payment.setOriginalAmount(intent.getOriginalAmount() != null ? intent.getOriginalAmount() : intent.getAmount());
        payment.setDiscountAmount(intent.getDiscountAmount() != null ? intent.getDiscountAmount() : BigDecimal.ZERO);
        payment.setRefundedAmount(intent.getRefundedAmount() != null ? intent.getRefundedAmount() : BigDecimal.ZERO);
        payment.setCreatedBy(intent.getCreatedBy());
        payment.setUpdatedBy(intent.getUpdatedBy());
        applyCallbackFields(payment, intent.getAmount(), intent.getCurrency(), intent.getPaymentMethod(), params, verifyResponse, true);
        return payment;
    }

    private void applyCallbackFields(Payment payment,
                                     BigDecimal defaultAmount,
                                     String defaultCurrency,
                                     String defaultPaymentMethod,
                                     Map<String, String> params,
                                     Map<String, Object> verifyResponse,
                                     boolean success) {
        String callbackPaymentMethod = params.get("payment_method");
        payment.setPgTransactionId(params.get("transaction_id"));
        payment.setAmount(parseAmount(params.get("amount"), defaultAmount));
        payment.setCurrency(defaultText(params.get("currency"), defaultCurrency));
        payment.setPaymentMethod(actualPaymentMethodLabel(callbackPaymentMethod, defaultPaymentMethod));
        payment.setCardCompany(isCardPaymentMethod(callbackPaymentMethod) ? cardCompany(callbackPaymentMethod) : null);
        payment.setCardLast4(isCardPaymentMethod(callbackPaymentMethod) ? params.get("card_number4") : null);
        payment.setStatus(success ? "paid" : "failed");
        payment.setPaidAt(success ? parseEximbayDate(params.get("transaction_date")) : null);
        payment.setFailedReason(success ? null : defaultText(params.get("resmsg"), String.valueOf(verifyResponse.get("resmsg"))));
        payment.setPgResponseCode(params.get("rescode"));
        payment.setPgResponseMessage(params.get("resmsg"));
        payment.setVerifiedAt("0000".equals(String.valueOf(verifyResponse.get("rescode"))) ? LocalDateTime.now() : null);
        payment.setWebhookReceivedAt(LocalDateTime.now());
        payment.setSettleAmount(parseAmount(params.get("base_amount"), null));
        payment.setSettleCurrency(params.get("base_currency"));
        payment.setFxRate(parseAmount(params.get("base_rate"), null));
        payment.setApprovalNo(params.get("auth_code"));
        payment.setInstallmentMonths(parseInteger(params.get("installment_months")));
        payment.setRawResponse(eximbayPaymentClient.toJson(Map.of(
                "callback", params,
                "verifyResponse", verifyResponse
        )));
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
                                                    List<String> paymentMethods) {
        Map<String, Object> payment = new LinkedHashMap<>();
        payment.put("transaction_type", "PAYMENT");
        payment.put("order_id", orderId);
        payment.put("currency", pricing.getCurrencyCode());
        payment.put("amount", eximbayPaymentClient.formatAmount(pricing.getAmount()));
        payment.put("lang", lang);
        if (paymentMethods.size() == 1) {
            payment.put("payment_method", paymentMethods.get(0));
        } else {
            payment.put("multi_payment_method", String.join("-", paymentMethods));
        }
        if (paymentMethods.stream().anyMatch(KOREAN_LOCAL_PAYMENT_METHODS::contains)) {
            payment.put("issuer_country", "KR");
        }

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

    private List<String> normalizePaymentMethods(PayTestPrepareRequestDto request) {
        LinkedHashSet<String> methods = new LinkedHashSet<>();
        if (request.getPaymentMethods() != null) {
            for (String method : request.getPaymentMethods()) {
                addPaymentMethod(methods, method);
            }
        }
        if (methods.isEmpty() && StringUtils.hasText(request.getPaymentMethod())) {
            Arrays.stream(request.getPaymentMethod().split("[-,]"))
                    .forEach(method -> addPaymentMethod(methods, method));
        }
        if (methods.isEmpty()) {
            methods.add("P000");
        }
        return new ArrayList<>(methods);
    }

    private void addPaymentMethod(Set<String> methods, String method) {
        if (!StringUtils.hasText(method)) {
            return;
        }
        String value = method.trim().toUpperCase(Locale.ROOT);
        if (!ALLOWED_PAYMENT_METHODS.contains(value)) {
            throw new BusinessException("Unsupported Eximbay payment method: " + value);
        }
        methods.add(value);
    }

    private String requestedPaymentMethodLabel(List<String> methods) {
        if (methods.size() == 1) {
            return actualPaymentMethodLabel(methods.get(0), "card");
        }
        return "multiple";
    }

    private String actualPaymentMethodLabel(String paymentMethod, String fallback) {
        if (!StringUtils.hasText(paymentMethod)) {
            return fallback;
        }
        String value = paymentMethod.trim().toUpperCase(Locale.ROOT);
        if (isCardPaymentMethod(value)) {
            return "card";
        }
        return switch (value) {
            case "P001" -> "paypal";
            case "P302" -> "kakaopay";
            case "P015", "P307", "P308" -> "naverpay";
            default -> fallback;
        };
    }

    private boolean isCardPaymentMethod(String paymentMethod) {
        return StringUtils.hasText(paymentMethod)
                && CARD_PAYMENT_METHODS.contains(paymentMethod.trim().toUpperCase(Locale.ROOT));
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
        String value = paymentMethod.trim().toUpperCase(Locale.ROOT);
        return switch (value) {
            case "P000" -> "Credit Card";
            case "P101" -> "VISA";
            case "P102" -> "MasterCard";
            case "P103" -> "AMEX";
            case "P104" -> "JCB";
            case "P106" -> "Diners";
            case "P107" -> "Discover";
            case "P109" -> "UnionPay";
            case "P110" -> "BC Card";
            case "P111" -> "KB Card";
            case "P112" -> "Hana Card";
            case "P113" -> "Samsung Card";
            case "P114" -> "Shinhan Card";
            case "P115" -> "Hyundai Card";
            case "P116" -> "Lotte Card";
            case "P117" -> "Nonghyup Card";
            case "P119" -> "Citibank Card";
            case "P120" -> "Woori Card";
            default -> "Eximbay";
        };
    }

    private String defaultText(String value, String defaultValue) {
        return StringUtils.hasText(value) ? value : defaultValue;
    }

    private String responseText(Map<String, Object> response, String key) {
        Object value = response.get(key);
        return value == null ? null : String.valueOf(value);
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
