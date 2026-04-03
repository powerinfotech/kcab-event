package com.power.controller.auth;

import com.power.annotation.PowerSession;
import com.power.dto.auth.AuthMenuBtnListDto;
import com.power.dto.auth.AuthMenuMgtAuthListDto;
import com.power.dto.common.ApiResponse;
import com.power.dto.common.LoginUser;
import com.power.service.auth.UserMenuAuthService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/user-menu-auth")
public class UserMenuAuthController {

    @Resource(name = "userMenuAuthService")
    private UserMenuAuthService userMenuAuthService;

    @GetMapping("/auth-list")
    public ApiResponse<List<AuthMenuMgtAuthListDto>> selectUserAuthList(
            @PowerSession LoginUser loginUser,
            @RequestParam("userId") String userId) {
        return ApiResponse.ok(userMenuAuthService.selectUserAuthList(userId));
    }

    @GetMapping("/all-menu-btn-list")
    public ApiResponse<List<AuthMenuBtnListDto>> selectUserAllAuthMenuBtnList(
            @PowerSession LoginUser loginUser,
            @RequestParam("userId") String userId) {
        return ApiResponse.ok(userMenuAuthService.selectUserAllAuthMenuBtnList(userId));
    }
}
