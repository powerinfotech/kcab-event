package com.kcabEvent.dto.saf;

import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

/**
 * SAF 사용자 관리 상세 응답 DTO.
 *
 * <p>상세 화면에서 수정할 사용자 정보와 기관 정보를 모두 포함한다.</p>
 */
@Getter
@Setter
public class SafAdminUserDetailDto {
    private Long userSeq;
    private String userId;
    private String email;
    private String name;
    private String position;
    private String userType;
    private String status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    private Long organizationSeq;
    private String organizationName;
    private String orgType;
    private String representativeName;
    private String contactEmail;
    private String contactPhone;
    private String website;
}
