package com.miso.lxnn.service.auth;

import com.miso.lxnn.domain.Btn;
import com.miso.lxnn.domain.MenuBtn;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.dto.common.MenuBtnDetailDto;
import com.miso.lxnn.dto.auth.MenuListDto;
import com.miso.lxnn.dto.auth.MenuSaveDto;

import java.util.List;

/**
 * MenuManagementService - 메뉴 관리 서비스 인터페이스
 *
 * <p>메뉴 계층 조회, 버튼 관리, 메뉴 저장·삭제 기능을 제공한다.</p>
 *
 * @see com.miso.lxnn.service.auth.impl.MenuManagementServiceImpl
 */
public interface MenuManagementService {
    /** 전체 메뉴 계층 목록을 조회한다 (관리자용). */
    List<MenuListDto> selectMenuInfo(String userId) throws Exception;
    /**
     * 사용자가 접근 권한을 가진 메뉴 계층 목록을 조회한다.
     * 허용된 메뉴의 상위 디렉토리 노드도 함께 포함된다.
     *
     * @param userId 로그인 아이디
     */
    List<MenuListDto> selectUserPermittedMenuInfo(String userId) throws Exception;
    /** 전체 버튼 목록을 조회한다. */
    List<Btn> selectBtnList() throws Exception;
    /** 메뉴에 연결된 전체 버튼 목록을 조회한다. */
    List<MenuBtn> selectMenuBtnList(Long menuSeq) throws Exception;
    /** 메뉴에 연결된 활성 버튼 목록을 조회한다. */
    List<MenuBtnDetailDto> selectActiveMenuBtnList(Long menuSeq) throws Exception;
    /**
     * 사용자가 해당 메뉴에서 권한을 가진 버튼 목록을 조회한다.
     *
     * @param userId  로그인 아이디
     * @param menuSeq 메뉴 순번
     */
    List<MenuBtnDetailDto> selectUserPermittedMenuBtnList(String userId, Long menuSeq) throws Exception;
    /**
     * 메뉴를 저장(등록/수정/삭제)한다.
     * 저장 시 연결 버튼도 기존 목록 전체 삭제 후 재등록한다 (트랜잭션).
     *
     * @param loginUser   현재 로그인 사용자
     * @param menuSaveDto 저장 요청 DTO (IudType으로 분기)
     */
    void saveMenu(LoginUser loginUser, MenuSaveDto menuSaveDto) throws Exception;
    /**
     * 메뉴를 삭제한다.
     *
     * @param menuSeq 삭제할 메뉴 순번
     */
    void deleteMenu(Integer menuSeq) throws Exception;
}
