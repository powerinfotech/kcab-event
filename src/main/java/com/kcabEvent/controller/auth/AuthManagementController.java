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

@RestController
@RequestMapping("/api/auth-mgt")
public class AuthManagementController {

    @Resource(name = "authManagementService")
    private AuthManagementService authManagementService;

    @GetMapping("/auth-grp-list")
    public ApiResponse<List<AuthGrpListDto>> selectAuthGrpList(@KcabEventSession LoginUser loginUser) {
        return ApiResponse.ok(authManagementService.selectAuthGrpList());
    }

    @GetMapping("/auth-list")
    public ApiResponse<List<AuthListDto>> selectAuthList(@KcabEventSession LoginUser loginUser,
                                                         @RequestParam Integer authGrpSeq) {
        return ApiResponse.ok(authManagementService.selectAuthList(authGrpSeq));
    }

    @GetMapping("/auth-user-list")
    public ApiResponse<List<AuthUserListDto>> selectAuthUserList(@KcabEventSession LoginUser loginUser,
                                                                  @RequestParam Integer authGrpSeq,
                                                                  @RequestParam Integer authSeq) {
        return ApiResponse.ok(authManagementService.selectAuthUserList(authGrpSeq, authSeq));
    }

    @GetMapping("/user-search")
    public ApiResponse<List<UserSearchDto>> selectUserSearchList(@KcabEventSession LoginUser loginUser,
                                                                  @RequestParam(required = false) String searchText,
                                                                  @RequestParam(required = false, defaultValue = "true") Boolean excludeUnused) {
        return ApiResponse.ok(authManagementService.selectUserSearchList(searchText, excludeUnused));
    }

    @PostMapping("/save")
    public ApiResponse<Void> saveAuthManagement(@KcabEventSession LoginUser loginUser,
                                                 @RequestBody @Valid AuthManagementSaveDto saveDto) {
        authManagementService.saveAuthManagement(saveDto, loginUser);
        return ApiResponse.ok();
    }
}
