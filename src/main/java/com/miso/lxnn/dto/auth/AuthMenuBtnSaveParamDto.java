package com.miso.lxnn.dto.auth;

import lombok.Getter;
import lombok.Setter;

import javax.validation.Valid;
import java.util.List;

@Getter
@Setter
public class AuthMenuBtnSaveParamDto {
    private Integer authGrpSeq;
    private Integer authSeq;
    @Valid
    private List<AuthMenuBtnSaveItemDto> saveList;
}
