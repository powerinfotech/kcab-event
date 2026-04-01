package com.miso.lxnn.service.auth;

import com.miso.lxnn.dto.auth.AuthGrpListDto;
import com.miso.lxnn.dto.auth.AuthListDto;
import com.miso.lxnn.dto.auth.AuthManagementSaveDto;
import com.miso.lxnn.dto.auth.AuthUserListDto;
import com.miso.lxnn.dto.auth.UserSearchDto;
import com.miso.lxnn.dto.common.LoginUser;

import javax.validation.Valid;
import java.util.List;

/**
 * AuthManagementService - 권한 관리 서비스 인터페이스
 *
 * <p>권한 그룹 / 권한 / 권한-사용자 매핑의 조회 및 일괄 저장(I/U/D) 기능을 제공한다.</p>
 *
 * @see com.miso.lxnn.service.auth.impl.AuthManagementServiceImpl
 */
public interface AuthManagementService {
    /** 전체 권한 그룹 목록을 조회한다. */
    List<AuthGrpListDto> selectAuthGrpList() throws Exception;
    /** 권한 그룹에 속한 권한 목록을 조회한다. */
    List<AuthListDto> selectAuthList(Integer authGrpSeq) throws Exception;
    /** 권한에 배정된 사용자 목록을 조회한다. */
    List<AuthUserListDto> selectAuthUserList(Integer authGrpSeq, Integer authSeq) throws Exception;
    /**
     * 권한 배정 시 사용자를 검색한다.
     *
     * @param searchText    아이디 또는 이름 검색어
     * @param excludeUnused 비활성 사용자 제외 여부
     */
    List<UserSearchDto> selectUserSearchList(String searchText, Boolean excludeUnused) throws Exception;
    /**
     * 권한 그룹·권한·권한-사용자를 일괄 저장한다 (트랜잭션).
     *
     * @param saveDto   변경 목록이 담긴 저장 DTO
     * @param loginUser 현재 로그인 사용자 (등록자·수정자 설정에 사용)
     */
    void saveAuthManagement(@Valid AuthManagementSaveDto saveDto, LoginUser loginUser) throws Exception;
}
