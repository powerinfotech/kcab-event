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
    private String nameEn;
    private String phone;
    private String language;

    @NotBlank
    private String orgName;
    private String orgNameEn;
    @NotBlank
    private String orgType;
    private String businessNumber;
    private String representativeName;
    @NotBlank
    @Email
    private String contactEmail;
    private String contactPhone;
    private String address;
    private String website;
}
