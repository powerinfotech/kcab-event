package com.miso.lxnn.controller.master;

import com.miso.lxnn.annotation.MisoSession;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.dto.common.ApiResponse;
import com.miso.lxnn.domain.User;
import com.miso.lxnn.dto.master.UserChangePasswordDto;
import com.miso.lxnn.dto.master.UserListDto;
import com.miso.lxnn.dto.master.UserListSearchDto;
import com.miso.lxnn.dto.master.UserSaveDto;
import com.miso.lxnn.service.master.UserManagementService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/user-mgt")
public class UserManagementController {
    @Resource(name = "userManagementService")
    private UserManagementService userManagementService;

    @GetMapping("/user-list")
    public ApiResponse<List<UserListDto>> selectUserList(UserListSearchDto searchParam) throws Exception {
        return ApiResponse.ok(userManagementService.selectUserList(searchParam));
    }

    @PostMapping("/save-user")
    public ApiResponse<UserSaveDto> saveUser(@MisoSession LoginUser LoginUser, @RequestBody @Valid UserSaveDto userSaveDto) throws Exception {
        userManagementService.saveUser(userSaveDto, LoginUser);
        return ApiResponse.ok(userSaveDto);
    }

    @PostMapping("/delete-user")
    public ApiResponse<Void> deleteUser(@MisoSession LoginUser LoginUser, @RequestBody User user) throws Exception {
        userManagementService.deleteUser(user, LoginUser);
        return ApiResponse.ok();
    }

    @PostMapping("/change-password")
    public ApiResponse<Void> changePassword(@MisoSession LoginUser LoginUser, @RequestBody @Valid UserChangePasswordDto userChangePasswordDto) throws Exception {
        userManagementService.changePassword(userChangePasswordDto, LoginUser);
        return ApiResponse.ok();
    }
}
