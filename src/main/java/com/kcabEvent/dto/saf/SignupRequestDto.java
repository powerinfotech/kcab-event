package com.kcabEvent.dto.saf;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequestDto {
    @NotBlank
    private String userId;
    @NotBlank
    private String password;
    @NotBlank
    @Email
    private String email;
    @NotBlank
    private String name;
    private String position;

    @NotBlank
    private String orgName;
    @NotBlank
    private String orgType;
    @NotBlank
    @Email
    private String contactEmail;
    private String contactPhone;
    private String website;
}
