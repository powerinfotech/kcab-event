package com.power.controller.master;

import com.power.annotation.PowerSession;
import com.power.dto.common.LoginUser;
import com.power.dto.common.ApiResponse;
import com.power.domain.User;
import com.power.dto.master.UserChangePasswordDto;
import com.power.dto.master.UserListDto;
import com.power.dto.master.UserListSearchDto;
import com.power.dto.master.UserSaveDto;
import com.power.service.master.UserManagementService;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/user-mgt")
public class UserManagementController {
    @Resource(name = "userManagementService")
    private UserManagementService userManagementService;

    @GetMapping("/user-list")
    public ApiResponse<List<UserListDto>> selectUserList(UserListSearchDto searchParam) {
        return ApiResponse.ok(userManagementService.selectUserList(searchParam));
    }

    @PostMapping("/save-user")
    public ApiResponse<UserSaveDto> saveUser(@PowerSession LoginUser LoginUser, @RequestBody @Valid UserSaveDto userSaveDto) {
        userManagementService.saveUser(userSaveDto, LoginUser);
        return ApiResponse.ok(userSaveDto);
    }

    @PostMapping("/delete-user")
    public ApiResponse<Void> deleteUser(@PowerSession LoginUser LoginUser, @RequestBody User user) {
        userManagementService.deleteUser(user, LoginUser);
        return ApiResponse.ok();
    }

    @PostMapping("/change-password")
    public ApiResponse<Void> changePassword(@PowerSession LoginUser LoginUser, @RequestBody @Valid UserChangePasswordDto userChangePasswordDto) {
        userManagementService.changePassword(userChangePasswordDto, LoginUser);
        return ApiResponse.ok();
    }
}
