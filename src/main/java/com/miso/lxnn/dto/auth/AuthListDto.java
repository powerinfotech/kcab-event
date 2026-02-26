package com.miso.lxnn.dto.auth;

import com.miso.lxnn.domain.Auth;
import com.miso.lxnn.enums.IudType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthListDto extends Auth {
    private IudType iudType;
}
