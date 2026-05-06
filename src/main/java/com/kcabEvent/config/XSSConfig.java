package com.kcabEvent.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * XSSConfig - XSS(Cross-Site Scripting) 방어 설정
 *
 * <p>두 단계의 XSS 방어를 구성한다.</p>
 *
 * <h3>방어 레이어</h3>
 *
 * <h4>1. Lucy XSS Servlet Filter (요청 입력값 필터링)</h4>
 * <p>네이버 Lucy XSS 필터를 전체 URL({@code /*})에 적용하여
 * HTTP 요청 파라미터의 XSS 위험 문자를 HTML 엔티티로 변환한다.</p>
 * <pre>
 * // 요청 파라미터: userName=&lt;script&gt;alert(1)&lt;/script&gt;
 * // 필터 처리 후: userName=&amp;lt;script&amp;gt;alert(1)&amp;lt;/script&amp;gt;
 * </pre>
 *
 * <h4>2. Jackson XSS Character Escapes (JSON 응답 출력 이스케이프)</h4>
 * <p>{@link XSSCharacterEscapes}를 Jackson ObjectMapper에 적용하여
 * JSON 직렬화 시 XSS 위험 문자를 자동으로 이스케이프한다.</p>
 *
 * <h3>현재 상태: 비활성화</h3>
 * <p>{@code @Configuration}이 주석 처리되어 있어 이 설정은 현재 적용되지 않는다.<br>
 * XSS 방어가 필요한 경우 {@code @Configuration} 주석을 해제하고
 * {@code lucy-xss-servlet-filter} 의존성이 {@code pom.xml}에 포함되어 있는지 확인한다.</p>
 *
 * <h3>활성화 방법</h3>
 * <pre>
 * // 1. @Configuration 주석 해제
 * // 2. pom.xml에 의존성 추가
 * &lt;dependency&gt;
 *     &lt;groupId&gt;com.navercorp.lucy&lt;/groupId&gt;
 *     &lt;artifactId&gt;lucy-xss-servlet&lt;/artifactId&gt;
 *     &lt;version&gt;2.0.1&lt;/version&gt;
 * &lt;/dependency&gt;
 * // 3. src/main/resources/lucy-xss-servlet-filter-rule.xml 규칙 파일 작성
 * </pre>
 */
@Configuration
@Slf4j
@RequiredArgsConstructor
public class XSSConfig implements WebMvcConfigurer {

    private final ObjectMapper objectMapper;

    // Lucy XSS Servlet Filter는 javax.servlet 기반이라 Spring Boot 3.x(jakarta)와 호환되지 않아 제거됨
    // XSS 방어가 필요한 경우 jakarta.servlet 호환 XSS 필터로 교체 필요

    /**
     * Jackson JSON 응답 XSS 이스케이프 컨버터 등록.
     *
     * <p>{@link XSSCharacterEscapes}를 적용한 별도의 ObjectMapper로
     * JSON 직렬화 시 XSS 위험 문자({@code < > & " ' ( ) #})를 HTML 엔티티로 변환한다.</p>
     *
     * @return XSS 이스케이프가 적용된 Jackson 메시지 컨버터
     */
    @Bean
    public org.springframework.http.converter.json.MappingJackson2HttpMessageConverter jsonEscapeConverter() {
        ObjectMapper copy = objectMapper.copy();
        copy.getFactory().setCharacterEscapes(new XSSCharacterEscapes());
        return new org.springframework.http.converter.json.MappingJackson2HttpMessageConverter(copy);
    }
}
