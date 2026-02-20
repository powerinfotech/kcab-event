package com.miso.lxnn.dto.auth;

import lombok.Getter;
import lombok.Setter;

import javax.validation.Valid;


@Getter
@Setter
public class AuthGroupMenuSaveParamDto {
     @Valid
     private AuthGroupMenuSaveDto authGroupMenuSaveDto;
     @Valid
     private Integer authGrpSeq;
}
