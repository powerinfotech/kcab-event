package com.power.dto.auth;

import com.power.domain.AuthGrp;
import com.power.enums.IudType;
import lombok.Getter;
import lombok.Setter;

/**
 * AuthGrpListDto - 권한 그룹 목록 DTO
 *
 * <p>{@link AuthGrp} 엔티티를 상속하고 {@link IudType}을 추가하여
 * 그리드에서 변경된 행의 상태(I/U/D)를 서버로 전달하는 데 사용한다.</p>
 *
 * @see com.power.dto.auth.AuthManagementSaveDto
 */
@Getter
@Setter
public class AuthGrpListDto extends AuthGrp {
    /** 행 변경 유형 (I: 추가, U: 수정, D: 삭제) */
    private IudType iudType;
}
