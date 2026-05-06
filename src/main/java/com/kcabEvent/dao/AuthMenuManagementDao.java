package com.kcabEvent.dao;

import com.kcabEvent.domain.AuthMenuBtn;
import com.kcabEvent.dto.auth.AuthMenuBtnListDto;
import com.kcabEvent.dto.auth.AuthMenuMgtAuthListDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

/**
 * AuthMenuManagementDao - 권한 메뉴 관리 MyBatis 매퍼 인터페이스
 *
 * <p>권한-메뉴-버튼 매핑(tb_auth_menu_btn)과 권한 그룹·권한 조회를 담당한다.</p>
 *
 * @see com.kcabEvent.service.auth.AuthMenuManagementService
 */
@EgovMapper("authMenuManagementDao")
public interface AuthMenuManagementDao {

    /**
     * 권한 그룹명과 권한명이 포함된 권한 목록을 조회한다.
     *
     * @param authNm 권한명 검색어 ({@code null}이면 전체)
     */
    List<AuthMenuMgtAuthListDto> selectAuthListWithGroup(@Param("authNm") String authNm);

    /**
     * 권한에 할당된 메뉴-버튼 목록을 재귀 CTE로 계층 전개하여 조회한다.
     *
     * @param authGrpSeq 권한 그룹 순번
     * @param authSeq    권한 순번
     */
    List<AuthMenuBtnListDto> selectAuthMenuBtnList(
            @Param("authGrpSeq") Integer authGrpSeq,
            @Param("authSeq") Integer authSeq
    );

    /** 권한-메뉴-버튼 매핑을 등록한다. */
    void insertAuthMenuBtn(AuthMenuBtn authMenuBtn);

    /** 권한-메뉴-버튼 매핑을 수정한다. */
    void updateAuthMenuBtn(AuthMenuBtn authMenuBtn);
}
