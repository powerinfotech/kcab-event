package com.power.util.json;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

/**
 * CustomLocalTimeDeserializer - JSON 문자열 → {@link LocalTime} 역직렬화
 *
 * <p>Jackson이 JSON 요청 본문의 시간 문자열을 {@link LocalTime}으로 변환할 때 사용한다.
 * {@link com.power.config.JacksonConfig#jsonMapperDateTimeModule}에서 등록된다.</p>
 *
 * <h3>지원 포맷</h3>
 * <ul>
 *   <li>입력: {@code "HH:mm:ss"} 24시간제 (예: {@code "09:30:00"}, {@code "14:30:00"})</li>
 *   <li>null 또는 빈 문자열 입력 시 {@code null} 반환</li>
 * </ul>
 *
 * <h3>JSON 요청 예시</h3>
 * <pre>
 * // 요청 Body
 * { "startTime": "09:00:00", "endTime": "18:30:00" }
 *
 * // DTO 필드
 * private LocalTime startTime;  // → LocalTime.of(9, 0, 0)
 * private LocalTime endTime;    // → LocalTime.of(18, 30, 0)
 * </pre>
 *
 * <h3>관련 클래스</h3>
 * <ul>
 *   <li>직렬화: {@link CustomLocalTimeSerializer}</li>
 *   <li>MVC 파라미터 변환: {@link com.power.util.formatter.LocalTimeFormatter}</li>
 * </ul>
 */
public class CustomLocalTimeDeserializer extends JsonDeserializer<LocalTime> {

    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm:ss");

    /**
     * JSON 시간 문자열을 {@link LocalTime}으로 역직렬화한다.
     *
     * @param p    JSON 파서
     * @param ctxt 역직렬화 컨텍스트
     * @return 파싱된 {@link LocalTime}, 값이 null이거나 빈 문자열이면 {@code null}
     * @throws IOException            JSON 읽기 오류
     * @throws JacksonException       역직렬화 오류
     * @throws java.time.format.DateTimeParseException {@code "HH:mm:ss"} 형식이 아닌 경우
     */
    @Override
    public LocalTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JacksonException {
        String text = p.getText();
        if (text == null || text.isBlank()) {
            return null;
        }
        return LocalTime.parse(text.strip(), TIME_FORMAT);
    }
}
