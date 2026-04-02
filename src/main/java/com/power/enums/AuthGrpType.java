package com.power.enums;


import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * AuthGrpType - 권한 그룹 유형
 *
 * <p>권한 그룹(tb_auth_grp)의 구분 코드를 정의한다.
 * 현재는 역할(ROLE) 유형만 사용하며, 향후 조직·직급 기반 그룹 등을 추가할 수 있다.</p>
 *
 * <h3>사용 예시</h3>
 * <pre>
 * AuthGrpType type = AuthGrpType.ROLE;
 * String label = type.getValue(); // "역할"
 * </pre>
 *
 * @see com.power.domain.AuthGrp
 */
@Getter
@RequiredArgsConstructor
public enum AuthGrpType {
    /** 역할 기반 권한 그룹 */
    ROLE("역할")
    ;

    /** 화면 표시용 한국어 이름 */
    private final String value;
}
