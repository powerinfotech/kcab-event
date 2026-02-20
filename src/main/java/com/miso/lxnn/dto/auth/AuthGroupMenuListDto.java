package com.miso.lxnn.dto.auth;

import com.miso.lxnn.domain.AuthGroupMenu;
import com.miso.lxnn.enums.MenuType;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class AuthGroupMenuListDto extends AuthGroupMenu {
    private Integer menuId;
    private Integer upMenuId;
    private String menuNm;
    private MenuType menuTypeCd;

}
