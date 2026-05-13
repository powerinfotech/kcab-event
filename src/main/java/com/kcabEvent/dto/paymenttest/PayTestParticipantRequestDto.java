package com.kcabEvent.dto.paymenttest;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PayTestParticipantRequestDto {
    private String email;
    private String firstName;
    private String middleName;
    private String lastName;
    private String organizationName;
    private String position;
    private String country;
}
