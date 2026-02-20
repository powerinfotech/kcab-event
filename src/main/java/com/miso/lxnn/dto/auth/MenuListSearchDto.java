package com.miso.lxnn.dto.auth;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class MenuListSearchDto {
    private String menuNm;
    private Boolean isExceptUnused;
}
