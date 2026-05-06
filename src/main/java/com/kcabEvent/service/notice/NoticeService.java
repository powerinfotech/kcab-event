package com.kcabEvent.service.notice;

import com.kcabEvent.domain.Notice;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.notice.NoticeListDto;
import com.kcabEvent.dto.notice.NoticeSaveDto;

import java.util.List;

public interface NoticeService {
    List<NoticeListDto> selectNoticeList(String searchText);
    Notice selectNoticeBySeq(Long noticeSeq);
    void saveNotice(NoticeSaveDto saveDto, LoginUser loginUser);
    void deleteNotice(Long noticeSeq);
    void incrementViewCount(Long noticeSeq);
}
