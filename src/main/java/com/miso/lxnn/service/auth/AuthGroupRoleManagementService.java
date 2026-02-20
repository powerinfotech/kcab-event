package com.miso.lxnn.service.auth;

import com.miso.lxnn.dto.auth.*;
import com.miso.lxnn.dto.common.LoginUser;

import java.util.List;

public interface AuthGroupRoleManagementService {
    List<AuthGroupListDto> selectAuthGroupList() throws Exception;
    List<AuthGroupRoleListDto> selectAuthGroupRoleList(Integer authGrpSeq) throws Exception;
    void saveAuthGroupRole(AuthGroupRoleSaveDto authGroupRoleSaveDto, LoginUser loginUser) throws Exception;
}
