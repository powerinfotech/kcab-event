package com.kcabEvent.aop;

import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * CustomParameterHandler - 요청 파라미터 전처리기
 *
 * <p>{@link RestControllerAdvice}와 {@link InitBinder}를 결합하여
 * 모든 {@code @RequestParam} / {@code @ModelAttribute} {@link String} 파라미터에
 * 앞뒤 공백 제거 및 빈 문자열 → {@code null} 변환을 자동으로 적용한다.</p>
 *
 * <h3>처리 규칙</h3>
 * <ul>
 *   <li>앞뒤 공백 제거 (trim)</li>
 *   <li>공백 제거 후 빈 문자열이면 {@code null}로 변환 (emptyAsNull=true)</li>
 * </ul>
 *
 * <h3>적용 범위</h3>
 * <ul>
 *   <li>{@code @RequestParam} — 쿼리 파라미터 / 폼 필드</li>
 *   <li>{@code @ModelAttribute} — 모델 바인딩 객체의 String 필드</li>
 *   <li>JSON {@code @RequestBody}는 적용되지 않음 (Jackson 직렬화 경로이므로
 *       {@link com.kcabEvent.util.json.StringStripJsonDeserializer}가 처리)</li>
 * </ul>
 *
 * <h3>동작 예시</h3>
 * <pre>
 * // 요청 파라미터
 * GET /api/search?keyword=++++hello++++
 *
 * // @RequestParam String keyword → "hello"
 *
 * GET /api/search?keyword=++++
 * // @RequestParam String keyword → null
 * </pre>
 *
 * @see com.kcabEvent.util.json.StringStripJsonDeserializer
 */
@RestControllerAdvice
public class CustomParameterHandler {

    /**
     * 모든 컨트롤러에 {@link StringTrimmerEditor}를 등록한다.
     *
     * @param dataBinder 요청별로 생성되는 데이터 바인더
     */
    @InitBinder
    public void InitBinder(WebDataBinder dataBinder) {
        StringTrimmerEditor ste = new StringTrimmerEditor(true);    // emptyAsNull: true (빈문자열은 null로 파싱함)
        dataBinder.registerCustomEditor(String.class, ste);
    }
}