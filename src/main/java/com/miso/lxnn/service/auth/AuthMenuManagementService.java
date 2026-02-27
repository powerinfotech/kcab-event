package com.miso.lxnn.service.auth;

import com.miso.lxnn.dto.auth.AuthMenuBtnListDto;
import com.miso.lxnn.dto.auth.AuthMenuBtnSaveItemDto;
import com.miso.lxnn.dto.auth.AuthMenuMgtAuthListDto;
import com.miso.lxnn.dto.common.LoginUser;

import java.util.List;

public interface AuthMenuManagementService {
    List<AuthMenuMgtAuthListDto> selectAuthListWithGroup() throws Exception;

    List<AuthMenuBtnListDto> selectAuthMenuBtnList(Integer authGrpSeq, Integer authSeq) throws Exception;

    void save(LoginUser loginUser, Integer authGrpSeq, Integer authSeq,
              List<AuthMenuBtnSaveItemDto> saveList) throws Exception;
}
