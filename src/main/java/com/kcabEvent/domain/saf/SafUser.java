package com.kcabEvent.domain.saf;

import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class SafUser {
    private Long userSeq;
    private String userId;
    private String email;
    private String passwordHash;
    private String name;
    private String nameEn;
    private String position;
    private String phone;
    private String userType;
    private String status;
    private OffsetDateTime emailVerifiedAt;
    private OffsetDateTime lastLoginAt;
    private Long createdBy;
    private OffsetDateTime createdAt;
    private Long updatedBy;
    private OffsetDateTime updatedAt;
    private OffsetDateTime deletedAt;
}
