package com.kcabEvent.controller.common;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.auth.MenuListDto;
import com.kcabEvent.dto.common.MenuBtnDetailDto;
import com.kcabEvent.dto.master.UserListDto;
import com.kcabEvent.dto.master.UserListSearchDto;
import com.kcabEvent.service.auth.MenuManagementService;
import com.kcabEvent.domain.User;
import com.kcabEvent.service.master.UserManagementService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import java.util.List;
import java.util.stream.Collectors;


@Slf4j
@RequestMapping("/api/common")
@RestController
public class CommonController {
    @Resource(name = "userManagementService")
    private UserManagementService userManagementService;

    @Resource(name = "menuManagementService")
    private MenuManagementService menuManagementService;


    @GetMapping("/login-info")
    public ApiResponse<LoginUser> loginInfo(@KcabEventSession LoginUser loginUser) {
        if (loginUser == null)
            return ApiResponse.ok(null);
        return ApiResponse.ok(resolveLoginInfoResponse(loginUser));
    }

    private LoginUser resolveLoginInfoResponse(LoginUser loginUser) {
        User user = userManagementService.selectUserInfo(loginUser.getUserId());
        return user != null ? LoginUser.convert(user) : null;
    }

    @GetMapping("/menu-info")
    public ApiResponse<List<MenuListDto>> menuInfo(@KcabEventSession LoginUser loginUser) {
        if(loginUser ==null)
            return ApiResponse.ok(null);
        String userId = loginUser.getUserId();
        return ApiResponse.ok(menuManagementService.selectUserPermittedMenuInfo(userId)
                .stream().filter(v->v.getUpMenuSeq() != null).collect(Collectors.toList()));
    }

    @GetMapping("/user-list")
    public ApiResponse<List<UserListDto>> userList(@KcabEventSession LoginUser loginUser, UserListSearchDto userListSearchDto) {
        if(loginUser ==null)
            return ApiResponse.ok(null);
        return ApiResponse.ok(userManagementService.selectUserList(userListSearchDto));
    }

    @GetMapping("/menu-btn-list")
    public ApiResponse<List<MenuBtnDetailDto>> menuBtnList(@KcabEventSession LoginUser loginUser, @RequestParam("menuSeq") Long menuSeq) {
        if(loginUser == null)
            return ApiResponse.ok(null);
        String userId = loginUser.getUserId();
        return ApiResponse.ok(menuManagementService.selectUserPermittedMenuBtnList(userId, menuSeq));
    }

}
