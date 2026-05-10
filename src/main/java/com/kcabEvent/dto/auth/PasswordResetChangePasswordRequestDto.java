package com.kcabEvent.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordResetChangePasswordRequestDto {
    @NotBlank
    private String password;

    @NotBlank
    private String passwordConfirm;
}
