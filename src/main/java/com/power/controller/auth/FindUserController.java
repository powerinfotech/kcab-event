package com.power.controller.auth;

import com.power.annotation.PowerSession;
import com.power.domain.User;
import com.power.dto.common.ApiResponse;
import com.power.dto.common.LoginUser;
import com.power.dto.master.UserChangePasswordDto;
import com.power.service.auth.FindUserService;
import com.power.service.auth.MenuManagementService;
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
