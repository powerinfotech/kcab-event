package com.kcabEvent.service.auth;

import com.kcabEvent.domain.User;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.master.UserChangePasswordDto;

/**
 * FindUserService - 아이디·비밀번호 찾기 서비스 인터페이스
 *
 * <p>세션 인증 없이 접근 가능한 아이디·비밀번호 찾기 및 비밀번호 재설정 기능을 제공한다.</p>
 *
 * @see com.kcabEvent.service.auth.impl.FindUserServiceImpl
 */
public interface FindUserService {
    /**
     * 사용자 이름·이메일로 아이디를 찾는다.
     *
     * @param user 검색 조건 (userName, email 등 포함)
     * @return 일치하는 사용자, 없으면 {@code null}
     */
    User findUserId(User user);

    /**
     * 아이디·이메일로 비밀번호 재설정 대상 사용자를 찾는다.
     *
     * @param user 검색 조건 (userId, email 등 포함)
     * @return 일치하는 사용자, 없으면 {@code null}
     */
    User findUserPassword(User user);

    /**
     * 비밀번호를 재설정한다.
     *
     * @param user 비밀번호 변경 요청 DTO (BCrypt 해시화 후 DB 저장)
     */
    void changePassword(UserChangePasswordDto user);
}
