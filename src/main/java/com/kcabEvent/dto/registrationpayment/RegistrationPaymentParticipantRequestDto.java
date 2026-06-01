package com.kcabEvent.dto.registrationpayment;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegistrationPaymentParticipantRequestDto {
    private String email;
    private String firstName;
    private String middleName;
    private String lastName;
    private String organizationName;
    private String position;
    private String country;
}
