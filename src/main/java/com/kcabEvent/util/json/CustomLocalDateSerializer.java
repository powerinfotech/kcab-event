package com.kcabEvent.util.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * CustomLocalDateSerializer - {@link LocalDate} → JSON 문자열 직렬화
 *
 * <p>Jackson이 {@link LocalDate} 필드를 JSON 응답으로 변환할 때 사용한다.
 * {@link com.kcabEvent.config.JacksonConfig#jsonMapperDateTimeModule}에서 등록된다.</p>
 *
 * <h3>출력 포맷</h3>
 * <ul>
 *   <li>출력: {@code "yyyy-MM-dd"} (예: {@code "2026-03-31"})</li>
 * </ul>
 *
 * <h3>JSON 응답 예시</h3>
 * <pre>
 * // DTO 필드
 * private LocalDate createdDt;  // LocalDate.of(2026, 3, 31)
 *
 * // JSON 응답
 * { "createdDt": "2026-03-31" }
 * </pre>
 *
 * <h3>관련 클래스</h3>
 * <ul>
 *   <li>역직렬화: {@link CustomLocalDateDeserializer}</li>
 *   <li>MVC 파라미터 변환: {@link com.kcabEvent.util.formatter.LocalDateFormatter}</li>
 * </ul>
 */
public class CustomLocalDateSerializer extends JsonSerializer<LocalDate> {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /**
     * {@link LocalDate}를 {@code "yyyy-MM-dd"} 형식의 JSON 문자열로 직렬화한다.
     *
     * @param value       직렬화할 {@link LocalDate} (null이면 Jackson이 이 메서드를 호출하지 않음)
     * @param gen         JSON 생성기
     * @param serializers 직렬화 제공자
     * @throws IOException JSON 쓰기 오류
     */
    @Override
    public void serialize(LocalDate value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeString(value.format(DATE_FORMAT));
    }
}
