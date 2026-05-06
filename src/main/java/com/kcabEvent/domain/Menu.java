package com.kcabEvent.domain;


import com.kcabEvent.enums.MenuType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
