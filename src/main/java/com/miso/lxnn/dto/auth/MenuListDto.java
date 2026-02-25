package com.miso.lxnn.dto.auth;

import com.miso.lxnn.domain.Menu;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class MenuListDto extends Menu {
    private String menuNamePath;
    private String menuIdPath;
    private Integer level;
    private String rgstUserName;
    private String uptUserName;
}
