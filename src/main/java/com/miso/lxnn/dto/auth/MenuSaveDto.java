package com.miso.lxnn.dto.auth;

import com.miso.lxnn.domain.Menu;
import com.miso.lxnn.enums.IudType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MenuSaveDto extends Menu {
    private IudType iudType;
    private List<MenuBtnSaveDto> menuBtnList;
}
