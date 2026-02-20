package com.miso.lxnn.dao;

import com.miso.lxnn.domain.LoginLog;
import com.miso.lxnn.dto.stats.AccessLogListDto;
import com.miso.lxnn.dto.stats.AccessLogListParam;
import com.miso.lxnn.dto.stats.AccessLogSearchUserListDto;
import org.egovframe.rte.psl.dataaccess.mapper.Mapper;

import java.util.List;

@Mapper("loginLogDao")
public interface LoginLogDao {
    List<AccessLogSearchUserListDto> selectUserList(String searchText) throws Exception;
    List<AccessLogListDto> selectLogList(AccessLogListParam param) throws Exception;
    void insertLoginLog(LoginLog loginLog) throws Exception;
}