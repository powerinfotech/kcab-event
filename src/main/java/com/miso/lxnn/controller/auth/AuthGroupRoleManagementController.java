package com.miso.lxnn.controller.auth;

import com.miso.lxnn.annotation.MisoSession;
import com.miso.lxnn.dto.auth.*;
import com.miso.lxnn.dto.common.ApiResponse;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.service.auth.AuthGroupRoleManagementService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/auth-group-role-mgt")
public class AuthGroupRoleManagementController {

    @Resource(name = "authGroupRoleManagementService")
    private AuthGroupRoleManagementService authGroupRoleManagementService;

    @GetMapping("/auth-group-role-list")
    public ApiResponse<List<AuthGroupRoleListDto>> selectAuthGroupRoleList(@MisoSession LoginUser loginUser, @RequestParam("authGrpSeq") Integer authGrpSeq) throws Exception {
        return ApiResponse.ok(authGroupRoleManagementService.selectAuthGroupRoleList(authGrpSeq));
    }

    @PostMapping("/save")
    public ApiResponse<Void> saveAuthGroup(@MisoSession LoginUser loginUser, @RequestBody @Valid AuthGroupRoleSaveDto authGroupRoleSaveDto) throws Exception {
        authGroupRoleManagementService.saveAuthGroupRole(authGroupRoleSaveDto, loginUser);
        return ApiResponse.ok();
    }

}
