package com.power.dto.auth;

import lombok.Getter;
import lombok.Setter;

import jakarta.validation.Valid;
import java.util.List;

/**
 * AuthManagementSaveDto - 권한 관리 일괄 저장 요청 DTO
 *
 * <p>권한 그룹 / 권한 / 권한-사용자 세 테이블을 한 번의 API 호출로 저장한다.
 * 각 목록의 항목은 {@link com.power.enums.IudType}을 통해 I/U/D를 지정한다.</p>
 *
 * <h3>요청 예시</h3>
 * <pre>
 * {
 *   "authGrpList": [{ "authGrpSeq": null, "authGrpNm": "신규그룹", "iudType": "I" }],
 *   "authList":    [{ "authSeq": 3, "authNm": "수정된권한", "iudType": "U" }],
 *   "authUserList": []
 * }
 * </pre>
 *
 * @see com.power.service.auth.AuthManagementService#saveAuthManagement
 */
@Getter
@Setter
public class AuthManagementSaveDto {
    /** 권한 그룹 변경 목록 */
    @Valid
    private List<AuthGrpListDto> authGrpList;
    /** 권한 변경 목록 */
    @Valid
    private List<AuthListDto> authList;
    /** 권한-사용자 매핑 변경 목록 */
    @Valid
    private List<AuthUserListDto> authUserList;
}
