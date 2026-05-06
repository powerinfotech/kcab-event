package com.kcabEvent.util.formatter;

import org.springframework.format.Formatter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/**
 * LocalDateTimeFormatter - {@link LocalDateTime} 문자열 변환 포맷터
 *
 * <p>Spring MVC의 {@code @RequestParam}, {@code @ModelAttribute}에서
 * {@code "yyyy-MM-dd HH:mm:ss"} 형식의 날짜+시간 문자열을 {@link LocalDateTime}으로 자동 변환하거나
 * {@link LocalDateTime}을 문자열로 출력할 때 사용한다.</p>
 *
 * <p>{@link com.kcabEvent.config.WebMvcConfig#addFormatters}에서 등록된다.</p>
 *
 * <p>JSON 요청/응답의 날짜+시간 변환은 이 포맷터가 아닌
 * {@link com.kcabEvent.config.JacksonConfig}의 {@code CustomLocalDateTimeSerializer} /
 * {@code CustomLocalDateTimeDeserializer}가 담당한다.</p>
 *
 * <h3>지원 포맷</h3>
 * <ul>
 *   <li>파싱: {@code "yyyy-MM-dd HH:mm:ss"} (예: {@code "2026-03-31 09:30:00"})</li>
 *   <li>출력: {@code "yyyy-MM-dd HH:mm:ss"} (예: {@code "2026-03-31 09:30:00"})</li>
 * </ul>
 *
 * <h3>사용 예시</h3>
 * <pre>
 * // Controller @RequestParam
 * {@code @GetMapping("/api/logs")}
 * public ResponseEntity<?> getLogs(
 *         {@code @RequestParam} LocalDateTime fromDt,   // "2026-03-31 00:00:00" → LocalDateTime
 *         {@code @RequestParam} LocalDateTime toDt) {   // "2026-03-31 23:59:59" → LocalDateTime
 *     ...
 * }
 * </pre>
 */
public class LocalDateTimeFormatter implements Formatter<LocalDateTime> {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * {@code "yyyy-MM-dd HH:mm:ss"} 형식의 문자열을 {@link LocalDateTime}으로 변환한다.
     *
     * @param text   변환할 날짜+시간 문자열 (예: {@code "2026-03-31 09:30:00"})
     * @param locale 로케일
     * @return 변환된 {@link LocalDateTime}
     * @throws java.time.format.DateTimeParseException 형식이 맞지 않는 경우
     */
    @Override
    public LocalDateTime parse(String text, Locale locale) {
        return LocalDateTime.parse(text, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss", locale));
    }

    /**
     * {@link LocalDateTime}을 {@code "yyyy-MM-dd HH:mm:ss"} 형식의 문자열로 출력한다.
     *
     * @param object 출력할 {@link LocalDateTime}
     * @param locale 로케일
     * @return {@code "yyyy-MM-dd HH:mm:ss"} 형식의 날짜+시간 문자열 (예: {@code "2026-03-31 09:30:00"})
     */
    @Override
    public String print(LocalDateTime object, Locale locale) {
        return FORMATTER.format(object);
    }
}
