package com.miso.lxnn.service.auth;

import com.miso.lxnn.domain.User;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.dto.master.UserChangePasswordDto;

public interface FindUserService {
    User findUserId(User user);
    User findUserPassword(User user);
    void changePassword(UserChangePasswordDto user) throws Exception ;
}
