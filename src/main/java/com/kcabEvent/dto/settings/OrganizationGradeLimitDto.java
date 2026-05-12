package com.kcabEvent.dto.settings;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrganizationGradeLimitDto {
    private String grade;
    private String gradeName;
    private Integer maxEventCount;
    private Integer sortSeq;
    private Long organizationCount;
    private Long currentEventCount;
    private Long updatedBy;
}
