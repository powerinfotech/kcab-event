package com.kcabEvent.dto.saf;

import lombok.Getter;
import lombok.Setter;

/**
 * SAF 사용자 관리 목록 검색 조건 DTO.
 *
 * <p>관리자 화면에서 사용자/기관 목록을 조회할 때 검색어, 사용자 유형, 상태 조건을 전달한다.</p>
 */
@Getter
@Setter
public class SafAdminUserSearchDto {
    /** 사용자 ID, 이름, 이메일, 기관명 통합 검색어 */
    private String keyword;
    /** 사용자 유형(admin, organization) */
    private String userType;
    /** 사용자 또는 기관 상태 */
    private String status;
}
