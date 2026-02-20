package com.miso.lxnn.service.master;

import com.miso.lxnn.domain.User;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.dto.master.*;

import java.util.List;

public interface UserManagementService {
    User selectUserInfo(String userId) throws Exception;
    List<UserListDto> selectUserList(UserListSearchDto param) throws Exception;
    List<UserComboListDto> selectUserComboList(String searchText) throws Exception;
    void saveUser(UserSaveDto user, LoginUser LoginUser) throws Exception;
    void deleteUser(User user, LoginUser LoginUser) throws Exception;
    void changePassword(UserChangePasswordDto user, LoginUser LoginUser) throws Exception;
}
