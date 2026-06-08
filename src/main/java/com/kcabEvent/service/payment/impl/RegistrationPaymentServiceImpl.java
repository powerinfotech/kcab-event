package com.kcabEvent.service.payment.impl;

import com.kcabEvent.dao.EventDao;
import com.kcabEvent.dao.RegistrationPaymentDao;
import com.kcabEvent.domain.Payment;
import com.kcabEvent.domain.PaymentIntent;
import com.kcabEvent.dto.event.EventDiscountCodeDto;
import com.kcabEvent.dto.event.EventRegistrationFieldDto;
import com.kcabEvent.dto.registrationpayment.RegistrationPaymentDiscountValidationRequestDto;
import com.kcabEvent.dto.registrationpayment.RegistrationPaymentDiscountValidationResponseDto;
import com.kcabEvent.dto.registrationpayment.RegistrationPaymentParticipantRequestDto;
import com.kcabEvent.dto.registrationpayment.RegistrationPaymentPrepareRequestDto;
import com.kcabEvent.dto.registrationpayment.RegistrationPaymentPrepareResponseDto;
import com.kcabEvent.dto.registrationpayment.RegistrationPaymentPricingOptionDto;
import com.kcabEvent.dto.registrationpayment.RegistrationPaymentResultDto;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.payment.EximbayPaymentClient;
import com.kcabEvent.service.payment.RegistrationPaymentService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
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

@Service("registrationPaymentService")
public class RegistrationPaymentServiceImpl extends EgovAbstractServiceImpl implements RegistrationPaymentService {

    private static final DateTimeFormatter ORDER_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
    private static final DateTimeFormatter EXIMBAY_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
    private static final String PUBLIC_REGISTRATION_STATUS_PATH = "/api/public/registration/payment/eximbay/status";
    private static final String PUBLIC_REGISTRATION_RETURN_PATH = "/api/public/registration/payment/eximbay/return";
    private static final Set<String> ALLOWED_PAYMENT_METHODS = Set.of("P000", "P001", "P302", "P015");
    private static final Set<String> KOREAN_LOCAL_PAYMENT_METHODS = Set.of("P302", "P015");
    private static final Set<String> CARD_PAYMENT_METHODS = Set.of(
            "P000", "P101", "P102", "P103", "P104", "P106", "P107", "P108", "P109",
            "P110", "P111", "P112", "P113", "P114", "P115", "P116", "P117", "P119",
            "P120", "P121", "P122", "P123", "P124", "P125", "P126", "P127", "P128",
            "P129", "P130"
    );

    @Resource(name = "registrationPaymentDao")
    private RegistrationPaymentDao registrationPaymentDao;

    @Resource(name = "eventDao")
    private EventDao eventDao;

    private final EximbayPaymentClient eximbayPaymentClient;

    public RegistrationPaymentServiceImpl(EximbayPaymentClient eximbayPaymentClient) {
        this.eximbayPaymentClient = eximbayPaymentClient;
    }

    @Override
    public List<RegistrationPaymentPricingOptionDto> selectPublicRegistrationPricingOptions(Long eventSeq) {
        if (eventSeq == null) {
            throw new BusinessException("Event is required.");
        }
        return registrationPaymentDao.selectPublicRegistrationPricingOptions(eventSeq);
    }

    @Override
    public RegistrationPaymentParticipantRequestDto selectPublicRegistrationParticipant(String email) {
        if (!StringUtils.hasText(email)) {
            return null;
        }
        ensureParticipantRegistrationSchema();
        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        if (!normalizedEmail.contains("@")) {
            throw new BusinessException("Please enter a valid participant email.");
        }
        return registrationPaymentDao.selectParticipantByEmail(normalizedEmail);
    }

    @Override
    public RegistrationPaymentDiscountValidationResponseDto validatePublicRegistrationDiscountCode(RegistrationPaymentDiscountValidationRequestDto request) {
        if (request == null || request.getEventSeq() == null || request.getEventPricingSeq() == null) {
            return emptyDiscountResponse(null, null, "Please select a ticket before applying a discount code.");
        }
        RegistrationPaymentPricingOptionDto pricing = registrationPaymentDao.selectPublicRegistrationPricingOptions(request.getEventSeq()).stream()
                .filter(option -> request.getEventPricingSeq().equals(option.getEventPricingSeq()))
                .findFirst()
                .orElse(null);
        if (pricing == null) {
            return emptyDiscountResponse(null, null, "Selected registration pricing is not available.");
        }
        return resolveDiscountCode(request.getDiscountCode(), pricing, false, false).response();
    }

