package com.miso.lxnn.domain;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class RoleUser {
    private Integer roleUserSeq;
    @NotNull
    private Integer roleSeq;
    @NotNull
    private Integer userSeq;
    private String roleDesc;
    @NotNull
    private LocalDate strDate;
    private LocalDate endDate;
    private Boolean useFlag;
    private String rgstUserId;
    private LocalDateTime rgstDateTime;
    private String uptUserId;
    private LocalDateTime uptDateTime;
}
