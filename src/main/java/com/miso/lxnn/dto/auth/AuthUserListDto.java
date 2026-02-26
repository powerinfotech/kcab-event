package com.miso.lxnn.dto.auth;

import com.miso.lxnn.domain.AuthUser;
import com.miso.lxnn.enums.IudType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthUserListDto extends AuthUser {
    private String userId;
    private String userName;
    private IudType iudType;
}
