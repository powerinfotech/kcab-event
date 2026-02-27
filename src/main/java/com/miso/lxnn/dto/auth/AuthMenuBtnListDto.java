package com.miso.lxnn.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthMenuBtnListDto {
    // tb_menu (via recursive CTE)
    private Integer menuSeq;
    private Integer upMenuSeq;
    private String menuNm;
    private String menuTypeCd;
    private String menuUseYn;
    private Integer sortSeq;
    private Integer level;
    private String sortSeqPath;

    // tb_btn
    private Long btnSeq;
    private Integer btnSortSeq;
    private String btnNm;

    // tb_menu_btn
    private String menuBtnUseYn;

    // tb_auth_menu_btn
    private Long authMenuBtnSeq;
    private String authMenuBtnUseYn;
}
