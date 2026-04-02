package com.power.service.common.impl;

import com.power.service.common.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;

/**
 * AuthServiceImpl - {@link AuthService} 구현체
 *
 * <p>현재 구현 없이 확장을 위해 예약된 서비스 빈.
 * 공통 인증 로직(세션 검증, 권한 확인 등)이 필요할 때 이 클래스에 추가한다.</p>
 */
@Slf4j
@Service("authService")
public class AuthServiceImpl extends EgovAbstractServiceImpl implements AuthService {


}
