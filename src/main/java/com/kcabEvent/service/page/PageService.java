package com.kcabEvent.service.page;

import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.page.PageDetailDto;
import com.kcabEvent.dto.page.PageListDto;
import com.kcabEvent.dto.page.PageSaveDto;

import java.util.List;

public interface PageService {

    List<PageListDto> selectPageList();

    PageDetailDto selectPageBySeq(Long pageSeq);

    PageDetailDto selectPageByUrl(String pageUrl);

    void savePage(PageSaveDto saveDto, LoginUser loginUser);

    void deletePage(Long pageSeq);
}
