package com.miso.lxnn.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * MenuType - 메뉴 유형 코드
 *
 * <p>메뉴(tb_menu)의 종류를 구분한다.
 * 디렉토리({@code D})는 자식 메뉴를 가지는 폴더 역할을 하고,
 * 화면({@code V})은 실제 페이지와 연결되는 말단 메뉴다.</p>
 *
 * <h3>사용 예시</h3>
 * <pre>
 * MenuType type = MenuType.V;
 * String label = type.getValue(); // "화면"
 * </pre>
 *
 * @see com.miso.lxnn.domain.Menu
 */
@Getter
@RequiredArgsConstructor
public enum MenuType {
    /** 디렉토리 — 자식 메뉴를 포함하는 상위 노드 */
    D("디렉토리"),
    /** 화면 — 실제 페이지와 연결되는 말단 메뉴 */
    V("화면")
    ;

    /** 화면 표시용 한국어 이름 */
    private final String value;
}
