package com.miso.lxnn.dto.auth;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class RoleListSearchDto {
    private String roleCd;
    private String roleNm;
    private Boolean useFlag;
}
