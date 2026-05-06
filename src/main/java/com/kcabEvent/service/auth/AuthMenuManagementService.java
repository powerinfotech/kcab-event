package com.kcabEvent.service.auth;

import com.kcabEvent.dto.auth.AuthMenuBtnListDto;
import com.kcabEvent.dto.auth.AuthMenuBtnSaveItemDto;
import com.kcabEvent.dto.auth.AuthMenuMgtAuthListDto;
import com.kcabEvent.dto.common.LoginUser;

import java.util.List;

/**
 * AuthMenuManagementService - 권한 메뉴 관리 서비스 인터페이스
 *
 * <p>권한별 메뉴-버튼 허용 목록 조회 및 저장(I/U) 기능을 제공한다.</p>
 *
 * @see com.kcabEvent.service.auth.impl.AuthMenuManagementServiceImpl
 */
public interface AuthMenuManagementService {
    /**
     * 권한명으로 권한 그룹·권한 목록을 조회한다.
     *
     * @param authNm 권한명 검색어 ({@code null}이면 전체)
     */
    List<AuthMenuMgtAuthListDto> selectAuthListWithGroup(String authNm);

    /**
     * 권한에 할당된 메뉴-버튼 목록을 조회한다.
     *
     * @param authGrpSeq 권한 그룹 순번
     * @param authSeq    권한 순번
     */
    List<AuthMenuBtnListDto> selectAuthMenuBtnList(Integer authGrpSeq, Integer authSeq);

    /**
     * 권한-메뉴-버튼 허용 목록을 저장한다 (트랜잭션).
     *
     * @param loginUser  현재 로그인 사용자 (등록자·수정자 설정에 사용)
     * @param authGrpSeq 권한 그룹 순번
     * @param authSeq    권한 순번
     * @param saveList   변경 항목 목록 (I/U만 처리, D는 지원하지 않음)
     */
    void save(LoginUser loginUser, Integer authGrpSeq, Integer authSeq,
              List<AuthMenuBtnSaveItemDto> saveList);
}
