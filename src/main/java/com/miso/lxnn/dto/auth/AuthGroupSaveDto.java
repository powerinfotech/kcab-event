package com.miso.lxnn.dto.auth;

import lombok.Getter;
import lombok.Setter;

import javax.validation.Valid;
import java.util.List;


@Getter
@Setter
public class AuthGroupSaveDto {
    @Valid
    List<AuthGroupListDto> authGroupList;
}
