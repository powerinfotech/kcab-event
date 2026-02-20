package com.miso.lxnn.service.master;

import com.miso.lxnn.dto.common.CodeResponseDto;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.dto.master.NoticeListDto;
import com.miso.lxnn.dto.master.NoticeListSearchDto;
import com.miso.lxnn.dto.master.NoticeSaveDto;

import java.util.List;

public interface NoticeUserManagementService {
    List<NoticeListDto> selectNoticeList(NoticeListSearchDto dto);
    Integer saveNotice(NoticeSaveDto dto, LoginUser loginUser);
    void deleteNotice(NoticeSaveDto dto);
    List<CodeResponseDto> searchConditions();
}
