package com.miso.lxnn.util.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

/**
 * CustomLocalTimeSerializer - {@link LocalTime} → JSON 문자열 직렬화
 *
 * <p>Jackson이 {@link LocalTime} 필드를 JSON 응답으로 변환할 때 사용한다.
 * {@link com.miso.lxnn.config.JacksonConfig#jsonMapperDateTimeModule}에서 등록된다.</p>
 *
 * <h3>출력 포맷</h3>
 * <ul>
 *   <li>출력: {@code "HH:mm:ss"} 24시간제 (예: {@code "09:30:00"}, {@code "14:30:00"})</li>
 * </ul>
 *
 * <h3>JSON 응답 예시</h3>
 * <pre>
 * // DTO 필드
 * private LocalTime startTime;  // LocalTime.of(14, 30, 0)
 *
 * // JSON 응답
 * { "startTime": "14:30:00" }
 * </pre>
 *
 * <h3>관련 클래스</h3>
 * <ul>
 *   <li>역직렬화: {@link CustomLocalTimeDeserializer}</li>
 *   <li>MVC 파라미터 변환: {@link com.miso.lxnn.util.formatter.LocalTimeFormatter}</li>
 * </ul>
 */
public class CustomLocalTimeSerializer extends JsonSerializer<LocalTime> {

    /** 24시간제 시간 포맷 — HH(00~23):mm:ss */
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm:ss");

    /**
     * {@link LocalTime}을 {@code "HH:mm:ss"} 형식의 JSON 문자열로 직렬화한다.
     *
     * @param value       직렬화할 {@link LocalTime} (null이면 Jackson이 이 메서드를 호출하지 않음)
     * @param gen         JSON 생성기
     * @param serializers 직렬화 제공자
     * @throws IOException JSON 쓰기 오류
     */
    @Override
    public void serialize(LocalTime value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeString(value.format(TIME_FORMAT));
    }
}
