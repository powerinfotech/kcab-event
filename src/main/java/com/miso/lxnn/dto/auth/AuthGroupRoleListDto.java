package com.miso.lxnn.dto.auth;

import com.miso.lxnn.domain.AuthGroupRole;
import com.miso.lxnn.enums.IudType;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class AuthGroupRoleListDto extends AuthGroupRole {
    private String roleCd;
    private String roleNm;
    private IudType iudType;
}
