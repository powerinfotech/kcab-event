package com.miso.lxnn.controller.auth;

import com.miso.lxnn.annotation.MisoSession;
import com.miso.lxnn.domain.AuthGroup;
import com.miso.lxnn.dto.auth.AuthGroupListDto;
import com.miso.lxnn.dto.auth.AuthGroupSaveDto;
import com.miso.lxnn.dto.common.ApiResponse;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.service.auth.AuthGroupManagementService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/auth-group-mgt")
public class AuthGroupManagementController {

    @Resource(name = "authGroupManagementService")
    private AuthGroupManagementService authGroupManagementService;


    @GetMapping("/auth-group-list")
    public ApiResponse<List<AuthGroupListDto>> selectAuthGroupList(@MisoSession LoginUser loginUser) throws Exception {
        return ApiResponse.ok(authGroupManagementService.selectAuthGroupList());
    }

    @PostMapping("/save")
    public ApiResponse<Void> saveAuthGroup(@MisoSession LoginUser loginUser, @RequestBody @Valid AuthGroupSaveDto authGroupSaveDto) throws Exception {
        authGroupManagementService.saveAuthGroup(authGroupSaveDto, loginUser);
        return ApiResponse.ok();
    }

}
