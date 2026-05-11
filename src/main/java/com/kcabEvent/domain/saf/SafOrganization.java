package com.kcabEvent.domain.saf;

import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class SafOrganization {
    private Long organizationSeq;
    private String name;
    private String orgType;
    private String contactEmail;
    private String contactPhone;
    private String website;
    private String logoUrl;
    private String description;
    /** 조직 등급: S/A/B/C (신규 가입시 기본값 C, 관리자가 변경) */
    private String grade;
    private Long createdBy;
    private OffsetDateTime createdAt;
    private Long updatedBy;
    private OffsetDateTime updatedAt;
}
