package com.kcabEvent.util.json;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * CustomLocalDateTimeDeserializer - JSON 문자열 → {@link LocalDateTime} 역직렬화
 *
 * <p>Jackson이 JSON 요청 본문의 날짜+시간 문자열을 {@link LocalDateTime}으로 변환할 때 사용한다.
 * {@link com.kcabEvent.config.JacksonConfig#jsonMapperDateTimeModule}에서 등록된다.</p>
 *
 * <h3>지원 포맷</h3>
 * <ul>
 *   <li>입력: {@code "yyyy-MM-dd HH:mm:ss"} (예: {@code "2026-03-31 09:30:00"})</li>
 *   <li>null 또는 빈 문자열 입력 시 {@code null} 반환</li>
 * </ul>
 *
 * <h3>JSON 요청 예시</h3>
 * <pre>
 * // 요청 Body
 * { "createdAt": "2026-03-31 09:30:00" }
 *
 * // DTO 필드
 * private LocalDateTime createdAt;  // → LocalDateTime.of(2026, 3, 31, 9, 30, 0)
 * </pre>
 *
 * <h3>관련 클래스</h3>
 * <ul>
 *   <li>직렬화: {@link CustomLocalDateTimeSerializer}</li>
 *   <li>MVC 파라미터 변환: {@link com.kcabEvent.util.formatter.LocalDateTimeFormatter}</li>
 * </ul>
 */
public class CustomLocalDateTimeDeserializer extends JsonDeserializer<LocalDateTime> {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * JSON 날짜+시간 문자열을 {@link LocalDateTime}으로 역직렬화한다.
     *
     * @param p    JSON 파서
     * @param ctxt 역직렬화 컨텍스트
     * @return 파싱된 {@link LocalDateTime}, 값이 null이거나 빈 문자열이면 {@code null}
     * @throws IOException            JSON 읽기 오류
     * @throws JacksonException       역직렬화 오류
     * @throws java.time.format.DateTimeParseException {@code "yyyy-MM-dd HH:mm:ss"} 형식이 아닌 경우
     */
    @Override
    public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JacksonException {
        String text = p.getText();
        if (text == null || text.isBlank()) {
            return null;
        }
        return LocalDateTime.parse(text.strip(), DATE_FORMAT);
    }
}
