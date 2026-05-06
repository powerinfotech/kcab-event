package com.kcabEvent.dto.auth;

import lombok.Getter;
import lombok.Setter;

/**
 * AuthMenuMgtAuthListDto - 권한 메뉴 관리 화면용 권한 목록 DTO
 *
 * <p>권한 메뉴 관리 화면 좌측 권한 선택 목록을 위해
 * 권한 그룹명과 권한 정보를 함께 조회한 결과를 담는다.</p>
 *
 * @see com.kcabEvent.dao.AuthMenuManagementDao#selectAuthListWithGroup
 * @see com.kcabEvent.dao.UserMenuAuthDao#selectUserAuthList
 */
@Getter
@Setter
public class AuthMenuMgtAuthListDto {
    /** 권한 고유 순번 */
    private Integer authSeq;
    /** 권한 그룹 고유 순번 */
    private Integer authGrpSeq;
    /** 권한 그룹명 */
    private String authGrpNm;
    /** 권한명 */
    private String authNm;
    /** 권한 설명 */
    private String authExpl;
    /** 사용 여부 ({@code "Y"} / {@code "N"}) */
    private String useYn;
}
