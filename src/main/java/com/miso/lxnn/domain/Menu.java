package com.miso.lxnn.domain;


import com.miso.lxnn.enums.MenuType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class Menu {
    private Integer menuSeq;
    private Integer menuId;
    @NotNull
    private Integer upMenuId;
    @NotEmpty
    private String menuNm;
    @NotNull
    private MenuType menuTypeCd;
    @NotEmpty
    private String menuViewPath;
    @NotEmpty
    private String menuUri;
    private Boolean useFlag;
    private Integer sortSeq;
    private String rgstUserId;
    private LocalDateTime rgstDateTime;
    private String uptUserId;
    private LocalDateTime uptDateTime;
}
