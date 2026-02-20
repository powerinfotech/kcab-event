package com.miso.lxnn.dto.auth;

import com.miso.lxnn.domain.Menu;
import com.miso.lxnn.enums.IudType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MenuSaveDto extends Menu {
    private IudType iudType;
}
