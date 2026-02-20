package com.miso.lxnn.service.common;

import com.miso.lxnn.dto.common.LoginRequestDto;

import javax.servlet.http.HttpServletRequest;

public interface LoginService {
    void login(LoginRequestDto loginInfo, HttpServletRequest request) throws Exception;
    void logout() throws Exception;
}
