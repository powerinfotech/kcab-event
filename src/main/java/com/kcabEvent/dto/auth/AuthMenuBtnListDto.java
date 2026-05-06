package com.kcabEvent.dto.auth;

import lombok.Getter;
import lombok.Setter;

/**
 * AuthMenuBtnListDto - 권한별 메뉴·버튼 목록 조회 결과 DTO
 *
 * <p>재귀 CTE로 메뉴 계층을 펼치고, 버튼/메뉴버튼/권한메뉴버튼 테이블을 조인한 결과를 담는다.
 * 권한 메뉴 관리 화면에서 권한별 버튼 허용 여부를 표시·편집하는 데 사용한다.</p>
 *
 * @see com.kcabEvent.dao.AuthMenuManagementDao#selectAuthMenuBtnList
 */
@Getter
@Setter
public class AuthMenuBtnListDto {
    // ─── tb_menu (via recursive CTE) ──────────────────────────────────
    /** 메뉴 고유 순번 */
    private Integer menuSeq;
    /** 상위 메뉴 순번 */
    private Integer upMenuSeq;
    /** 메뉴명 */
    private String menuNm;
    /** 메뉴 유형 코드 (D: 디렉토리, V: 화면) */
    private String menuTypeCd;
    /** 메뉴 사용 여부 */
    private String menuUseYn;
    /** 메뉴 정렬 순서 */
    private Integer sortSeq;
    /** 메뉴 계층 깊이 (루트=1) */
    private Integer level;
    /** 정렬 경로 문자열 (계층 정렬용) */
    private String sortSeqPath;

    // ─── tb_btn ───────────────────────────────────────────────────────
    /** 버튼 고유 순번 */
    private Long btnSeq;
    /** 버튼 정렬 순서 */
    private Integer btnSortSeq;
    /** 버튼명 */
    private String btnNm;

    // ─── tb_menu_btn ──────────────────────────────────────────────────
    /** 메뉴-버튼 연결 사용 여부 */
    private String menuBtnUseYn;

    // ─── tb_auth_menu_btn ─────────────────────────────────────────────
    /** 권한-메뉴-버튼 매핑 고유 순번 */
    private Long authMenuBtnSeq;
    /** 권한-메뉴-버튼 사용 허용 여부 */
    private String authMenuBtnUseYn;
}