    @Override
    @Transactional
    public RegistrationPaymentPrepareResponseDto preparePublicRegistrationPayment(RegistrationPaymentPrepareRequestDto request) {
        return preparePaymentInternal(request);
    }

    private RegistrationPaymentPrepareResponseDto preparePaymentInternal(RegistrationPaymentPrepareRequestDto request) {
        validatePrepareRequest(request);

        RegistrationPaymentPricingOptionDto pricing = registrationPaymentDao.selectPublicRegistrationPricingForUpdate(
                request.getEventSeq(),
                request.getEventPricingSeq()
        );
        if (pricing == null) {
            throw new BusinessException("Selected registration pricing is not available.");
        }

        RegistrationPaymentParticipantRequestDto participant = request.getParticipant();
        participant.setEmail(participant.getEmail().toLowerCase(Locale.ROOT));

        String orderId = buildOrderId();
        String callbackBaseUrl = normalizeCallbackBaseUrl(request.getCallbackBaseUrl());
        String statusUrl = callbackBaseUrl + PUBLIC_REGISTRATION_STATUS_PATH;
        String returnUrl = callbackBaseUrl + PUBLIC_REGISTRATION_RETURN_PATH + "?merchant_order_id=" + orderId;
        String lang = normalizeLang(request.getLang());
        List<String> paymentMethods = normalizePaymentMethods(request);
        String payerName = fullName(participant);
        DiscountApplication discount = StringUtils.hasText(request.getDiscountCode())
                ? resolveDiscountCode(request.getDiscountCode(), pricing, true, true)
                : noDiscount(pricing);
        BigDecimal payableAmount = discount.finalAmount();

        if (payableAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return completeFreePublicRegistration(
                    orderId,
                    pricing,
                    participant,
                    payerName,
                    discount
            );
        }

        Map<String, Object> eximbayRequest = buildEximbayRequest(
                orderId,
                pricing,
                payableAmount,
                payerName,
                participant.getEmail(),
                statusUrl,
                returnUrl,
                lang,
                paymentMethods,
                "KCAB_PUBLIC_REGISTRATION"
        );
        Map<String, Object> readyResponse = eximbayPaymentClient.ready(eximbayRequest);
        requireSuccess(readyResponse, "Failed to prepare Eximbay payment.");
        eximbayRequest.put("fgkey", readyResponse.get("fgkey"));

        PaymentIntent intent = new PaymentIntent();
        intent.setPgProvider("eximbay");
        intent.setPgMid(eximbayPaymentClient.getMid());
        intent.setPgOrderId(orderId);
        intent.setAmount(payableAmount);
        intent.setCurrency(pricing.getCurrencyCode());
        intent.setPaymentMethod(requestedPaymentMethodLabel(paymentMethods));
        intent.setStatus("ready");
        intent.setRawResponse(eximbayPaymentClient.toJson(Map.of(
                "readyRequest", eximbayRequest,
                "readyResponse", readyResponse,
                "discount", discount.rawData(),
                "participant", participantRawData(participant)
        )));
        intent.setEventSeq(pricing.getEventSeq());
        intent.setEventPricingSeq(pricing.getEventPricingSeq());
        intent.setOriginalAmount(pricing.getAmount());
        intent.setDiscountAmount(discount.discountAmount());
        intent.setRefundedAmount(BigDecimal.ZERO);
        intent.setPayerName(payerName);
        intent.setPayerEmail(participant.getEmail());
        intent.setPayerCountry(participant.getCountry());
        intent.setFirstName(participant.getFirstName());
        intent.setMiddleName(participant.getMiddleName());
        intent.setLastName(participant.getLastName());
        intent.setOrganizationName(participant.getOrganizationName());
        intent.setPosition(participant.getPosition());
        registrationPaymentDao.insertPaymentIntent(intent);

        RegistrationPaymentPrepareResponseDto response = new RegistrationPaymentPrepareResponseDto();
        response.setPaymentSeq(null);
        response.setOrderId(orderId);
        response.setSdkUrl(eximbayPaymentClient.getSdkUrl());
        response.setEximbayRequest(eximbayRequest);
        response.setPayment(registrationPaymentDao.selectRegistrationPaymentIntentResultByOrderId(orderId));
        return response;
    }

