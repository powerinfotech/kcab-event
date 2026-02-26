package com.miso.lxnn.dto.auth;

import com.miso.lxnn.domain.AuthGrp;
import com.miso.lxnn.enums.IudType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthGrpListDto extends AuthGrp {
    private IudType iudType;
}
