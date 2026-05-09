package com.kcabEvent.controller.auth;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.dto.auth.AuthGrpListDto;
import com.kcabEvent.dto.auth.AuthListDto;
import com.kcabEvent.dto.auth.AuthManagementSaveDto;
import com.kcabEvent.dto.auth.AuthUserListDto;
import com.kcabEvent.dto.auth.UserSearchDto;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.service.auth.AuthManagementService;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;

/**
 * 권한 그룹, 권한, 사용자 배정을 관리하는 관리자 API를 제공한다.
 */
@RestController
@RequestMapping("/api/auth-mgt")
public class AuthManagementController {

    @Resource(name = "authManagementService")
    private AuthManagementService authManagementService;

    /**
     * 전체 권한 그룹 목록을 조회한다.
     */
    @GetMapping("/auth-grp-list")
    public ApiResponse<List<AuthGrpListDto>> selectAuthGrpList(@KcabEventSession LoginUser loginUser) {
        return ApiResponse.ok(authManagementService.selectAuthGrpList());
    }

    /**
     * 선택한 권한 그룹에 속한 권한 목록을 조회한다.
     */
    @GetMapping("/auth-list")
    public ApiResponse<List<AuthListDto>> selectAuthList(@KcabEventSession LoginUser loginUser,
                                                         @RequestParam Integer authGrpSeq) {
        return ApiResponse.ok(authManagementService.selectAuthList(authGrpSeq));
    }

    /**
     * 선택한 권한 그룹과 권한에 배정된 사용자 목록을 조회한다.
     */
    @GetMapping("/auth-user-list")
    public ApiResponse<List<AuthUserListDto>> selectAuthUserList(@KcabEventSession LoginUser loginUser,
                                                                  @RequestParam Integer authGrpSeq,
                                                                  @RequestParam Integer authSeq) {
        return ApiResponse.ok(authManagementService.selectAuthUserList(authGrpSeq, authSeq));
    }

    /**
     * 권한 배정 대상 사용자를 검색한다.
     */
    @GetMapping("/user-search")
    public ApiResponse<List<UserSearchDto>> selectUserSearchList(@KcabEventSession LoginUser loginUser,
                                                                  @RequestParam(required = false) String searchText,
                                                                  @RequestParam(required = false, defaultValue = "true") Boolean excludeUnused) {
        return ApiResponse.ok(authManagementService.selectUserSearchList(searchText, excludeUnused));
    }

    /**
     * 사용자 권한 배정 변경사항을 저장한다.
     */
    @PostMapping("/save")
    public ApiResponse<Void> saveAuthManagement(@KcabEventSession LoginUser loginUser,
                                                 @RequestBody @Valid AuthManagementSaveDto saveDto) {
        authManagementService.saveAuthManagement(saveDto, loginUser);
        return ApiResponse.ok();
    }
}
