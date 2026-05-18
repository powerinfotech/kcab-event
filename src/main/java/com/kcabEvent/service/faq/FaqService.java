package com.kcabEvent.service.faq;

import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.faq.FaqListDto;
import com.kcabEvent.dto.faq.FaqSaveDto;

import java.util.List;

/**
 * FAQ 목록 조회와 일괄 저장 기능을 정의한다.
 */
public interface FaqService {
    /**
     * 카테고리 조건에 따라 FAQ 목록을 조회한다.
     */
    List<FaqListDto> selectFaqList(String category, String audience, Boolean activeOnly);

    /**
     * 생성, 수정, 삭제된 FAQ 행을 저장한다.
     */
    void saveFaq(FaqSaveDto saveDto, LoginUser loginUser);
}
