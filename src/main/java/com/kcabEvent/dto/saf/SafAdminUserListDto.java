package com.kcabEvent.dto.saf;

import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

/**
 * SAF 사용자 관리 목록 응답 DTO.
 *
 * <p>사용자 기본 정보와 연결된 기관 정보를 함께 내려 화면에서 한 행으로 표시할 수 있게 한다.</p>
 */
@Getter
@Setter
public class SafAdminUserListDto {
    private Long userSeq;
    private String userId;
    private String email;
    private String name;
    private String nameEn;
    private String position;
    private String phone;
    private String userType;
    private String status;
    private Long organizationSeq;
    private String organizationName;
    private String organizationNameEn;
    private String orgType;
    private String organizationStatus;
    private Boolean approvalPending;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
