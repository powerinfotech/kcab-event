package com.kcabEvent.dao;

import com.kcabEvent.domain.Refund;
import com.kcabEvent.dto.payment.RefundListDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

@EgovMapper("refundDao")
public interface RefundDao {
    List<RefundListDto> selectRefundsByPaymentSeq(@Param("paymentSeq") Long paymentSeq);

    void insertRefund(Refund refund);
}
