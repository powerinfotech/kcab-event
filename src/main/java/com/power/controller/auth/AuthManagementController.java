package com.power.controller.auth;

import com.power.annotation.MisoSession;
import com.power.dto.auth.AuthGrpListDto;
import com.power.dto.auth.AuthListDto;
import com.power.dto.auth.AuthManagementSaveDto;
import com.power.dto.auth.AuthUserListDto;
import com.power.dto.auth.UserSearchDto;
import com.power.dto.common.ApiResponse;
import com.power.dto.common.LoginUser;
import com.power.service.auth.AuthManagementService;
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
    public ApiResponse<List<AuthGrpListDto>> selectAuthGrpList(@MisoSession LoginUser loginUser) throws Exception {
        return ApiResponse.ok(authManagementService.selectAuthGrpList());
    }

    @GetMapping("/auth-list")
    public ApiResponse<List<AuthListDto>> selectAuthList(@MisoSession LoginUser loginUser,
                                                         @RequestParam Integer authGrpSeq) throws Exception {
        return ApiResponse.ok(authManagementService.selectAuthList(authGrpSeq));
    }

    @GetMapping("/auth-user-list")
    public ApiResponse<List<AuthUserListDto>> selectAuthUserList(@MisoSession LoginUser loginUser,
                                                                  @RequestParam Integer authGrpSeq,
                                                                  @RequestParam Integer authSeq) throws Exception {
        return ApiResponse.ok(authManagementService.selectAuthUserList(authGrpSeq, authSeq));
    }

    @GetMapping("/user-search")
    public ApiResponse<List<UserSearchDto>> selectUserSearchList(@MisoSession LoginUser loginUser,
                                                                  @RequestParam(required = false) String searchText,
                                                                  @RequestParam(required = false, defaultValue = "true") Boolean excludeUnused) throws Exception {
        return ApiResponse.ok(authManagementService.selectUserSearchList(searchText, excludeUnused));
    }

    @PostMapping("/save")
    public ApiResponse<Void> saveAuthManagement(@MisoSession LoginUser loginUser,
                                                 @RequestBody @Valid AuthManagementSaveDto saveDto) throws Exception {
        authManagementService.saveAuthManagement(saveDto, loginUser);
        return ApiResponse.ok();
    }
}
