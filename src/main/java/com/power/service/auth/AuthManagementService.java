package com.power.service.auth;

import com.power.dto.auth.AuthGrpListDto;
import com.power.dto.auth.AuthListDto;
import com.power.dto.auth.AuthManagementSaveDto;
import com.power.dto.auth.AuthUserListDto;
import com.power.dto.auth.UserSearchDto;
import com.power.dto.common.LoginUser;

import jakarta.validation.Valid;
import java.util.List;

/**
 * AuthManagementService - 권한 관리 서비스 인터페이스
 *
 * <p>권한 그룹 / 권한 / 권한-사용자 매핑의 조회 및 일괄 저장(I/U/D) 기능을 제공한다.</p>
 *
 * @see com.power.service.auth.impl.AuthManagementServiceImpl
 */
public interface AuthManagementService {
    /** 전체 권한 그룹 목록을 조회한다. */
    List<AuthGrpListDto> selectAuthGrpList();
    /** 권한 그룹에 속한 권한 목록을 조회한다. */
    List<AuthListDto> selectAuthList(Integer authGrpSeq);
    /** 권한에 배정된 사용자 목록을 조회한다. */
    List<AuthUserListDto> selectAuthUserList(Integer authGrpSeq, Integer authSeq);
    /**
     * 권한 배정 시 사용자를 검색한다.
     *
     * @param searchText    아이디 또는 이름 검색어
     * @param excludeUnused 비활성 사용자 제외 여부
     */
    List<UserSearchDto> selectUserSearchList(String searchText, Boolean excludeUnused);
    /**
     * 권한 그룹·권한·권한-사용자를 일괄 저장한다 (트랜잭션).
     *
     * @param saveDto   변경 목록이 담긴 저장 DTO
     * @param loginUser 현재 로그인 사용자 (등록자·수정자 설정에 사용)
     */
    void saveAuthManagement(@Valid AuthManagementSaveDto saveDto, LoginUser loginUser);
}
