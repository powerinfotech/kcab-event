package com.kcabEvent.dto.participant;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/** My Events: 인증코드 검증 요청 */
@Getter
@Setter
public class MyEventsVerifyRequest {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String code;
}
