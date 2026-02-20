package com.miso.lxnn.service.auth;

import com.miso.lxnn.dto.auth.AuthGroupMenuListDto;
import com.miso.lxnn.dto.auth.AuthGroupMenuSaveDto;
import com.miso.lxnn.dto.common.LoginUser;

import java.util.List;

public interface AuthGroupMenuManagementService {
    List<AuthGroupMenuListDto> selectAuthGroupMenuList(Integer authGrpSeq) throws Exception;
    void save(LoginUser loginUser, AuthGroupMenuSaveDto authGroupMenuSaveDtos, Integer authGrpSeq) throws Exception;
}
