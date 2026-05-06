package com.kcabEvent.config;

import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.kcabEvent.util.json.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * JacksonConfig - Jackson ObjectMapper 커스텀 직렬화/역직렬화 설정
 *
 * <p>두 개의 Jackson 모듈을 Bean으로 등록하여 전역 ObjectMapper에 자동 적용한다.</p>
 *
 * <h3>등록 모듈</h3>
 *
 * <h4>1. jsonMapperDateTimeModule — Java 8 날짜/시간 직렬화</h4>
 * <ul>
 *   <li>{@link LocalTime}:     {@code HH:mm:ss} 형식으로 직렬화 / 역직렬화</li>
 *   <li>{@link LocalDate}:     {@code yyyy-MM-dd} 형식으로 직렬화 / 역직렬화</li>
 *   <li>{@link LocalDateTime}: {@code yyyy-MM-dd HH:mm:ss} 형식으로 직렬화 / 역직렬화</li>
 * </ul>
 * <pre>
 * // JSON 응답 예시
 * { "createdAt": "2026-03-31 09:30:00", "birthday": "1990-01-15" }
 * </pre>
 *
 * <h4>2. customJsonDeSerializeModule — 문자열 앞뒤 공백 제거</h4>
 * <ul>
 *   <li>모든 {@link String} 필드를 역직렬화할 때 자동으로 {@code trim()} 처리</li>
 *   <li>사용자 입력값의 실수로 인한 공백을 서버 진입 시점에 일괄 제거</li>
 * </ul>
 * <pre>
 * // 클라이언트 전송: { "userName": "  홍길동  " }
 * // 역직렬화 결과:   userName = "홍길동"
 * </pre>
 */
@Configuration
public class JacksonConfig {

    /**
     * Java 8 날짜/시간 타입 직렬화·역직렬화 모듈 등록
     *
     * <p>Jackson의 기본 동작(ISO-8601 배열 형식)을 프로젝트 표준 날짜 문자열 형식으로 대체한다.</p>
     *
     * @return LocalDate / LocalDateTime / LocalTime 커스텀 직렬화 모듈
     */
    @Bean
    public Module jsonMapperDateTimeModule() {
        SimpleModule module = new SimpleModule();
        module.addSerializer(LocalTime.class, new CustomLocalTimeSerializer());
        module.addSerializer(LocalDate.class, new CustomLocalDateSerializer());
        module.addSerializer(LocalDateTime.class, new CustomLocalDateTimeSerializer());
        module.addDeserializer(LocalTime.class, new CustomLocalTimeDeserializer());
        module.addDeserializer(LocalDate.class, new CustomLocalDateDeserializer());
        module.addDeserializer(LocalDateTime.class, new CustomLocalDateTimeDeserializer());
        return module;
    }

    /**
     * 문자열 앞뒤 공백 자동 제거 역직렬화 모듈 등록
     *
     * <p>요청 Body의 모든 String 필드를 역직렬화할 때 {@code trim()}을 적용한다.
     * Controller 또는 Service에서 별도로 공백을 처리하지 않아도 된다.</p>
     *
     * @return String trim 역직렬화 모듈
     */
    @Bean
    public Module customJsonDeSerializeModule() {
        SimpleModule module = new SimpleModule();
        module.addDeserializer(String.class, new StringStripJsonDeserializer());
        return module;
    }
}
