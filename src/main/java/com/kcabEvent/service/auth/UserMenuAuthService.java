package com.kcabEvent.service.auth;

import com.kcabEvent.dto.auth.AuthMenuBtnListDto;
import com.kcabEvent.dto.auth.AuthMenuMgtAuthListDto;

import java.util.List;

/**
 * UserMenuAuthService - 사용자 메뉴 권한 서비스 인터페이스
 *
 * <p>사용자에게 부여된 권한 목록과 메뉴-버튼 허용 목록을 조회한다.
 * 로그인 후 사이드 메뉴 구성 및 버튼 권한 제어에 사용된다.</p>
 *
 * @see com.kcabEvent.service.auth.impl.UserMenuAuthServiceImpl
 */
public interface UserMenuAuthService {
    /**
     * 사용자에게 배정된 권한 목록을 조회한다.
     *
     * @param userId 로그인 아이디
     */
    List<AuthMenuMgtAuthListDto> selectUserAuthList(String userId);

    /**
     * 사용자의 모든 권한에서 허용된 메뉴-버튼 목록을 통합 조회한다.
     *
     * @param userId 로그인 아이디
     */
    List<AuthMenuBtnListDto> selectUserAllAuthMenuBtnList(String userId);
}
