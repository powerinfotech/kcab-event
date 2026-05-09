package com.kcabEvent.service.notice.impl;

import com.kcabEvent.dao.NoticeDao;
import com.kcabEvent.domain.Notice;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.notice.NoticeListDto;
import com.kcabEvent.dto.notice.NoticeSaveDto;
import com.kcabEvent.service.notice.NoticeService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import java.util.List;

/**
 * 공지사항 저장, 삭제, 공개 조회수 증가를 구현한다.
 */
@Slf4j
@Service("noticeService")
public class NoticeServiceImpl extends EgovAbstractServiceImpl implements NoticeService {

    @Resource(name = "noticeDao")
    private NoticeDao noticeDao;

    @Override
    public List<NoticeListDto> selectNoticeList(String searchText) {
        return noticeDao.selectNoticeList(searchText);
    }

    @Override
    public Notice selectNoticeBySeq(Long noticeSeq) {
        return noticeDao.selectNoticeBySeq(noticeSeq);
    }

    @Override
    @Transactional("transactionManager")
    public void saveNotice(NoticeSaveDto saveDto, LoginUser loginUser) {
        Long userSeq = Long.valueOf(loginUser.getUserSeq());

        Notice notice = new Notice();
        notice.setTitle(saveDto.getTitle());
        notice.setContent(saveDto.getContent());
        notice.setTopYn(saveDto.getTopYn() != null ? saveDto.getTopYn() : "N");
        notice.setUseYn(saveDto.getUseYn() != null ? saveDto.getUseYn() : "Y");
        notice.setFileSeq(saveDto.getFileSeq());

        if (saveDto.getNoticeSeq() == null) {
            notice.setRgstUserSeq(userSeq);
            notice.setUptUserSeq(userSeq);
            noticeDao.insertNotice(notice);
        } else {
            notice.setNoticeSeq(saveDto.getNoticeSeq());
            notice.setUptUserSeq(userSeq);
            noticeDao.updateNotice(notice);
        }
    }

    @Override
    @Transactional("transactionManager")
    public void deleteNotice(Long noticeSeq) {
        noticeDao.deleteNotice(noticeSeq);
    }

    @Override
    public void incrementViewCount(Long noticeSeq) {
        noticeDao.incrementViewCount(noticeSeq);
    }
}
