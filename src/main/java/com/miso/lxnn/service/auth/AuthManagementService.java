package com.miso.lxnn.service.auth;

import com.miso.lxnn.dto.auth.AuthGrpListDto;
import com.miso.lxnn.dto.auth.AuthListDto;
import com.miso.lxnn.dto.auth.AuthManagementSaveDto;
import com.miso.lxnn.dto.auth.AuthUserListDto;
import com.miso.lxnn.dto.auth.UserSearchDto;
import com.miso.lxnn.dto.common.LoginUser;

import javax.validation.Valid;
import java.util.List;

public interface AuthManagementService {
    List<AuthGrpListDto> selectAuthGrpList() throws Exception;
    List<AuthListDto> selectAuthList(Integer authGrpSeq) throws Exception;
    List<AuthUserListDto> selectAuthUserList(Integer authGrpSeq, Integer authSeq) throws Exception;
    List<UserSearchDto> selectUserSearchList(String searchText, Boolean excludeUnused) throws Exception;
    void saveAuthManagement(@Valid AuthManagementSaveDto saveDto, LoginUser loginUser) throws Exception;
}
