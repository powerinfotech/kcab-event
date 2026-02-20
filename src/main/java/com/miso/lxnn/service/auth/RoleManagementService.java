package com.miso.lxnn.service.auth;

import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.dto.auth.RoleListDto;
import com.miso.lxnn.dto.auth.RoleSaveDto;
import com.miso.lxnn.dto.auth.RoleUserListDto;
import com.miso.lxnn.dto.auth.RoleListSearchDto;

import java.util.List;

public interface RoleManagementService {
    List<RoleListDto> selectRoleList(RoleListSearchDto roleListSearchDto) throws Exception;
    List<RoleUserListDto> selectRoleUserList(Integer roleSeq) throws Exception;
    void saveRole(RoleSaveDto roleSaveDto, LoginUser loginUser) throws Exception;
}
