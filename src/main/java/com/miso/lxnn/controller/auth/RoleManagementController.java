package com.miso.lxnn.controller.auth;

import com.miso.lxnn.annotation.MisoSession;
import com.miso.lxnn.dto.auth.RoleListDto;
import com.miso.lxnn.dto.auth.RoleSaveDto;
import com.miso.lxnn.dto.auth.RoleUserListDto;
import com.miso.lxnn.dto.common.ApiResponse;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.service.auth.RoleManagementService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/role-mgt")
public class RoleManagementController {
    @Resource(name = "roleManagementService")
    private RoleManagementService roleManagementService;


    @GetMapping("/role-list")
    public ApiResponse<List<RoleListDto>> selectRoleList(@MisoSession LoginUser loginUser) throws Exception {
        return ApiResponse.ok(roleManagementService.selectRoleList(null));
    }

    @GetMapping("/role-user-list")
    public ApiResponse<List<RoleUserListDto>> selectRoleUserList(@MisoSession LoginUser loginUser, @RequestParam("roleSeq") Integer roleSeq) throws Exception {
        return ApiResponse.ok(roleManagementService.selectRoleUserList(roleSeq));
    }

    @PostMapping("/save")
    public ApiResponse<Void> saveRole(@MisoSession LoginUser loginUser, @RequestBody @Valid RoleSaveDto roleSaveDto) throws Exception {
        roleManagementService.saveRole(roleSaveDto, loginUser);
        return ApiResponse.ok();
    }


}
