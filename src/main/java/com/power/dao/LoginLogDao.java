package com.power.dao;

import com.power.domain.LoginLog;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

/**
 * LoginLogDao - 로그인 이력 MyBatis 매퍼 인터페이스
 *
 * <p>로그인 성공 시 접속 IP·User-Agent 정보를 tb_login_log에 기록한다.</p>
 *
 * @see com.power.service.common.LoginService
 * @see com.power.domain.LoginLog
 */
@EgovMapper("loginLogDao")
public interface LoginLogDao {
    /** 로그인 이력을 등록한다. */
    void insertLoginLog(LoginLog loginLog);
}