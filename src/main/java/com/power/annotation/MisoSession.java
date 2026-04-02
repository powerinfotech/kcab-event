package com.power.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * MisoSession - 세션 사용자 정보 주입 애노테이션
 *
 * <p>컨트롤러 메서드 파라미터에 붙이면
 * {@link com.power.config.LoginUserArgumentResolver}가 HTTP 세션에서
 * {@link com.power.dto.common.LoginUser}를 꺼내 자동으로 주입한다.</p>
 *
 * <h3>사용 방법</h3>
 * <pre>
 * // 컨트롤러 메서드에서 세션 사용자 정보를 직접 받는다
 * {@literal @}GetMapping("/api/my-info")
 * public ApiResponse{@literal <}User{@literal >} getMyInfo({@literal @}MisoSession LoginUser loginUser) {
 *     return ApiResponse.ok(loginUser);
 * }
 * </pre>
 *
 * @see com.power.config.LoginUserArgumentResolver
 * @see com.power.dto.common.LoginUser
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface MisoSession {
}
