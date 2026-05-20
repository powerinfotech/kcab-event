package com.kcabEvent.dto.saf;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SafEmailVerificationSendRequestDto {
    @NotBlank
    @Email
    private String email;

    private String purpose;
}
