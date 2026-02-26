package com.miso.lxnn.dto.auth;

import lombok.Getter;
import lombok.Setter;

import javax.validation.Valid;
import java.util.List;

@Getter
@Setter
public class AuthManagementSaveDto {
    @Valid
    private List<AuthGrpListDto> authGrpList;
    @Valid
    private List<AuthListDto> authList;
    @Valid
    private List<AuthUserListDto> authUserList;
}
