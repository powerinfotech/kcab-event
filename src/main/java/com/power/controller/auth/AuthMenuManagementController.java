package com.power.controller.auth;

import com.power.annotation.PowerSession;
import com.power.dto.auth.AuthMenuBtnListDto;
import com.power.dto.auth.AuthMenuBtnSaveParamDto;
import com.power.dto.auth.AuthMenuMgtAuthListDto;
import com.power.dto.common.ApiResponse;
import com.power.dto.common.LoginUser;
import com.power.service.auth.AuthMenuManagementService;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/auth-menu-mgt")
public class AuthMenuManagementController {

    @Resource(name = "authMenuManagementService")
    private AuthMenuManagementService authMenuManagementService;

    @GetMapping("/auth-list")
    public ApiResponse<List<AuthMenuMgtAuthListDto>> selectAuthList(
            @PowerSession LoginUser loginUser,
            @RequestParam(value = "authNm", required = false) String authNm) throws Exception {
        return ApiResponse.ok(authMenuManagementService.selectAuthListWithGroup(authNm));
    }

    @GetMapping("/auth-menu-btn-list")
    public ApiResponse<List<AuthMenuBtnListDto>> selectAuthMenuBtnList(
            @PowerSession LoginUser loginUser,
            @RequestParam("authGrpSeq") Integer authGrpSeq,
            @RequestParam("authSeq") Integer authSeq) throws Exception {
        return ApiResponse.ok(authMenuManagementService.selectAuthMenuBtnList(authGrpSeq, authSeq));
    }

    @PostMapping("/save")
    public ApiResponse<Void> save(
            @PowerSession LoginUser loginUser,
            @RequestBody @Valid AuthMenuBtnSaveParamDto param) throws Exception {
        authMenuManagementService.save(loginUser, param.getAuthGrpSeq(), param.getAuthSeq(), param.getSaveList());
        return ApiResponse.ok();
    }
}
