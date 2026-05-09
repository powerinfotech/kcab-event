package com.kcabEvent.service.page;

import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.page.PageDetailDto;
import com.kcabEvent.dto.page.PageListDto;
import com.kcabEvent.dto.page.PageSaveDto;

import java.util.List;

/**
 * 관리자 및 공개 페이지에서 사용하는 페이지/섹션 관리 기능을 정의한다.
 */
public interface PageService {

    /**
     * 전체 페이지 요약 목록을 조회한다.
     */
    List<PageListDto> selectPageList();

    /**
     * 순번으로 페이지 상세와 섹션 목록을 조회한다.
     */
    PageDetailDto selectPageBySeq(Long pageSeq);

    /**
     * 공개 URL로 페이지 상세와 섹션 목록을 조회한다.
     */
    PageDetailDto selectPageByUrl(String pageUrl);

    /**
     * 페이지와 섹션을 생성하거나 수정한다.
     */
    void savePage(PageSaveDto saveDto, LoginUser loginUser);

    /**
     * 페이지 순번으로 페이지와 섹션을 삭제한다.
     */
    void deletePage(Long pageSeq);
}
