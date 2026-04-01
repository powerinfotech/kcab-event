package com.miso.lxnn.dto.auth;

import lombok.Getter;
import lombok.Setter;

/**
 * UserSearchDto - 사용자 검색 결과 DTO
 *
 * <p>권한 관리 화면에서 사용자를 검색하여 권한에 배정할 때 사용하는 경량 DTO.</p>
 *
 * @see com.miso.lxnn.dao.AuthManagementDao#selectUserSearchList
 */
@Getter
@Setter
public class UserSearchDto {
    /** 사용자 고유 순번 */
    private Integer userSeq;
    /** 로그인 아이디 */
    private String userId;
    /** 사용자 이름 */
    private String userName;
}
