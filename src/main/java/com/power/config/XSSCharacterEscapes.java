package com.power.config;

import com.fasterxml.jackson.core.SerializableString;
import com.fasterxml.jackson.core.io.CharacterEscapes;
import com.fasterxml.jackson.core.io.SerializedString;
import org.apache.commons.text.StringEscapeUtils;

/**
 * XSSCharacterEscapes - Jackson JSON 응답의 XSS 방어용 문자 이스케이프 설정
 *
 * <p>Jackson의 {@link CharacterEscapes}를 확장하여 JSON 직렬화 시
 * XSS 공격에 사용될 수 있는 특수문자를 HTML 엔티티로 자동 변환한다.</p>
 *
 * <p>{@link XSSConfig#jsonEscapeConverter()}에서 ObjectMapper에 적용된다.</p>
 *
 * <h3>이스케이프 대상 문자</h3>
 * <table border="1">
 *   <tr><th>문자</th><th>변환 결과 (HTML 엔티티)</th><th>차단 공격</th></tr>
 *   <tr><td>{@code <}</td><td>{@code &lt;}</td><td>HTML 태그 삽입</td></tr>
 *   <tr><td>{@code >}</td><td>{@code &gt;}</td><td>HTML 태그 삽입</td></tr>
 *   <tr><td>{@code &}</td><td>{@code &amp;}</td><td>엔티티 인젝션</td></tr>
 *   <tr><td>{@code "}</td><td>{@code &quot;}</td><td>속성값 탈출</td></tr>
 *   <tr><td>{@code (}</td><td>{@code &#40;}</td><td>스크립트 함수 호출</td></tr>
 *   <tr><td>{@code )}</td><td>{@code &#41;}</td><td>스크립트 함수 호출</td></tr>
 *   <tr><td>{@code #}</td><td>{@code &#35;}</td><td>URL 프래그먼트 조작</td></tr>
 *   <tr><td>{@code '}</td><td>{@code &#39;}</td><td>SQL/스크립트 인젝션</td></tr>
 * </table>
 *
 * <h3>동작 예시</h3>
 * <pre>
 * // DB 저장값: {@code <script>alert('xss')</script>}
 * // JSON 응답: {@code "\u003cscript\u003ealert(&#39;xss&#39;)\u003c/script\u003e"}
 * // 브라우저 렌더링: 스크립트 실행 없이 텍스트로 표시됨
 * </pre>
 *
 * <h3>주의사항</h3>
 * <p>이스케이프는 JSON 응답 직렬화 시점에만 적용된다.
 * DB 저장 전 입력값 필터링은 Lucy XSS Servlet Filter({@link XSSConfig})에서 처리한다.</p>
 */
public class XSSCharacterEscapes extends CharacterEscapes {

    private final int[] asciiEscapes;

    public XSSCharacterEscapes() {
        asciiEscapes = CharacterEscapes.standardAsciiEscapesForJSON();
        asciiEscapes['<']  = CharacterEscapes.ESCAPE_CUSTOM;
        asciiEscapes['>']  = CharacterEscapes.ESCAPE_CUSTOM;
        asciiEscapes['&']  = CharacterEscapes.ESCAPE_CUSTOM;
        asciiEscapes['"']  = CharacterEscapes.ESCAPE_CUSTOM;
        asciiEscapes['(']  = CharacterEscapes.ESCAPE_CUSTOM;
        asciiEscapes[')']  = CharacterEscapes.ESCAPE_CUSTOM;
        asciiEscapes['#']  = CharacterEscapes.ESCAPE_CUSTOM;
        asciiEscapes['\''] = CharacterEscapes.ESCAPE_CUSTOM;
    }

    /** ASCII 문자별 이스케이프 방식 배열 반환 */
    @Override
    public int[] getEscapeCodesForAscii() {
        return asciiEscapes;
    }

    /**
     * 커스텀 이스케이프 대상 문자를 HTML 엔티티 문자열로 변환한다.
     *
     * @param ch 이스케이프할 문자의 코드포인트
     * @return HTML 엔티티 문자열 (예: {@code &lt;}, {@code &#39;})
     */
    @Override
    public SerializableString getEscapeSequence(int ch) {
        return new SerializedString(StringEscapeUtils.escapeHtml4(Character.toString((char) ch)));
    }
}
