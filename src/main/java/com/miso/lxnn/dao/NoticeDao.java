package com.miso.lxnn.dao;

import com.miso.lxnn.dto.master.NoticeListDto;
import com.miso.lxnn.dto.master.NoticeListSearchDto;
import com.miso.lxnn.dto.master.NoticeSaveDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface NoticeDao {
    List<NoticeListDto> selectNoticeList(NoticeListSearchDto dto);
    void insertNotice(NoticeSaveDto dto);
    void updateNotice(NoticeSaveDto dto);
    void deleteNotice(NoticeSaveDto dto);

}
