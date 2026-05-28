package com.kcabEvent.service.payment;

import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.paymenttest.PayTestDiscountValidationRequestDto;
import com.kcabEvent.dto.paymenttest.PayTestDiscountValidationResponseDto;
import com.kcabEvent.dto.paymenttest.PayTestEventOptionDto;
import com.kcabEvent.dto.paymenttest.PayTestParticipantRequestDto;
import com.kcabEvent.dto.paymenttest.PayTestPrepareRequestDto;
import com.kcabEvent.dto.paymenttest.PayTestPrepareResponseDto;
import com.kcabEvent.dto.paymenttest.PayTestPricingOptionDto;
import com.kcabEvent.dto.paymenttest.PayTestResultDto;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

public interface PayTestService {
    List<PayTestEventOptionDto> selectPayTestEvents(LoginUser loginUser);

    PayTestPrepareResponseDto preparePayment(PayTestPrepareRequestDto request, LoginUser loginUser);

    PayTestResultDto selectResult(String orderId, LoginUser loginUser);

    List<PayTestPricingOptionDto> selectPublicRegistrationPricingOptions(Long eventSeq);

    PayTestParticipantRequestDto selectPublicRegistrationParticipant(String email);

    PayTestDiscountValidationResponseDto validatePublicRegistrationDiscountCode(PayTestDiscountValidationRequestDto request);

    PayTestPrepareResponseDto preparePublicRegistrationPayment(PayTestPrepareRequestDto request);

    PayTestResultDto selectPublicRegistrationPaymentResult(String orderId);

    String processEximbayStatus(HttpServletRequest request);
}
