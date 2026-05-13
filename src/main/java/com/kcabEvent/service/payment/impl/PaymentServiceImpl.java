package com.kcabEvent.service.payment.impl;

import com.kcabEvent.dao.PaymentDao;
import com.kcabEvent.dao.RefundDao;
import com.kcabEvent.dao.SafOrganizationDao;
import com.kcabEvent.domain.Payment;
import com.kcabEvent.domain.Refund;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.payment.PaymentCancelRequestDto;
import com.kcabEvent.dto.payment.PaymentDetailDto;
import com.kcabEvent.dto.payment.PaymentEventOptionDto;
import com.kcabEvent.dto.payment.PaymentListDto;
import com.kcabEvent.dto.payment.PaymentSearchDto;
import com.kcabEvent.dto.payment.RefundListDto;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.payment.EximbayPaymentClient;
import com.kcabEvent.service.payment.PaymentService;
import jakarta.annotation.Resource;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Map;
import java.util.List;

@Service("paymentService")
public class PaymentServiceImpl extends EgovAbstractServiceImpl implements PaymentService {

    @Resource(name = "paymentDao")
    private PaymentDao paymentDao;

    @Resource(name = "refundDao")
    private RefundDao refundDao;

    @Resource(name = "safOrganizationDao")
    private SafOrganizationDao safOrganizationDao;

    private final EximbayPaymentClient eximbayPaymentClient;

    public PaymentServiceImpl(EximbayPaymentClient eximbayPaymentClient) {
        this.eximbayPaymentClient = eximbayPaymentClient;
    }

    @Override
    public List<PaymentListDto> selectPaymentList(PaymentSearchDto searchDto, LoginUser loginUser) {
        PaymentSearchDto criteria = searchDto != null ? searchDto : new PaymentSearchDto();
        criteria.setOrganizationSeq(resolveScopedOrganizationSeq(loginUser));
        if (criteria.getKeyword() != null) {
            String trimmed = criteria.getKeyword().trim();
            criteria.setKeyword(trimmed.isEmpty() ? null : trimmed);
        }
        criteria.setPgProviders(List.of("eximbay"));
        criteria.setPaymentMethods(List.of("card"));
        return paymentDao.selectPaymentList(criteria);
    }

    @Override
    public PaymentDetailDto selectPaymentDetail(Long paymentSeq, LoginUser loginUser) {
        Long organizationSeq = resolveScopedOrganizationSeq(loginUser);
        PaymentDetailDto detail = paymentDao.selectPaymentDetail(paymentSeq, organizationSeq);
        if (detail == null) {
            throw new BusinessException("Payment not found or not accessible.");
        }
        List<RefundListDto> refunds = refundDao.selectRefundsByPaymentSeq(paymentSeq);
        detail.setRefunds(refunds);
        return detail;
    }

    @Override
    public List<PaymentEventOptionDto> selectEventOptions(LoginUser loginUser) {
        return paymentDao.selectPaymentEventOptions(resolveScopedOrganizationSeq(loginUser));
    }

