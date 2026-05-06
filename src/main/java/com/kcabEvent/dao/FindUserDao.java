package com.kcabEvent.dao;

import com.kcabEvent.domain.User;
import org.apache.ibatis.annotations.Mapper;

/**
 * FindUserDao - 아이디·비밀번호 찾기 MyBatis 매퍼 인터페이스
 *
 * <p>로그인 화면의 아이디·비밀번호 찾기 기능에서 사용자를 조회한다.
 * 세션 인증 없이 접근 가능한 공개 엔드포인트에서만 사용한다.</p>
 *
 * @see com.kcabEvent.service.auth.FindUserService
 */
@Mapper
public interface FindUserDao {

    /**
     * 사용자 이름·이메일로 아이디를 찾는다.
     *
     * @param user 검색 조건 (userName, email 등)
     * @return 일치하는 사용자, 없으면 {@code null}
     */
    User findUserId(User user);

    /**
     * 아이디·이메일로 비밀번호 재설정 대상 사용자를 찾는다.
     *
     * @param user 검색 조건 (userId, email 등)
     * @return 일치하는 사용자, 없으면 {@code null}
     */
    User findUserPassword(User user);
}
