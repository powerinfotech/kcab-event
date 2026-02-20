package com.miso.lxnn.service.common;

import com.miso.lxnn.domain.User;

public interface UserService {
    User selectUserInfo(String userId) throws Exception;
}
