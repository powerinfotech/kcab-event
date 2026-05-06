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

@RestController
@RequestMapping("/api/find-user")
public class FindUserController {
    @Resource(name = "findUserService")
    private FindUserService findUserService;

    @PostMapping("/find-id")
    public ApiResponse<User> findUserId(@RequestBody User user){
        return ApiResponse.ok(findUserService.findUserId(user));
    }
    @PostMapping("/find-password")
    public ApiResponse<User> findPassword(@RequestBody User user){
        return ApiResponse.ok(findUserService.findUserPassword(user));
    }
    @PostMapping("/change-password")
    public ApiResponse<Void> changePassword (@RequestBody UserChangePasswordDto user)  {
        findUserService.changePassword(user);
        return ApiResponse.ok();
    }

}
