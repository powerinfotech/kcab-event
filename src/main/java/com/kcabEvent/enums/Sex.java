package com.kcabEvent.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Sex - 성별 코드
 *
 * <p>사용자 성별을 나타내는 열거형.
 * {@code value}는 화면 표시용 한국어 이름이고,
 * {@code temp}는 DB 저장용 단문자 코드({@code "M"}/{@code "F"})다.</p>
 *
 * <p><strong>참고:</strong> {@code temp} 필드는 명명이 적절하지 않으나
 * 기존 DB 스키마 및 매퍼와 호환성을 유지하기 위해 변경하지 않는다.
 * 신규 코드에서는 {@code sex.getTemp()}보다 상수 비교({@code "M"}, {@code "F"})를 권장한다.</p>
 *
 * <h3>사용 예시</h3>
 * <pre>
 * Sex sex = Sex.MAN;
 * sex.getValue(); // "남성"
 * sex.getTemp();  // "M"
 * </pre>
 */
@Getter
@RequiredArgsConstructor
public enum Sex {
    /** 남성 (DB 코드: {@code "M"}) */
    MAN("남성", "M"),
    /** 여성 (DB 코드: {@code "F"}) */
    WOMAN("여성", "F")
    ;

    /** 화면 표시용 한국어 이름 */
    private final String value;
    /**
     * DB 저장용 단문자 성별 코드 ({@code "M"} / {@code "F"}).
     * 필드명이 {@code temp}인 것은 초기 설계 당시의 임시 명칭이 굳어진 것이다.
     */
    private final String temp;

}