    private RegistrationPaymentPrepareResponseDto completeFreePublicRegistration(String orderId,
                                                                     RegistrationPaymentPricingOptionDto pricing,
                                                                     RegistrationPaymentParticipantRequestDto participant,
                                                                     String payerName,
                                                                     DiscountApplication discount) {
        Long participantSeq = registrationPaymentDao.upsertParticipant(participant);
        Long eventParticipantSeq = registrationPaymentDao.upsertEventParticipant(pricing.getEventSeq(), participantSeq);
        registrationPaymentDao.upsertEventParticipantProfile(eventParticipantSeq, pricing.getEventSeq(), participantSeq, participant);

        Payment payment = new Payment();
        payment.setPgProvider("discount");
        payment.setPgMid(eximbayPaymentClient.getMid());
        payment.setPgOrderId(orderId);
        payment.setAmount(discount.finalAmount());
        payment.setCurrency(pricing.getCurrencyCode());
        payment.setPaymentMethod("discount");
        payment.setStatus("paid");
        payment.setPaidAt(LocalDateTime.now());
        payment.setRawResponse(eximbayPaymentClient.toJson(Map.of(
                "flow", "KCAB_PUBLIC_REGISTRATION_FREE",
                "discount", discount.rawData(),
                "participant", participantRawData(participant)
        )));
        payment.setVerifiedAt(LocalDateTime.now());
        payment.setWebhookReceivedAt(LocalDateTime.now());
        payment.setEventSeq(pricing.getEventSeq());
        payment.setEventParticipantSeq(eventParticipantSeq);
        payment.setParticipantSeq(participantSeq);
        payment.setPayerName(payerName);
        payment.setPayerEmail(participant.getEmail());
        payment.setPayerCountry(participant.getCountry());
        payment.setEventPricingSeq(pricing.getEventPricingSeq());
        payment.setOriginalAmount(pricing.getAmount());
        payment.setDiscountCodeSeq(discount.discountCodeSeq());
        payment.setDiscountAmount(discount.discountAmount());
        payment.setRefundedAmount(BigDecimal.ZERO);
        Payment existingPayment = registrationPaymentDao.selectPaymentByRegistrationForUpdate(
                payment.getEventSeq(),
                payment.getEventPricingSeq(),
                payment.getParticipantSeq()
        );
        if (existingPayment == null) {
            registrationPaymentDao.insertPayment(payment);
        } else {
            payment.setPaymentSeq(existingPayment.getPaymentSeq());
            registrationPaymentDao.updatePaymentFromCallbackBySeq(payment);
        }

        RegistrationPaymentPrepareResponseDto response = new RegistrationPaymentPrepareResponseDto();
        response.setPaymentSeq(payment.getPaymentSeq());
        response.setOrderId(orderId);
        response.setPayment(registrationPaymentDao.selectRegistrationPaymentResultByOrderId(orderId));
        return response;
    }

    @Override
    public RegistrationPaymentResultDto selectPublicRegistrationPaymentResult(String orderId) {
        return selectResultInternal(orderId);
    }

