package com.miso.lxnn.controller.auth;

import com.miso.lxnn.annotation.MisoSession;
import com.miso.lxnn.dto.auth.AuthMenuBtnListDto;
import com.miso.lxnn.dto.auth.AuthMenuBtnSaveParamDto;
import com.miso.lxnn.dto.auth.AuthMenuMgtAuthListDto;
import com.miso.lxnn.dto.common.ApiResponse;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.service.auth.AuthMenuManagementService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/auth-menu-mgt")
public class AuthMenuManagementController {

    @Resource(name = "authMenuManagementService")
    private AuthMenuManagementService authMenuManagementService;

    @GetMapping("/auth-list")
    public ApiResponse<List<AuthMenuMgtAuthListDto>> selectAuthList(
            @MisoSession LoginUser loginUser) throws Exception {
        return ApiResponse.ok(authMenuManagementService.selectAuthListWithGroup());
    }

    @GetMapping("/auth-menu-btn-list")
    public ApiResponse<List<AuthMenuBtnListDto>> selectAuthMenuBtnList(
            @MisoSession LoginUser loginUser,
            @RequestParam("authGrpSeq") Integer authGrpSeq,
            @RequestParam("authSeq") Integer authSeq) throws Exception {
        return ApiResponse.ok(authMenuManagementService.selectAuthMenuBtnList(authGrpSeq, authSeq));
    }

    @PostMapping("/save")
    public ApiResponse<Void> save(
            @MisoSession LoginUser loginUser,
            @RequestBody @Valid AuthMenuBtnSaveParamDto param) throws Exception {
        authMenuManagementService.save(loginUser, param.getAuthGrpSeq(), param.getAuthSeq(), param.getSaveList());
        return ApiResponse.ok();
    }
}
