package com.kcabEvent.dao;

import com.kcabEvent.domain.Faq;
import com.kcabEvent.dto.faq.FaqListDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

@EgovMapper("faqDao")
public interface FaqDao {

    List<FaqListDto> selectFaqList(@Param("category") String category);

    void insertFaq(Faq faq);

    void updateFaq(Faq faq);

    void deleteFaq(@Param("faqSeq") Long faqSeq);
}
