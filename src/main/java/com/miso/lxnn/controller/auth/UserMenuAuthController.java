package com.miso.lxnn.controller.auth;

import com.miso.lxnn.annotation.MisoSession;
import com.miso.lxnn.dto.auth.AuthMenuBtnListDto;
import com.miso.lxnn.dto.auth.AuthMenuMgtAuthListDto;
import com.miso.lxnn.dto.common.ApiResponse;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.service.auth.UserMenuAuthService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/user-menu-auth")
public class UserMenuAuthController {

    @Resource(name = "userMenuAuthService")
    private UserMenuAuthService userMenuAuthService;

    @GetMapping("/auth-list")
    public ApiResponse<List<AuthMenuMgtAuthListDto>> selectUserAuthList(
            @MisoSession LoginUser loginUser,
            @RequestParam("userId") String userId) throws Exception {
        return ApiResponse.ok(userMenuAuthService.selectUserAuthList(userId));
    }

    @GetMapping("/all-menu-btn-list")
    public ApiResponse<List<AuthMenuBtnListDto>> selectUserAllAuthMenuBtnList(
            @MisoSession LoginUser loginUser,
            @RequestParam("userId") String userId) throws Exception {
        return ApiResponse.ok(userMenuAuthService.selectUserAllAuthMenuBtnList(userId));
    }
}
