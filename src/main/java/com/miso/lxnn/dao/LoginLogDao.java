package com.miso.lxnn.dao;

import com.miso.lxnn.domain.LoginLog;
import org.egovframe.rte.psl.dataaccess.mapper.Mapper;

/**
 * LoginLogDao - 로그인 이력 MyBatis 매퍼 인터페이스
 *
 * <p>로그인 성공 시 접속 IP·User-Agent 정보를 tb_login_log에 기록한다.</p>
 *
 * @see com.miso.lxnn.service.common.LoginService
 * @see com.miso.lxnn.domain.LoginLog
 */
@Mapper("loginLogDao")
public interface LoginLogDao {
    /** 로그인 이력을 등록한다. */
    void insertLoginLog(LoginLog loginLog) throws Exception;
}