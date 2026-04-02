package com.power.dto.auth;

import com.power.domain.Menu;
import com.power.enums.IudType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * MenuSaveDto - 메뉴 저장 요청 DTO
 *
 * <p>{@link Menu} 엔티티를 상속하고 {@link IudType} 및 연결 버튼 목록을 추가한다.
 * 메뉴 저장 시 연결 버튼도 함께 일괄 처리(전체 삭제 후 재등록)한다.</p>
 *
 * <h3>요청 예시</h3>
 * <pre>
 * {
 *   "menuSeq": null, "menuNm": "사용자관리", "menuTypeCd": "V",
 *   "iudType": "I",
 *   "menuBtnList": [
 *     { "btnSeq": 1, "btnNm": "저장", "useYn": "Y" }
 *   ]
 * }
 * </pre>
 *
 * @see com.power.service.auth.MenuManagementService#saveMenu
 */
@Getter
@Setter
public class MenuSaveDto extends Menu {
    /** 행 변경 유형 (I: 추가, U: 수정, D: 삭제) */
    private IudType iudType;
    /** 이 메뉴에 연결할 버튼 목록 (저장 시 기존 연결 버튼은 전체 삭제 후 재등록) */
    private List<MenuBtnSaveDto> menuBtnList;
}