    private RegistrationPaymentResultDto selectResultInternal(String orderId) {
        if (!StringUtils.hasText(orderId)) {
            throw new BusinessException("Order ID is required.");
        }
        String trimmedOrderId = orderId.trim();
        RegistrationPaymentResultDto result = registrationPaymentDao.selectRegistrationPaymentResultByOrderId(trimmedOrderId);
        if (result == null) {
            result = registrationPaymentDao.selectRegistrationPaymentIntentResultByOrderId(trimmedOrderId);
        }
        if (result == null) {
            throw new BusinessException("Registration payment order was not found.");
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

        Payment current = registrationPaymentDao.selectPaymentByOrderIdForUpdate(orderId);
        PaymentIntent intent = current == null ? registrationPaymentDao.selectPaymentIntentByOrderIdForUpdate(orderId) : null;
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
            registrationPaymentDao.updatePaymentFromCallback(update);
            return "OK";
        }

        if (!success) {
            PaymentIntent failedIntent = buildPaymentIntentStatusUpdate(intent, null, params, verifyResponse, "failed");
            registrationPaymentDao.updatePaymentIntentStatus(failedIntent);
            return "OK";
        }

        RegistrationPaymentParticipantRequestDto participant = buildParticipantRequest(intent);
        Long participantSeq = registrationPaymentDao.upsertParticipant(participant);
        Long eventParticipantSeq = registrationPaymentDao.upsertEventParticipant(intent.getEventSeq(), participantSeq);
        registrationPaymentDao.upsertEventParticipantProfile(eventParticipantSeq, intent.getEventSeq(), participantSeq, participant);
        Payment payment = buildPaymentFromIntent(intent, eventParticipantSeq, participantSeq, params, verifyResponse);
        Payment existingPayment = registrationPaymentDao.selectPaymentByRegistrationForUpdate(
                payment.getEventSeq(),
                payment.getEventPricingSeq(),
                payment.getParticipantSeq()
        );
        if (existingPayment == null) {
            registrationPaymentDao.insertPayment(payment);
        } else {
            payment.setPaymentSeq(existingPayment.getPaymentSeq());
            registrationPaymentDao.updatePaymentFromCallbackBySeq(payment);
        }

        PaymentIntent paidIntent = buildPaymentIntentStatusUpdate(intent, payment.getPaymentSeq(), params, verifyResponse, "paid");
        registrationPaymentDao.updatePaymentIntentStatus(paidIntent);
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

    private RegistrationPaymentParticipantRequestDto buildParticipantRequest(PaymentIntent intent) {
        Map<String, Object> raw = eximbayPaymentClient.fromJsonMap(intent.getRawResponse());
        Map<String, Object> savedParticipant = eximbayPaymentClient.asMap(raw.get("participant"));
        RegistrationPaymentParticipantRequestDto participant = new RegistrationPaymentParticipantRequestDto();
        participant.setEmail(defaultText(stringValue(savedParticipant.get("email")), intent.getPayerEmail()).toLowerCase(Locale.ROOT));
        participant.setFirstName(defaultText(stringValue(savedParticipant.get("firstName")), intent.getFirstName()));
        participant.setMiddleName(defaultText(stringValue(savedParticipant.get("middleName")), intent.getMiddleName()));
        participant.setLastName(defaultText(stringValue(savedParticipant.get("lastName")), intent.getLastName()));
        participant.setOrganizationName(defaultText(stringValue(savedParticipant.get("organizationName")), intent.getOrganizationName()));
        participant.setPosition(defaultText(stringValue(savedParticipant.get("position")), intent.getPosition()));
        participant.setPhone(stringValue(savedParticipant.get("phone")));
        participant.setAddress(stringValue(savedParticipant.get("address")));
        participant.setCity(stringValue(savedParticipant.get("city")));
        participant.setNationality(stringValue(savedParticipant.get("nationality")));
        participant.setResidenceCountry(defaultText(stringValue(savedParticipant.get("residenceCountry")), intent.getPayerCountry()));
        participant.setCountry(participant.getResidenceCountry());
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
        payment.setDiscountCodeSeq(extractDiscountCodeSeq(intent.getRawResponse()));
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

    private DiscountApplication noDiscount(RegistrationPaymentPricingOptionDto pricing) {
        BigDecimal originalAmount = normalizeMoney(pricing.getAmount(), pricing.getCurrencyCode());
        RegistrationPaymentDiscountValidationResponseDto response = new RegistrationPaymentDiscountValidationResponseDto();
        response.setValid(false);
        response.setStatus("none");
        response.setMessage("");
        response.setOriginalAmount(originalAmount);
        response.setDiscountAmount(BigDecimal.ZERO.setScale(currencyScale(pricing.getCurrencyCode()), RoundingMode.HALF_UP));
        response.setFinalAmount(originalAmount);
        return new DiscountApplication(response, null, BigDecimal.ZERO.setScale(currencyScale(pricing.getCurrencyCode()), RoundingMode.HALF_UP), originalAmount);
    }

    private DiscountApplication resolveDiscountCode(String rawDiscountCode,
                                                    RegistrationPaymentPricingOptionDto pricing,
                                                    boolean lock,
                                                    boolean throwOnInvalid) {
        BigDecimal originalAmount = normalizeMoney(pricing.getAmount(), pricing.getCurrencyCode());
        String discountCode = normalizeDiscountCode(rawDiscountCode);
        if (!StringUtils.hasText(discountCode)) {
            return invalidDiscount(pricing, null, "empty", "Enter a discount code.", throwOnInvalid);
        }

        EventDiscountCodeDto discount = lock
                ? registrationPaymentDao.selectPublicRegistrationDiscountCodeForUpdate(pricing.getEventSeq(), discountCode)
                : registrationPaymentDao.selectPublicRegistrationDiscountCode(pricing.getEventSeq(), discountCode);
        if (discount == null) {
            return invalidDiscount(pricing, discountCode, "not_found", "This discount code does not exist for this event.", throwOnInvalid);
        }

        LocalDateTime now = LocalDateTime.now();
        if (!"Y".equalsIgnoreCase(String.valueOf(discount.getUseYn()))) {
            return invalidDiscount(pricing, discountCode, "inactive", "This discount code is not active.", throwOnInvalid);
        }
        if (discount.getValidFromAt() != null && discount.getValidFromAt().isAfter(now)) {
            return invalidDiscount(pricing, discountCode, "not_started", "This discount code is not available yet.", throwOnInvalid);
        }
        if (discount.getValidToAt() != null && discount.getValidToAt().isBefore(now)) {
            return invalidDiscount(pricing, discountCode, "expired", "This discount code has expired.", throwOnInvalid);
        }
        if (discount.getUsageLimit() != null
                && discount.getUsageLimit() >= 0
                && discount.getUsedCount() != null
                && discount.getUsedCount() >= discount.getUsageLimit()) {
            return invalidDiscount(pricing, discountCode, "usage_limit", "This discount code has reached its usage limit.", throwOnInvalid);
        }
        if (StringUtils.hasText(discount.getAppliesToPriceType())
                && !discount.getAppliesToPriceType().trim().equalsIgnoreCase(String.valueOf(pricing.getPriceType()))) {
            return invalidDiscount(pricing, discountCode, "price_type_mismatch", "This code cannot be used for the selected ticket.", throwOnInvalid);
        }
        if ("amount".equalsIgnoreCase(discount.getDiscountType())
                && StringUtils.hasText(discount.getCurrencyCode())
                && !discount.getCurrencyCode().trim().equalsIgnoreCase(String.valueOf(pricing.getCurrencyCode()))) {
            return invalidDiscount(
                    pricing,
                    discountCode,
                    "currency_mismatch",
                    "This discount code is for " + discount.getCurrencyCode().trim().toUpperCase(Locale.ROOT) + " tickets only.",
                    throwOnInvalid
            );
        }

        BigDecimal discountAmount = calculateDiscountAmount(discount, pricing);
        BigDecimal finalAmount = originalAmount.subtract(discountAmount);
        if (finalAmount.compareTo(BigDecimal.ZERO) < 0) {
            finalAmount = BigDecimal.ZERO;
        }
        finalAmount = normalizeMoney(finalAmount, pricing.getCurrencyCode());

        RegistrationPaymentDiscountValidationResponseDto response = new RegistrationPaymentDiscountValidationResponseDto();
        response.setValid(true);
        response.setStatus("applied");
        response.setMessage("Discount code applied.");
        response.setDiscountCodeSeq(discount.getDiscountCodeSeq());
        response.setDiscountCode(discount.getDiscountCode());
        response.setDiscountType(discount.getDiscountType());
        response.setDiscountValue(discount.getDiscountValue());
        response.setCurrencyCode(discount.getCurrencyCode());
        response.setOriginalAmount(originalAmount);
        response.setDiscountAmount(discountAmount);
        response.setFinalAmount(finalAmount);
        response.setUsageLimit(discount.getUsageLimit());
        response.setUsedCount(discount.getUsedCount());
        return new DiscountApplication(response, discount.getDiscountCodeSeq(), discountAmount, finalAmount);
    }

    private DiscountApplication invalidDiscount(RegistrationPaymentPricingOptionDto pricing,
                                                String discountCode,
                                                String status,
                                                String message,
                                                boolean throwOnInvalid) {
        if (throwOnInvalid) {
            throw new BusinessException(message);
        }
        BigDecimal originalAmount = normalizeMoney(pricing.getAmount(), pricing.getCurrencyCode());
        RegistrationPaymentDiscountValidationResponseDto response = emptyDiscountResponse(originalAmount, pricing.getCurrencyCode(), message);
        response.setStatus(status);
        response.setDiscountCode(discountCode);
        return new DiscountApplication(response, null, BigDecimal.ZERO.setScale(currencyScale(pricing.getCurrencyCode()), RoundingMode.HALF_UP), originalAmount);
    }

    private RegistrationPaymentDiscountValidationResponseDto emptyDiscountResponse(BigDecimal originalAmount,
                                                                       String currencyCode,
                                                                       String message) {
        String currency = StringUtils.hasText(currencyCode) ? currencyCode : "USD";
        BigDecimal normalizedOriginal = originalAmount != null
                ? normalizeMoney(originalAmount, currency)
                : BigDecimal.ZERO.setScale(currencyScale(currency), RoundingMode.HALF_UP);
        RegistrationPaymentDiscountValidationResponseDto response = new RegistrationPaymentDiscountValidationResponseDto();
        response.setValid(false);
        response.setStatus("empty");
        response.setMessage(message);
        response.setOriginalAmount(normalizedOriginal);
        response.setDiscountAmount(BigDecimal.ZERO.setScale(currencyScale(currency), RoundingMode.HALF_UP));
        response.setFinalAmount(normalizedOriginal);
        return response;
    }

    private BigDecimal calculateDiscountAmount(EventDiscountCodeDto discount, RegistrationPaymentPricingOptionDto pricing) {
        BigDecimal originalAmount = normalizeMoney(pricing.getAmount(), pricing.getCurrencyCode());
        BigDecimal discountValue = discount.getDiscountValue() == null ? BigDecimal.ZERO : discount.getDiscountValue();
        BigDecimal discountAmount;
        if ("percent".equalsIgnoreCase(discount.getDiscountType())) {
            discountAmount = originalAmount
                    .multiply(discountValue)
                    .divide(BigDecimal.valueOf(100), currencyScale(pricing.getCurrencyCode()) + 4, RoundingMode.HALF_UP);
        } else {
            discountAmount = discountValue;
        }
        discountAmount = normalizeMoney(discountAmount, pricing.getCurrencyCode());
        if (discountAmount.compareTo(originalAmount) > 0) {
            return originalAmount;
        }
        return discountAmount;
    }

    private BigDecimal normalizeMoney(BigDecimal value, String currencyCode) {
        BigDecimal amount = value == null ? BigDecimal.ZERO : value;
        return amount.setScale(currencyScale(currencyCode), RoundingMode.HALF_UP);
    }

    private int currencyScale(String currencyCode) {
        return "KRW".equalsIgnoreCase(String.valueOf(currencyCode)) ? 0 : 2;
    }

    private String normalizeDiscountCode(String value) {
        return StringUtils.hasText(value) ? value.trim().toUpperCase(Locale.ROOT) : "";
    }

    private Long extractDiscountCodeSeq(String rawResponse) {
        Map<String, Object> raw = eximbayPaymentClient.fromJsonMap(rawResponse);
        Map<String, Object> discount = eximbayPaymentClient.asMap(raw.get("discount"));
        Object discountCodeSeq = discount.get("discountCodeSeq");
        if (discountCodeSeq instanceof Number number) {
            return number.longValue();
        }
        if (discountCodeSeq instanceof String text && StringUtils.hasText(text)) {
            try {
                return Long.parseLong(text.trim());
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }

    private record DiscountApplication(RegistrationPaymentDiscountValidationResponseDto response,
                                       Long discountCodeSeq,
                                       BigDecimal discountAmount,
                                       BigDecimal finalAmount) {
        private Map<String, Object> rawData() {
            Map<String, Object> data = new LinkedHashMap<>();
            data.put("valid", response.isValid());
            data.put("status", response.getStatus());
            if (StringUtils.hasText(response.getDiscountCode())) {
                data.put("discountCode", response.getDiscountCode());
            }
            if (discountCodeSeq != null) {
                data.put("discountCodeSeq", discountCodeSeq);
            }
            data.put("discountAmount", discountAmount);
            data.put("finalAmount", finalAmount);
            return data;
        }
    }

    private void validatePrepareRequest(RegistrationPaymentPrepareRequestDto request) {
        if (request == null) {
            throw new BusinessException("Registration payment request is required.");
        }
        if (request.getEventSeq() == null || request.getEventPricingSeq() == null) {
            throw new BusinessException("Please select an event and pricing.");
        }
        RegistrationPaymentParticipantRequestDto participant = request.getParticipant();
        if (participant == null) {
            throw new BusinessException("Participant information is required.");
        }
        ensureParticipantRegistrationSchema();
        normalizeParticipantText(participant);
        List<EventRegistrationFieldDto> fields = resolveRegistrationFields(request.getEventSeq());

        String email = participant.getEmail();
        if (!email.contains("@")) {
            throw new BusinessException("Please enter a valid participant email.");
        }
        for (EventRegistrationFieldDto field : fields) {
            if (!"Y".equalsIgnoreCase(field.getEnabledYn()) || !"Y".equalsIgnoreCase(field.getRequiredYn())) {
                continue;
            }
            if (!StringUtils.hasText(participantValue(participant, field.getFieldCode()))) {
                throw new BusinessException(field.getFieldLabel() + " is required.");
            }
        }
        sanitizeDisabledParticipantFields(participant, fields);
        participant.setEmail(email.toLowerCase(Locale.ROOT));
    }

    private void normalizeParticipantText(RegistrationPaymentParticipantRequestDto participant) {
        participant.setEmail(trimToEmpty(participant.getEmail()).toLowerCase(Locale.ROOT));
        participant.setFirstName(trimToEmpty(participant.getFirstName()));
        participant.setMiddleName(trimToEmpty(participant.getMiddleName()));
        participant.setLastName(trimToEmpty(participant.getLastName()));
        participant.setPhone(trimToEmpty(participant.getPhone()));
        participant.setOrganizationName(trimToEmpty(participant.getOrganizationName()));
        participant.setPosition(trimToEmpty(participant.getPosition()));
        participant.setAddress(trimToEmpty(participant.getAddress()));
        participant.setCity(trimToEmpty(participant.getCity()));
        participant.setNationality(trimToEmpty(participant.getNationality()));
        String residenceCountry = StringUtils.hasText(participant.getResidenceCountry())
                ? participant.getResidenceCountry()
                : participant.getCountry();
        participant.setResidenceCountry(trimToEmpty(residenceCountry));
        participant.setCountry(participant.getResidenceCountry());
    }

    private void sanitizeDisabledParticipantFields(RegistrationPaymentParticipantRequestDto participant,
                                                   List<EventRegistrationFieldDto> fields) {
        Set<String> enabledCodes = new LinkedHashSet<>();
        for (EventRegistrationFieldDto field : fields) {
            if ("Y".equalsIgnoreCase(field.getEnabledYn())) {
                enabledCodes.add(field.getFieldCode());
            }
        }
        if (!enabledCodes.contains("first_name")) participant.setFirstName("");
        if (!enabledCodes.contains("middle_name")) participant.setMiddleName("");
        if (!enabledCodes.contains("last_name")) participant.setLastName("");
        if (!enabledCodes.contains("phone")) participant.setPhone("");
        if (!enabledCodes.contains("organization_name")) participant.setOrganizationName("");
        if (!enabledCodes.contains("position")) participant.setPosition("");
        if (!enabledCodes.contains("address")) participant.setAddress("");
        if (!enabledCodes.contains("city")) participant.setCity("");
        if (!enabledCodes.contains("nationality")) participant.setNationality("");
        if (!enabledCodes.contains("residence_country")) {
            participant.setResidenceCountry("");
            participant.setCountry("");
        }
    }

    private String participantValue(RegistrationPaymentParticipantRequestDto participant, String fieldCode) {
        return switch (String.valueOf(fieldCode)) {
            case "email" -> participant.getEmail();
            case "first_name" -> participant.getFirstName();
            case "middle_name" -> participant.getMiddleName();
            case "last_name" -> participant.getLastName();
            case "phone" -> participant.getPhone();
            case "organization_name" -> participant.getOrganizationName();
            case "position" -> participant.getPosition();
            case "address" -> participant.getAddress();
            case "city" -> participant.getCity();
            case "nationality" -> participant.getNationality();
            case "residence_country" -> participant.getResidenceCountry();
            default -> "";
        };
    }

    private List<EventRegistrationFieldDto> resolveRegistrationFields(Long eventSeq) {
        List<EventRegistrationFieldDto> fields = eventDao.selectEventRegistrationFields(eventSeq);
        if (fields == null || fields.isEmpty()) {
            return defaultRegistrationFields();
        }
        for (EventRegistrationFieldDto field : fields) {
            if ("email".equals(field.getFieldCode())) {
                field.setEnabledYn("Y");
                field.setRequiredYn("Y");
            }
        }
        return fields;
    }

    private List<EventRegistrationFieldDto> defaultRegistrationFields() {
        List<EventRegistrationFieldDto> fields = new ArrayList<>();
        fields.add(registrationField("email", "Email", "Y", "Y", 1));
        fields.add(registrationField("first_name", "First Name", "Y", "Y", 2));
        fields.add(registrationField("middle_name", "Middle Name", "Y", "N", 3));
        fields.add(registrationField("last_name", "Last Name", "Y", "Y", 4));
        fields.add(registrationField("phone", "Phone Number", "N", "N", 5));
        fields.add(registrationField("organization_name", "Company Name", "Y", "N", 6));
        fields.add(registrationField("position", "Position", "Y", "N", 7));
        fields.add(registrationField("address", "Address", "N", "N", 8));
        fields.add(registrationField("city", "City", "N", "N", 9));
        fields.add(registrationField("nationality", "Nationality", "N", "N", 10));
        fields.add(registrationField("residence_country", "Country of Residence", "Y", "N", 11));
        return fields;
    }

    private EventRegistrationFieldDto registrationField(String code, String label, String enabledYn, String requiredYn, int sortSeq) {
        EventRegistrationFieldDto field = new EventRegistrationFieldDto();
        field.setFieldCode(code);
        field.setFieldLabel(label);
        field.setEnabledYn(enabledYn);
        field.setRequiredYn(requiredYn);
        field.setSortSeq(sortSeq);
        return field;
    }

    private void ensureParticipantRegistrationSchema() {
        eventDao.ensureParticipantsPhoneColumn();
        eventDao.ensureParticipantsAddressColumn();
        eventDao.ensureParticipantsCityColumn();
        eventDao.ensureParticipantsNationalityColumn();
        eventDao.ensureParticipantsResidenceCountryColumn();
        eventDao.backfillParticipantsResidenceCountry();
        eventDao.ensureEventRegistrationFieldsTable();
        eventDao.ensureEventParticipantProfilesTable();
    }

    private Map<String, Object> buildEximbayRequest(String orderId,
                                                    RegistrationPaymentPricingOptionDto pricing,
                                                    BigDecimal payableAmount,
                                                    String payerName,
                                                    String email,
                                                    String statusUrl,
                                                    String returnUrl,
                                                    String lang,
                                                    List<String> paymentMethods,
                                                    String flowMarker) {
        Map<String, Object> payment = new LinkedHashMap<>();
        payment.put("transaction_type", "PAYMENT");
        payment.put("order_id", orderId);
        payment.put("currency", pricing.getCurrencyCode());
        payment.put("amount", eximbayPaymentClient.formatAmount(payableAmount));
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
        otherParam.put("param1", flowMarker);

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
            throw new BusinessException("Callback base URL is required for Eximbay payment.");
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

    private List<String> normalizePaymentMethods(RegistrationPaymentPrepareRequestDto request) {
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

    private String fullName(RegistrationPaymentParticipantRequestDto participant) {
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

    private String trimToEmpty(String value) {
        return value == null ? "" : value.trim();
    }

    private String stringValue(Object value) {
        return value == null ? null : String.valueOf(value);
    }

    private Map<String, Object> participantRawData(RegistrationPaymentParticipantRequestDto participant) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("email", participant.getEmail());
        data.put("firstName", participant.getFirstName());
        data.put("middleName", participant.getMiddleName());
        data.put("lastName", participant.getLastName());
        data.put("phone", participant.getPhone());
        data.put("organizationName", participant.getOrganizationName());
        data.put("position", participant.getPosition());
        data.put("address", participant.getAddress());
        data.put("city", participant.getCity());
        data.put("nationality", participant.getNationality());
        data.put("residenceCountry", participant.getResidenceCountry());
        return data;
    }

    private String responseText(Map<String, Object> response, String key) {
        Object value = response.get(key);
        return value == null ? null : String.valueOf(value);
    }

}
