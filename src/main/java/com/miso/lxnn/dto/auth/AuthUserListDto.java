package com.miso.lxnn.dto.auth;

import com.miso.lxnn.domain.AuthUser;
import com.miso.lxnn.enums.IudType;
import lombok.Getter;
import lombok.Setter;

/**
 * AuthUserListDto - 권한-사용자 매핑 목록 DTO
 *
 * <p>{@link AuthUser} 엔티티를 상속하고 사용자 표시 정보({@code userId}, {@code userName})와
 * {@link IudType}을 추가한다. 권한 관리 화면에서 사용자 배정 목록 조회 및 저장에 사용한다.</p>
 *
 * @see com.miso.lxnn.dto.auth.AuthManagementSaveDto
 */
@Getter
@Setter
public class AuthUserListDto extends AuthUser {
    /** 로그인 아이디 (표시용) */
    private String userId;
    /** 사용자 이름 (표시용) */
    private String userName;
    /** 행 변경 유형 (I: 추가, U: 수정, D: 삭제) */
    private IudType iudType;
}
