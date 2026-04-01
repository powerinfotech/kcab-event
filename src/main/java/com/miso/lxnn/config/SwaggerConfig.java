package com.miso.lxnn.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * SwaggerConfig - SpringDoc OpenAPI(Swagger) 문서 설정
 *
 * <p>SpringDoc(springdoc-openapi)을 사용하여 API 문서를 자동 생성한다.</p>
 *
 * <h3>접근 URL</h3>
 * <ul>
 *   <li>Swagger UI: {@code /swagger-ui/index.html}</li>
 *   <li>OpenAPI JSON: {@code /v3/api-docs}</li>
 * </ul>
 *
 * <h3>CSRF 연동</h3>
 * <p>Swagger UI에서 발생하는 API 호출은 {@link CsrfRequireMatcher}에 의해
 * CSRF 검사에서 제외된다 (Referer 헤더 기준).</p>
 *
 * <h3>컨트롤러 문서화 예시</h3>
 * <pre>
 * {@code @Tag(name = "사용자 관리", description = "사용자 CRUD API")}
 * {@code @RestController}
 * public class UserController {
 *
 *     {@code @Operation(summary = "사용자 목록 조회")}
 *     {@code @GetMapping("/api/users")}
 *     public ResponseEntity<?> getUsers() { ... }
 * }
 * </pre>
 */
@Configuration
public class SwaggerConfig {

    /**
     * OpenAPI 문서 구성 Bean 생성
     *
     * @return 제목·설명·버전이 설정된 {@link OpenAPI} 인스턴스
     */
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .components(new Components())
                .info(this.info());
    }

    /**
     * API 문서 기본 정보 구성
     *
     * @return 제목, 설명, 버전이 포함된 {@link Info}
     */
    private Info info() {
        return new Info()
                .title("재난안정망 API")
                .description("...")
                .version("1.0");
    }
}
