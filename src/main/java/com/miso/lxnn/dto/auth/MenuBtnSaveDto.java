package com.miso.lxnn.dto.auth;

import lombok.Getter;
import lombok.Setter;

/**
 * MenuBtnSaveDto - 메뉴-버튼 저장 항목 DTO
 *
 * <p>메뉴 저장 시 연결할 버튼 목록({@link MenuSaveDto#getMenuBtnList()})을 구성하는 단위 객체.
 * 메뉴에 버튼을 추가하거나 사용 여부를 지정할 때 사용한다.</p>
 *
 * @see MenuSaveDto
 */
@Getter
@Setter
public class MenuBtnSaveDto {
    /** 버튼 고유 순번 */
    private Long btnSeq;
    /** 버튼 표시명 (메뉴별 커스텀 이름; {@code null}이면 빈 문자열로 저장) */
    private String btnNm;
    /** 사용 여부 ({@code "Y"} / {@code "N"}) */
    private String useYn;
}
