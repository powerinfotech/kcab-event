package com.power.service.common;

import com.power.dto.common.LoginRequestDto;

import jakarta.servlet.http.HttpServletRequest;

/**
 * LoginService - 로그인·로그아웃 서비스 인터페이스
 *
 * <p>사용자 인증, 세션 생성, 로그인 이력 기록 및 로그아웃 기능을 제공한다.</p>
 *
 * @see com.power.service.common.impl.LoginServiceImpl
 * @see com.power.controller.common.LoginController
 */
public interface LoginService {
    /**
     * 사용자를 인증하고 세션을 생성한다.
     * 인증 성공 시 최종 로그인 일시를 갱신하고 로그인 이력을 기록한다.
     *
     * @param loginInfo 로그인 요청 DTO (아이디·비밀번호·모드)
     * @param request   클라이언트 IP·User-Agent 수집용 HTTP 요청
     * @throws com.power.exception.custom.BusinessException 사용자가 없거나 비밀번호 불일치 시
     */
    void login(LoginRequestDto loginInfo, HttpServletRequest request);

    /**
     * 현재 세션을 무효화(로그아웃)한다.
     */
    void logout();
}
