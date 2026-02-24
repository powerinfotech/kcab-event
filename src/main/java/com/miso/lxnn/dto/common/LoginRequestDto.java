package com.miso.lxnn.dto.common;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
public class LoginRequestDto {
    @NotNull(message = "아이디는 필수 입력입니다.")
    private String userId;

    @NotNull(message = "비밀번호를 입력해 주세요.")
    private String password;

    private String mode;
}
