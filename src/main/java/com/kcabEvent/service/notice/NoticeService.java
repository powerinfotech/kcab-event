package com.kcabEvent.service.notice;

import com.kcabEvent.domain.Notice;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.notice.NoticeListDto;
import com.kcabEvent.dto.notice.NoticeSaveDto;

import java.util.List;

/**
 * 공지사항 관리와 공개 조회수 증가 기능을 정의한다.
 */
public interface NoticeService {
    /**
     * 검색어 조건에 따라 공지사항 목록을 조회한다.
     */
    List<NoticeListDto> selectNoticeList(String searchText);

    /**
     * 공지사항 순번으로 공지사항을 조회한다.
     */
    Notice selectNoticeBySeq(Long noticeSeq);

    /**
     * 현재 로그인 사용자를 감사 정보로 사용해 공지사항을 생성하거나 수정한다.
     */
    void saveNotice(NoticeSaveDto saveDto, LoginUser loginUser);

    /**
     * 공지사항 순번으로 공지사항을 삭제한다.
     */
    void deleteNotice(Long noticeSeq);

    /**
     * 공개 공지사항의 조회수를 증가시킨다.
     */
    void incrementViewCount(Long noticeSeq);
}
