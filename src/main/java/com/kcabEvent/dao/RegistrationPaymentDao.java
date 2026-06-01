package com.kcabEvent.dao;

import com.kcabEvent.domain.Payment;
import com.kcabEvent.domain.PaymentIntent;
import com.kcabEvent.dto.event.EventDiscountCodeDto;
import com.kcabEvent.dto.registrationpayment.RegistrationPaymentParticipantRequestDto;
import com.kcabEvent.dto.registrationpayment.RegistrationPaymentPricingOptionDto;
import com.kcabEvent.dto.registrationpayment.RegistrationPaymentResultDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

@EgovMapper("registrationPaymentDao")
public interface RegistrationPaymentDao {
    List<RegistrationPaymentPricingOptionDto> selectPublicRegistrationPricingOptions(@Param("eventSeq") Long eventSeq);

    RegistrationPaymentParticipantRequestDto selectParticipantByEmail(@Param("email") String email);

    RegistrationPaymentPricingOptionDto selectPublicRegistrationPricingForUpdate(@Param("eventSeq") Long eventSeq,
                                                                     @Param("eventPricingSeq") Long eventPricingSeq);

    EventDiscountCodeDto selectPublicRegistrationDiscountCode(@Param("eventSeq") Long eventSeq,
                                                              @Param("discountCode") String discountCode);

    EventDiscountCodeDto selectPublicRegistrationDiscountCodeForUpdate(@Param("eventSeq") Long eventSeq,
                                                                       @Param("discountCode") String discountCode);

    Long upsertParticipant(RegistrationPaymentParticipantRequestDto participant);

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

    RegistrationPaymentResultDto selectRegistrationPaymentResultByOrderId(@Param("orderId") String orderId);

    RegistrationPaymentResultDto selectRegistrationPaymentIntentResultByOrderId(@Param("orderId") String orderId);
}
