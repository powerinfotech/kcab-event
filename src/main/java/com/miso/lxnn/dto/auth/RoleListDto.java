package com.miso.lxnn.dto.auth;

import com.miso.lxnn.domain.Role;
import com.miso.lxnn.enums.IudType;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class RoleListDto extends Role {
    private IudType iudType;
}
