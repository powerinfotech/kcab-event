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
    @NotNull
    private Integer upMenuSeq;
    @NotEmpty
    private String menuNm;
    @NotNull
    private MenuType menuTypeCd;
    private String menuViewPath;
    private String menuUrl;
    private String useYn;
    private Integer sortSeq;
    private Integer rgstUserSeq;
    private LocalDateTime rgstDateTime;
    private Integer uptUserSeq;
    private LocalDateTime uptDateTime;
}
