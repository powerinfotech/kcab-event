package com.kcabEvent.service.noticenews;

import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.noticenews.NoticeNewsDetailDto;
import com.kcabEvent.dto.noticenews.NoticeNewsListDto;
import com.kcabEvent.dto.noticenews.NoticeNewsSaveDto;
import com.kcabEvent.dto.noticenews.NoticeNewsSearchDto;

import java.util.List;

public interface NoticeNewsService {

    List<NoticeNewsListDto> selectNoticeNewsList(NoticeNewsSearchDto search);

    NoticeNewsDetailDto selectNoticeNewsDetail(Long noticeNewsSeq);

    Long saveNoticeNews(NoticeNewsSaveDto saveDto, LoginUser loginUser);

    void deleteNoticeNews(Long noticeNewsSeq, LoginUser loginUser);
}
