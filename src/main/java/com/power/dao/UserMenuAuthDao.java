package com.power.dao;

import com.power.dto.auth.AuthMenuBtnListDto;
import com.power.dto.auth.AuthMenuMgtAuthListDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

/**
 * UserMenuAuthDao - 사용자 메뉴 권한 MyBatis 매퍼 인터페이스
 *
 * <p>사용자에게 부여된 권한 목록과 메뉴-버튼 허용 목록을 조회한다.
 * 로그인 후 사이드 메뉴 렌더링 및 버튼 권한 제어에 사용된다.</p>
 *
 * @see com.power.service.auth.UserMenuAuthService
 */
@EgovMapper("userMenuAuthDao")
public interface UserMenuAuthDao {
    /**
     * 사용자에게 배정된 권한 목록을 조회한다.
     *
     * @param userId 로그인 아이디
     */
    List<AuthMenuMgtAuthListDto> selectUserAuthList(@Param("userId") String userId) throws Exception;

    /**
     * 사용자의 모든 권한에서 허용된 메뉴-버튼 목록을 통합 조회한다.
     *
     * @param userId 로그인 아이디
     */
    List<AuthMenuBtnListDto> selectUserAllAuthMenuBtnList(@Param("userId") String userId) throws Exception;
}
