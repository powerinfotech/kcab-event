package com.miso.lxnn.dto.master;

import com.miso.lxnn.domain.User;
import com.miso.lxnn.enums.IudType;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class UserSaveDto extends User {
    private IudType iudType;
}
