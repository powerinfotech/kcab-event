package com.miso.lxnn.service.auth;

import com.miso.lxnn.dto.auth.AuthMenuBtnListDto;
import com.miso.lxnn.dto.auth.AuthMenuMgtAuthListDto;

import java.util.List;

public interface UserMenuAuthService {
    List<AuthMenuMgtAuthListDto> selectUserAuthList(String userId) throws Exception;

    List<AuthMenuBtnListDto> selectUserAllAuthMenuBtnList(String userId) throws Exception;
}
