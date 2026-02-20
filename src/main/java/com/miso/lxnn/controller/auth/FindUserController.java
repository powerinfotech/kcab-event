package com.miso.lxnn.controller.auth;

import com.miso.lxnn.annotation.MisoSession;
import com.miso.lxnn.domain.User;
import com.miso.lxnn.dto.common.ApiResponse;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.dto.master.UserChangePasswordDto;
import com.miso.lxnn.service.auth.FindUserService;
import com.miso.lxnn.service.auth.MenuManagementService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

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
    public ApiResponse<Void> changePassword (@RequestBody UserChangePasswordDto user)  throws Exception {
        findUserService.changePassword(user);
        return ApiResponse.ok();
    }

}
