package com.power.dao;

import com.power.domain.Menu;
import com.power.dto.auth.MenuListDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

/**
 * MenuDao - 메뉴 MyBatis 매퍼 인터페이스
 *
 * <p>메뉴(tb_menu) 테이블의 CRUD를 담당하며,
 * 사용자별 접근 허용 메뉴 순번 조회도 제공한다.</p>
 *
 * @see com.power.service.auth.MenuManagementService
 */
@EgovMapper("menuDao")
public interface MenuDao {
    /**
     * 메뉴 전체 계층을 재귀 CTE로 펼친 목록을 조회한다.
     *
     * @param userId 사용자 아이디 (권한 필터링에 사용)
     */
    List<MenuListDto> selectMenuList(String userId);
    /**
     * 사용자가 권한을 가진 메뉴 순번 목록을 조회한다.
     *
     * @param userId 로그인 아이디
     */
    List<Long> selectUserPermittedMenuSeqs(String userId);
    /** 메뉴를 등록한다. */
    void insertMenu(Menu menu);
    /** 메뉴를 수정한다. */
    void updateMenu(Menu menu);
    /** 메뉴를 삭제한다. */
    void deleteMenu(@Param("menuSeq") Integer menuSeq);
}