package com.miso.lxnn.dto.auth;

import com.miso.lxnn.enums.MenuType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserMenuAuthMenuListDto {
    private Integer authGrpSeq;
    private Integer menuSeq;
    private Integer menuId;
    private Integer upMenuId;
    private String menuNm;
    private MenuType menuTypeCd;
    private Boolean useFlag;
}
