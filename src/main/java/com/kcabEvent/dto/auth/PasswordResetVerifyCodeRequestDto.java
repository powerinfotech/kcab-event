package com.kcabEvent.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordResetVerifyCodeRequestDto {
    @NotBlank
    @Pattern(regexp = "\\d{6}")
    private String code;
}
