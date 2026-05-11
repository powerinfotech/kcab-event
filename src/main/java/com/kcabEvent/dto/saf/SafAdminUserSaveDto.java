package com.kcabEvent.dto.saf;

import lombok.Getter;
import lombok.Setter;

/**
 * SAF 사용자 관리 저장 요청 DTO.
 *
 * <p>상세 화면에서 수정 가능한 사용자 필드와 연결 기관 필드를 한 번에 전달한다.</p>
 */
@Getter
@Setter
public class SafAdminUserSaveDto {
    private Long userSeq;
    private String userId;
    private String email;
    private String password;
    private String passwordHash;
    private String name;
    private String position;
    private String userType;
    private String status;

    private Long organizationSeq;
    private String organizationName;
    private String orgType;
    private String contactEmail;
    private String contactPhone;
    private String website;
    /** 조직 등급: S/A/B/C */
    private String grade;
    private Long updatedBy;
}
