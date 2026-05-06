package com.kcabEvent.controller.master;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.domain.User;
import com.kcabEvent.dto.master.UserChangePasswordDto;
import com.kcabEvent.dto.master.UserListDto;
import com.kcabEvent.dto.master.UserListSearchDto;
import com.kcabEvent.dto.master.UserSaveDto;
import com.kcabEvent.service.master.UserManagementService;
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
    public ApiResponse<UserSaveDto> saveUser(@KcabEventSession LoginUser LoginUser, @RequestBody @Valid UserSaveDto userSaveDto) {
        userManagementService.saveUser(userSaveDto, LoginUser);
        return ApiResponse.ok(userSaveDto);
    }

    @PostMapping("/delete-user")
    public ApiResponse<Void> deleteUser(@KcabEventSession LoginUser LoginUser, @RequestBody User user) {
        userManagementService.deleteUser(user, LoginUser);
        return ApiResponse.ok();
    }

    @PostMapping("/change-password")
    public ApiResponse<Void> changePassword(@KcabEventSession LoginUser LoginUser, @RequestBody @Valid UserChangePasswordDto userChangePasswordDto) {
        userManagementService.changePassword(userChangePasswordDto, LoginUser);
        return ApiResponse.ok();
    }
}
