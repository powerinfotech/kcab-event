package com.miso.lxnn.util.json;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;

/**
 * StringStripJsonDeserializer - JSON 문자열 앞뒤 공백 제거 역직렬화
 *
 * <p>Jackson이 JSON 요청 본문의 모든 {@link String} 필드를 역직렬화할 때 자동으로
 * {@link String#strip()}을 적용하여 앞뒤 공백(유니코드 공백 포함)을 제거한다.
 * {@link com.miso.lxnn.config.JacksonConfig#customJsonDeSerializeModule}에서 전역 등록된다.</p>
 *
 * <h3>처리 규칙</h3>
 * <ul>
 *   <li>앞뒤 공백 제거 ({@link String#strip()} — 유니코드 공백도 처리)</li>
 *   <li>공백 제거 후 빈 문자열이 되면 {@code null}로 변환</li>
 *   <li>JSON의 {@code null} 값은 그대로 {@code null} 반환</li>
 * </ul>
 *
 * <h3>동작 예시</h3>
 * <pre>
 * // 요청 Body
 * { "userName": "  홍길동  ", "memo": "   ", "email": null }
 *
 * // 역직렬화 결과
 * userName → "홍길동"   (앞뒤 공백 제거)
 * memo     → null      (공백만 있는 문자열 → null)
 * email    → null      (원래 null)
 * </pre>
 *
 * <h3>주의사항</h3>
 * <p>빈 문자열({@code ""})과 공백만 있는 문자열({@code "   "}) 모두 {@code null}로 변환된다.
 * 빈 문자열을 그대로 유지해야 하는 필드가 있다면 해당 DTO에
 * {@code @JsonDeserialize(using = UntypedObjectDeserializer.class)}를 적용하여 오버라이드한다.</p>
 */
public class StringStripJsonDeserializer extends JsonDeserializer<String> {

    /**
     * JSON 문자열을 앞뒤 공백 제거 후 반환한다.
     * 공백 제거 후 빈 문자열이면 {@code null}을 반환한다.
     *
     * @param p   JSON 파서
     * @param ctx 역직렬화 컨텍스트
     * @return 공백이 제거된 문자열, 또는 {@code null}
     * @throws IOException JSON 읽기 오류
     */
    @Override
    public String deserialize(JsonParser p, DeserializationContext ctx) throws IOException {
        // p.getValueAsString()은 JSON null 토큰을 "" (빈 문자열)로 반환한다.
        // p.getText()와 달리 null 토큰에 대해 "null" 문자열을 반환하지 않으므로
        // null → null 변환이 의도대로 동작한다.
        String value = p.getValueAsString();

        if (value == null) {
            return null;
        }

        String valueStripped = value.strip();

        return valueStripped.length() != 0 ? valueStripped : null;
    }
}
