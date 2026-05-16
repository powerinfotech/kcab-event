package com.kcabEvent.dao;

import com.kcabEvent.domain.Payment;
import com.kcabEvent.dto.payment.PaymentDetailDto;
import com.kcabEvent.dto.payment.PaymentEventOptionDto;
import com.kcabEvent.dto.payment.PaymentListDto;
import com.kcabEvent.dto.payment.PaymentSearchDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@EgovMapper("paymentDao")
public interface PaymentDao {
    List<PaymentListDto> selectPaymentList(PaymentSearchDto searchDto);

    PaymentDetailDto selectPaymentDetail(@Param("paymentSeq") Long paymentSeq,
                                         @Param("organizationSeq") Long organizationSeq);

    Payment selectPaymentForUpdate(@Param("paymentSeq") Long paymentSeq);

    List<PaymentEventOptionDto> selectPaymentEventOptions(@Param("organizationSeq") Long organizationSeq);

    int updatePaymentStatusOnCancel(@Param("paymentSeq") Long paymentSeq,
                                    @Param("status") String status,
                                    @Param("refundedAmount") BigDecimal refundedAmount,
                                    @Param("cancelledAt") LocalDateTime cancelledAt,
                                    @Param("cancelReason") String cancelReason,
                                    @Param("updatedBy") Long updatedBy);

    int updateEventParticipantOnCancel(@Param("eventParticipantSeq") Long eventParticipantSeq,
                                        @Param("cancelledAt") LocalDateTime cancelledAt,
                                        @Param("cancelReason") String cancelReason);

    int updatePaymentMemo(@Param("paymentSeq") Long paymentSeq,
                          @Param("adminMemo") String adminMemo,
                          @Param("updatedBy") Long updatedBy);
}
