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

/**
 * 권한 그룹에 메뉴와 버튼 권한을 배정하는 API를 제공한다.
 */
@RestController
@RequestMapping("/api/auth-menu-mgt")
public class AuthMenuManagementController {

    @Resource(name = "authMenuManagementService")
    private AuthMenuManagementService authMenuManagementService;

    /**
     * 메뉴 권한 설정에 사용할 권한 그룹 포함 권한 목록을 조회한다.
     */
    @GetMapping("/auth-list")
    public ApiResponse<List<AuthMenuMgtAuthListDto>> selectAuthList(
            @KcabEventSession LoginUser loginUser,
            @RequestParam(value = "authNm", required = false) String authNm) {
        return ApiResponse.ok(authMenuManagementService.selectAuthListWithGroup(authNm));
    }

    /**
     * 선택한 권한의 메뉴 및 버튼 권한 목록을 조회한다.
     */
    @GetMapping("/auth-menu-btn-list")
    public ApiResponse<List<AuthMenuBtnListDto>> selectAuthMenuBtnList(
            @KcabEventSession LoginUser loginUser,
            @RequestParam("authGrpSeq") Integer authGrpSeq,
            @RequestParam("authSeq") Integer authSeq) {
        return ApiResponse.ok(authMenuManagementService.selectAuthMenuBtnList(authGrpSeq, authSeq));
    }

    /**
     * 권한별 메뉴 및 버튼 권한 변경사항을 저장한다.
     */
    @PostMapping("/save")
    public ApiResponse<Void> save(
            @KcabEventSession LoginUser loginUser,
            @RequestBody @Valid AuthMenuBtnSaveParamDto param) {
        authMenuManagementService.save(loginUser, param.getAuthGrpSeq(), param.getAuthSeq(), param.getSaveList());
        return ApiResponse.ok();
    }
}
