package com.miso.lxnn.controller.common;

import com.miso.lxnn.annotation.MisoSession;
import com.miso.lxnn.dto.common.ApiResponse;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.dto.auth.MenuListDto;
import com.miso.lxnn.dto.common.MenuBtnDetailDto;
import com.miso.lxnn.dto.master.UserListDto;
import com.miso.lxnn.dto.master.UserListSearchDto;
import com.miso.lxnn.service.auth.MenuManagementService;
import com.miso.lxnn.domain.User;
import com.miso.lxnn.service.master.UserManagementService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
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
    public ApiResponse<LoginUser> loginInfo(@MisoSession LoginUser loginUser) throws Exception {
        if (loginUser == null)
            return ApiResponse.ok(null);
        return ApiResponse.ok(resolveLoginInfoResponse(loginUser));
    }

    private LoginUser resolveLoginInfoResponse(LoginUser loginUser) throws Exception {
        User user = userManagementService.selectUserInfo(loginUser.getUserId());
        return user != null ? LoginUser.convert(user) : null;
    }

    @GetMapping("/menu-info")
    public ApiResponse<List<MenuListDto>> menuInfo(@MisoSession LoginUser loginUser) throws Exception {
        if(loginUser ==null)
            return ApiResponse.ok(null);
        String userId = loginUser.getUserId();
        return ApiResponse.ok(menuManagementService.selectUserPermittedMenuInfo(userId)
                .stream().filter(v->v.getUpMenuSeq() != null).collect(Collectors.toList()));
    }

    @GetMapping("/user-list")
    public ApiResponse<List<UserListDto>> userList(@MisoSession LoginUser loginUser, UserListSearchDto userListSearchDto) throws Exception {
        if(loginUser ==null)
            return ApiResponse.ok(null);
        return ApiResponse.ok(userManagementService.selectUserList(userListSearchDto));
    }

    @GetMapping("/menu-btn-list")
    public ApiResponse<List<MenuBtnDetailDto>> menuBtnList(@MisoSession LoginUser loginUser, @RequestParam("menuSeq") Long menuSeq) throws Exception {
        if(loginUser == null)
            return ApiResponse.ok(null);
        String userId = loginUser.getUserId();
        return ApiResponse.ok(menuManagementService.selectUserPermittedMenuBtnList(userId, menuSeq));
    }

}
