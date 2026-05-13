package com.kcabEvent.service.payment;

import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.paymenttest.PayTestEventOptionDto;
import com.kcabEvent.dto.paymenttest.PayTestPrepareRequestDto;
import com.kcabEvent.dto.paymenttest.PayTestPrepareResponseDto;
import com.kcabEvent.dto.paymenttest.PayTestResultDto;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

public interface PayTestService {
    List<PayTestEventOptionDto> selectPayTestEvents(LoginUser loginUser);

    PayTestPrepareResponseDto preparePayment(PayTestPrepareRequestDto request, LoginUser loginUser);

    PayTestResultDto selectResult(String orderId, LoginUser loginUser);

    String processEximbayStatus(HttpServletRequest request);
}
