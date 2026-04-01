package com.miso.lxnn.dto.master;

import lombok.Getter;
import lombok.Setter;

/**
 * UserComboListDto - 사용자 콤보박스 목록 DTO
 *
 * <p>사용자 선택 콤보박스/자동완성 컴포넌트를 위해
 * 사용자 식별에 필요한 최소 정보만 담는 경량 DTO.</p>
 *
 * @see com.miso.lxnn.dao.UserDao#selectUserComboList
 */
@Getter
@Setter
public class UserComboListDto {
    /** 로그인 아이디 */
    private String userId;
    /** 사용자 이름 */
    private String userName;
    /** 사용자 고유 순번 */
    private Integer userSeq;
}
