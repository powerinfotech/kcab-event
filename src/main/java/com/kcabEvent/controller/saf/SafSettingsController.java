package com.kcabEvent.controller.saf;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.settings.OrganizationGradeLimitDto;
import com.kcabEvent.dto.settings.SettingsCodeDto;
import com.kcabEvent.dto.settings.SettingsGroupDto;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.saf.SafSettingsService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/settings")
public class SafSettingsController {

    @Resource(name = "safSettingsService")
    private SafSettingsService safSettingsService;

    @GetMapping("/groups")
    public ApiResponse<List<SettingsGroupDto>> selectSettingsGroups(
            @KcabEventSession LoginUser loginUser
    ) {
        validateAdmin(loginUser);
        return ApiResponse.ok(safSettingsService.selectSettingsGroups());
    }

    @PutMapping("/groups")
    public ApiResponse<Void> saveSettingsGroups(
            @KcabEventSession LoginUser loginUser,
            @RequestBody List<SettingsGroupDto> groups
    ) {
        validateAdmin(loginUser);
        safSettingsService.saveSettingsGroups(groups, loginUser.getUserSeq().longValue());
        return ApiResponse.ok();
    }

    @GetMapping("/codes")
    public ApiResponse<List<SettingsCodeDto>> selectSettingsCodes(
            @KcabEventSession LoginUser loginUser,
            @RequestParam String comGrpCd
    ) {
        validateAdmin(loginUser);
        return ApiResponse.ok(safSettingsService.selectSettingsCodes(comGrpCd));
    }

    @PutMapping("/codes")
    public ApiResponse<Void> saveSettingsCodes(
            @KcabEventSession LoginUser loginUser,
            @RequestParam String comGrpCd,
            @RequestBody List<SettingsCodeDto> codes
    ) {
        validateAdmin(loginUser);
        safSettingsService.saveSettingsCodes(comGrpCd, codes, loginUser.getUserSeq().longValue());
        return ApiResponse.ok();
    }

    @GetMapping("/organization-grade-limits")
    public ApiResponse<List<OrganizationGradeLimitDto>> selectOrganizationGradeLimits(
            @KcabEventSession LoginUser loginUser
    ) {
        validateAdmin(loginUser);
        return ApiResponse.ok(safSettingsService.selectOrganizationGradeLimits());
    }

    @PutMapping("/organization-grade-limits")
    public ApiResponse<Void> saveOrganizationGradeLimits(
            @KcabEventSession LoginUser loginUser,
            @RequestBody List<OrganizationGradeLimitDto> limits
    ) {
        validateAdmin(loginUser);
        safSettingsService.saveOrganizationGradeLimits(limits, loginUser.getUserSeq().longValue());
        return ApiResponse.ok();
    }

    private void validateAdmin(LoginUser loginUser) {
        if (loginUser == null || !"Y".equals(loginUser.getAdmYn())) {
            throw new BusinessException("Only administrators can manage settings.");
        }
    }
}
