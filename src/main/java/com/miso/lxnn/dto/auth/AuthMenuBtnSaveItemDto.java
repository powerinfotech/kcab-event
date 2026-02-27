package com.miso.lxnn.dto.auth;

import com.miso.lxnn.enums.IudType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthMenuBtnSaveItemDto {
    private Long authMenuBtnSeq;
    private Integer menuSeq;
    private Long btnSeq;
    private String useYn;
    private IudType iudType;
}
