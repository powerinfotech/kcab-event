package com.miso.lxnn.service.auth;

import com.miso.lxnn.dto.auth.UserMenuAuthGroupListDto;
import com.miso.lxnn.dto.auth.UserMenuAuthMenuListDto;

import java.util.List;

public interface UserMenuAuthStateService {
    List<UserMenuAuthGroupListDto> selectUserMenuAuthGroupList(Integer userSeq) throws Exception;
    List<UserMenuAuthMenuListDto> selectUserMenuAuthMenuList(Integer authGrpSeq) throws Exception;
}
