package com.kcabEvent.dao;

import com.kcabEvent.domain.Payment;
import com.kcabEvent.domain.PaymentIntent;
import com.kcabEvent.dto.paymenttest.PayTestEventOptionDto;
import com.kcabEvent.dto.paymenttest.PayTestParticipantRequestDto;
import com.kcabEvent.dto.paymenttest.PayTestPricingOptionDto;
import com.kcabEvent.dto.paymenttest.PayTestResultDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

@EgovMapper("payTestDao")
public interface PayTestDao {
    List<PayTestEventOptionDto> selectPayTestEvents();

    List<PayTestPricingOptionDto> selectPayTestPricingOptions(@Param("eventSeq") Long eventSeq);

    PayTestPricingOptionDto selectPayTestPricingForUpdate(@Param("eventSeq") Long eventSeq,
                                                          @Param("eventPricingSeq") Long eventPricingSeq);

    Long upsertParticipant(PayTestParticipantRequestDto participant);

    Long upsertEventParticipant(@Param("eventSeq") Long eventSeq,
                                @Param("participantSeq") Long participantSeq);

    void insertPaymentIntent(PaymentIntent paymentIntent);

    PaymentIntent selectPaymentIntentByOrderIdForUpdate(@Param("orderId") String orderId);

    int updatePaymentIntentStatus(PaymentIntent paymentIntent);

    Payment selectPaymentByRegistrationForUpdate(@Param("eventSeq") Long eventSeq,
                                                 @Param("eventPricingSeq") Long eventPricingSeq,
                                                 @Param("participantSeq") Long participantSeq);

    void insertPayment(Payment payment);

    int updatePaymentForRetry(Payment payment);

    int updatePaymentFromCallbackBySeq(Payment payment);

    Payment selectPaymentByOrderIdForUpdate(@Param("orderId") String orderId);

    Payment selectPaymentByOrderId(@Param("orderId") String orderId);

    int updatePaymentFromCallback(Payment payment);

    PayTestResultDto selectPayTestResultByOrderId(@Param("orderId") String orderId);

    PayTestResultDto selectPayTestIntentResultByOrderId(@Param("orderId") String orderId);
}
