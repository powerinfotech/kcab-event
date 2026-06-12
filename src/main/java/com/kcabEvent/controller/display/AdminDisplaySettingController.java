package com.kcabEvent.controller.display;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.display.DisplaySettingDto;
import com.kcabEvent.service.display.PublicDisplaySettingService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/display-setting")
public class AdminDisplaySettingController {

    @Resource(name = "publicDisplaySettingService")
    private PublicDisplaySettingService publicDisplaySettingService;

    @GetMapping
    public ApiResponse<DisplaySettingDto> get(@KcabEventSession LoginUser loginUser) {
        return ApiResponse.ok(publicDisplaySettingService.getAdminSetting());
    }

    @PutMapping
    public ApiResponse<Void> save(
            @KcabEventSession LoginUser loginUser,
            @RequestBody DisplaySettingDto request
    ) {
        publicDisplaySettingService.saveSetting(request, loginUser);
        return ApiResponse.ok();
    }
}
