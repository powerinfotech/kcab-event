package com.kcabEvent.service.common;

/**
 * ConvenienceLoginService - 개발 편의 로그인 서비스 인터페이스
 *
 * <p>로컬·개발 환경({@code @Profile("local", "dev")})에서만 활성화되는
 * 비밀번호 없는 빠른 로그인 기능을 제공한다.</p>
 *
 * @see com.kcabEvent.service.common.impl.ConvenienceLoginServiceImpl
 * @see com.kcabEvent.controller.ConvenienceLoginController
 */
public interface ConvenienceLoginService {
    /**
     * 아이디만으로 세션을 생성한다 (비밀번호 검증 생략).
     *
     * @param userId 로그인 아이디
     * @throws com.kcabEvent.exception.custom.BusinessException 사용자 정보가 없을 경우
     */
    void login(String userId);
}
