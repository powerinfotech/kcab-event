package com.kcabEvent.service.page.impl;

import com.kcabEvent.dao.PageDao;
import com.kcabEvent.domain.Page;
import com.kcabEvent.domain.PageSection;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.page.PageDetailDto;
import com.kcabEvent.dto.page.PageListDto;
import com.kcabEvent.dto.page.PageSaveDto;
import com.kcabEvent.dto.page.SectionDto;
import com.kcabEvent.service.page.PageService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import java.util.List;

@Slf4j
@Service("pageService")
public class PageServiceImpl extends EgovAbstractServiceImpl implements PageService {

    @Resource(name = "pageDao")
    private PageDao pageDao;

    @Override
    public List<PageListDto> selectPageList() {
        return pageDao.selectPageList();
    }

    @Override
    public PageDetailDto selectPageBySeq(Long pageSeq) {
        PageDetailDto page = pageDao.selectPageBySeq(pageSeq);
        if (page != null) {
            page.setSections(pageDao.selectSectionList(pageSeq));
        }
        return page;
    }

    @Override
    public PageDetailDto selectPageByUrl(String pageUrl) {
        PageDetailDto page = pageDao.selectPageByUrl(pageUrl);
        if (page != null) {
            page.setSections(pageDao.selectSectionList(page.getPageSeq()));
        }
        return page;
    }

    @Override
    @Transactional("transactionManager")
    public void savePage(PageSaveDto saveDto, LoginUser loginUser) {
        Long userSeq = Long.valueOf(loginUser.getUserSeq());

        Page page = new Page();
        page.setPageNm(saveDto.getPageNm());
        page.setPageUrl(saveDto.getPageUrl());
        page.setPageTitle(saveDto.getPageTitle());
        page.setPageDesc(saveDto.getPageDesc());
        page.setUseYn(saveDto.getUseYn() != null ? saveDto.getUseYn() : "Y");
        page.setSortSeq(saveDto.getSortSeq() != null ? saveDto.getSortSeq() : 0);

        if (saveDto.getPageSeq() == null) {
            page.setRgstUserSeq(userSeq);
            page.setUptUserSeq(userSeq);
            pageDao.insertPage(page);
            saveDto.setPageSeq(page.getPageSeq());
        } else {
            page.setPageSeq(saveDto.getPageSeq());
            page.setUptUserSeq(userSeq);
            pageDao.updatePage(page);
        }

        if (saveDto.getSections() != null) {
            for (SectionDto sectionDto : saveDto.getSections()) {
                if (sectionDto.getIudType() == null) continue;

                PageSection section = new PageSection();
                section.setPageSeq(saveDto.getPageSeq());
                section.setSectionType(sectionDto.getSectionType());
                section.setSectionData(sectionDto.getSectionData());
                section.setSortSeq(sectionDto.getSortSeq());
                section.setUseYn(sectionDto.getUseYn() != null ? sectionDto.getUseYn() : "Y");

                switch (sectionDto.getIudType()) {
                    case I:
                        section.setRgstUserSeq(userSeq);
                        section.setUptUserSeq(userSeq);
                        pageDao.insertSection(section);
                        break;
                    case U:
                        section.setSectionSeq(sectionDto.getSectionSeq());
                        section.setUptUserSeq(userSeq);
                        pageDao.updateSection(section);
                        break;
                    case D:
                        pageDao.deleteSection(sectionDto.getSectionSeq());
                        break;
                    default:
                        break;
                }
            }
        }
    }

    @Override
    @Transactional("transactionManager")
    public void deletePage(Long pageSeq) {
        pageDao.deleteSectionsByPageSeq(pageSeq);
        pageDao.deletePage(pageSeq);
    }
}
