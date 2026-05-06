package com.kcabEvent.domain.saf;

import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class SafOrganization {
    private Long organizationSeq;
    private String name;
    private String nameEn;
    private String orgType;
    private String businessNumber;
    private String representativeName;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private String website;
    private String logoUrl;
    private String description;
    private String status;
    private String rejectionReason;
    private Long approvedBy;
    private OffsetDateTime approvedAt;
    private Long createdBy;
    private OffsetDateTime createdAt;
    private Long updatedBy;
    private OffsetDateTime updatedAt;
}
