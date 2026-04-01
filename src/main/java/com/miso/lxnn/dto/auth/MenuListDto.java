package com.miso.lxnn.dto.auth;

import com.miso.lxnn.domain.Menu;
import lombok.Getter;
import lombok.Setter;


/**
 * MenuListDto - 메뉴 목록 조회 결과 DTO
 *
 * <p>{@link Menu} 엔티티를 상속하고 계층 경로, 깊이, 등록자·수정자 이름을 추가로 제공한다.
 * 재귀 CTE 쿼리로 메뉴 전체 계층 트리를 평탄화한 결과를 담는다.</p>
 *
 * @see com.miso.lxnn.dao.MenuDao#selectMenuList
 */
@Getter
@Setter
public class MenuListDto extends Menu {
    /** 상위 메뉴명을 포함한 전체 경로 (예: {@code "시스템관리 > 메뉴관리"}) */
    private String menuNamePath;
    /** 상위 메뉴 ID를 포함한 전체 ID 경로 */
    private String menuIdPath;
    /** 메뉴 계층 깊이 (루트=1) */
    private Integer level;
    /** 등록자 이름 */
    private String rgstUserName;
    /** 수정자 이름 */
    private String uptUserName;
}
