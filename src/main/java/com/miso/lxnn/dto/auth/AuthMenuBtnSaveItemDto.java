package com.miso.lxnn.dto.auth;

import com.miso.lxnn.enums.IudType;
import lombok.Getter;
import lombok.Setter;

/**
 * AuthMenuBtnSaveItemDto - 권한-메뉴-버튼 저장 항목 DTO
 *
 * <p>권한 메뉴 관리 화면에서 버튼 허용 여부를 변경할 때 개별 항목을 표현한다.
 * {@link AuthMenuBtnSaveParamDto}의 {@code saveList}를 구성하는 단위 객체.</p>
 *
 * @see AuthMenuBtnSaveParamDto
 */
@Getter
@Setter
public class AuthMenuBtnSaveItemDto {
    /** 권한-메뉴-버튼 매핑 고유 순번 (신규 추가 시 {@code null}) */
    private Long authMenuBtnSeq;
    /** 메뉴 고유 순번 */
    private Integer menuSeq;
    /** 버튼 고유 순번 */
    private Long btnSeq;
    /** 사용 허용 여부 ({@code "Y"} / {@code "N"}) */
    private String useYn;
    /** 행 변경 유형 (I: 추가, U: 수정) */
    private IudType iudType;
}
