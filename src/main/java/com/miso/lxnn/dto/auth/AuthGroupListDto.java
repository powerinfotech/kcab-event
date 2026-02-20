package com.miso.lxnn.dto.auth;

import com.miso.lxnn.domain.AuthGroup;
import com.miso.lxnn.enums.IudType;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class AuthGroupListDto extends AuthGroup {
    private IudType iudType;
}
