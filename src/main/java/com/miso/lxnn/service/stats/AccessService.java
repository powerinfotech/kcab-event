package com.miso.lxnn.service.stats;

import com.miso.lxnn.dto.stats.AccessLogListDto;
import com.miso.lxnn.dto.stats.AccessLogListParam;
import com.miso.lxnn.dto.stats.AccessLogSearchUserListDto;

import java.util.List;

public interface AccessService {
    List<AccessLogSearchUserListDto> selectUserList(String searchText) throws Exception;
    List<AccessLogListDto> selectLogList(AccessLogListParam param) throws Exception;
}
