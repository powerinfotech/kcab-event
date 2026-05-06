package com.kcabEvent.dao;

import com.kcabEvent.domain.Notice;
import com.kcabEvent.dto.notice.NoticeListDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

@EgovMapper("noticeDao")
public interface NoticeDao {

    List<NoticeListDto> selectNoticeList(@Param("searchText") String searchText);

    Notice selectNoticeBySeq(@Param("noticeSeq") Long noticeSeq);

    void insertNotice(Notice notice);

    void updateNotice(Notice notice);

    void deleteNotice(@Param("noticeSeq") Long noticeSeq);

    void incrementViewCount(@Param("noticeSeq") Long noticeSeq);
}
