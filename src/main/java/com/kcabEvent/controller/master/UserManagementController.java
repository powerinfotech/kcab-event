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

/**
 * 기존 사용자 검색, 저장, 삭제, 비밀번호 변경을 위한 관리자 API를 제공한다.
 */
@RestController
@RequestMapping("/api/user-mgt")
public class UserManagementController {
    @Resource(name = "userManagementService")
    private UserManagementService userManagementService;

    /**
     * 전달된 검색 조건으로 사용자 목록을 조회한다.
     */
    @GetMapping("/user-list")
    public ApiResponse<List<UserListDto>> selectUserList(UserListSearchDto searchParam) {
        return ApiResponse.ok(userManagementService.selectUserList(searchParam));
    }

    /**
     * 사용자를 생성하거나 수정한다.
     */
    @PostMapping("/save-user")
    public ApiResponse<UserSaveDto> saveUser(@KcabEventSession LoginUser LoginUser, @RequestBody @Valid UserSaveDto userSaveDto) {
        userManagementService.saveUser(userSaveDto, LoginUser);
        return ApiResponse.ok(userSaveDto);
    }

    /**
     * 서비스 정책에 따라 사용자를 삭제하거나 비활성화한다.
     */
    @PostMapping("/delete-user")
    public ApiResponse<Void> deleteUser(@KcabEventSession LoginUser LoginUser, @RequestBody User user) {
        userManagementService.deleteUser(user, LoginUser);
        return ApiResponse.ok();
    }

    /**
     * 사용자 비밀번호를 변경한다.
     */
    @PostMapping("/change-password")
    public ApiResponse<Void> changePassword(@KcabEventSession LoginUser LoginUser, @RequestBody @Valid UserChangePasswordDto userChangePasswordDto) {
        userManagementService.changePassword(userChangePasswordDto, LoginUser);
        return ApiResponse.ok();
    }
}
