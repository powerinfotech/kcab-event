package com.miso.lxnn.dto.auth;

import com.miso.lxnn.domain.RoleUser;
import com.miso.lxnn.enums.IudType;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class RoleUserListDto extends RoleUser {
    private String userNm;
    private String userId;
    private IudType iudType;
}
