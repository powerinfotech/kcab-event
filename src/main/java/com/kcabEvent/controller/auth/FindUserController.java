package com.kcabEvent.controller.auth;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.domain.User;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.master.UserChangePasswordDto;
import com.kcabEvent.service.auth.FindUserService;
import com.kcabEvent.service.auth.MenuManagementService;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;

/**
 * 아이디 찾기와 비밀번호 재설정을 위한 계정 복구 API를 처리한다.
 */
@RestController
@RequestMapping("/api/find-user")
public class FindUserController {
    @Resource(name = "findUserService")
    private FindUserService findUserService;

    /**
     * 사용자 식별 정보로 아이디를 조회한다.
     */
    @PostMapping("/find-id")
    public ApiResponse<User> findUserId(@RequestBody User user){
        return ApiResponse.ok(findUserService.findUserId(user));
    }

    /**
     * 비밀번호 재설정 전에 사용자 정보를 검증한다.
     */
    @PostMapping("/find-password")
    public ApiResponse<User> findPassword(@RequestBody User user){
        return ApiResponse.ok(findUserService.findUserPassword(user));
    }

    /**
     * 계정 복구 검증 후 비밀번호를 변경한다.
     */
    @PostMapping("/change-password")
    public ApiResponse<Void> changePassword (@RequestBody UserChangePasswordDto user)  {
        findUserService.changePassword(user);
        return ApiResponse.ok();
    }

}
