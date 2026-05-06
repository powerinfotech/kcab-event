package com.kcabEvent.service.faq;

import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.faq.FaqListDto;
import com.kcabEvent.dto.faq.FaqSaveDto;

import java.util.List;

public interface FaqService {
    List<FaqListDto> selectFaqList(String category);
    void saveFaq(FaqSaveDto saveDto, LoginUser loginUser);
}
