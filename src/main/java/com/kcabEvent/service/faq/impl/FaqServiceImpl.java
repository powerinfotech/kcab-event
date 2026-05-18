package com.kcabEvent.service.faq.impl;

import com.kcabEvent.dao.FaqDao;
import com.kcabEvent.domain.Faq;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.faq.FaqListDto;
import com.kcabEvent.dto.faq.FaqSaveDto;
import com.kcabEvent.exception.custom.BusinessException;
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

    private static final String AUDIENCE_PUBLIC = "public";
    private static final String AUDIENCE_ORGANIZATION = "organization";

    @Resource(name = "faqDao")
    private FaqDao faqDao;

    @Override
    public List<FaqListDto> selectFaqList(String category, String audience, Boolean activeOnly) {
        return faqDao.selectFaqList(category, normalizeAudience(audience), activeOnly);
    }

    @Override
    @Transactional("transactionManager")
    public void saveFaq(FaqSaveDto saveDto, LoginUser loginUser) {
        if (saveDto.getFaqList() == null) return;
        if (loginUser == null || !"Y".equals(loginUser.getAdmYn())) {
            throw new BusinessException("Only administrators can manage FAQ.");
        }
        Long userSeq = Long.valueOf(loginUser.getUserSeq());

        for (FaqListDto item : saveDto.getFaqList()) {
            if (item.getIudType() == null) continue;

            Faq faq = new Faq();
            faq.setAudience(normalizeAudienceForSave(item.getAudience()));
            faq.setCategory(item.getCategory());
            faq.setQuestion(item.getQuestion());
            faq.setAnswer(stripHtmlTags(item.getAnswer()));
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

    private String normalizeAudience(String audience) {
        if (AUDIENCE_ORGANIZATION.equals(audience)) {
            return AUDIENCE_ORGANIZATION;
        }
        if (AUDIENCE_PUBLIC.equals(audience)) {
            return AUDIENCE_PUBLIC;
        }
        return null;
    }

    private String normalizeAudienceForSave(String audience) {
        String normalized = normalizeAudience(audience);
        return normalized != null ? normalized : AUDIENCE_PUBLIC;
    }

    private String stripHtmlTags(String value) {
        if (value == null) {
            return null;
        }
        return value
                .replaceAll("(?i)<br\\s*/?>", "\n")
                .replaceAll("(?i)</p\\s*>", "\n")
                .replaceAll("<[^>]*>", "")
                .trim();
    }
}
