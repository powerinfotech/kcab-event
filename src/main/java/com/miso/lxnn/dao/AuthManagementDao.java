package com.miso.lxnn.dao;

import com.miso.lxnn.domain.Auth;
import com.miso.lxnn.domain.AuthGrp;
import com.miso.lxnn.domain.AuthUser;
import com.miso.lxnn.dto.auth.AuthGrpListDto;
import com.miso.lxnn.dto.auth.AuthListDto;
import com.miso.lxnn.dto.auth.AuthUserListDto;
import com.miso.lxnn.dto.auth.UserSearchDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.Mapper;

import java.util.List;

/**
 * AuthManagementDao - 권한 관리 MyBatis 매퍼 인터페이스
 *
 * <p>권한 그룹(tb_auth_grp), 권한(tb_auth), 권한-사용자(tb_auth_user) 테이블에 대한 CRUD를 담당한다.
 * 권한 그룹 삭제 시 연관 데이터(권한, 권한-사용자, 권한-메뉴-버튼)를 연쇄 삭제한다.</p>
 *
 * @see com.miso.lxnn.service.auth.AuthManagementService
 */
@Mapper("authManagementDao")
public interface AuthManagementDao {
    /** 전체 권한 그룹 목록을 조회한다. */
    List<AuthGrpListDto> selectAuthGrpList() throws Exception;
    /** 권한 그룹을 등록한다. */
    void insertAuthGrp(AuthGrp authGrp) throws Exception;
    /** 권한 그룹을 수정한다. */
    void updateAuthGrp(AuthGrp authGrp) throws Exception;
    /** 권한 그룹을 삭제한다. */
    void deleteAuthGrp(@Param("authGrpSeq") Integer authGrpSeq) throws Exception;

    /** 권한 그룹에 속한 권한 목록을 조회한다. */
    List<AuthListDto> selectAuthList(@Param("authGrpSeq") Integer authGrpSeq) throws Exception;
    /** 권한을 등록한다. */
    void insertAuth(Auth auth) throws Exception;
    /** 권한을 수정한다. */
    void updateAuth(Auth auth) throws Exception;
    /** 권한을 삭제한다. */
    void deleteAuth(@Param("authSeq") Integer authSeq) throws Exception;

    /** 권한에 배정된 사용자 목록을 조회한다. */
    List<AuthUserListDto> selectAuthUserList(@Param("authGrpSeq") Integer authGrpSeq, @Param("authSeq") Integer authSeq) throws Exception;
    /** 권한-사용자 매핑을 등록한다. */
    void insertAuthUser(AuthUser authUser) throws Exception;
    /** 권한-사용자 매핑을 수정한다. */
    void updateAuthUser(AuthUser authUser) throws Exception;
    /** 권한-사용자 매핑을 삭제한다. */
    void deleteAuthUser(@Param("authUserSeq") Integer authUserSeq) throws Exception;
    /** 권한 삭제 시 연관된 권한-사용자 매핑을 연쇄 삭제한다. */
    void deleteAuthUserByAuthSeq(@Param("authSeq") Integer authSeq) throws Exception;
    /** 권한 그룹 삭제 시 연관된 권한을 연쇄 삭제한다. */
    void deleteAuthByAuthGrpSeq(@Param("authGrpSeq") Integer authGrpSeq) throws Exception;
    /** 권한 그룹 삭제 시 연관된 권한-사용자 매핑을 연쇄 삭제한다. */
    void deleteAuthUserByAuthGrpSeq(@Param("authGrpSeq") Integer authGrpSeq) throws Exception;
    /** 권한 삭제 시 연관된 권한-메뉴-버튼 매핑을 연쇄 삭제한다. */
    void deleteAuthMenuBtnByAuthSeq(@Param("authSeq") Integer authSeq) throws Exception;
    /** 권한 그룹 삭제 시 연관된 권한-메뉴-버튼 매핑을 연쇄 삭제한다. */
    void deleteAuthMenuBtnByAuthGrpSeq(@Param("authGrpSeq") Integer authGrpSeq) throws Exception;

    /**
     * 권한 배정 시 사용자를 검색한다.
     *
     * @param searchText   아이디 또는 이름 검색어 ({@code null}이면 전체)
     * @param excludeUnused {@code true}이면 비활성 사용자를 제외한다
     */
    List<UserSearchDto> selectUserSearchList(@Param("searchText") String searchText, @Param("excludeUnused") Boolean excludeUnused) throws Exception;
}
