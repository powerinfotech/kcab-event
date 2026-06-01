package com.kcabEvent.service.payment;

import com.kcabEvent.dto.registrationpayment.RegistrationPaymentDiscountValidationRequestDto;
import com.kcabEvent.dto.registrationpayment.RegistrationPaymentDiscountValidationResponseDto;
import com.kcabEvent.dto.registrationpayment.RegistrationPaymentParticipantRequestDto;
import com.kcabEvent.dto.registrationpayment.RegistrationPaymentPrepareRequestDto;
import com.kcabEvent.dto.registrationpayment.RegistrationPaymentPrepareResponseDto;
import com.kcabEvent.dto.registrationpayment.RegistrationPaymentPricingOptionDto;
import com.kcabEvent.dto.registrationpayment.RegistrationPaymentResultDto;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

public interface RegistrationPaymentService {
    List<RegistrationPaymentPricingOptionDto> selectPublicRegistrationPricingOptions(Long eventSeq);

    RegistrationPaymentParticipantRequestDto selectPublicRegistrationParticipant(String email);

    RegistrationPaymentDiscountValidationResponseDto validatePublicRegistrationDiscountCode(RegistrationPaymentDiscountValidationRequestDto request);

    RegistrationPaymentPrepareResponseDto preparePublicRegistrationPayment(RegistrationPaymentPrepareRequestDto request);

    RegistrationPaymentResultDto selectPublicRegistrationPaymentResult(String orderId);

    String processEximbayStatus(HttpServletRequest request);
}
