package com.kcabEvent.dto.auth;

import com.kcabEvent.domain.Auth;
import com.kcabEvent.enums.IudType;
import lombok.Getter;
import lombok.Setter;

/**
 * AuthListDto - 권한 목록 DTO
 *
 * <p>{@link Auth} 엔티티를 상속하고 {@link IudType}을 추가하여
 * 그리드에서 변경된 권한 행의 상태(I/U/D)를 서버로 전달하는 데 사용한다.</p>
 *
 * @see com.kcabEvent.dto.auth.AuthManagementSaveDto
 */
@Getter
@Setter
public class AuthListDto extends Auth {
    /** 행 변경 유형 (I: 추가, U: 수정, D: 삭제) */
    private IudType iudType;
}
