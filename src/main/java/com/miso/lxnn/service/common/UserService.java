package com.miso.lxnn.service.common;

import com.miso.lxnn.domain.User;

/**
 * UserService - 공통 사용자 조회 서비스 인터페이스
 *
 * <p>로그인된 사용자 정보 조회 등 공통 목적의 사용자 조회 기능을 제공한다.
 * 사용자 CRUD 관리는 {@link com.miso.lxnn.service.master.UserManagementService}를 사용한다.</p>
 *
 * @see com.miso.lxnn.service.common.impl.UserServiceImpl
 */
public interface UserService {
    /**
     * 아이디로 사용자 정보를 조회한다.
     *
     * @param userId 로그인 아이디
     * @return 사용자 엔티티, 없으면 {@code null}
     */
    User selectUserInfo(String userId) throws Exception;
}
