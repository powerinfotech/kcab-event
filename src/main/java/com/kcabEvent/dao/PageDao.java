package com.kcabEvent.dao;

import com.kcabEvent.domain.Page;
import com.kcabEvent.domain.PageSection;
import com.kcabEvent.dto.page.PageDetailDto;
import com.kcabEvent.dto.page.PageListDto;
import com.kcabEvent.dto.page.SectionDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

@EgovMapper("pageDao")
public interface PageDao {

    List<PageListDto> selectPageList();

    PageDetailDto selectPageBySeq(@Param("pageSeq") Long pageSeq);

    PageDetailDto selectPageByUrl(@Param("pageUrl") String pageUrl);

    List<SectionDto> selectSectionList(@Param("pageSeq") Long pageSeq);

    void insertPage(Page page);

    void updatePage(Page page);

    void deletePage(@Param("pageSeq") Long pageSeq);

    void insertSection(PageSection section);

    void updateSection(PageSection section);

    void deleteSection(@Param("sectionSeq") Long sectionSeq);

    void deleteSectionsByPageSeq(@Param("pageSeq") Long pageSeq);
}
