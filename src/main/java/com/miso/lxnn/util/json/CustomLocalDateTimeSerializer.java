package com.miso.lxnn.util.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * CustomLocalDateTimeSerializer - {@link LocalDateTime} → JSON 문자열 직렬화
 *
 * <p>Jackson이 {@link LocalDateTime} 필드를 JSON 응답으로 변환할 때 사용한다.
 * {@link com.miso.lxnn.config.JacksonConfig#jsonMapperDateTimeModule}에서 등록된다.</p>
 *
 * <h3>출력 포맷</h3>
 * <ul>
 *   <li>출력: {@code "yyyy-MM-dd HH:mm:ss"} (예: {@code "2026-03-31 09:30:00"})</li>
 * </ul>
 *
 * <h3>JSON 응답 예시</h3>
 * <pre>
 * // DTO 필드
 * private LocalDateTime createdAt;  // LocalDateTime.of(2026, 3, 31, 9, 30, 0)
 *
 * // JSON 응답
 * { "createdAt": "2026-03-31 09:30:00" }
 * </pre>
 *
 * <h3>관련 클래스</h3>
 * <ul>
 *   <li>역직렬화: {@link CustomLocalDateTimeDeserializer}</li>
 *   <li>MVC 파라미터 변환: {@link com.miso.lxnn.util.formatter.LocalDateTimeFormatter}</li>
 * </ul>
 */
public class CustomLocalDateTimeSerializer extends JsonSerializer<LocalDateTime> {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * {@link LocalDateTime}을 {@code "yyyy-MM-dd HH:mm:ss"} 형식의 JSON 문자열로 직렬화한다.
     *
     * @param value       직렬화할 {@link LocalDateTime} (null이면 Jackson이 이 메서드를 호출하지 않음)
     * @param gen         JSON 생성기
     * @param serializers 직렬화 제공자
     * @throws IOException JSON 쓰기 오류
     */
    @Override
    public void serialize(LocalDateTime value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeString(value.format(DATE_FORMAT));
    }
}
