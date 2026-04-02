package com.power.util.formatter;

import org.springframework.format.Formatter;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/**
 * LocalTimeFormatter - {@link LocalTime} 문자열 변환 포맷터
 *
 * <p>Spring MVC의 {@code @RequestParam}, {@code @ModelAttribute}에서
 * {@code "HH:mm:ss"} 형식의 시간 문자열을 {@link LocalTime}으로 자동 변환하거나
 * {@link LocalTime}을 문자열로 출력할 때 사용한다.</p>
 *
 * <p>{@link LocalDateFormatter}, {@link LocalDateTimeFormatter}와 함께
 * {@link com.power.config.WebMvcConfig#addFormatters}에 등록하여 사용한다.</p>
 *
 * <p>JSON 요청/응답의 시간 변환은 이 포맷터가 아닌
 * {@link com.power.config.JacksonConfig}의 {@code CustomLocalTimeSerializer} /
 * {@code CustomLocalTimeDeserializer}가 담당한다.</p>
 *
 * <h3>지원 포맷</h3>
 * <ul>
 *   <li>파싱: {@code "HH:mm:ss"} (예: {@code "09:30:00"})</li>
 *   <li>출력: {@code "HH:mm:ss"} (예: {@code "09:30:00"})</li>
 * </ul>
 *
 * <h3>등록 방법</h3>
 * <pre>
 * // WebMvcConfig.java
 * {@code @Override}
 * public void addFormatters(FormatterRegistry registry) {
 *     registry.addFormatter(new LocalDateFormatter());
 *     registry.addFormatter(new LocalDateTimeFormatter());
 *     registry.addFormatter(new LocalTimeFormatter());  // 추가
 * }
 * </pre>
 *
 * <h3>사용 예시</h3>
 * <pre>
 * // Controller @RequestParam
 * {@code @GetMapping("/api/schedule")}
 * public ResponseEntity<?> getSchedule(
 *         {@code @RequestParam} LocalTime startTime,   // "09:00:00" → LocalTime
 *         {@code @RequestParam} LocalTime endTime) {   // "18:00:00" → LocalTime
 *     ...
 * }
 *
 * // Controller @ModelAttribute
 * {@code @PostMapping("/api/work-time")}
 * public ResponseEntity<?> saveWorkTime(WorkTimeRequest request) {
 *     // WorkTimeRequest.startTime: LocalTime — "09:00:00" 자동 변환
 * }
 * </pre>
 */
public class LocalTimeFormatter implements Formatter<LocalTime> {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");

    /**
     * {@code "HH:mm:ss"} 형식의 문자열을 {@link LocalTime}으로 변환한다.
     *
     * @param text   변환할 시간 문자열 (예: {@code "09:30:00"})
     * @param locale 로케일
     * @return 변환된 {@link LocalTime}
     * @throws java.time.format.DateTimeParseException 형식이 맞지 않는 경우
     */
    @Override
    public LocalTime parse(String text, Locale locale) {
        return LocalTime.parse(text, DateTimeFormatter.ofPattern("HH:mm:ss", locale));
    }

    /**
     * {@link LocalTime}을 {@code "HH:mm:ss"} 형식의 문자열로 출력한다.
     *
     * @param object 출력할 {@link LocalTime}
     * @param locale 로케일
     * @return {@code "HH:mm:ss"} 형식의 시간 문자열 (예: {@code "09:30:00"})
     */
    @Override
    public String print(LocalTime object, Locale locale) {
        return FORMATTER.format(object);
    }
}
