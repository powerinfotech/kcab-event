package com.kcabEvent.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * UserClass - 사용자 직급 분류
 *
 * <p>사용자 계정(tb_user)의 직급 구분을 나타낸다.
 * 현재 사원({@code EMPLOYEE})과 임원({@code EXECUTIVE}) 두 가지를 지원한다.</p>
 *
 * <h3>사용 예시</h3>
 * <pre>
 * UserClass cls = UserClass.EXECUTIVE;
 * String label = cls.getValue(); // "임원"
 * </pre>
 *
 * @see com.kcabEvent.domain.User
 */
@Getter
@RequiredArgsConstructor
public enum UserClass {
    /** 사원 직급 */
    EMPLOYEE("사원"),
    /** 임원 직급 */
    EXECUTIVE("임원")
    ;

    /** 화면 표시용 한국어 이름 */
    private final String value;

}
