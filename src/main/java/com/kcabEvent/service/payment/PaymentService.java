package com.kcabEvent.service.payment;

import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.payment.PaymentCancelRequestDto;
import com.kcabEvent.dto.payment.PaymentDetailDto;
import com.kcabEvent.dto.payment.PaymentEventOptionDto;
import com.kcabEvent.dto.payment.PaymentListDto;
import com.kcabEvent.dto.payment.PaymentSearchDto;

import java.util.List;

public interface PaymentService {
    List<PaymentListDto> selectPaymentList(PaymentSearchDto searchDto, LoginUser loginUser);

    PaymentDetailDto selectPaymentDetail(Long paymentSeq, LoginUser loginUser);

    List<PaymentEventOptionDto> selectEventOptions(LoginUser loginUser);

    PaymentDetailDto cancelPayment(Long paymentSeq, PaymentCancelRequestDto request, LoginUser loginUser);

    void updateAdminMemo(Long paymentSeq, String memo, LoginUser loginUser);
}
