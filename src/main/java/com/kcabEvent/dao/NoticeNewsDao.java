package com.kcabEvent.dao;

import com.kcabEvent.domain.NoticeNews;
import com.kcabEvent.dto.noticenews.NoticeNewsDetailDto;
import com.kcabEvent.dto.noticenews.NoticeNewsListDto;
import com.kcabEvent.dto.noticenews.NoticeNewsSearchDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

@EgovMapper("noticeNewsDao")
public interface NoticeNewsDao {

    List<NoticeNewsListDto> selectNoticeNewsList(NoticeNewsSearchDto search);

    NoticeNewsDetailDto selectNoticeNewsDetail(@Param("noticeNewsSeq") Long noticeNewsSeq);

    long insertNoticeNews(NoticeNews noticeNews);

    int updateNoticeNews(NoticeNews noticeNews);

    int softDeleteNoticeNews(@Param("noticeNewsSeq") Long noticeNewsSeq,
                             @Param("uptUserSeq") Long uptUserSeq);

    int incrementViewCount(@Param("noticeNewsSeq") Long noticeNewsSeq);
}
