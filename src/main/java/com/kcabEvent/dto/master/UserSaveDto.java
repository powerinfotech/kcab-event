package com.kcabEvent.dto.master;

import com.kcabEvent.domain.User;
import com.kcabEvent.enums.IudType;
import lombok.Getter;
import lombok.Setter;


/**
 * UserSaveDto - 사용자 저장 요청 DTO
 *
 * <p>{@link User} 엔티티를 상속하고 {@link IudType}을 추가하여
 * 사용자 등록({@code I}) 또는 수정({@code U}) 요청을 처리한다.</p>
 *
 * @see com.kcabEvent.service.master.UserManagementService#saveUser
 */
@Getter
@Setter
public class UserSaveDto extends User {
    /** 행 변경 유형 (I: 등록, U: 수정) */
    private IudType iudType;
}