    @Override
    @Transactional
    public PaymentDetailDto cancelPayment(Long paymentSeq, PaymentCancelRequestDto request, LoginUser loginUser) {
        if (request == null) {
            throw new BusinessException("Cancel request is required.");
        }
        if (!StringUtils.hasText(request.getReason())) {
            throw new BusinessException("Cancel reason is required.");
        }

        Payment payment = paymentDao.selectPaymentForUpdate(paymentSeq);
        if (payment == null) {
            throw new BusinessException("Payment not found.");
        }

        Long organizationSeq = resolveScopedOrganizationSeq(loginUser);
        if (organizationSeq != null) {
            PaymentDetailDto accessCheck = paymentDao.selectPaymentDetail(paymentSeq, organizationSeq);
            if (accessCheck == null) {
                throw new BusinessException("Payment not accessible.");
            }
        }

        String currentStatus = payment.getStatus();
        if (!"paid".equals(currentStatus)) {
            throw new BusinessException("Only paid payments can be cancelled.");
        }

        BigDecimal totalAmount = payment.getAmount() != null ? payment.getAmount() : BigDecimal.ZERO;
        BigDecimal alreadyRefunded = payment.getRefundedAmount() != null ? payment.getRefundedAmount() : BigDecimal.ZERO;
        BigDecimal cancellable = totalAmount.subtract(alreadyRefunded);
        if (cancellable.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("This payment has already been fully refunded.");
        }

        BigDecimal requestAmount = request.getAmount();
        boolean isFull = requestAmount == null || requestAmount.compareTo(cancellable) >= 0;
        if (!isFull) {
            throw new BusinessException("Partial refunds are not supported.");
        }
        BigDecimal applyAmount = cancellable;
        if (applyAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Cancel amount must be greater than zero.");
        }

        String refundType = request.getRefundType();
        if (!StringUtils.hasText(refundType)) {
            refundType = determineRefundType(payment);
        }
        if (!isValidRefundType(refundType)) {
            throw new BusinessException("Invalid refund type: " + refundType);
        }

        Long userSeq = loginUser != null && loginUser.getUserSeq() != null ? loginUser.getUserSeq().longValue() : null;
        LocalDateTime now = LocalDateTime.now();
        BigDecimal balanceAfter = cancellable.subtract(applyAmount);
        String refundRequestId = buildRefundRequestId(paymentSeq);
        Map<String, Object> eximbayCancelRequest = null;
        Map<String, Object> eximbayCancelResponse = null;

        if ("eximbay".equalsIgnoreCase(payment.getPgProvider())) {
            if (!StringUtils.hasText(payment.getPgTransactionId())) {
                throw new BusinessException("Eximbay transaction ID is missing. This payment cannot be cancelled through PG.");
            }
            eximbayCancelRequest = eximbayPaymentClient.buildCancelRequest(
                    refundRequestId,
                    applyAmount,
                    request.getReason(),
                    payment.getPgOrderId(),
                    payment.getCurrency(),
                    totalAmount,
                    cancellable
            );
            eximbayCancelResponse = eximbayPaymentClient.cancel(
                    payment.getPgTransactionId(),
                    refundRequestId,
                    applyAmount,
                    request.getReason(),
                    payment.getPgOrderId(),
                    payment.getCurrency(),
                    totalAmount,
                    cancellable
            );
            if (!"0000".equals(stringValue(eximbayCancelResponse.get("rescode")))) {
                throw new BusinessException("Eximbay cancel failed: "
                        + stringValue(eximbayCancelResponse.getOrDefault("resmsg", "Unknown error")));
            }
        }

        Refund refund = new Refund();
        refund.setPaymentSeq(paymentSeq);
        refund.setAmount(applyAmount);
        refund.setCurrency(payment.getCurrency());
        refund.setReason(request.getReason());
        refund.setStatus("completed");
        refund.setRefundType(refundType);
        refund.setRefundRequestId(refundRequestId);
        refund.setSettleAmount(calculateSettleRefundAmount(payment, applyAmount, totalAmount));
        refund.setPgRefundId(nestedString(eximbayCancelResponse, "refund", "refund_id"));
        refund.setPgRefundTransactionId(nestedString(eximbayCancelResponse, "refund", "refund_transaction_id"));
        refund.setPgResponseCode(eximbayCancelResponse != null ? stringValue(eximbayCancelResponse.get("rescode")) : null);
        refund.setPgResponseMessage(eximbayCancelResponse != null ? stringValue(eximbayCancelResponse.get("resmsg")) : null);
        refund.setBalanceBefore(cancellable);
        refund.setBalanceAfter(balanceAfter);
        refund.setRawRequest(eximbayCancelRequest != null ? eximbayPaymentClient.toJson(eximbayCancelRequest) : null);
        refund.setRawResponse(eximbayCancelResponse != null ? eximbayPaymentClient.toJson(eximbayCancelResponse) : null);
        refund.setRequestedBy(userSeq != null ? userSeq : 0L);
        refund.setProcessedBy(userSeq);
        refund.setRequestedAt(now);
        refund.setProcessedAt(now);
        refund.setCreatedBy(userSeq);
        refund.setUpdatedBy(userSeq);
        refundDao.insertRefund(refund);

        BigDecimal newRefundedAmount = alreadyRefunded.add(applyAmount);

        paymentDao.updatePaymentStatusOnCancel(
                paymentSeq,
                "cancelled",
                newRefundedAmount,
                now,
                request.getReason(),
                userSeq
        );

        return selectPaymentDetail(paymentSeq, loginUser);
    }

    @Override
    @Transactional
    public void updateAdminMemo(Long paymentSeq, String memo, LoginUser loginUser) {
        Long organizationSeq = resolveScopedOrganizationSeq(loginUser);
        PaymentDetailDto accessCheck = paymentDao.selectPaymentDetail(paymentSeq, organizationSeq);
        if (accessCheck == null) {
            throw new BusinessException("Payment not accessible.");
        }
        Long userSeq = loginUser != null && loginUser.getUserSeq() != null ? loginUser.getUserSeq().longValue() : null;
        paymentDao.updatePaymentMemo(paymentSeq, memo, userSeq);
    }

    private String determineRefundType(Payment payment) {
        LocalDateTime paidAt = payment.getPaidAt();
        if (paidAt == null) {
            return "refund";
        }
        LocalDateTime today = LocalDateTime.now(ZoneId.systemDefault()).toLocalDate().atStartOfDay();
        return paidAt.isAfter(today) ? "void" : "refund";
    }

    private boolean isValidRefundType(String type) {
        return "void".equals(type) || "refund".equals(type);
    }

    private String buildRefundRequestId(Long paymentSeq) {
        return "RF" + paymentSeq + System.currentTimeMillis();
    }

    @SuppressWarnings("unchecked")
    private String nestedString(Map<String, Object> source, String parentKey, String key) {
        if (source == null) {
            return null;
        }
        Object parent = source.get(parentKey);
        if (!(parent instanceof Map<?, ?> parentMap)) {
            return null;
        }
        return stringValue(parentMap.get(key));
    }

    private String stringValue(Object value) {
        return value == null ? null : String.valueOf(value);
    }

    private BigDecimal calculateSettleRefundAmount(Payment payment, BigDecimal refundAmount, BigDecimal totalAmount) {
        if (payment.getSettleAmount() == null || totalAmount == null || totalAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return null;
        }
        return payment.getSettleAmount()
                .multiply(refundAmount)
                .divide(totalAmount, 2, RoundingMode.HALF_UP);
    }

    private Long resolveScopedOrganizationSeq(LoginUser loginUser) {
        if (loginUser != null && "Y".equals(loginUser.getAdmYn())) {
            return null;
        }
        if (loginUser == null || loginUser.getUserSeq() == null) {
            throw new BusinessException("Login session is invalid.");
        }
        Long organizationSeq = safOrganizationDao.selectOrganizationSeqByUserSeq(loginUser.getUserSeq().longValue());
        if (organizationSeq == null) {
            throw new BusinessException("No organization is linked to this account.");
        }
        return organizationSeq;
    }
}
