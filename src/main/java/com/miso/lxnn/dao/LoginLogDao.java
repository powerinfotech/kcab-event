package com.miso.lxnn.dao;

import com.miso.lxnn.domain.LoginLog;
import org.egovframe.rte.psl.dataaccess.mapper.Mapper;

@Mapper("loginLogDao")
public interface LoginLogDao {
    void insertLoginLog(LoginLog loginLog) throws Exception;
}