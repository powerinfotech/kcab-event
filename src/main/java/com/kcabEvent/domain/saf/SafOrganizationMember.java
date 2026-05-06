package com.kcabEvent.domain.saf;

import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class SafOrganizationMember {
    private Long organizationSeq;
    private Long userSeq;
    private String role;
    private OffsetDateTime createdAt;
}
