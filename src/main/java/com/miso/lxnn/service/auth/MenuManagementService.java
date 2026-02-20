package com.miso.lxnn.service.auth;

import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.dto.auth.MenuListDto;
import com.miso.lxnn.dto.auth.MenuSaveDto;

import java.util.List;

public interface MenuManagementService {
    List<MenuListDto>  selectMenuInfo(String userId) throws Exception;
    void saveMenu(LoginUser loginUser, MenuSaveDto menuSaveDto) throws Exception;
    void deleteMenu(Integer menuSeq) throws Exception;
}
