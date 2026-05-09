package com.kcabEvent.controller.auth;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.dto.auth.AuthMenuBtnListDto;
import com.kcabEvent.dto.auth.AuthMenuMgtAuthListDto;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.service.auth.UserMenuAuthService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import java.util.List;

/**
 * 특정 사용자에게 배정된 메뉴와 버튼 권한을 조회하는 API를 제공한다.
 */
@RestController
@RequestMapping("/api/user-menu-auth")
public class UserMenuAuthController {

    @Resource(name = "userMenuAuthService")
    private UserMenuAuthService userMenuAuthService;

    /**
     * 사용자에게 부여된 권한 그룹과 권한을 조회한다.
     */
    @GetMapping("/auth-list")
    public ApiResponse<List<AuthMenuMgtAuthListDto>> selectUserAuthList(
            @KcabEventSession LoginUser loginUser,
            @RequestParam("userId") @NotBlank String userId) {
        return ApiResponse.ok(userMenuAuthService.selectUserAuthList(userId));
    }

    /**
     * 사용자가 사용할 수 있는 전체 메뉴 및 버튼 권한을 조회한다.
     */
    @GetMapping("/all-menu-btn-list")
    public ApiResponse<List<AuthMenuBtnListDto>> selectUserAllAuthMenuBtnList(
            @KcabEventSession LoginUser loginUser,
            @RequestParam("userId") @NotBlank String userId) {
        return ApiResponse.ok(userMenuAuthService.selectUserAllAuthMenuBtnList(userId));
    }
}
