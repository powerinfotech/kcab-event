package com.kcabEvent.service.faq.impl;

import com.kcabEvent.dao.FaqDao;
import com.kcabEvent.domain.Faq;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.faq.FaqListDto;
import com.kcabEvent.dto.faq.FaqSaveDto;
import com.kcabEvent.service.faq.FaqService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import java.util.List;

/**
 * FAQ 목록 조회와 행 단위 생성/수정/삭제 처리를 구현한다.
 */
@Slf4j
@Service("faqService")
public class FaqServiceImpl extends EgovAbstractServiceImpl implements FaqService {

    @Resource(name = "faqDao")
    private FaqDao faqDao;

    @Override
    public List<FaqListDto> selectFaqList(String category) {
        return faqDao.selectFaqList(category);
    }

    @Override
    @Transactional("transactionManager")
    public void saveFaq(FaqSaveDto saveDto, LoginUser loginUser) {
        if (saveDto.getFaqList() == null) return;
        Long userSeq = Long.valueOf(loginUser.getUserSeq());

        for (FaqListDto item : saveDto.getFaqList()) {
            if (item.getIudType() == null) continue;

            Faq faq = new Faq();
            faq.setCategory(item.getCategory());
            faq.setQuestion(item.getQuestion());
            faq.setAnswer(item.getAnswer());
            faq.setSortSeq(item.getSortSeq());
            faq.setUseYn(item.getUseYn() != null ? item.getUseYn() : "Y");

            switch (item.getIudType()) {
                case I:
                    faq.setRgstUserSeq(userSeq);
                    faq.setUptUserSeq(userSeq);
                    faqDao.insertFaq(faq);
                    break;
                case U:
                    faq.setFaqSeq(item.getFaqSeq());
                    faq.setUptUserSeq(userSeq);
                    faqDao.updateFaq(faq);
                    break;
                case D:
                    faqDao.deleteFaq(item.getFaqSeq());
                    break;
                default:
                    break;
            }
        }
    }
}
