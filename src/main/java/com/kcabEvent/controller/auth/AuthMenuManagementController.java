package com.kcabEvent.controller.auth;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.dto.auth.AuthMenuBtnListDto;
import com.kcabEvent.dto.auth.AuthMenuBtnSaveParamDto;
import com.kcabEvent.dto.auth.AuthMenuMgtAuthListDto;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.service.auth.AuthMenuManagementService;
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
            @KcabEventSession LoginUser loginUser,
            @RequestParam(value = "authNm", required = false) String authNm) {
        return ApiResponse.ok(authMenuManagementService.selectAuthListWithGroup(authNm));
    }

    @GetMapping("/auth-menu-btn-list")
    public ApiResponse<List<AuthMenuBtnListDto>> selectAuthMenuBtnList(
            @KcabEventSession LoginUser loginUser,
            @RequestParam("authGrpSeq") Integer authGrpSeq,
            @RequestParam("authSeq") Integer authSeq) {
        return ApiResponse.ok(authMenuManagementService.selectAuthMenuBtnList(authGrpSeq, authSeq));
    }

    @PostMapping("/save")
    public ApiResponse<Void> save(
            @KcabEventSession LoginUser loginUser,
            @RequestBody @Valid AuthMenuBtnSaveParamDto param) {
        authMenuManagementService.save(loginUser, param.getAuthGrpSeq(), param.getAuthSeq(), param.getSaveList());
        return ApiResponse.ok();
    }
}
