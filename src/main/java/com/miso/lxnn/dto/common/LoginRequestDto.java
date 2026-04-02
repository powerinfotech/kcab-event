package com.miso.lxnn.dto.common;

import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.NotNull;

/**
 * LoginRequestDto - 로그인 요청 DTO
 *
 * <p>{@code POST /api/login} 요청 Body로 사용된다.
 * {@code mode} 필드가 {@code "auto"}이면 비밀번호 검증을 생략하고
 * 세션 기반 자동 로그인을 허용한다.</p>
 *
 * <h3>요청 예시</h3>
 * <pre>
 * // 일반 로그인
 * { "userId": "admin", "password": "P@ssw0rd" }
 *
 * // 자동 로그인 (비밀번호 검증 생략)
 * { "userId": "admin", "password": null, "mode": "auto" }
 * </pre>
 *
 * @see com.miso.lxnn.controller.LoginController
 * @see com.miso.lxnn.service.common.LoginService
 */
@Getter
@Setter
public class LoginRequestDto {
    /** 로그인 아이디 (필수) */
    @NotNull(message = "아이디는 필수 입력입니다.")
    private String userId;

    /** 비밀번호 (필수; {@code mode=auto}이면 서버에서 검증 생략) */
    @NotNull(message = "비밀번호를 입력해 주세요.")
    private String password;

    /**
     * 로그인 모드.
     * {@code "auto"}이면 비밀번호 검증 없이 세션을 생성한다.
     * 일반 로그인 시에는 {@code null} 또는 생략한다.
     */
    private String mode;
}
