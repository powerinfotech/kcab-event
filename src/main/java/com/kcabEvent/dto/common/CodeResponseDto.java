package com.kcabEvent.dto.common;

import lombok.Getter;
import lombok.Setter;

/**
 * CodeResponseDto - 공통 코드 응답 DTO
 *
 * <p>프론트엔드 Select/Combo 컴포넌트에 필요한 최소 코드 정보를 담는다.
 * {@code label}은 화면 표시 텍스트, {@code value}는 실제 저장 값, {@code parent}는 상위 코드다.</p>
 *
 * <h3>응답 예시</h3>
 * <pre>
 * // 2-필드 생성자 사용
 * new CodeResponseDto("남성", "MAN")
 * // → { "label": "남성", "value": "MAN", "parent": null }
 *
 * // 3-필드 생성자 사용 (부모 코드 포함)
 * new CodeResponseDto("서울", "11", "KR")
 * // → { "label": "서울", "value": "11", "parent": "KR" }
 * </pre>
 */
@Getter
@Setter
public class CodeResponseDto {
    /** 기본 생성자 (Jackson 역직렬화 및 빈 객체 생성용) */
    public CodeResponseDto(){}

    /**
     * label·value만 지정하는 생성자.
     *
     * @param label 화면 표시 텍스트
     * @param value 저장 값
     */
    public CodeResponseDto (String label,String value) {
        this.label = label;
        this.value = value;
    }

    /**
     * label·value·parent를 모두 지정하는 생성자.
     *
     * @param label  화면 표시 텍스트
     * @param value  저장 값
     * @param parent 상위(부모) 코드 값
     */
    public CodeResponseDto (String label,String value,String parent) {
        this.label = label;
        this.value = value;
        this.parent = parent;
    }

    /** 화면에 표시할 코드 이름 */
    private String label;
    /** DB 저장 또는 API 전송 시 사용하는 코드 값 */
    private String value;
    /** 상위(부모) 코드 값. 계층 구조가 없으면 {@code null} */
    private String parent;
}
