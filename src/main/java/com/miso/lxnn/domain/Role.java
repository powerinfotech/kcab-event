package com.miso.lxnn.domain;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotEmpty;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class Role {
    private Integer roleSeq;
    @NotEmpty
    private String roleCd;
    @NotEmpty
    private String roleNm;
    private String roleDesc;
    private Boolean useFlag;
    private String rgstUserId;
    private LocalDateTime rgstDateTime;
    private String uptUserId;
    private LocalDateTime uptDateTime;
}
