package com.miso.lxnn.service.auth;

import com.miso.lxnn.domain.AuthGroup;
import com.miso.lxnn.dto.auth.AuthGroupListDto;
import com.miso.lxnn.dto.auth.AuthGroupSaveDto;
import com.miso.lxnn.dto.common.LoginUser;

import javax.validation.Valid;
import java.util.List;

public interface AuthGroupManagementService {
    List<AuthGroupListDto> selectAuthGroupList() throws Exception;
    void saveAuthGroup(@Valid AuthGroupSaveDto authGroupSaveDto, LoginUser loginUser) throws Exception;
}
