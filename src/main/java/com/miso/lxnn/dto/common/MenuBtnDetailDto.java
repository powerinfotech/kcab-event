package com.miso.lxnn.dto.common;

import lombok.Getter;
import lombok.Setter;

/**
 * MenuBtnDetailDto - 메뉴 버튼 상세 응답 DTO
 *
 * <p>특정 메뉴에 연결된 버튼의 상세 정보를 담는다.
 * 프론트엔드에서 메뉴별 버튼 권한 목록 렌더링에 사용된다.</p>
 *
 * <h3>응답 예시</h3>
 * <pre>
 * { "btnSeq": 1, "btnNm": "저장", "btnFuncCd": "SAVE", "sortSeq": 1 }
 * </pre>
 *
 * @see com.miso.lxnn.dao.MenuBtnDao
 */
@Getter
@Setter
public class MenuBtnDetailDto {
    /** 버튼 고유 순번 (tb_btn.btn_seq) */
    private Long btnSeq;
    /** 버튼 표시명 (tb_menu_btn.btn_nm) */
    private String btnNm;
    /** 버튼 기능 코드 (tb_btn.btn_func_cd, 예: {@code "SAVE"}, {@code "DELETE"}) */
    private String btnFuncCd;
    /** 버튼 정렬 순서 */
    private Integer sortSeq;
}
