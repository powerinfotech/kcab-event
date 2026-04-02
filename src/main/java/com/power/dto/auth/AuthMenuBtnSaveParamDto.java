package com.power.dto.auth;

import lombok.Getter;
import lombok.Setter;

import jakarta.validation.Valid;
import java.util.List;

/**
 * AuthMenuBtnSaveParamDto - 권한-메뉴-버튼 저장 요청 파라미터 DTO
 *
 * <p>{@code POST /api/auth-menu-mgt/save} 요청 Body.
 * 권한 그룹·권한 식별자와 변경된 메뉴-버튼 항목 목록을 함께 전달한다.</p>
 *
 * <h3>요청 예시</h3>
 * <pre>
 * {
 *   "authGrpSeq": 1,
 *   "authSeq": 2,
 *   "saveList": [
 *     { "authMenuBtnSeq": null, "menuSeq": 10, "btnSeq": 3, "useYn": "Y", "iudType": "I" },
 *     { "authMenuBtnSeq": 55,  "menuSeq": 10, "btnSeq": 4, "useYn": "N", "iudType": "U" }
 *   ]
 * }
 * </pre>
 *
 * @see com.power.service.auth.AuthMenuManagementService#save
 */
@Getter
@Setter
public class AuthMenuBtnSaveParamDto {
    /** 권한 그룹 고유 순번 */
    private Integer authGrpSeq;
    /** 권한 고유 순번 */
    private Integer authSeq;
    /** 저장할 권한-메뉴-버튼 변경 항목 목록 */
    @Valid
    private List<AuthMenuBtnSaveItemDto> saveList;
}
