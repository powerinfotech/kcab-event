package com.kcabEvent.dto.participant;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/** My Events: 인증코드 발송 요청 */
@Getter
@Setter
public class MyEventsCodeRequest {
    @NotBlank
    @Email
    private String email;
}
