package com.miso.lxnn.util.formatter;

import org.springframework.format.Formatter;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/**
 * LocalDateFormatter - {@link LocalDate} 문자열 변환 포맷터
 *
 * <p>Spring MVC의 {@code @RequestParam}, {@code @ModelAttribute}에서
 * {@code "yyyy-MM-dd"} 형식의 날짜 문자열을 {@link LocalDate}로 자동 변환하거나
 * {@link LocalDate}를 문자열로 출력할 때 사용한다.</p>
 *
 * <p>{@link com.miso.lxnn.config.WebMvcConfig#addFormatters}에서 등록된다.</p>
 *
 * <p>JSON 요청/응답의 날짜 변환은 이 포맷터가 아닌
 * {@link com.miso.lxnn.config.JacksonConfig}의 {@code CustomLocalDateSerializer} /
 * {@code CustomLocalDateDeserializer}가 담당한다.</p>
 *
 * <h3>지원 포맷</h3>
 * <ul>
 *   <li>파싱: {@code "yyyy-MM-dd"} (예: {@code "2026-03-31"})</li>
 *   <li>출력: {@code "yyyy-MM-dd"} (예: {@code "2026-03-31"})</li>
 * </ul>
 *
 * <h3>사용 예시</h3>
 * <pre>
 * // Controller @RequestParam
 * {@code @GetMapping("/api/reports")}
 * public ResponseEntity<?> getReport(
 *         {@code @RequestParam} LocalDate startDt,   // "2026-03-01" → LocalDate
 *         {@code @RequestParam} LocalDate endDt) {   // "2026-03-31" → LocalDate
 *     ...
 * }
 *
 * // Controller @ModelAttribute
 * {@code @GetMapping("/api/search")}
 * public ResponseEntity<?> search(SearchRequest request) {
 *     // SearchRequest.startDt: LocalDate — "2026-03-01" 자동 변환
 * }
 * </pre>
 */
public class LocalDateFormatter implements Formatter<LocalDate> {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /**
     * {@code "yyyy-MM-dd"} 형식의 문자열을 {@link LocalDate}로 변환한다.
     *
     * @param text   변환할 날짜 문자열 (예: {@code "2026-03-31"})
     * @param locale 로케일
     * @return 변환된 {@link LocalDate}
     * @throws java.time.format.DateTimeParseException 형식이 맞지 않는 경우
     */
    @Override
    public LocalDate parse(String text, Locale locale) {
        return LocalDate.parse(text, DateTimeFormatter.ofPattern("yyyy-MM-dd", locale));
    }

    /**
     * {@link LocalDate}를 {@code "yyyy-MM-dd"} 형식의 문자열로 출력한다.
     *
     * @param object 출력할 {@link LocalDate}
     * @param locale 로케일
     * @return {@code "yyyy-MM-dd"} 형식의 날짜 문자열 (예: {@code "2026-03-31"})
     */
    @Override
    public String print(LocalDate object, Locale locale) {
        return FORMATTER.format(object);
    }
}
