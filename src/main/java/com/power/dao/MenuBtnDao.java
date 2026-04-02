package com.power.dao;

import com.power.domain.MenuBtn;
import com.power.dto.common.MenuBtnDetailDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

/**
 * MenuBtnDao - 메뉴-버튼 MyBatis 매퍼 인터페이스
 *
 * <p>메뉴-버튼 매핑(tb_menu_btn)의 조회 및 저장을 담당한다.
 * 메뉴 저장 시 기존 버튼을 전체 삭제하고 새 목록으로 재등록하는 방식을 사용한다.</p>
 *
 * @see com.power.service.auth.MenuManagementService
 */
@EgovMapper("menuBtnDao")
public interface MenuBtnDao {
    /** 메뉴에 연결된 전체 버튼 목록을 조회한다. */
    List<MenuBtn> selectByMenuSeq(@Param("menuSeq") Long menuSeq);
    /** 메뉴에 연결된 활성({@code useYn=Y}) 버튼 목록을 상세 정보와 함께 조회한다. */
    List<MenuBtnDetailDto> selectActiveByMenuSeq(@Param("menuSeq") Long menuSeq);
    /**
     * 사용자가 해당 메뉴에서 권한을 가진 버튼 목록을 조회한다.
     *
     * @param userId  로그인 아이디
     * @param menuSeq 메뉴 순번
     */
    List<MenuBtnDetailDto> selectUserPermittedMenuBtnList(@Param("userId") String userId, @Param("menuSeq") Long menuSeq);
    /** 메뉴에 연결된 모든 버튼 매핑을 삭제한다 (저장 전 초기화에 사용). */
    void deleteByMenuSeq(@Param("menuSeq") Long menuSeq);
    /** 메뉴-버튼 매핑을 등록한다. */
    void insert(MenuBtn menuBtn);
}
