package com.miso.lxnn.controller.auth;

import com.miso.lxnn.annotation.MisoSession;
import com.miso.lxnn.dto.auth.AuthGroupMenuListDto;
import com.miso.lxnn.dto.auth.AuthGroupMenuSaveParamDto;
import com.miso.lxnn.dto.common.ApiResponse;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.service.auth.AuthGroupMenuManagementService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/auth-group-menu-mgt")
public class AuthGroupMenuManagementController {
    @Resource(name = "authGroupMenuManagementService")
    private AuthGroupMenuManagementService authGroupMenuManagementService;


    @GetMapping("/auth-group-menu-list")
    public ApiResponse<List<AuthGroupMenuListDto>> selectAuthGroupMenuList(@MisoSession LoginUser loginUser
            , @RequestParam("authGrpSeq") Integer authGrpSeq) throws Exception {
        return ApiResponse.ok(authGroupMenuManagementService.selectAuthGroupMenuList(authGrpSeq));
    }

    @PostMapping("/save")
    public ApiResponse<Void> save(@MisoSession LoginUser loginUser
            , @RequestBody @Valid AuthGroupMenuSaveParamDto authGroupMenuSaveDto) throws Exception {
        authGroupMenuManagementService.save(loginUser, authGroupMenuSaveDto.getAuthGroupMenuSaveDto(), authGroupMenuSaveDto.getAuthGrpSeq());
        return ApiResponse.ok();
    }
}
