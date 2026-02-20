package com.miso.lxnn.controller.auth;

import com.miso.lxnn.dto.auth.UserMenuAuthGroupListDto;
import com.miso.lxnn.dto.auth.UserMenuAuthMenuListDto;
import com.miso.lxnn.dto.common.ApiResponse;
import com.miso.lxnn.dto.master.UserComboListDto;
import com.miso.lxnn.service.auth.UserMenuAuthStateService;
import com.miso.lxnn.service.master.UserManagementService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/user-menu-auth-state")
public class UserMenuAuthStateController {

    @Resource(name = "userManagementService")
    private UserManagementService userManagementService;

    @Resource(name = "userMenuAuthStateService")
    private UserMenuAuthStateService userMenuAuthStateService;


    @GetMapping("/auth-group-list")
    public ApiResponse<List<UserMenuAuthGroupListDto>> authGroupList(@RequestParam("userSeq") Integer userSeq) throws Exception {
        return ApiResponse.ok(userMenuAuthStateService.selectUserMenuAuthGroupList(userSeq));
    }

    @GetMapping("/auth-menu-list")
    public ApiResponse<List<UserMenuAuthMenuListDto>> selectAuthGroupMenuList(@RequestParam("authGrpSeq") Integer authGrpSeq) throws Exception {
        return ApiResponse.ok(userMenuAuthStateService.selectUserMenuAuthMenuList(authGrpSeq));
    }

    @GetMapping("/user-combo-list")
    public ApiResponse<List<UserComboListDto>> userComboList(String searchText) throws Exception {
        return ApiResponse.ok(userManagementService.selectUserComboList(searchText));
    }
}
