package com.kcabEvent.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordResetSendCodeRequestDto {
    @NotBlank
    private String userId;

    @Email
    @NotBlank
    private String email;
}
