package com.power.dto.auth;

import lombok.Getter;
import lombok.Setter;


/**
 * MenuListSearchDto - 메뉴 목록 검색 조건 DTO
 *
 * <p>메뉴 관리 화면에서 메뉴명 검색 및 미사용 메뉴 제외 여부를 전달한다.</p>
 *
 * @see com.power.dao.MenuDao#selectMenuList
 */
@Getter
@Setter
public class MenuListSearchDto {
    /** 메뉴명 검색어 (부분 일치, {@code null}이면 전체 조회) */
    private String menuNm;
    /** {@code true}이면 사용 여부가 {@code "N"}인 메뉴를 제외한다 */
    private Boolean isExceptUnused;
}
